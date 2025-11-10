# QR Code Scanner - Chrome Extension

A Chrome browser extension that lets you extract information from QR codes visible on websites.

## Features

- Scan any webpage for QR codes
- Automatically detect QR codes in images and canvas elements
- Display decoded information in a clean, user-friendly interface
- Copy QR code data to clipboard with one click
- Automatically detect and open URLs found in QR codes
- Works on all websites

## Installation

### Install from Source

1. Clone this repository or download the source code:
   ```bash
   git clone https://github.com/Bangla84PL/qr-code-scanner.git
   cd qr-code-scanner
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Generate placeholder icons (or replace with your own):
   ```bash
   node create-icons.js
   ```

4. Load the extension in Chrome:
   - Open Chrome and navigate to `chrome://extensions/`
   - Enable "Developer mode" using the toggle in the top-right corner
   - Click "Load unpacked"
   - Select the `qr-code-scanner` directory

5. The QR Code Scanner extension should now appear in your Chrome toolbar!

## Usage

1. Navigate to any webpage that contains QR codes
2. Click the QR Code Scanner icon in your Chrome toolbar
3. Click the "Scan Page for QR Codes" button
4. View the decoded information from any QR codes found on the page
5. Use the "Copy" button to copy the data to your clipboard
6. For URLs, use the "Open Link" button to visit the link

## How It Works

The extension uses the following technologies:

- **jsQR**: A pure JavaScript QR code reading library that decodes QR codes from image data
- **Chrome Extensions API**: To interact with web pages and the browser
- **HTML5 Canvas**: To process images and extract QR code data

When you click "Scan Page for QR Codes":
1. The extension finds all `<img>` and `<canvas>` elements on the current page
2. Each element is processed through the jsQR library
3. Any detected QR codes are decoded and displayed in the popup
4. You can then interact with the decoded data

## Customization

### Icons

The extension comes with placeholder icons. For a professional look, replace the icons in the `icons/` directory with your own:
- `icon16.png` - 16x16 pixels
- `icon48.png` - 48x48 pixels
- `icon128.png` - 128x128 pixels

You can use the provided `icons/icon.svg` as a starting point for creating custom icons.

## Development

### Project Structure

```
qr-code-scanner/
├── manifest.json          # Extension configuration
├── popup.html            # Extension popup UI
├── popup.css             # Popup styling
├── popup.js              # Popup logic
├── content.js            # Content script for scanning pages
├── jsQR.js               # QR code decoding library
├── icons/                # Extension icons
│   ├── icon16.png
│   ├── icon48.png
│   ├── icon128.png
│   └── icon.svg
├── create-icons.js       # Script to generate placeholder icons
├── package.json          # npm configuration
└── README.md            # This file
```

### Testing

To test the extension:
1. Create a test HTML page with QR codes
2. Load the page in Chrome
3. Click the extension icon and scan the page
4. Verify that QR codes are correctly detected and decoded

## Browser Compatibility

This extension is designed for Google Chrome and other Chromium-based browsers (Edge, Brave, Opera, etc.) that support Manifest V3.

## Privacy

This extension:
- Does NOT collect any user data
- Does NOT send data to external servers
- Only processes images locally in your browser
- Only accesses the current tab when you click the scan button

## License

ISC

## Credits

- Built with [jsQR](https://github.com/cozmo/jsQR) by cozmo
- Developed for extracting information from QR codes on websites

## Troubleshooting

### Extension doesn't detect QR codes
- Make sure the QR codes are visible on the page (not lazy-loaded or hidden)
- Some images may have CORS restrictions that prevent scanning
- Try refreshing the page and scanning again

### "Unable to scan this page" error
- The extension may not have permission to access certain pages (like chrome:// URLs)
- Try reloading the page and the extension

### No results found
- The page may not contain any QR codes
- QR codes may be too small or low quality to scan
- QR codes may be embedded in ways the extension can't detect (e.g., in iframes)

## Contributing

Contributions are welcome! Please feel free to submit issues or pull requests.
