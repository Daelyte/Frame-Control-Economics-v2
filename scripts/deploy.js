#!/usr/bin/env node
/**
 * Deployment helper script for Frame Control Economics v2
 * Validates build and provides deployment guidance
 */

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🚀 Frame Control Economics v2 - Deployment Helper\n');

// Check if we're in the right directory
if (!fs.existsSync('package.json')) {
  console.error('❌ Please run this script from the project root directory');
  process.exit(1);
}

const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
if (packageJson.name !== 'frame-control-economics-v2') {
  console.error('❌ This script is for Frame Control Economics v2 project only');
  process.exit(1);
}

console.log(`📦 Project: ${packageJson.name} v${packageJson.version}`);
console.log(`🗂️  Directory: ${process.cwd()}\n`);

// Check Node version
const nodeVersion = process.version;
console.log(`🟢 Node.js: ${nodeVersion}`);

if (parseInt(nodeVersion.slice(1)) < 18) {
  console.warn('⚠️  Node.js 18+ recommended for optimal performance');
}

// Validate dependencies
try {
  console.log('📋 Checking dependencies...');
  execSync('npm ls --production --silent', { stdio: 'ignore' });
  console.log('✅ Dependencies valid');
} catch (error) {
  console.warn('⚠️  Dependency issues detected, running npm install...');
  execSync('npm install', { stdio: 'inherit' });
}

// Build the project
try {
  console.log('\n🔨 Building project...');
  execSync('npm run build', { stdio: 'inherit' });
  console.log('✅ Build successful');
} catch (error) {
  console.error('❌ Build failed');
  process.exit(1);
}

// Check build output
const distExists = fs.existsSync('dist');
if (!distExists) {
  console.error('❌ Build output directory "dist" not found');
  process.exit(1);
}

const indexExists = fs.existsSync('dist/index.html');
if (!indexExists) {
  console.error('❌ index.html not found in build output');
  process.exit(1);
}

console.log('✅ Build output validated');

// Check git status
try {
  const gitStatus = execSync('git status --porcelain', { encoding: 'utf8' });
  if (gitStatus.trim()) {
    console.warn('\n⚠️  Uncommitted changes detected:');
    console.log(gitStatus);
    console.log('Consider committing changes before deployment');
  } else {
    console.log('\n✅ Git working tree clean');
  }
} catch (error) {
  console.warn('⚠️  Git not available or not a git repository');
}

// Deployment instructions
console.log('\n🌍 Deployment Options:');
console.log('');
console.log('1. 🚀 Netlify (Recommended):');
console.log('   • Visit: https://app.netlify.com');
console.log('   • Drag & drop the "dist" folder');
console.log('   • Or connect GitHub repository for auto-deploy');
console.log('');
console.log('2. 📁 Manual hosting:');
console.log('   • Upload "dist" folder contents to your web server');
console.log('   • Ensure SPA redirects are configured');
console.log('');
console.log('3. 🔗 One-click deploy:');
console.log('   • https://app.netlify.com/start/deploy?repository=https://github.com/Daelyte/Frame-Control-Economics-v2');
console.log('');
console.log('🌐 Live Demo:');
console.log('   • https://frame-control-.netlify.app');

console.log('\n✨ Deployment ready! Your advanced motion design system is prepared for the web.');
console.log('🎭 Features: OKLCH colors, Container queries, Framer Motion, Parallax effects');
console.log('♿ Accessibility: prefers-reduced-motion, WCAG compliant, keyboard navigation');
console.log('⚡ Performance: Optimized builds, tree-shaking, hardware acceleration');

process.exit(0);