# QR Code Scanner - Chrome Extension

A modern, accessible, and feature-rich Chrome extension for extracting information from QR codes visible on websites. Built with TypeScript, following Manifest V3 specifications and modern web development best practices.

## Features

- 🔍 **Fast QR Code Detection** - Automatically scans images and canvas elements on web pages
- 📋 **One-Click Copy** - Copy QR code data to clipboard instantly
- 🔗 **Smart Link Detection** - Automatically detect and open URLs from QR codes
- 📊 **Scan History** - Keep track of all scanned QR codes with timestamps and sources
- ⚙️ **Customizable Settings** - Configure auto-copy, notifications, history, and more
- 🌍 **Internationalization** - Supports multiple languages (English, Spanish, French)
- 🎨 **Theme Support** - Light, dark, and auto themes
- ♿ **Accessibility** - Full keyboard navigation, ARIA labels, and screen reader support
- 🔒 **Privacy-Focused** - All processing happens locally, no data sent to external servers
- 🚀 **Performance Optimized** - Efficient scanning with minimal resource usage

## Installation

### From Chrome Web Store
*Coming soon*

### From Source

1. Clone the repository:
```bash
git clone https://github.com/Bangla84PL/qr-code-scanner.git
cd qr-code-scanner
```

2. Install dependencies:
```bash
npm install
```

3. Build the extension:
```bash
npm run build
```

4. Load in Chrome:
   - Open Chrome and navigate to `chrome://extensions/`
   - Enable "Developer mode"
   - Click "Load unpacked"
   - Select the `dist` folder

## Development

### Prerequisites

- Node.js 18+ and npm
- Chrome browser

### Setup

```bash
# Install dependencies
npm install

# Start development mode (watches for changes)
npm run dev

# Build for production
npm run build

# Run tests
npm test

# Run tests in watch mode
npm test:watch

# Type checking
npm run type-check

# Lint code
npm run lint

# Package extension for distribution
npm run package
```

### Project Structure

```
qr-code-scanner/
├── src/
│   ├── background/         # Background service worker
│   │   └── background.ts
│   ├── content/           # Content scripts
│   │   └── content.ts
│   ├── popup/             # Popup UI
│   │   ├── popup.html
│   │   ├── popup.css
│   │   └── popup.ts
│   ├── utils/             # Utility functions
│   │   ├── helpers.ts
│   │   ├── storage.ts
│   │   ├── qr-scanner.ts
│   │   └── __tests__/
│   ├── types/             # TypeScript type definitions
│   │   ├── index.ts
│   │   └── global.d.ts
│   └── _locales/          # Internationalization
│       ├── en/
│       ├── es/
│       └── fr/
├── public/                # Static assets
│   └── manifest.json
├── icons/                 # Extension icons
├── scripts/              # Build scripts
├── dist/                 # Built extension (generated)
├── vite.config.ts        # Vite configuration
├── tsconfig.json         # TypeScript configuration
├── jest.config.js        # Jest configuration
└── package.json
```

## Architecture

### Manifest V3 Compliance

This extension strictly follows Chrome's Manifest V3 specifications:

- **Service Worker** - Background script runs as a service worker
- **Minimal Permissions** - Only requests necessary permissions (activeTab, scripting, storage)
- **Content Security Policy** - Strict CSP to prevent XSS attacks
- **Modern APIs** - Uses chrome.* APIs with Promises

### Component Responsibilities

#### Background Service Worker (`background.ts`)
- Handles extension lifecycle events
- Manages notifications
- Coordinates data storage

#### Content Script (`content.ts`)
- Scans web pages for QR codes in images and canvas elements
- Processes QR codes using jsQR library
- Communicates scan results back to popup

#### Popup (`popup.ts`)
- Provides user interface with three tabs: Scan, History, Settings
- Manages user interactions
- Displays scan results
- Handles settings and history management

#### Utilities
- **helpers.ts** - Common utility functions (URL validation, sanitization, etc.)
- **storage.ts** - Chrome storage API wrappers
- **qr-scanner.ts** - QR code scanning logic

## Usage

### Basic Scanning

1. Navigate to a webpage containing QR codes
2. Click the extension icon in the toolbar
3. Click "Scan Page for QR Codes"
4. View results and copy or open links

### Keyboard Shortcuts

- `Alt+1` - Switch to Scan tab
- `Alt+2` - Switch to History tab
- `Alt+3` - Switch to Settings tab
- `Ctrl/Cmd+Enter` - Start scanning (when on Scan tab)

### Settings

Configure the extension behavior:

- **Auto-copy** - Automatically copy QR code data to clipboard
- **Notifications** - Show desktop notifications when QR codes are found
- **Scan History** - Enable/disable history tracking
- **Max History Items** - Limit the number of history items (10-200)
- **Theme** - Choose light, dark, or auto (follows system preference)

## Security

- **Content Security Policy** - Strict CSP prevents code injection
- **Input Sanitization** - All user-facing data is sanitized to prevent XSS
- **Local Processing** - All QR code processing happens locally
- **No External Requests** - Extension doesn't send data to external servers
- **Minimal Permissions** - Only requests necessary Chrome permissions

## Accessibility

- Full keyboard navigation support
- ARIA labels for screen readers
- High contrast mode support
- Reduced motion support for accessibility preferences
- Focus indicators for all interactive elements
- Semantic HTML structure

## Performance

- **Lazy Loading** - Resources loaded only when needed
- **Efficient Scanning** - Skips small images (< 50x50px)
- **Debouncing** - Prevents excessive operations
- **Caching** - Smart caching of settings and history
- **Minimal Bundle** - Optimized build with tree-shaking

## Browser Compatibility

- Chrome 88+
- Edge 88+
- Other Chromium-based browsers

## Contributing

Contributions are welcome! Please follow these guidelines:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Write tests for new features
4. Ensure all tests pass (`npm test`)
5. Follow TypeScript and ESLint rules (`npm run lint`)
6. Commit your changes (`git commit -m 'Add amazing feature'`)
7. Push to the branch (`git push origin feature/amazing-feature`)
8. Open a Pull Request

### Code Style

- Use TypeScript with strict mode
- Follow functional programming patterns
- Write JSDoc comments for public functions
- Maintain test coverage above 70%
- Use meaningful variable names
- Keep functions small and focused

## Testing

```bash
# Run all tests
npm test

# Run tests in watch mode
npm test:watch

# Generate coverage report
npm test -- --coverage
```

Tests are written using Jest and cover:
- Utility functions
- Storage operations
- QR code scanning logic
- UI interactions

## License

ISC License - see LICENSE file for details

## Privacy Policy

See [privacy-policy.html](privacy-policy.html) for our privacy policy.

## Changelog

### Version 2.0.0

- Complete TypeScript rewrite
- Manifest V3 migration
- Added scan history feature
- Added settings panel
- Internationalization support (EN, ES, FR)
- Theme support (light/dark/auto)
- Improved accessibility (ARIA, keyboard navigation)
- Enhanced security (CSP, input sanitization)
- Performance optimizations
- Comprehensive test suite

### Version 1.0.0

- Initial release
- Basic QR code scanning
- Copy to clipboard
- Simple popup UI

## Support

For issues, questions, or suggestions:
- Open an issue on [GitHub](https://github.com/Bangla84PL/qr-code-scanner/issues)
- Check existing issues for solutions

## Acknowledgments

- [jsQR](https://github.com/cozmo/jsQR) - QR code detection library
- Chrome Extension documentation and community

---

Made with ❤️ for the Chrome extension community
