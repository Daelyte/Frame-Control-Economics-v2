# 🔮 Blender-Powered UI Models Setup Guide

Complete guide to creating the Neural Network Orb, Crystal Prisms, and Dragon models in Blender for Frame Economics.

## 🎯 Overview

We're creating three main 3D elements:
1. **Neural Network Orb** - Central psychology/brain metaphor
2. **Crystal Prisms** - Floating ambient background elements  
3. **Dragon Model** - Side accent element (optional upgrade)

## 🧠 1. Neural Network Orb

### Blender Steps:

1. **Create Base Sphere**
   ```
   Add > Mesh > UV Sphere
   Scale: S + 0.3 (small central core)
   ```

2. **Add Wireframe Network**
   ```
   Duplicate sphere: Shift+D
   Scale up: S + 1.5
   Add Modifier > Wireframe
   - Thickness: 0.02
   - Offset: -1.0 (inward)
   ```

3. **Materials Setup**
   ```
   Central Orb:
   - Principled BSDF
   - Base Color: #1F7A72 (jade)
   - Emission: #1F7A72
   - Emission Strength: 0.3
   - Metallic: 0.8, Roughness: 0.1
   
   Network Wireframe:
   - Base Color: #9BB0A7 (sage)
   - Emission: #9BB0A7  
   - Emission Strength: 0.2
   - Transmission: 0.6 (glass-like)
   ```

4. **Add Network Nodes**
   ```
   Create small spheres at vertices:
   - Add > Mesh > UV Sphere
   - Scale: S + 0.08
   - Duplicate to ~12-20 positions on wireframe vertices
   - Material: Bright emission (#FF3B30)
   ```

5. **Animation (Optional)**
   ```
   - Keyframe rotation: R + Y + 360 over 240 frames
   - Add noise modifier to network for subtle movement
   - Pulse animation: Scale 0.9-1.1 over 60 frames
   ```

6. **Export**
   ```
   File > Export > glTF 2.0
   - Format: GLB (Binary)
   - Include: Selected Objects
   - Apply Modifiers: ON
   - Compression: Draco (optional)
   - Save as: neural-orb.glb
   ```

## 💎 2. Crystal Prisms (3 Variants)

### Variant A: Triangular Prism

1. **Create Shape**
   ```
   Add > Mesh > Cylinder
   Vertices: 3 (makes triangle)
   Scale: S + 0.8
   Extrude: E + Z + 1.0
   ```

2. **Material - Glass Crystal**
   ```
   Principled BSDF:
   - Base Color: #1F7A72
   - Transmission: 0.9
   - Roughness: 0.1  
   - IOR: 1.5
   - Alpha: 0.6
   ```

### Variant B: Hexagonal Prism

1. **Create Shape**
   ```
   Add > Mesh > Cylinder
   Vertices: 6
   Scale: S + 0.8
   Extrude: E + Z + 0.6
   ```

### Variant C: Octahedron Crystal

1. **Create Shape**
   ```
   Add > Mesh > Octahedron
   Apply Transform: Ctrl+A
   ```

### Export All Crystals
```
Select all 3 variants
File > Export > glTF 2.0
Save as: crystal-prisms.glb
```

## 🐉 3. Dragon Model (Advanced)

### Option A: Download & Optimize

**Recommended Sources:**
- [Sketchfab - Dragon Head Low Poly](https://sketchfab.com/tags/dragon)
- [Free3D - Dragon Models](https://free3d.com/3d-models/dragon)
- [CGTrader - Free Dragons](https://www.cgtrader.com/free-3d-models/animals/fantasy/dragon)

**Search Terms:**
- "dragon head low poly CC0"
- "animated dragon free"
- "dragon bust royalty free"

### Option B: Create Simple Dragon

1. **Basic Dragon Head**
   ```
   Add > Mesh > Cube
   Scale: S + [1.5, 1, 2] (elongated)
   Add eyes: 2 small spheres
   Add horns: 2 cones, scale + position
   Add snout: smaller cube, positioned forward
   ```

2. **Materials**
   ```
   Main Body: #1F7A72 (jade)
   Eyes: #FF3B30 (cherry red, emissive)
   Horns: #9BB0A7 (metallic sage)
   ```

### Animation (Optional)
```
Idle Animation:
- Subtle breathing: Scale 0.98-1.02 over 90 frames
- Head sway: Rotate Y -5° to +5° over 120 frames
```

## 🛠️ Optimization Checklist

### Before Export:
- [ ] Apply all transforms (Ctrl+A)
- [ ] Remove doubles (M > Merge by Distance)  
- [ ] Check polygon count (<20K per model)
- [ ] Optimize materials (combine where possible)
- [ ] Pack textures if using images

### Export Settings:
```
Format: GLB (Binary)
Include:
  ☑ Selected Objects
  ☑ Materials  
  ☑ Animations (if any)
Geometry:
  ☑ Apply Modifiers
  ☑ UVs
  ☑ Normals
Transform:
  ☑ +Y Up
Compression:
  ☑ Draco (for smaller files)
```

## 📁 File Organization

Place exported models in:
```
public/models/
├── neural-orb.glb          # Main neural network
├── neural-orb-simple.glb   # Lower poly version  
├── crystal-prisms.glb      # All 3 crystal variants
├── dragon-head.glb         # Optional dragon model
└── dragon-fallback.png     # 2D fallback image
```

## 🎨 Material Guidelines

### Color Palette:
- **Primary**: #1F7A72 (Jade) 
- **Accent**: #FF3B30 (Cherry Red)
- **Muted**: #9BB0A7 (Sage)
- **Deep**: #0F3B38 (Deep Teal)

### Material Properties:
- **Glass/Crystal**: High transmission (0.8-0.9), low roughness (0.1)
- **Metal**: High metallic (0.8+), medium roughness (0.2-0.4)  
- **Emissive**: Use sparingly, 0.1-0.5 intensity
- **Transparency**: 0.6-0.8 for glass effects

## 🚀 Performance Tips

### Poly Count Targets:
- **Neural Orb**: <5K triangles
- **Each Crystal**: <1K triangles
- **Dragon Model**: <15K triangles

### LOD Strategy:
Create multiple versions:
- **High**: Full detail for desktop
- **Medium**: 50% poly reduction
- **Low**: Geometric primitives only

## 🔧 Testing Your Models

1. **Blender Preview**: Use rendered view to check materials
2. **Online Viewer**: Upload to [glTF Viewer](https://gltf-viewer.donmccurdy.com/)
3. **Local Test**: Place in `/public/models/` and test in Next.js

## 📦 Optimization Commands

After exporting, optimize with gltf-transform:

```bash
# Basic optimization
npx gltf-transform copy input.glb output.glb --prune

# With Draco compression  
npx gltf-transform copy input.glb output.glb \
  --prune \
  --draco.quantizePosition 14 \
  --draco.quantizeNormal 12 \
  --draco.quantizeTexcoord 12

# Check model info
npx gltf-transform inspect output.glb
```

## 🎯 Success Metrics

Your models should achieve:
- **File Size**: <500KB total for all models
- **Poly Count**: <25K total across all models  
- **Load Time**: <2 seconds on 3G connection
- **Visual Quality**: Crisp at 1080p, acceptable at 4K

---

**Need help?** Check the console for loading errors and performance metrics. The fallback components will automatically activate if models fail to load.