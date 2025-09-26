#!/usr/bin/env node

/**
 * Update OG image references to use new dragon assets
 */

import { readFileSync, writeFileSync, existsSync } from 'fs';
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

console.log(`${colors.bold}🐉 Updating OG Images to New Dragon Assets${colors.reset}\n`);

// Check if new dragon assets exist
const newOgImage = join(ROOT_DIR, 'public', 'og-dragon-new.png');
const socialReadyImage = join(ROOT_DIR, 'public', 'dragons', 'og-dragon-1200x630-translucent-40.png');

if (!existsSync(newOgImage) && !existsSync(socialReadyImage)) {
  log.error('Dragon assets not found!');
  log.info('Please copy your dragon images first:');
  console.log('  1. Copy og-dragon-1200x630-translucent-40.png to public/og-dragon-new.png');
  console.log('  2. Copy all dragon variants to public/dragons/');
  console.log('  3. Run this script again');
  process.exit(1);
}

// Use the appropriate image
let dragonImagePath;
if (existsSync(newOgImage)) {
  dragonImagePath = 'og-dragon-new.png';
  log.info('Using og-dragon-new.png');
} else if (existsSync(socialReadyImage)) {
  dragonImagePath = 'dragons/og-dragon-1200x630-translucent-40.png';
  log.info('Using dragon from dragons folder');
} else {
  log.error('No suitable dragon image found');
  process.exit(1);
}

// Update index.html
const indexHtmlPath = join(ROOT_DIR, 'index.html');
if (!existsSync(indexHtmlPath)) {
  log.error('index.html not found');
  process.exit(1);
}

try {
  let htmlContent = readFileSync(indexHtmlPath, 'utf8');
  let updatedCount = 0;

  // Update Facebook/Meta OG image
  const oldOgImageRegex = /<meta property="og:image" content="[^"]*dragon-og[^"]*"/g;
  if (htmlContent.match(oldOgImageRegex)) {
    htmlContent = htmlContent.replace(
      oldOgImageRegex,
      `<meta property="og:image" content="https://icecoldfroste.com/${dragonImagePath}"`
    );
    updatedCount++;
    log.success('Updated Facebook/Meta OG image');
  }

  // Update Twitter image
  const oldTwitterImageRegex = /<meta name="twitter:image" content="[^"]*dragon-og[^"]*"/g;
  if (htmlContent.match(oldTwitterImageRegex)) {
    htmlContent = htmlContent.replace(
      oldTwitterImageRegex,
      `<meta name="twitter:image" content="https://icecoldfroste.com/${dragonImagePath}"`
    );
    updatedCount++;
    log.success('Updated Twitter/X card image');
  }

  // Add cache busting version parameter
  const timestamp = Date.now();
  htmlContent = htmlContent.replace(
    new RegExp(`content="https://icecoldfroste\\.com/${dragonImagePath.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}"`, 'g'),
    `content="https://icecoldfroste.com/${dragonImagePath}?v=${timestamp}"`
  );

  // Write updated HTML
  if (updatedCount > 0) {
    writeFileSync(indexHtmlPath, htmlContent, 'utf8');
    log.success(`Updated ${updatedCount} OG image reference(s) in index.html`);
  } else {
    log.warning('No OG image references found to update');
  }

  // Update animated banner component if it exists
  const animatedBannerPath = join(ROOT_DIR, 'src', 'styles', 'animated-banner.css');
  if (existsSync(animatedBannerPath)) {
    let cssContent = readFileSync(animatedBannerPath, 'utf8');
    
    // Update background image reference
    const oldBgImageRegex = /url\("\/og-image\.jpg"\)/g;
    if (cssContent.match(oldBgImageRegex)) {
      cssContent = cssContent.replace(
        oldBgImageRegex,
        `url("/${dragonImagePath}")`
      );
      
      writeFileSync(animatedBannerPath, cssContent, 'utf8');
      log.success('Updated animated banner background image');
    }
  }

  console.log(`\n${colors.bold}Summary:${colors.reset}`);
  console.log(`✅ OG images updated to use: ${dragonImagePath}`);
  console.log(`✅ Cache busting added: ?v=${timestamp}`);
  console.log('\n🚀 Ready to deploy! Your new dragon will show in social shares.');
  
} catch (error) {
  log.error(`Failed to update OG images: ${error.message}`);
  process.exit(1);
}