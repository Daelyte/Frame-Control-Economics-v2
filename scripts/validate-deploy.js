#!/usr/bin/env node

/**
 * Comprehensive deployment validation script
 * Prevents common Netlify deployment failures before pushing to main
 */

import { execSync } from 'child_process';
import { readFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const ROOT_DIR = join(__dirname, '..');

// Colors for console output
const colors = {
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  reset: '\x1b[0m',
  bold: '\x1b[1m'
};

const log = {
  error: (msg) => console.log(`${colors.red}❌ ${msg}${colors.reset}`),
  success: (msg) => console.log(`${colors.green}✅ ${msg}${colors.reset}`),
  warning: (msg) => console.log(`${colors.yellow}⚠️  ${msg}${colors.reset}`),
  info: (msg) => console.log(`${colors.blue}ℹ️  ${msg}${colors.reset}`),
  step: (msg) => console.log(`${colors.cyan}🔍 ${msg}${colors.reset}`),
  header: (msg) => console.log(`\n${colors.bold}${colors.magenta}🚀 ${msg}${colors.reset}\n`)
};

class DeploymentValidator {
  constructor() {
    this.errors = [];
    this.warnings = [];
    this.passed = 0;
    this.total = 0;
  }

  addError(message, details = '') {
    this.errors.push({ message, details });
  }

  addWarning(message, details = '') {
    this.warnings.push({ message, details });
  }

  incrementTest() {
    this.total++;
  }

  passTest() {
    this.passed++;
    this.total++;
  }

  /**
   * Check for Ghost plugin configuration issues
   */
  validateGhostPlugin() {
    log.step('Checking for Ghost plugin configuration issues...');
    this.incrementTest();

    try {
      // Check netlify.toml for Ghost plugin
      const netlifyTomlPath = join(ROOT_DIR, 'netlify.toml');
      if (existsSync(netlifyTomlPath)) {
        const netlifyConfig = readFileSync(netlifyTomlPath, 'utf8');
        
        if (netlifyConfig.includes('netlify-plugin-ghost-markdown')) {
          if (!netlifyConfig.includes('ghostURL') || 
              netlifyConfig.includes('ghostURL = ""') || 
              netlifyConfig.includes('ghostURL=""')) {
            this.addError(
              'Ghost plugin configuration found but ghostURL is missing or empty',
              'Remove the Ghost plugin from netlify.toml or provide a valid ghostURL'
            );
            return;
          }
        }
      }

      // Check package.json for Ghost plugin
      const packageJsonPath = join(ROOT_DIR, 'package.json');
      if (existsSync(packageJsonPath)) {
        const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf8'));
        
        if (packageJson.dependencies?.['netlify-plugin-ghost-markdown'] ||
            packageJson.devDependencies?.['netlify-plugin-ghost-markdown']) {
          this.addWarning(
            'Ghost plugin found in package.json but may not be properly configured',
            'Ensure ghostURL is properly set in netlify.toml or remove the plugin'
          );
        }
      }

      this.passTest();
      log.success('Ghost plugin validation passed');
    } catch (error) {
      this.addError('Failed to validate Ghost plugin configuration', error.message);
    }
  }

  /**
   * Test build process
   */
  async validateBuild() {
    log.step('Testing build process...');
    this.incrementTest();

    try {
      // Run TypeScript check first
      log.info('Running TypeScript check...');
      execSync('npm run build-with-check', { 
        cwd: ROOT_DIR, 
        stdio: 'pipe',
        timeout: 120000 // 2 minutes timeout
      });

      this.passTest();
      log.success('Build validation passed');
    } catch (error) {
      const errorOutput = error.stdout?.toString() || error.stderr?.toString() || error.message;
      this.addError(
        'Build process failed',
        `Exit code: ${error.status}\nOutput: ${errorOutput.slice(0, 500)}...`
      );
    }
  }

  /**
   * Validate environment variables
   */
  validateEnvironment() {
    log.step('Checking environment configuration...');
    this.incrementTest();

    try {
      // Check for .env files
      const envFiles = ['.env', '.env.local', '.env.production'];
      let hasEnvConfig = false;

      for (const envFile of envFiles) {
        if (existsSync(join(ROOT_DIR, envFile))) {
          hasEnvConfig = true;
          break;
        }
      }

      // Check if environment variables are properly handled
      const viteConfigPath = join(ROOT_DIR, 'vite.config.ts');
      if (existsSync(viteConfigPath)) {
        const viteConfig = readFileSync(viteConfigPath, 'utf8');
        if (viteConfig.includes('process.env') && !hasEnvConfig) {
          this.addWarning(
            'Environment variables used but no .env file found',
            'Ensure all required environment variables are set in Netlify'
          );
        }
      }

      this.passTest();
      log.success('Environment validation passed');
    } catch (error) {
      this.addError('Failed to validate environment', error.message);
    }
  }

  /**
   * Check for common deployment issues
   */
  validateDeploymentConfig() {
    log.step('Checking deployment configuration...');
    this.incrementTest();

    try {
      // Validate netlify.toml
      const netlifyTomlPath = join(ROOT_DIR, 'netlify.toml');
      if (!existsSync(netlifyTomlPath)) {
        this.addWarning('netlify.toml not found', 'Consider adding deployment configuration');
      } else {
        const netlifyConfig = readFileSync(netlifyTomlPath, 'utf8');
        
        // Check for basic configuration
        if (!netlifyConfig.includes('[build]')) {
          this.addWarning('No [build] section in netlify.toml', 'Build configuration may be missing');
        }
        
        if (!netlifyConfig.includes('publish =')) {
          this.addWarning('No publish directory specified', 'Netlify may not know where to find built files');
        }

        // Check for problematic plugins
        const problematicPlugins = [
          'netlify-plugin-ghost-markdown',
          'netlify-plugin-subfont',
          'netlify-plugin-sitemap'
        ];

        for (const plugin of problematicPlugins) {
          if (netlifyConfig.includes(plugin)) {
            this.addWarning(
              `Potentially problematic plugin detected: ${plugin}`,
              'Ensure plugin is properly configured or remove if not needed'
            );
          }
        }
      }

      // Check package.json scripts
      const packageJson = JSON.parse(readFileSync(join(ROOT_DIR, 'package.json'), 'utf8'));
      if (!packageJson.scripts?.build) {
        this.addError('No build script in package.json', 'Netlify needs a build command');
        return;
      }

      this.passTest();
      log.success('Deployment configuration validation passed');
    } catch (error) {
      this.addError('Failed to validate deployment configuration', error.message);
    }
  }

  /**
   * Check for TypeScript issues
   */
  validateTypeScript() {
    log.step('Checking TypeScript configuration...');
    this.incrementTest();

    try {
      // Check if TypeScript is configured
      const tsconfigPath = join(ROOT_DIR, 'tsconfig.json');
      if (!existsSync(tsconfigPath)) {
        this.addWarning('tsconfig.json not found', 'TypeScript configuration may be missing');
      }

      // Run TypeScript check without building
      execSync('npx tsc --noEmit', { 
        cwd: ROOT_DIR, 
        stdio: 'pipe',
        timeout: 60000 // 1 minute timeout
      });

      this.passTest();
      log.success('TypeScript validation passed');
    } catch (error) {
      const errorOutput = error.stdout?.toString() || error.stderr?.toString() || error.message;
      
      // Check if it's just warnings or actual errors
      if (errorOutput.includes('error TS')) {
        this.addError('TypeScript errors found', errorOutput.slice(0, 500));
      } else {
        this.addWarning('TypeScript check had issues', errorOutput.slice(0, 200));
        this.passTest(); // Don't fail for warnings
      }
    }
  }

  /**
   * Check dependencies
   */
  validateDependencies() {
    log.step('Checking dependencies...');
    this.incrementTest();

    try {
      // Check for npm audit issues
      try {
        execSync('npm audit --audit-level high', { 
          cwd: ROOT_DIR, 
          stdio: 'pipe',
          timeout: 30000
        });
      } catch (auditError) {
        if (auditError.status === 1) {
          this.addWarning('High severity npm audit issues found', 'Consider updating dependencies');
        }
      }

      // Check for missing dependencies
      execSync('npm ls --depth=0', { 
        cwd: ROOT_DIR, 
        stdio: 'pipe',
        timeout: 30000
      });

      this.passTest();
      log.success('Dependencies validation passed');
    } catch (error) {
      this.addError('Dependencies validation failed', error.message);
    }
  }

  /**
   * Run all validations
   */
  async runAll() {
    log.header('🔍 DEPLOYMENT VALIDATION STARTED');
    
    const startTime = Date.now();

    // Run all validations
    this.validateGhostPlugin();
    this.validateDeploymentConfig();
    this.validateEnvironment();
    this.validateTypeScript();
    this.validateDependencies();
    await this.validateBuild(); // This one takes the longest

    const duration = ((Date.now() - startTime) / 1000).toFixed(1);

    // Report results
    log.header('📊 VALIDATION RESULTS');
    
    console.log(`${colors.bold}Tests: ${this.passed}/${this.total} passed${colors.reset}`);
    console.log(`${colors.bold}Time: ${duration}s${colors.reset}\n`);

    if (this.warnings.length > 0) {
      log.warning(`${this.warnings.length} warning(s) found:`);
      this.warnings.forEach((warning, i) => {
        console.log(`  ${i + 1}. ${warning.message}`);
        if (warning.details) {
          console.log(`     ${colors.yellow}${warning.details}${colors.reset}`);
        }
      });
      console.log('');
    }

    if (this.errors.length > 0) {
      log.error(`${this.errors.length} error(s) found:`);
      this.errors.forEach((error, i) => {
        console.log(`  ${i + 1}. ${error.message}`);
        if (error.details) {
          console.log(`     ${colors.red}${error.details}${colors.reset}`);
        }
      });
      console.log('');
      log.error('❌ VALIDATION FAILED - Fix errors before pushing to main');
      process.exit(1);
    } else {
      log.success(`🎉 ALL VALIDATIONS PASSED - Safe to deploy!`);
      if (this.warnings.length > 0) {
        log.warning('Consider addressing warnings for optimal deployment');
      }
      process.exit(0);
    }
  }
}

// Run validation
const validator = new DeploymentValidator();
validator.runAll().catch((error) => {
  log.error(`Validation script failed: ${error.message}`);
  process.exit(1);
});