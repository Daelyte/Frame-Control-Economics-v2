#!/usr/bin/env node

/**
 * Build Verification Script
 * Ensures React 18 + Three.js compatibility before deployment
 */

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

console.log('🔍 Verifying React 18 + Three.js Build Compatibility...\n');

// Helper to run commands and capture output
function runCommand(command, description) {
  console.log(`⚡ ${description}...`);
  try {
    const output = execSync(command, { encoding: 'utf-8', stdio: 'pipe' });
    console.log(`✅ ${description} - Success\n`);
    return output;
  } catch (error) {
    console.log(`❌ ${description} - Failed:`);
    console.log(error.message);
    process.exit(1);
  }
}

// Check package.json versions
console.log('📦 Checking package.json versions...');
const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));

const expectedVersions = {
  'react': '19.1.1',
  'react-dom': '19.1.1', 
  '@react-three/fiber': '9.3.0',
  '@react-three/drei': '10.7.6',
  'three': '0.180.0'
};

let versionErrors = 0;
for (const [pkg, expectedVersion] of Object.entries(expectedVersions)) {
  const actualVersion = packageJson.dependencies[pkg];
  if (actualVersion === expectedVersion) {
    console.log(`✅ ${pkg}: ${actualVersion}`);
  } else {
    console.log(`❌ ${pkg}: expected ${expectedVersion}, got ${actualVersion}`);
    versionErrors++;
  }
}

if (versionErrors > 0) {
  console.log(`\n❌ ${versionErrors} version mismatches detected!`);
  process.exit(1);
}

console.log('✅ All package versions correct\n');

// Verify peer dependencies
runCommand('npm ls react --depth=0', 'Checking React peer dependencies');

// Test build
runCommand('npm run build', 'Testing production build');

// Check build output
console.log('📁 Checking build output...');
const distPath = path.join(process.cwd(), 'dist');
if (!fs.existsSync(distPath)) {
  console.log('❌ dist/ directory not found');
  process.exit(1);
}

const buildFiles = fs.readdirSync(path.join(distPath, 'assets'));
const jsFiles = buildFiles.filter(f => f.endsWith('.js'));
const cssFiles = buildFiles.filter(f => f.endsWith('.css'));

console.log(`✅ Found ${jsFiles.length} JS files, ${cssFiles.length} CSS files`);

// Check for dragon chunk
const dragonChunk = jsFiles.find(f => f.includes('DragonScene'));
if (dragonChunk) {
  console.log(`✅ Dragon chunk found: ${dragonChunk}`);
} else {
  console.log('⚠️  Dragon chunk not found (may not be code-split)');
}

// Bundle size check
const indexJs = jsFiles.find(f => f.startsWith('index-'));
if (indexJs) {
  const indexPath = path.join(distPath, 'assets', indexJs);
  const sizeKB = Math.round(fs.statSync(indexPath).size / 1024);
  console.log(`📊 Main bundle size: ${sizeKB}KB`);
  
  if (sizeKB > 350) {
    console.log('⚠️  Main bundle is large, may impact LCP');
  } else {
    console.log('✅ Main bundle size acceptable');
  }
}

// Check Node version in netlify.toml
console.log('\n🔧 Checking Netlify configuration...');
if (fs.existsSync('netlify.toml')) {
  const netlifyConfig = fs.readFileSync('netlify.toml', 'utf8');
  if (netlifyConfig.includes('NODE_VERSION = "20.19.5"')) {
    console.log('✅ Node version locked in netlify.toml');
  } else {
    console.log('⚠️  Node version not properly locked in netlify.toml');
  }
} else {
  console.log('⚠️  netlify.toml not found');
}

// Lighthouse CI config check
if (fs.existsSync('lighthouserc.json')) {
  console.log('✅ Lighthouse CI configuration found');
} else {
  console.log('⚠️  lighthouserc.json not found');
}

console.log('\n🎉 Build verification complete!');
console.log('🚀 Ready for Netlify deployment');
console.log('\nNext steps:');
console.log('1. Push changes to trigger Netlify build');
console.log('2. Clear Netlify cache if needed');
console.log('3. Monitor Lighthouse scores in CI');
console.log('4. Test terror dragon effects on live site');