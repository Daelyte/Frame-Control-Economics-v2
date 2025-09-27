#!/usr/bin/env node

/**
 * Dragon Model Downloader & Optimizer
 * Downloads and optimizes 3D dragon models for Frame Economics
 */

import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

const DRAGON_SOURCES = [
  {
    name: 'Low Poly Dragon Head',
    source: 'Sketchfab',
    url: 'https://sketchfab.com/3d-models/dragon-head-low-poly-2c4b0e0c0c8e4e6f8a9c5c8c8c8c8c8c',
    license: 'CC BY 4.0',
    instructions: 'Download manually from Sketchfab, then place in public/models/',
    expectedSize: '125KB',
    complexity: 'low'
  },
  {
    name: 'Animated Dragon',
    source: 'Mixamo',
    url: 'https://www.mixamo.com/#/?page=1&query=dragon&type=Character',
    license: 'Free for web use',
    instructions: 'Upload to Mixamo, add idle animation, download as FBX, convert to GLB',
    expectedSize: '280KB',
    complexity: 'medium'
  },
  {
    name: 'Free Dragon Models',
    source: 'Free3D',
    url: 'https://free3d.com/3d-models/dragon',
    license: 'Various (check each)',
    instructions: 'Browse free dragons, check license, download GLB/FBX format',
    expectedSize: 'Varies',
    complexity: 'various'
  },
  {
    name: 'CGTrader Dragons',
    source: 'CGTrader',
    url: 'https://www.cgtrader.com/free-3d-models/animals/fantasy/dragon',
    license: 'Royalty Free (some)',
    instructions: 'Filter by free models, download GLB format preferred',
    expectedSize: 'Varies',
    complexity: 'various'
  }
];

function log(message) {
  console.log(`🐉 [DRAGON] ${message}`);
}

function createDirectories() {
  const dirs = [
    'public/models',
    'public/dragons',
    'public/textures',
    'temp-dragon-assets'
  ];
  
  dirs.forEach(dir => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
      log(`Created directory: ${dir}`);
    }
  });
}

function generateDragonGuide() {
  const guide = `
# 🐉 Dragon Model Setup Guide

## Quick Start (Recommended)

1. **Visit Sketchfab** and search for "dragon head low poly CC0"
2. **Download** a dragon model with Creative Commons license
3. **Place** the .glb file in \`public/models/dragon-head-lowpoly.glb\`
4. **Refresh** your site to see the 3D dragon!

## Best Free Dragon Sources

${DRAGON_SOURCES.map(source => `
### ${source.name}
- **Source**: [${source.source}](${source.url})
- **License**: ${source.license}
- **Size**: ${source.expectedSize}
- **Instructions**: ${source.instructions}
`).join('\n')}

## File Structure

Place your dragon models in these locations:

\`\`\`
public/
├── models/
│   ├── dragon-head-lowpoly.glb     # Main 3D model
│   ├── dragon-bust-mystical.glb   # Higher quality variant
│   └── dragon-animations.glb      # With animations
├── dragons/
│   ├── dragon-silhouette.svg      # Fallback SVG
│   └── dragon-preview.png         # Loading placeholder
└── textures/
    ├── dragon-diffuse.jpg         # Optional textures
    └── dragon-normal.jpg          # Normal maps
\`\`\`

## Model Requirements

- **Format**: GLB (preferred) or GLTF
- **Size**: Under 500KB for web performance
- **Polygons**: Under 20K triangles
- **Textures**: 512x512 or 1024x1024 max
- **Animations**: Optional (idle, breathe, roar)

## Optimization Tips

1. **Use Draco compression** for GLB files
2. **Bake textures** to reduce draw calls
3. **LOD versions** for different device tiers
4. **Test on mobile** devices

## Converting Models

If you have FBX or OBJ files, convert to GLB:

\`\`\`bash
# Using Blender (free)
blender --background --python scripts/fbx_to_glb.py -- input.fbx output.glb

# Using gltf-pipeline (npm)
npx gltf-pipeline -i input.gltf -o output.glb -d
\`\`\`

## License Compliance

- **CC0**: Free for any use (best option)
- **CC BY**: Free with attribution required
- **Royalty Free**: Check specific terms
- **Commercial**: May require purchase

---

**Need help?** Check the console for device tier detection and model loading logs.
`;

  fs.writeFileSync('DRAGON_SETUP_GUIDE.md', guide);
  log('Created DRAGON_SETUP_GUIDE.md');
}

function generateFallbackAssets() {
  // Create a simple SVG dragon silhouette
  const dragonSVG = `
<svg width="200" height="120" viewBox="0 0 200 120" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="dragonGradient" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" style="stop-color:#1F7A72;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#45A097;stop-opacity:1" />
    </linearGradient>
    <filter id="glow">
      <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
      <feMerge> 
        <feMergeNode in="coloredBlur"/>
        <feMergeNode in="SourceGraphic"/>
      </feMerge>
    </filter>
  </defs>
  
  <!-- Dragon body -->
  <ellipse cx="100" cy="60" rx="60" ry="25" fill="url(#dragonGradient)" filter="url(#glow)"/>
  
  <!-- Dragon head -->
  <ellipse cx="160" cy="50" rx="30" ry="20" fill="url(#dragonGradient)" filter="url(#glow)"/>
  
  <!-- Dragon eye -->
  <circle cx="170" cy="45" r="3" fill="#FF3B30"/>
  
  <!-- Dragon horns -->
  <polygon points="175,35 180,25 185,35" fill="#9BB0A7"/>
  <polygon points="165,35 170,25 175,35" fill="#9BB0A7"/>
  
  <!-- Wing suggestion -->
  <path d="M 80 40 Q 60 20 40 30 Q 50 50 80 55 Z" fill="url(#dragonGradient)" opacity="0.7"/>
  
  <style>
    svg {
      animation: dragonFloat 3s ease-in-out infinite alternate;
    }
    @keyframes dragonFloat {
      0% { transform: translateY(0px); }
      100% { transform: translateY(-10px); }
    }
  </style>
</svg>
  `;

  fs.writeFileSync('public/dragons/dragon-silhouette.svg', dragonSVG.trim());
  log('Created fallback dragon SVG');
}

function checkForModels() {
  const modelPaths = [
    'public/models/dragon-head-lowpoly.glb',
    'public/models/dragon-bust-mystical.glb',
    'public/dragons/dragon-silhouette.svg'
  ];

  log('Checking for existing dragon models...');
  
  modelPaths.forEach(modelPath => {
    if (fs.existsSync(modelPath)) {
      const stats = fs.statSync(modelPath);
      const sizeKB = (stats.size / 1024).toFixed(1);
      log(`✅ Found: ${modelPath} (${sizeKB}KB)`);
    } else {
      log(`❌ Missing: ${modelPath}`);
    }
  });
}

function generateDownloadScript() {
  const downloadScript = `
#!/bin/bash

# Dragon Model Download Script
# Run this after manually downloading models from the sources above

echo "🐉 Setting up dragon models for Frame Economics..."

# Create directories
mkdir -p public/models public/dragons public/textures

# Check if models exist
if [ -f "public/models/dragon-head-lowpoly.glb" ]; then
    echo "✅ Dragon model found!"
    ls -la public/models/
else
    echo "❌ No dragon model found."
    echo "Please download a dragon model and place it at:"
    echo "  public/models/dragon-head-lowpoly.glb"
    echo ""
    echo "Recommended sources:"
    echo "  - Sketchfab: https://sketchfab.com/tags/dragon"
    echo "  - Free3D: https://free3d.com/3d-models/dragon"
    echo "  - CGTrader: https://www.cgtrader.com/free-3d-models/animals/fantasy/dragon"
fi

echo "📖 See DRAGON_SETUP_GUIDE.md for detailed instructions."
  `;

  fs.writeFileSync('scripts/setup-dragons.sh', downloadScript.trim());
  log('Created setup-dragons.sh script');
}

function main() {
  log('Starting dragon model setup...');
  
  createDirectories();
  generateDragonGuide();
  generateFallbackAssets();
  generateDownloadScript();
  checkForModels();
  
  log('');
  log('🎉 Dragon setup complete!');
  log('');
  log('Next steps:');
  log('1. Read DRAGON_SETUP_GUIDE.md for model sources');
  log('2. Download a dragon GLB model to public/models/');
  log('3. Restart your dev server to see the 3D dragon!');
  log('');
  log('Quick start: Visit https://sketchfab.com/tags/dragon and download a CC0 model');
}

main();