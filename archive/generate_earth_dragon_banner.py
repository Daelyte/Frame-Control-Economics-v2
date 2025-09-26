#!/usr/bin/env python3
"""
Generate Earth Dragon OG Banner for Frame Economics
Creates a 1200x630 PNG with all the specified elements
"""

from PIL import Image, ImageDraw, ImageFont, ImageFilter, ImageOps
import numpy as np
import os

# Constants
W, H = 1200, 630
OUTPUT_PATH = "public/og-earth-dragon.png"

def create_earth_dragon_banner():
    # Base image with deep ink background
    img = Image.new("RGBA", (W, H), (5, 18, 19, 255))
    
    # Helper functions
    def vertical_gradient_rgba(w, h, top_rgb, bot_rgb):
        g = np.linspace(0, 1, h, dtype=np.float32)[:, None, None]
        top = np.array(top_rgb, dtype=np.float32)[None, None, :]
        bot = np.array(bot_rgb, dtype=np.float32)[None, None, :]
        arr = top * (1 - g) + bot * g
        arr = np.repeat(arr, w, axis=1)
        arr = np.ascontiguousarray(arr.astype(np.uint8))
        return Image.fromarray(arr, "RGB").convert("RGBA")
    
    def radial_overlay(w, h, center, color=(70, 160, 120), power=2.2, alpha=0.45):
        yy, xx = np.mgrid[0:h, 0:w]
        cx, cy = center
        r = np.sqrt(((xx - cx) / (0.9 * w))**2 + ((yy - cy) / (0.9 * h))**2)
        mask = np.clip(1 - (r**power), 0, 1) * alpha * 255
        overlay = Image.new("RGBA", (w, h), color + (0,))
        overlay.putalpha(Image.fromarray(mask.astype(np.uint8)))
        return overlay
    
    # Background gradient (deep teal/jade)
    bg_grad = vertical_gradient_rgba(W, H, (8, 31, 27), (7, 23, 21))
    img = Image.alpha_composite(img, bg_grad)
    
    # Jade glow on right side
    img = Image.alpha_composite(img, radial_overlay(W, H, (int(W * 0.77), int(H * 0.46))))
    
    # Diagonal topographic lines
    draw = ImageDraw.Draw(img)
    step = 46
    for i in range(-H, W, step):
        draw.line([(i, 0), (i + H, H)], fill=(20, 60, 55, 50), width=1)
    
    # Cylindrical metallic band
    band_h, band_margin = 170, 24
    band_box = (band_margin, band_margin, W - band_margin, band_margin + band_h)
    band_grad = vertical_gradient_rgba(W - 2 * band_margin, band_h, (18, 60, 48), (12, 38, 32))
    
    # Create band with rounded corners
    band_layer = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    mask = Image.new("L", (W, H), 0)
    mask_draw = ImageDraw.Draw(mask)
    mask_draw.rounded_rectangle(band_box, radius=band_h // 2, fill=255)
    tmp = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    tmp.paste(band_grad, (band_margin, band_margin))
    band_layer = Image.composite(tmp, band_layer, mask)
    img = Image.alpha_composite(img, band_layer)
    
    # Metallic sheen effect
    sheen = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    sdraw = ImageDraw.Draw(sheen)
    for i in range(0, W, 6):
        alpha = int(max(0, 120 - abs(i - W // 2) * 0.25))
        sdraw.line([(i, band_margin), (i + int(H * 0.5), band_margin + band_h)], 
                  fill=(255, 255, 255, max(0, alpha // 18)))
    sheen = sheen.filter(ImageFilter.GaussianBlur(2.4))
    img = Image.alpha_composite(img, sheen)
    
    # Dragon mark background (create simple dragon silhouette)
    dragon_canvas = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    dragon_draw = ImageDraw.Draw(dragon_canvas)
    
    # Simple dragon silhouette at position
    x, y = int(W * 0.67), int(H * 0.24)
    dragon_size = int(H * 0.6)
    
    # Dragon body (curved shape)
    dragon_draw.ellipse([x, y, x + dragon_size//2, y + dragon_size//3], 
                       fill=(76, 200, 150, 80))
    # Dragon head
    dragon_draw.ellipse([x + dragon_size//3, y - dragon_size//6, 
                        x + dragon_size//2 + 40, y + dragon_size//6], 
                       fill=(76, 200, 150, 60))
    
    # Blur for glow effect
    dragon_glow = dragon_canvas.filter(ImageFilter.GaussianBlur(20))
    img = Image.alpha_composite(img, dragon_glow)
    
    # Typography
    def load_font(size, bold=False):
        try:
            if bold:
                return ImageFont.truetype("arial.ttf", size=size)
            else:
                return ImageFont.truetype("arial.ttf", size=size)
        except:
            return ImageFont.load_default()
    
    # Main title in the band
    title_font = load_font(84, bold=True)
    subtitle_font = load_font(22)
    tagline_font = load_font(30)
    cta_font = load_font(30)
    
    draw = ImageDraw.Draw(img)
    
    # "FRAME ECONOMICS" in the cylindrical band
    draw.text((band_margin + 36, band_margin + 28), "FRAME  ECONOMICS", 
              font=title_font, fill=(186, 249, 232, 255))
    
    # Subtitle in the band
    draw.text((band_margin + 40, band_margin + 112), 
              "Earth Dragon Edition · Master Behavioral Psychology & Influence", 
              font=subtitle_font, fill=(158, 231, 222, 255))
    
    # Tagline below the band
    draw.text((48, band_margin + band_h + 48), "Rules · Science · Case Studies", 
              font=tagline_font, fill=(150, 215, 200, 230))
    
    # CTA pill
    pill_w, pill_h = 336, 56
    pill_x, pill_y = 48, band_margin + band_h + 92
    
    pill = Image.new("RGBA", (pill_w, pill_h), (0, 0, 0, 0))
    pdraw = ImageDraw.Draw(pill)
    pdraw.rounded_rectangle((0, 0, pill_w, pill_h), radius=28, 
                           fill=(57, 215, 201, 230), outline=(0, 0, 0, 40), width=1)
    
    # Inner highlight
    inner = Image.new("RGBA", (pill_w, pill_h), (255, 255, 255, 0))
    idraw = ImageDraw.Draw(inner)
    idraw.rounded_rectangle((2, 2, pill_w - 2, pill_h // 2), radius=26, 
                           fill=(255, 255, 255, 60))
    pill = Image.alpha_composite(pill, inner)
    
    # CTA text
    cta_text = "icecoldfroste.com"
    try:
        tw = cta_font.getbbox(cta_text)[2]
        th = cta_font.getbbox(cta_text)[3]
    except:
        tw, th = 200, 30
    
    pdraw.text(((pill_w - tw) // 2, (pill_h - th) // 2 - 1), cta_text, 
               font=cta_font, fill=(1, 37, 35, 255))
    
    img.alpha_composite(pill, dest=(pill_x, pill_y))
    
    # Vignette effect
    v = Image.new("L", (W, H), 0)
    vd = ImageDraw.Draw(v)
    vd.rectangle((0, 0, W, H), fill=255)
    v = v.filter(ImageFilter.GaussianBlur(120))
    v = ImageOps.invert(v).point(lambda x: int(x * 0.45))
    vig = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    vig.putalpha(v)
    img = Image.alpha_composite(img, vig)
    
    # Subtle grain texture
    w, h = img.size
    noise = np.random.randint(0, 256, (h, w), dtype=np.uint8)
    nimg = Image.fromarray(noise, "L").filter(ImageFilter.GaussianBlur(0.6)).convert("RGBA")
    nimg.putalpha(10)
    img = Image.alpha_composite(img, nimg)
    
    return img

def main():
    print("🐉 Generating Earth Dragon OG Banner...")
    
    try:
        # Create the banner
        banner = create_earth_dragon_banner()
        
        # Ensure public directory exists
        os.makedirs("public", exist_ok=True)
        
        # Save the image
        banner.save(OUTPUT_PATH, "PNG", optimize=True)
        
        print(f"✅ Earth Dragon banner generated successfully!")
        print(f"📁 Saved to: {OUTPUT_PATH}")
        print(f"📐 Dimensions: 1200x630 (perfect for OG sharing)")
        
        # Get file size
        file_size = os.path.getsize(OUTPUT_PATH)
        print(f"💾 File size: {file_size:,} bytes")
        
    except Exception as e:
        print(f"❌ Error generating banner: {e}")
        print("Make sure you have PIL (Pillow) installed: pip install Pillow")

if __name__ == "__main__":
    main()