# Favicon Generation Instructions

The SVG favicon (`/public/favicon.svg`) is the source file. PNG versions need to be generated for older browser support.

## Option 1: Online Tool (Recommended for Phase 1)

1. Visit https://realfavicongenerator.net/
2. Upload `/public/favicon.svg`
3. Generate favicons for all platforms
4. Download and place in `/public/`:
   - `favicon-16x16.png`
   - `favicon-32x32.png`
   - `apple-touch-icon.png` (180x180)

## Option 2: Using ImageMagick (if installed)

```bash
cd frontend/public

# Generate 16x16 PNG
convert favicon.svg -resize 16x16 favicon-16x16.png

# Generate 32x32 PNG
convert favicon.svg -resize 32x32 favicon-32x32.png

# Generate Apple touch icon (180x180)
convert favicon.svg -resize 180x180 apple-touch-icon.png
```

## Option 3: Using Node.js (sharp package)

```bash
npm install --save-dev sharp

node -e "
const sharp = require('sharp');
sharp('public/favicon.svg')
  .resize(16, 16)
  .png()
  .toFile('public/favicon-16x16.png');
sharp('public/favicon.svg')
  .resize(32, 32)
  .png()
  .toFile('public/favicon-32x32.png');
sharp('public/favicon.svg')
  .resize(180, 180)
  .png()
  .toFile('public/apple-touch-icon.png');
"
```

## Current Status

✅ SVG favicon created (`favicon.svg`)  
⏳ PNG favicons need to be generated (can be done manually or deferred to Phase 2)

The SVG favicon will work in modern browsers. PNG versions are for legacy support.

