#!/usr/bin/env python3
"""
Frame Economics Banner Generator
Generates beautiful dragon banners for the website
"""

from PIL import Image, ImageDraw, ImageFont, ImageFilter, ImageOps
import numpy as np
import os

def vertical_gradient_rgba(w, h, top_rgb, bot_rgb):
    """Create a vertical gradient background"""
    g = np.linspace(0, 1, h, dtype=np.float32)[:, None, None]
    top = np.array(top_rgb, dtype=np.float32)[None, None, :]
    bot = np.array(bot_rgb, dtype=np.float32)[None, None, :]
    arr = top * (1 - g) + bot * g
    arr = np.repeat(arr, w, axis=1)
    arr = np.ascontiguousarray(arr.astype(np.uint8))
    return Image.fromarray(arr, "RGB").convert("RGBA")

def radial_overlay(w, h, center, color=(70, 160, 120), power=2.1, alpha=0.45):
    """Create a radial gradient overlay"""
    yy, xx = np.mgrid[0:h, 0:w]
    cx, cy = center
    r = np.sqrt(((xx - cx) / (0.9 * w)) ** 2 + ((yy - cy) / (0.9 * h)) ** 2)
    mask = np.clip(1 - (r ** power), 0, 1) * alpha * 255
    overlay = Image.new("RGBA", (w, h), color + (0,))
    overlay.putalpha(Image.fromarray(mask.astype(np.uint8)))
    return overlay

def add_topo_lines(img, color=(22, 65, 58, 55), step=44):
    """Add topographical lines to the background"""
    draw = ImageDraw.Draw(img)
    W, H = img.size
    for i in range(-H, W, step):
        draw.line([(i, 0), (i + H, H)], fill=color, width=1)

def create_dragon_silhouette(w, h):
    """Create a dragon silhouette using paths"""
    dragon = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    draw = ImageDraw.Draw(dragon)
    
    # Scale factor based on image size
    scale = min(w, h) / 400
    
    # Dragon head outline (simplified)
    head_points = [
        (int(200 * scale), int(150 * scale)),
        (int(180 * scale), int(120 * scale)),
        (int(160 * scale), int(100 * scale)),
        (int(200 * scale), int(80 * scale)),
        (int(240 * scale), int(90 * scale)),
        (int(280 * scale), int(110 * scale)),
        (int(300 * scale), int(140 * scale)),
        (int(290 * scale), int(170 * scale)),
        (int(270 * scale), int(180 * scale)),
        (int(240 * scale), int(175 * scale)),
    ]
    
    # Draw dragon head
    draw.polygon(head_points, fill=(90, 210, 160, 180), outline=(60, 180, 130, 200))
    
    # Dragon horns/antlers
    horn_points = [
        [(int(220 * scale), int(80 * scale)), (int(210 * scale), int(60 * scale)), (int(215 * scale), int(40 * scale))],
        [(int(240 * scale), int(75 * scale)), (int(250 * scale), int(55 * scale)), (int(260 * scale), int(35 * scale))],
        [(int(260 * scale), int(85 * scale)), (int(275 * scale), int(65 * scale)), (int(290 * scale), int(45 * scale))]
    ]
    
    for horn in horn_points:
        draw.line(horn, fill=(90, 210, 160, 220), width=int(3 * scale))
    
    # Dragon eye
    draw.ellipse([
        int(230 * scale), int(130 * scale), 
        int(245 * scale), int(145 * scale)
    ], fill=(120, 240, 180, 255))
    
    # Breathing effect (curved lines)
    breath_points = [
        [(int(160 * scale), int(140 * scale)), (int(120 * scale), int(135 * scale)), (int(80 * scale), int(130 * scale))],
        [(int(165 * scale), int(150 * scale)), (int(125 * scale), int(148 * scale)), (int(85 * scale), int(145 * scale))],
        [(int(155 * scale), int(130 * scale)), (int(115 * scale), int(125 * scale)), (int(75 * scale), int(120 * scale))]
    ]
    
    for breath in breath_points:
        draw.line(breath, fill=(90, 210, 160, 150), width=int(2 * scale))
    
    return dragon

def get_font(size):
    """Get the best available font"""
    font_paths = [
        "/Windows/Fonts/arial.ttf",  # Windows
        "/System/Library/Fonts/Arial.ttf",  # macOS
        "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf",  # Linux
        "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf"
    ]
    
    for path in font_paths:
        if os.path.exists(path):
            try:
                return ImageFont.truetype(path, size=size)
            except:
                continue
    
    return ImageFont.load_default()

def build_banner(W, H, out_path, variant="dark"):
    """Build a Frame Economics banner"""
    
    if variant == "dark":
        # Dark gradient background
        img = vertical_gradient_rgba(W, H, (6, 24, 22), (4, 16, 15))
        img = Image.alpha_composite(img, radial_overlay(W, H, (int(W * 0.78), int(H * 0.46)), color=(76, 170, 135), alpha=0.40))
        add_topo_lines(img)
    else:
        # Light gradient background
        img = vertical_gradient_rgba(W, H, (240, 248, 245), (220, 240, 235))
        img = Image.alpha_composite(img, radial_overlay(W, H, (int(W * 0.78), int(H * 0.46)), color=(39, 215, 201), alpha=0.20))
    
    # Add dragon silhouette
    dragon_scale = 0.6
    dragon_w, dragon_h = int(W * dragon_scale), int(H * dragon_scale)
    dragon = create_dragon_silhouette(dragon_w, dragon_h)
    
    # Position dragon in upper right
    dragon_x = int(W * 0.55)
    dragon_y = int(H * 0.1)
    
    # Create glow effect
    glow = dragon.copy().filter(ImageFilter.GaussianBlur(15))
    glow_img = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    glow_img.paste(glow, (dragon_x, dragon_y), glow)
    img = Image.alpha_composite(img, glow_img)
    
    # Paste dragon
    dragon_img = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    dragon_img.paste(dragon, (dragon_x, dragon_y), dragon)
    img = Image.alpha_composite(img, dragon_img)
    
    # Text styling
    title_font = get_font(int(0.12 * H))
    subtitle_font = get_font(int(0.045 * H))
    url_font = get_font(int(0.035 * H))
    
    draw = ImageDraw.Draw(img)
    
    # Main title
    title_color = (188, 250, 234, 255) if variant == "dark" else (6, 24, 22, 255)
    draw.text((int(0.05 * W), int(0.15 * H)), "FRAME ECONOMICS", font=title_font, fill=title_color)
    
    # Subtitle
    subtitle_color = (150, 215, 200, 230) if variant == "dark" else (40, 120, 100, 230)
    draw.text((int(0.05 * W), int(0.35 * H)), "Master Behavioral Psychology & Influence", font=subtitle_font, fill=subtitle_color)
    
    # Features line
    draw.text((int(0.05 * W), int(0.45 * H)), "Rules · Science · Case Studies", font=subtitle_font, fill=subtitle_color)
    
    # URL pill/button
    pill_w, pill_h = int(0.3 * W), int(0.08 * H)
    pill_x, pill_y = int(0.05 * W), int(0.65 * H)
    
    # Create pill background
    pill = Image.new("RGBA", (pill_w, pill_h), (0, 0, 0, 0))
    pill_draw = ImageDraw.Draw(pill)
    pill_color = (57, 215, 201, 235) if variant == "dark" else (39, 150, 140, 235)
    pill_draw.rounded_rectangle((0, 0, pill_w, pill_h), radius=pill_h // 2, fill=pill_color, outline=(0, 0, 0, 50), width=2)
    
    # Add shine effect
    shine = Image.new("RGBA", (pill_w, pill_h), (255, 255, 255, 0))
    shine_draw = ImageDraw.Draw(shine)
    shine_draw.rounded_rectangle((2, 2, pill_w - 2, pill_h // 2), radius=pill_h // 2 - 3, fill=(255, 255, 255, 60))
    pill = Image.alpha_composite(pill, shine)
    
    # Add URL text
    url_text = "icecoldfroste.com"
    url_color = (1, 37, 35, 255) if variant == "dark" else (255, 255, 255, 255)
    
    # Calculate text position to center it in pill
    bbox = pill_draw.textbbox((0, 0), url_text, font=url_font)
    text_w = bbox[2] - bbox[0]
    text_h = bbox[3] - bbox[1]
    text_x = (pill_w - text_w) // 2
    text_y = (pill_h - text_h) // 2
    
    pill_draw.text((text_x, text_y), url_text, font=url_font, fill=url_color)
    
    # Composite pill onto main image
    img.alpha_composite(pill, dest=(pill_x, pill_y))
    
    # Add subtle vignette
    vignette = Image.new("L", (W, H), 255)
    vignette_draw = ImageDraw.Draw(vignette)
    vignette_draw.rectangle((0, 0, W, H), fill=255)
    vignette = vignette.filter(ImageFilter.GaussianBlur(100))
    vignette = ImageOps.invert(vignette)
    vignette = vignette.point(lambda x: int(x * 0.3))
    
    vig_img = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    vig_img.putalpha(vignette)
    img = Image.alpha_composite(img, vig_img)
    
    # Light texture/grain
    noise = np.random.randint(0, 256, (H, W), dtype=np.uint8)
    noise_img = Image.fromarray(noise, "L").filter(ImageFilter.GaussianBlur(0.5)).convert("RGBA")
    noise_img.putalpha(8)
    img = Image.alpha_composite(img, noise_img)
    
    # Save
    img.save(out_path, "PNG", optimize=True, quality=95)
    print(f"✅ Generated: {out_path}")

def main():
    """Generate all banner variants"""
    # Ensure public directory exists
    public_dir = "public"
    if not os.path.exists(public_dir):
        os.makedirs(public_dir)
    
    # Generate banners
    banners = [
        (1200, 630, f"{public_dir}/og-dragon-dark.png", "dark"),
        (1200, 600, f"{public_dir}/og-dragon-dark-slim.png", "dark"),
        (1200, 630, f"{public_dir}/og-dragon-light.png", "light"),
        (1200, 630, f"{public_dir}/og-dragon-pro.png", "dark"),  # Professional variant
    ]
    
    for width, height, path, variant in banners:
        build_banner(width, height, path, variant)
    
    print(f"\n🎉 All banners generated successfully!")
    print("Files created:")
    for _, _, path, _ in banners:
        print(f"  - {path}")

if __name__ == "__main__":
    main()