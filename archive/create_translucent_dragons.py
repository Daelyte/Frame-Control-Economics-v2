#!/usr/bin/env python3
"""
Create translucent variants of the dragon OG image for better web integration.
"""

try:
    from PIL import Image, ImageOps
    import os
    import numpy as np
    
    # Source image
    src_path = "public/dragon-og.png"
    
    if not os.path.exists(src_path):
        print(f"❌ Source image not found: {src_path}")
        exit(1)
    
    print(f"📸 Loading source image: {src_path}")
    im = Image.open(src_path).convert("RGBA")
    w, h = im.size
    print(f"📏 Image dimensions: {w}x{h}")
    
    def apply_opacity(img, opacity):
        """Apply uniform opacity to an image"""
        r, g, b, a = img.split()
        # Keep existing alpha but reduce overall opacity
        a = a.point(lambda x: int(x * opacity))
        return Image.merge("RGBA", (r, g, b, a))
    
    def create_vignette_fade(img):
        """Create a radial fade effect centered on the dragon"""
        w, h = img.size
        # Create a radial gradient mask
        yy, xx = np.mgrid[0:h, 0:w]
        cx, cy = int(0.74*w), int(0.50*h)  # Dragon position (right-center)
        
        # Radial distance calculation
        r = np.sqrt(((xx-cx)/(0.7*w))**2 + ((yy-cy)/(0.7*h))**2)
        # Gradient from center (opaque) to edges (transparent)
        grad = 1.0 - np.clip((r-0.2)/0.6, 0, 1)
        mask_arr = (grad*255).astype(np.uint8)
        mask = Image.fromarray(mask_arr, mode="L")
        
        # Apply the mask
        result = img.copy()
        result.putalpha(mask)
        return result
    
    print("🎨 Creating translucent variants...")
    
    # Create opacity variants
    variants = [
        ("public/dragon-og-translucent-70.png", 0.70),
        ("public/dragon-og-translucent-40.png", 0.40),
        ("public/dragon-og-translucent-20.png", 0.20)
    ]
    
    for output_path, opacity in variants:
        translucent = apply_opacity(im, opacity)
        translucent.save(output_path, "PNG", optimize=True)
        size = os.path.getsize(output_path)
        print(f"✅ Created {output_path} ({opacity*100}% opacity) - {size:,} bytes")
    
    # Create vignette fade variant
    fade_path = "public/dragon-og-translucent-fade.png"
    faded = create_vignette_fade(im)
    faded.save(fade_path, "PNG", optimize=True)
    size = os.path.getsize(fade_path)
    print(f"✅ Created {fade_path} (vignette fade) - {size:,} bytes")
    
    # Create optimized 1200x630 version with 40% opacity
    target_w, target_h = 1200, 630
    resized = im.resize((target_w, target_h), Image.Resampling.LANCZOS)
    resized40 = apply_opacity(resized, 0.40)
    og_path = "public/dragon-og-1200x630-translucent.png"
    resized40.save(og_path, "PNG", optimize=True)
    size = os.path.getsize(og_path)
    print(f"✅ Created {og_path} (1200x630, 40% opacity) - {size:,} bytes")
    
    print("🎉 All translucent dragon variants created successfully!")
    print("\nGenerated files:")
    for output_path, _ in variants:
        print(f"  - {output_path}")
    print(f"  - {fade_path}")
    print(f"  - {og_path}")
    
except ImportError:
    print("❌ PIL (Pillow) not available. Installing...")
    os.system("pip install Pillow")
    print("Please run the script again after installation.")
except Exception as e:
    print(f"❌ Error: {e}")