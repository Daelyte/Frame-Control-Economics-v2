#!/usr/bin/env node

/**
 * Quick validation script for immediate deployment issues
 * Focuses on the most common problems: Ghost plugin and build failures
 */

import { execSync } from 'child_process';
import { readFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
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
  info: (msg) => console.log(`${colors.blue}ℹ️  ${msg}${colors.reset}`)
};

let hasErrors = false;

console.log(`${colors.bold}🔍 Quick Deployment Validation${colors.reset}\n`);

// Check 1: Ghost plugin configuration
try {
  log.info('Checking Ghost plugin configuration...');
  const netlifyTomlPath = join(ROOT_DIR, 'netlify.toml');
  
  if (existsSync(netlifyTomlPath)) {
    const netlifyConfig = readFileSync(netlifyTomlPath, 'utf8');
    
    if (netlifyConfig.includes('netlify-plugin-ghost-markdown')) {
      if (!netlifyConfig.includes('ghostURL') || 
          netlifyConfig.includes('ghostURL = ""') || 
          netlifyConfig.includes('ghostURL=""')) {
        log.error('Ghost plugin found but ghostURL is missing or empty!');
        log.error('This will cause: Plugin "netlify-plugin-ghost-markdown" invalid input "ghostURL"');
        console.log(`${colors.yellow}Fix: Remove the plugin or add a valid ghostURL${colors.reset}\n`);
        hasErrors = true;
      } else {
        log.success('Ghost plugin configuration looks good');
      }
    } else {
      log.success('No Ghost plugin found (good!)');
    }
  } else {
    log.info('No netlify.toml found');
  }
} catch (error) {
  log.error(`Ghost plugin check failed: ${error.message}`);
  hasErrors = true;
}

// Check 2: Build test
try {
  log.info('Testing build process...');
  execSync('npm run build', { 
    cwd: ROOT_DIR, 
    stdio: 'pipe',
    timeout: 60000 // 1 minute timeout
  });
  log.success('Build test passed');
} catch (error) {
  log.error('Build test failed!');
  log.error('This will cause: Build script returned non-zero exit code: 2');
  console.log(`${colors.red}Error details:${colors.reset}`);
  const errorOutput = error.stdout?.toString() || error.stderr?.toString() || error.message;
  console.log(errorOutput.slice(0, 300) + '...\n');
  hasErrors = true;
}

// Check 3: TypeScript errors
try {
  log.info('Checking TypeScript...');
  execSync('npx tsc --noEmit', { 
    cwd: ROOT_DIR, 
    stdio: 'pipe',
    timeout: 30000
  });
  log.success('TypeScript check passed');
} catch (error) {
  const errorOutput = error.stdout?.toString() || error.stderr?.toString() || '';
  if (errorOutput.includes('error TS')) {
    log.error('TypeScript errors found!');
    console.log(`${colors.red}TypeScript errors:${colors.reset}`);
    console.log(errorOutput.slice(0, 300) + '...\n');
    hasErrors = true;
  } else {
    log.success('TypeScript check passed');
  }
}

// Final result
console.log(`${colors.bold}═══════════════════════════════════════${colors.reset}`);
if (hasErrors) {
  log.error('VALIDATION FAILED - Do not push to main!');
  console.log(`${colors.yellow}Fix the errors above before deploying${colors.reset}`);
  process.exit(1);
} else {
  log.success('🎉 ALL CHECKS PASSED - Safe to deploy!');
  console.log(`${colors.green}Your deployment should succeed on Netlify${colors.reset}`);
  process.exit(0);
}