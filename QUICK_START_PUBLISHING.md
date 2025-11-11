# Quick Start - Publish to Chrome Web Store

Follow these simple steps to publish your extension:

## 1. Create Your Developer Account (One-time)

1. Go to [Chrome Web Store Developer Dashboard](https://chrome.google.com/webstore/devconsole/)
2. Sign in with your Google account
3. Pay the **$5 one-time registration fee**
4. Accept the developer agreement

## 2. Package Your Extension

Run this command to create a ZIP file ready for upload:

```bash
npm run package
```

This will create `qr-code-scanner-v1.0.0.zip` with all the necessary files.

## 3. Prepare Required Materials

### Screenshots (Required)
You need at least 1 screenshot showing the extension in action:
- Size: **1280x800** or **640x400** pixels
- Format: PNG or JPEG
- Take screenshots of:
  - The extension popup showing scan results
  - The extension scanning a real webpage with QR codes

### How to take screenshots:
1. Load the extension in Chrome (chrome://extensions → Load unpacked)
2. Find a webpage with a QR code (or create a test page)
3. Click the extension icon and scan the page
4. Take a screenshot of the results
5. Crop to recommended size

## 4. Upload to Chrome Web Store

1. Go to [Developer Dashboard](https://chrome.google.com/webstore/devconsole/)
2. Click **"New Item"**
3. Upload `qr-code-scanner-v1.0.0.zip`
4. Click **"Upload"**

## 5. Fill Out the Store Listing

Use the pre-written content from `STORE_LISTING.md`:

### Product Details Tab:
- **Name**: Copy from STORE_LISTING.md
- **Summary**: Copy from STORE_LISTING.md (132 chars max)
- **Description**: Copy the detailed description
- **Category**: Select "Productivity"
- **Language**: English (US)

### Graphic Assets Tab:
- **Icon**: Upload icons/icon128.png
- **Screenshots**: Upload your screenshots (minimum 1)
- **Promotional images**: Optional (can add later)

### Privacy Tab:
- **Single purpose**: Copy from STORE_LISTING.md
- **Permissions justification**: Copy justifications for each permission
- **Privacy policy**:
  - Option 1: Upload privacy-policy.html to your website and provide URL
  - Option 2: Enable GitHub Pages and use: https://bangla84pl.github.io/qr-code-scanner/privacy-policy.html
  - Option 3: Provide the privacy policy as inline text
- **Data usage**: Answer "No" to all data collection questions

### Distribution Tab:
- **Visibility**: Public
- **Regions**: All regions
- **Pricing**: Free

## 6. Submit for Review

1. Review all information
2. Click **"Submit for Review"**
3. Wait for email confirmation (1-5 business days)

## Privacy Policy Hosting Options

### Option A: GitHub Pages (Free & Easy)
1. Go to your repository settings on GitHub
2. Enable GitHub Pages
3. Set source to main branch
4. Your privacy policy will be at: https://bangla84pl.github.io/qr-code-scanner/privacy-policy.html

### Option B: Host Yourself
Upload `privacy-policy.html` to any web hosting and use that URL

### Option C: Inline Text
Copy the text content from `privacy-policy.html` and paste it directly

## Checklist Before Submitting

- [ ] Developer account created and paid
- [ ] Extension packaged with `npm run package`
- [ ] At least 1 screenshot taken (1280x800 or 640x400)
- [ ] Store listing filled out completely
- [ ] Privacy policy URL provided (or inline text)
- [ ] All permissions justified
- [ ] Data usage questionnaire completed
- [ ] Reviewed everything for accuracy

## After Submission

- You'll receive an email when reviewed (typically 1-5 days)
- If approved, your extension goes live immediately
- If rejected, you'll get feedback on what to fix
- You can update the extension anytime by uploading new versions

## Tips for Faster Approval

1. ✅ Be clear and honest about what your extension does
2. ✅ Use professional screenshots and icons
3. ✅ Provide detailed permission justifications
4. ✅ Have a proper privacy policy
5. ✅ Test thoroughly before submitting

## Need Help?

- Full details: See `PUBLISHING_GUIDE.md`
- Store listing text: See `STORE_LISTING.md`
- Privacy policy: See `privacy-policy.html`

## Common Issues

**"Invalid ZIP file"**
- Make sure you used `npm run package`
- Don't include node_modules in the ZIP

**"Missing privacy policy"**
- Host privacy-policy.html somewhere and provide the URL
- Or copy the text content directly

**"Permissions not justified"**
- Copy the justifications from STORE_LISTING.md
- Explain why each permission is necessary

Good luck! 🚀
