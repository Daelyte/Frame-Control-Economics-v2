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