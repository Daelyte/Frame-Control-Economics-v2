# Earth Dragon Edition - Integration Guide

## 🎯 What I've Updated

✅ **HTML Meta Tags Updated**
- Title changed to "Frame Economics — Earth Dragon Edition"
- OG image path updated to `/og-earth-dragon.png`
- Enhanced meta descriptions with Earth Dragon branding
- Twitter card meta tags updated

✅ **Hero Section Enhanced**
- Added "EARTH DRAGON EDITION" subtitle to the main banner
- Styled with cyan accent color for distinctive branding

## 🖼️ Required: Save Your OG Banner

**CRITICAL STEP**: You need to save the generated Earth Dragon banner image as:
```
public/og-earth-dragon.png
```

The image should be:
- **Dimensions**: 1200x630 pixels (perfect for social sharing)
- **Style**: Deep teal/jade gradient with diagonal topographic lines
- **Content**: "FRAME ECONOMICS" in cylindrical metallic band, Earth Dragon Edition subtitle, jade dragon mark background
- **CTA**: "icecoldfroste.com" call-to-action pill

## 🚀 Additional Integration Ideas

### 1. Dragon Mark Favicon
Consider creating a smaller dragon mark for favicon:
```html
<link rel="icon" type="image/png" href="/dragon-favicon.png" />
```

### 2. Loading Screen Enhancement
You could add the dragon mark to your loading screens:
```tsx
// In PremiumSpinner or loading components
<div className="dragon-mark-bg opacity-10">
  <img src="/dragon-mark.png" alt="" />
</div>
```

### 3. Earth Dragon Theme Colors
Your banner uses these beautiful colors that could be integrated throughout:
```css
/* Earth Dragon Color Palette */
--dragon-teal: #4CB8C4
--dragon-jade: #4CC89C  
--dragon-deep: #051213
--dragon-bronze: #D4A574
--dragon-cyan: #39F3FF
```

### 4. Section Dividers
The topographic diagonal lines could be used as section dividers:
```tsx
const TopoLines = () => (
  <div className="relative w-full h-4 overflow-hidden">
    {Array.from({length: 20}).map((_, i) => (
      <div 
        key={i}
        className="absolute h-px bg-teal-500/10 transform rotate-12"
        style={{left: `${i * 8}%`, top: '50%'}}
      />
    ))}
  </div>
);
```

### 5. Enhanced Mobile Navigation
Consider adding the dragon mark to your mobile menu:
```tsx
// In your mobile navigation
<div className="flex items-center gap-2">
  <img src="/dragon-mark.png" className="w-6 h-6 opacity-60" alt="" />
  <span>Frame Economics</span>
</div>
```

## 🔍 SEO Benefits

The Earth Dragon edition branding provides:
- **Distinctive positioning** - stands out from generic psychology content
- **Memorable brand identity** - dragon symbolism conveys power/wisdom
- **Social media appeal** - eye-catching OG banner for shares
- **Cohesive theming** - jade/teal colors create professional mystique

## 🎨 Brand Story Integration

Consider weaving the Earth Dragon narrative throughout:
- **Rules Section**: "Ancient wisdom meets modern psychology"
- **Assessment**: "Discover your dragon-level frame control"
- **Community**: "Join the Earth Dragon practitioners"

The Earth Dragon positions Frame Economics as both grounded (earth) and powerful (dragon) - perfect for your behavioral psychology brand.