# Chrome Web Store Listing - Copy & Paste Template

This file contains all the text you need for your Chrome Web Store submission.
Simply copy and paste the sections below into the appropriate fields.

---

## Extension Name
```
QR Code Scanner
```

## Short Description / Summary
(132 characters max)
```
Extract information from QR codes visible on any website with a single click. Fast, private, and easy to use.
```

## Detailed Description
(Use this in the main description field - you can format with basic markdown)

```
QR Code Scanner - Extract Information from Any Website

Instantly scan and decode QR codes visible on any website with a single click!

✨ FEATURES

• Automatically detect QR codes in images and canvas elements
• Extract text, URLs, and other data from QR codes
• Clean, intuitive interface
• Copy decoded data to clipboard instantly
• Automatic URL detection with quick "Open Link" button
• Works on all websites
• 100% privacy-focused - all processing happens locally in your browser

🔒 PRIVACY FIRST

• No data collection - We don't collect ANY user data
• No external servers - All scanning happens in your browser
• No tracking or analytics
• No background processes - Only runs when you click the scan button
• Open source - Verify our claims by reviewing the code

📖 HOW TO USE

1. Navigate to any webpage with a QR code
2. Click the QR Code Scanner icon in your browser toolbar
3. Click "Scan Page for QR Codes" button
4. View decoded information instantly
5. Copy data or open links with one click

💡 PERFECT FOR

• Reading QR codes in online articles and documentation
• Extracting data from website screenshots
• Quickly accessing URLs embedded in QR codes
• Developers testing QR code implementations
• Anyone who needs to scan QR codes without using their phone
• Accessing information from conference websites, event pages, and more

🛡️ PERMISSIONS

This extension requires minimal permissions:
• Access to current tab - Only when you click the scan button
• No background tracking
• No data collection
• No unnecessary permissions

🔧 TECHNICAL DETAILS

• Built with Manifest V3 for maximum security
• Uses the reliable jsQR library for QR code decoding
• Lightweight and fast
• Works offline once installed

🌟 WHY CHOOSE THIS EXTENSION?

Unlike other QR code scanners that require camera access or upload images to servers,
this extension works directly with images already displayed on websites. Everything
happens locally in your browser, ensuring your privacy and security.

💬 SUPPORT

Found a bug or have a feature request? Visit our GitHub repository to report issues
or contribute to the project.

⭐ If you find this extension useful, please leave a review!
```

---

## Category
```
Productivity
```

Alternative:
```
Tools
```

---

## Single Purpose Description
(Required for Chrome Web Store review)

```
This extension serves a single, clear purpose: to scan and decode QR codes visible on web pages.

When the user clicks the extension icon and initiates a scan, it analyzes the current webpage
for QR code images, decodes them using the jsQR library, and displays the results in a popup
interface. The extension does nothing else - no tracking, no analytics, no background processes.

All functionality is directly related to QR code scanning and result display.
```

---

## Permission Justifications

### activeTab Permission
```
Required to access the content of the current tab when the user clicks the extension icon
and initiates a scan. This allows the extension to find and analyze images on the page
for QR codes. The extension only accesses tab content when explicitly activated by the user.
```

### scripting Permission
```
Required to inject the content script that analyzes images and canvas elements on the page
to detect and decode QR codes. The script only executes when the user clicks the "Scan"
button and does not run in the background or automatically.
```

### Content Scripts - <all_urls> Pattern
```
The extension needs to work on any website where a user might encounter a QR code, which
is why the content script is registered for all URLs. However, the content script only
activates when the user explicitly clicks the scan button - it does not run automatically
or in the background. This ensures the extension can be used on any website while
respecting user privacy and browser performance.
```

---

## Privacy Policy URL

Option 1 - Host the HTML file:
```
[Upload privacy-policy.html to your website and use that URL]
```

Option 2 - GitHub Pages:
```
https://bangla84pl.github.io/qr-code-scanner/privacy-policy.html
```

Option 3 - Direct text (if URL not available):
```
Use the content from privacy-policy.html file
```

---

## Homepage URL (Optional but Recommended)
```
https://github.com/Bangla84PL/qr-code-scanner
```

---

## Support URL (Optional but Recommended)
```
https://github.com/Bangla84PL/qr-code-scanner/issues
```

---

## Data Usage Certification

When filling out the data usage questionnaire, answer as follows:

**Does this extension handle personal or sensitive user data?**
```
No
```

**Does this extension collect user data?**
```
No - This extension does not collect any user data
```

**Does this extension use or transfer data for purposes unrelated to the extension's functionality?**
```
No
```

**Does this extension sell or transfer user data to third parties?**
```
No
```

---

## Promotional Text (Optional)
(Used in promotions and search results)

```
Scan QR codes on any webpage instantly. Private, fast, and easy to use.
No camera needed - works directly with images on websites.
```

---

## Search Keywords (Optional but Recommended)
```
qr code, qr scanner, barcode, qr reader, code scanner, qr decode, website scanner
```

---

## Language
```
English (United States)
```

---

## Distribution

**Visibility Options:**

1. **Public** - Anyone can find and install
2. **Unlisted** - Only people with the direct link can install
3. **Private** - Only for specific users/groups

**Recommended:**
```
Public
```

**Regions:**
```
All regions (or select specific countries)
```

**Pricing:**
```
Free
```

---

## Version Information

**Version Number:**
```
1.0.0
```

**Version Description:**
```
Initial release with QR code scanning functionality for images and canvas elements.
```

---

## Notes for Submission

✅ **What reviewers like to see:**
- Clear explanation of permissions
- Privacy-focused approach
- Single, well-defined purpose
- Professional presentation
- Working as described

❌ **What to avoid:**
- Requesting unnecessary permissions
- Vague descriptions
- Missing privacy policy
- Misleading functionality claims

---

## After Submission Checklist

- [ ] Extension ZIP file uploaded
- [ ] All required fields completed
- [ ] Screenshots uploaded (at least 1)
- [ ] Icon uploaded (128x128)
- [ ] Privacy policy provided
- [ ] Permissions justified
- [ ] Data usage questionnaire completed
- [ ] Reviewed all information for accuracy
- [ ] Clicked "Submit for Review"

---

**Expected Review Time:** 1-5 business days
**Next Steps:** You'll receive an email when your extension is approved or if changes are needed.

Good luck with your submission! 🚀
