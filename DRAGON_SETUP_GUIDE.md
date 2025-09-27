
# 🐉 Dragon Model Setup Guide

## Quick Start (Recommended)

1. **Visit Sketchfab** and search for "dragon head low poly CC0"
2. **Download** a dragon model with Creative Commons license
3. **Place** the .glb file in `public/models/dragon-head-lowpoly.glb`
4. **Refresh** your site to see the 3D dragon!

## Best Free Dragon Sources


### Low Poly Dragon Head
- **Source**: [Sketchfab](https://sketchfab.com/3d-models/dragon-head-low-poly-2c4b0e0c0c8e4e6f8a9c5c8c8c8c8c8c)
- **License**: CC BY 4.0
- **Size**: 125KB
- **Instructions**: Download manually from Sketchfab, then place in public/models/


### Animated Dragon
- **Source**: [Mixamo](https://www.mixamo.com/#/?page=1&query=dragon&type=Character)
- **License**: Free for web use
- **Size**: 280KB
- **Instructions**: Upload to Mixamo, add idle animation, download as FBX, convert to GLB


### Free Dragon Models
- **Source**: [Free3D](https://free3d.com/3d-models/dragon)
- **License**: Various (check each)
- **Size**: Varies
- **Instructions**: Browse free dragons, check license, download GLB/FBX format


### CGTrader Dragons
- **Source**: [CGTrader](https://www.cgtrader.com/free-3d-models/animals/fantasy/dragon)
- **License**: Royalty Free (some)
- **Size**: Varies
- **Instructions**: Filter by free models, download GLB format preferred


## File Structure

Place your dragon models in these locations:

```
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
```

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

```bash
# Using Blender (free)
blender --background --python scripts/fbx_to_glb.py -- input.fbx output.glb

# Using gltf-pipeline (npm)
npx gltf-pipeline -i input.gltf -o output.glb -d
```

## License Compliance

- **CC0**: Free for any use (best option)
- **CC BY**: Free with attribution required
- **Royalty Free**: Check specific terms
- **Commercial**: May require purchase

---

**Need help?** Check the console for device tier detection and model loading logs.
