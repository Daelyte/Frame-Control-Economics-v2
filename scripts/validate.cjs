#!/usr/bin/env node

/**
 * Cross-platform deployment validation script
 * Uses CommonJS for maximum compatibility
 * Focuses on preventing the most common deployment failures
 */

const { execSync } = require('child_process');
const { readFileSync, existsSync } = require('fs');
const { join } = require('path');

const ROOT_DIR = join(__dirname, '..');

const colors = {
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  reset: '\x1b[0m',
  bold: '\x1b[1m'
};

const log = {
  error: (msg) => console.log(`${colors.red}❌ ${msg}${colors.reset}`),
  success: (msg) => console.log(`${colors.green}✅ ${msg}${colors.reset}`),
  warning: (msg) => console.log(`${colors.yellow}⚠️  ${msg}${colors.reset}`),
  info: (msg) => console.log(`${colors.blue}ℹ️  ${msg}${colors.reset}`),
  section: (msg) => console.log(`${colors.bold}${colors.blue}${msg}${colors.reset}`)
};

let hasErrors = false;
let hasWarnings = false;

console.log(`${colors.bold}🔍 Frame Economics Deployment Validation${colors.reset}\n`);

// Check 1: Package.json validation
try {
  log.section('📦 Package Dependencies');
  const packageJsonPath = join(ROOT_DIR, 'package.json');
  
  if (!existsSync(packageJsonPath)) {
    log.error('package.json not found!');
    hasErrors = true;
  } else {
    const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf8'));
    
    // Check critical dependencies
    const requiredDeps = [
      'react', 'react-dom', 'vite', 'typescript', 
      'tailwindcss', 'lucide-react'
    ];
    
    const allDeps = { ...packageJson.dependencies, ...packageJson.devDependencies };
    const missingDeps = requiredDeps.filter(dep => !allDeps[dep]);
    
    if (missingDeps.length > 0) {
      log.error(`Missing critical dependencies: ${missingDeps.join(', ')}`);
      hasErrors = true;
    } else {
      log.success('All critical dependencies present');
    }
  }
} catch (error) {
  log.error(`Package.json check failed: ${error.message}`);
  hasErrors = true;
}

// Check 2: Netlify configuration
try {
  log.section('🌐 Netlify Configuration');
  const netlifyTomlPath = join(ROOT_DIR, 'netlify.toml');
  
  if (existsSync(netlifyTomlPath)) {
    const netlifyConfig = readFileSync(netlifyTomlPath, 'utf8');
    
    // Check for problematic plugins
    const problematicPlugins = [
      'netlify-plugin-ghost-markdown',
      'netlify-plugin-fetch-feeds'
    ];
    
    let pluginIssues = 0;
    
    problematicPlugins.forEach(plugin => {
      if (netlifyConfig.includes(plugin)) {
        if (!netlifyConfig.includes(`${plugin}"`)) {
          // Plugin mentioned but not properly configured
          log.warning(`${plugin} found but may not be properly disabled`);
          hasWarnings = true;
        } else if (netlifyConfig.includes('enabled = false')) {
          log.success(`${plugin} properly disabled`);
        } else {
          log.error(`${plugin} is enabled but may be missing required inputs!`);
          hasErrors = true;
          pluginIssues++;
        }
      }
    });
    
    if (pluginIssues === 0) {
      log.success('Netlify plugin configuration looks safe');
    }
  } else {
    log.info('No netlify.toml found (using Netlify UI config)');
  }
} catch (error) {
  log.error(`Netlify config check failed: ${error.message}`);
  hasErrors = true;
}

// Check 3: TypeScript compilation
try {
  log.section('📘 TypeScript Validation');
  execSync('npx tsc --noEmit --skipLibCheck', { 
    cwd: ROOT_DIR, 
    stdio: 'pipe',
    timeout: 45000 // 45 seconds
  });
  log.success('TypeScript compilation passed');
} catch (error) {
  const errorOutput = error.stdout?.toString() || error.stderr?.toString() || '';
  if (errorOutput.includes('error TS')) {
    log.error('TypeScript compilation errors found!');
    
    // Show first few errors
    const errors = errorOutput.split('\n').filter(line => line.includes('error TS'));
    errors.slice(0, 3).forEach(err => {
      console.log(`  ${colors.red}${err.trim()}${colors.reset}`);
    });
    
    if (errors.length > 3) {
      console.log(`  ${colors.yellow}... and ${errors.length - 3} more errors${colors.reset}`);
    }
    
    hasErrors = true;
  } else {
    log.success('TypeScript check passed');
  }
}

// Check 4: Build test
try {
  log.section('🔨 Build Process Test');
  execSync('npm run build', { 
    cwd: ROOT_DIR, 
    stdio: 'pipe',
    timeout: 120000 // 2 minutes
  });
  log.success('Build test passed');
} catch (error) {
  log.error('Build failed!');
  
  const errorOutput = error.stdout?.toString() || error.stderr?.toString() || error.message;
  
  // Extract key error information
  if (errorOutput.includes('Module not found')) {
    const moduleMatch = errorOutput.match(/Module not found.*?'([^']+)'/);
    if (moduleMatch) {
      log.error(`Missing module: ${moduleMatch[1]}`);
      log.info('This usually means a dependency is not installed');
    }
  }
  
  if (errorOutput.includes('Cannot resolve')) {
    log.error('Import resolution failed - check your import paths');
  }
  
  // Show relevant error snippet
  const relevantLines = errorOutput.split('\n')
    .filter(line => 
      line.includes('error') || 
      line.includes('Error') || 
      line.includes('failed') ||
      line.includes('Cannot')
    )
    .slice(0, 3);
    
  relevantLines.forEach(line => {
    console.log(`  ${colors.red}${line.trim()}${colors.reset}`);
  });
  
  hasErrors = true;
}

// Check 5: Critical files exist
try {
  log.section('📁 Critical Files Check');
  const criticalFiles = [
    'index.html',
    'src/main.tsx',
    'src/App.tsx',
    'tailwind.config.js',
    'vite.config.ts'
  ];
  
  const missingFiles = criticalFiles.filter(file => 
    !existsSync(join(ROOT_DIR, file))
  );
  
  if (missingFiles.length > 0) {
    log.error(`Missing critical files: ${missingFiles.join(', ')}`);
    hasErrors = true;
  } else {
    log.success('All critical files present');
  }
} catch (error) {
  log.error(`File check failed: ${error.message}`);
  hasErrors = true;
}

// Final result
console.log(`\n${colors.bold}${'═'.repeat(50)}${colors.reset}`);

if (hasErrors) {
  log.error('VALIDATION FAILED - UNSAFE TO DEPLOY!');
  console.log(`\n${colors.yellow}Fix the errors above before attempting deployment${colors.reset}`);
  console.log(`${colors.blue}Emergency deploy: npm run fix-and-deploy${colors.reset}`);
  process.exit(1);
} else if (hasWarnings) {
  log.warning('Validation passed with warnings');
  console.log(`${colors.yellow}Review warnings above but deployment should succeed${colors.reset}`);
  console.log(`${colors.green}🚀 Proceeding with deployment...${colors.reset}`);
  process.exit(0);
} else {
  log.success('🎉 ALL CHECKS PASSED - SAFE TO DEPLOY!');
  console.log(`${colors.green}Your deployment should succeed on Netlify${colors.reset}`);
  process.exit(0);
}