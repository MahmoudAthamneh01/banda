# Self-Hosted Fonts — China Compliance

**Status:** Placeholder fonts (system fallback)  
**Action Required:** Download and place actual font files here

## Required Fonts:

### Arabic (`ar/`)
- **Cairo-Regular.woff2** - Download from: https://fonts.google.com/specimen/Cairo
- **Tajawal-Regular.woff2** - Download from: https://fonts.google.com/specimen/Tajawal

### Chinese (`zh/`)
- **NotoSansSC-Regular.woff2** - Download from: https://fonts.google.com/noto/specimen/Noto+Sans+SC
- **PingFangSC.woff2** - System font (macOS/iOS) - Use Noto Sans SC as web fallback

### English (`en/`)
- **Roboto-Regular.woff2** - Download from: https://fonts.google.com/specimen/Roboto

## Download Instructions:

1. Visit Google Fonts
2. Select font → Download family
3. Extract .ttf files
4. Convert to .woff2 using: https://cloudconvert.com/ttf-to-woff2
5. Place in respective folders

## Compliance Note:

⚠️ **CRITICAL:** Do NOT use external font CDNs (Google Fonts CDN, etc.)  
All fonts must be self-hosted to comply with China's zero-external-assets policy.

See: `docs/05-security-compliance-china.md` and `configs/compliance/zero-external-assets.md`
