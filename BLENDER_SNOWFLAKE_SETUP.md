# Blender Icy Snowflake Setup Guide

This guide explains how to generate the sophisticated Blender icy snowflake model for the Frame Economics 3D experience.

## Quick Start

The application will work perfectly with the current procedural snowflake. The Blender-generated snowflake is an **optional enhancement** that provides more realistic ice materials and detailed geometry.

## Prerequisites

- Blender 3.0+ (Download from [blender.org](https://www.blender.org/download/))
- Basic familiarity with Blender interface

## Step 1: Generate the Snowflake in Blender

1. **Open Blender** (3.0 or newer)

2. **Open Text Editor**:
   - Switch to the "Scripting" workspace or add a Text Editor panel
   - Click "New" to create a new text block

3. **Copy the Script**:
   - Copy the entire contents of `blender-scripts/icy_snowflake_generator.py`
   - Paste it into the Blender text editor

4. **Configure Export Settings** (optional):
   ```python
   # In the script, modify these lines:
   EXPORT_GLTF = True  # Enable auto-export
   EXPORT_PATH = "C:/your/path/icy_snowflake.glb"  # Set your export path
   ```

5. **Run the Script**:
   - Click "Run Script" button or press `Alt + P`
   - The snowflake will be generated in the 3D viewport
   - If `EXPORT_GLTF = True`, it will auto-export to your specified path

## Step 2: Manual Export (if not auto-exported)

1. **Select the Snowflake**: Click on the "Icy_Snowflake" object in the outliner
2. **Export as GLB**:
   - File → Export → glTF 2.0 (.glb)
   - Choose your export location
   - **Important Settings**:
     - Format: GLB (binary)
     - Include: Selected Objects (or Visible Objects)
     - Transform: Apply modifiers ✓
     - Materials: Export ✓

## Step 3: Add to Your Project

1. **Place the GLB file**:
   ```
   public/
   └── models/
       └── icy_snowflake.glb
   ```

2. **Verify Setup**:
   - The application will automatically detect and load the GLB model
   - If the file is missing, it gracefully falls back to the procedural snowflake
   - Check browser console for loading status

## Customization Options

### Script Parameters

You can modify these values in the Blender script before running:

```python
SNOWFLAKE_SCALE = 1.0            # Overall size (try 0.8 for smaller, 1.2 for larger)
ARM_THICKNESS = 0.02             # Branch thickness
NUM_ARMS = 6                     # Number of main arms (6 is traditional)
SUBDIV_LEVELS = 2                # Detail level (higher = more polygons)
DISPLACE_STRENGTH = 0.03         # Surface roughness strength
```

### Material Properties

The script creates an advanced ice material with:
- **Transmission**: Full transparency like real ice
- **IOR**: 1.31 (index of refraction for ice)
- **Clearcoat**: Glossy surface layer
- **Procedural Bump**: Micro-surface details using Musgrave texture

## Performance Considerations

### File Size Optimization

For web deployment, consider these optimizations:

1. **Enable Decimation** (in script):
   ```python
   # Uncomment these lines at the end of the script:
   dec = snowflake.modifiers.new('Decimate', type='DECIMATE')
   dec.ratio = 0.6  # Reduce polygon count by 40%
   ```

2. **Draco Compression** (in Blender export):
   - Enable "Draco mesh compression" in export settings
   - Reduces file size significantly

3. **Texture Optimization**:
   - The script uses procedural materials (no texture files needed)
   - This keeps the GLB file small and self-contained

### Device Tier Handling

The application automatically handles different device capabilities:

- **High-end devices**: Full Blender model with all details
- **Medium devices**: Blender model with reduced complexity
- **Low-end devices**: Always uses procedural fallback for performance

## Troubleshooting

### Model Not Loading
- Check that the file exists at `public/models/icy_snowflake.glb`
- Verify file is not corrupted (try opening in Blender)
- Check browser console for loading errors

### Performance Issues
- Reduce `SUBDIV_LEVELS` in the script (try 1 instead of 2)
- Enable decimation modifier
- Use Draco compression in export

### Visual Issues
- Ensure you have proper lighting in your 3D scene
- The ice material requires good lighting to look realistic
- Try adjusting `emissiveIntensity` values in the script

## Advanced: HDRI Lighting

For the most realistic results, use HDRI environment lighting:

1. Download an HDRI file (try [HDRI Haven](https://hdrihaven.com/))
2. Set the path in the script:
   ```python
   WORLD_HDRI = "C:/path/to/your/hdri.exr"
   ```
3. This provides realistic reflections and lighting

## Integration Details

The `IcySnowflake` component handles:
- **Automatic Loading**: Tries GLB first, falls back to procedural
- **Error Handling**: Graceful degradation if file is missing
- **Performance**: Device-appropriate rendering
- **Animation**: Maintains the same magical animations as the procedural version

The system is designed to work perfectly whether you use the Blender model or not!

## File Structure

```
frame-economics-v2-test/
├── blender-scripts/
│   └── icy_snowflake_generator.py    # Blender script
├── components/
│   ├── IcySnowflake.tsx              # GLB loader with fallback
│   └── NeuralOrb.tsx                 # Uses IcySnowflake component
├── public/
│   └── models/
│       └── icy_snowflake.glb         # (Your generated file)
└── BLENDER_SNOWFLAKE_SETUP.md        # This guide
```