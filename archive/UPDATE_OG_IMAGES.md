# 🐉 Dragon OG Image Update Instructions

## Files You Need to Add

Please copy your translucent dragon images to the following locations:

### 1. Social Media Ready (Primary OG Image)
**Copy:** `og-dragon-1200x630-translucent-40.png`
**To:** `public/og-dragon-new.png`
**Size:** 1200×630px (perfect for social sharing)

### 2. All Dragon Variations (to dragons folder)
Copy all your dragon images to `public/dragons/`:
- `og-dragon-translucent-70.png`
- `og-dragon-translucent-40.png`
- `og-dragon-translucent-20.png`
- `og-dragon-translucent-fade.png`
- `og-dragon-1200x630-translucent-40.png`

## What This Updates

✅ **Facebook/Meta sharing** - Shows new dragon when shared on Facebook, Messenger, etc.  
✅ **Twitter/X sharing** - Shows new dragon in Twitter cards  
✅ **LinkedIn sharing** - Professional dragon branding on LinkedIn  
✅ **Discord/Slack** - Rich link previews with new dragon  
✅ **WhatsApp/Telegram** - Link previews show updated branding  

## Commands to Run After Copying Files

```bash
# Validate the new setup
npm run validate:quick

# Test the dragon integration
npm run dev
```

## File Locations Summary

```
public/
├── dragons/                           # Dragon asset library
│   ├── og-dragon-translucent-70.png  # High visibility
│   ├── og-dragon-translucent-40.png  # Balanced
│   ├── og-dragon-translucent-20.png  # Subtle watermark
│   ├── og-dragon-translucent-fade.png # Soft fade
│   └── og-dragon-1200x630-translucent-40.png # Social ready
├── og-dragon-new.png                 # Main OG image (copy of social ready)
└── dragon-mark.png                   # Existing dragon logo
```

## After Copying Files

1. Copy your files to the locations above
2. Run: `npm run update-og` (I'll create this command)
3. The HTML meta tags will be automatically updated
4. Deploy to see new dragon in social shares!