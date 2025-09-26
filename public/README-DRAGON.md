# Dragon Theme Implementation

## Files Added/Updated

### New Dragon Assets
- `dragon-og.png` - Main OG image for social media (1200x630px) **[PLACEHOLDER - Replace with actual image]**
- `dragon-mark.png` - Dragon logo mark for masking **[PLACEHOLDER - Replace with actual image]**
- `dragon-hero.html` - Standalone animated hero page with dragon theme

### Updated Components
- `src/components/AnimatedOGBanner.tsx` - Now uses dragon theme instead of video
- `src/components/DragonLogoDemo.tsx` - Demo component showcasing dragon logo
- `src/index.css` - Added dragon logo CSS component
- `index.html` - Updated OG meta tags to use dragon image

## Dragon Logo Usage

The dragon logo is a CSS-only component with these features:
- **Breathing glow animation** (3.6s cycle)
- **Rotating glint effect** (5s cycle)
- **Hover effects** with lift and enhanced glow
- **Responsive sizing** via CSS custom properties
- **Reduced motion support** for accessibility

### Basic Usage
```jsx
<a className="dragon-logo" href="/" aria-label="Frame Economics dragon mark"></a>
```

### Custom Size
```jsx
<a 
  className="dragon-logo" 
  style={{ '--dragon-size': '72px' }}
  href="/" 
  aria-label="Frame Economics dragon mark"
></a>
```

### Available CSS Custom Properties
- `--dragon-size`: Controls logo dimensions (default: 48px)
- `--dragon-base`: Base color (default: #39D7C9)
- `--dragon-glow`: Glow color (default: #78FFF3)

## Next Steps

1. **Replace placeholder files:**
   - Add your actual dragon OG image as `dragon-og.png` (1200x630px)
   - Add your dragon logo mark as `dragon-mark.png` (square, transparent background)

2. **Optional cleanup:**
   - Remove old `og-image.jpg` when confirmed dragon theme is working
   - Remove `og-video-placeholder.txt` if no longer needed

3. **Test the implementation:**
   - Verify OG tags work properly with social media debuggers
   - Test dragon logo displays correctly across different screen sizes
   - Confirm animations respect `prefers-reduced-motion`

## Social Media Preview

The dragon OG image will be used for:
- Facebook/Open Graph previews
- Twitter card previews
- LinkedIn post previews
- Other social media platforms

Make sure the dragon image includes readable text and branding that works at thumbnail sizes.