# Developer Guide - QR Code Scanner Extension

This guide provides detailed information for developers working on the QR Code Scanner Chrome extension.

## Table of Contents

1. [Getting Started](#getting-started)
2. [Architecture Overview](#architecture-overview)
3. [Development Workflow](#development-workflow)
4. [TypeScript Guidelines](#typescript-guidelines)
5. [Testing Strategy](#testing-strategy)
6. [Building and Deployment](#building-and-deployment)
7. [Security Best Practices](#security-best-practices)
8. [Performance Optimization](#performance-optimization)
9. [Accessibility Guidelines](#accessibility-guidelines)
10. [Internationalization](#internationalization)

## Getting Started

### Development Environment Setup

1. **Install Node.js and npm**
   - Minimum version: Node.js 18.x
   - Use nvm for version management (recommended)

2. **Clone and install**
   ```bash
   git clone https://github.com/Bangla84PL/qr-code-scanner.git
   cd qr-code-scanner
   npm install
   ```

3. **IDE Setup**
   - Recommended: VS Code with extensions:
     - ESLint
     - Prettier
     - TypeScript Vue Plugin
     - Chrome Extension API IntelliSense

4. **Start development**
   ```bash
   npm run dev
   ```

### Hot Reloading

The extension supports hot reloading during development:
- Popup changes reload automatically
- Content script changes require page refresh
- Background script changes require extension reload

## Architecture Overview

### Component Communication

```
┌─────────────────┐
│  Background SW  │ ←→ Chrome APIs (Storage, Notifications)
└────────┬────────┘
         │
         ↓
┌─────────────────┐
│   Popup UI      │ ←→ User Interactions
└────────┬────────┘
         │
         ↓ (Messages)
┌─────────────────┐
│ Content Script  │ ←→ Web Page (DOM, Images, Canvas)
└─────────────────┘
```

### Message Passing

The extension uses Chrome's message passing API:

```typescript
// From popup to content script
chrome.tabs.sendMessage(tabId, {
  action: MessageAction.SCAN_PAGE
}, (response) => {
  // Handle response
});

// From content script to popup/background
chrome.runtime.sendMessage({
  action: 'saveToHistory',
  data: historyItem
});
```

### Storage Architecture

```typescript
chrome.storage.local = {
  qr_settings: UserSettings,
  qr_history: HistoryItem[]
}
```

## Development Workflow

### Branch Strategy

- `main` - Production-ready code
- `develop` - Integration branch
- `feature/*` - Feature branches
- `bugfix/*` - Bug fix branches
- `claude/*` - Claude AI session branches

### Commit Convention

Follow conventional commits:

```
feat: Add export history feature
fix: Resolve QR scanning on canvas elements
docs: Update README with new features
test: Add tests for storage utilities
refactor: Simplify QR scanning logic
perf: Optimize image scanning performance
style: Format code with Prettier
```

### Code Review Checklist

- [ ] TypeScript types are properly defined
- [ ] Tests are written and passing
- [ ] No console.errors in production code
- [ ] Accessibility features maintained
- [ ] i18n strings properly defined
- [ ] Security considerations addressed
- [ ] Performance impact assessed
- [ ] Documentation updated

## TypeScript Guidelines

### Type Safety

Always use explicit types:

```typescript
// Good
function scanImage(img: HTMLImageElement): Promise<string | null> {
  return new Promise((resolve) => {
    // Implementation
  });
}

// Avoid
function scanImage(img: any): any {
  // Implementation
}
```

### Avoiding `any`

Use proper types or generics instead of `any`:

```typescript
// Good
async function getStorage<T>(keys: string): Promise<T> {
  // Implementation
}

// Avoid
async function getStorage(keys: any): Promise<any> {
  // Implementation
}
```

### Type Imports

Use type imports for types only:

```typescript
import type { QRCodeResult, UserSettings } from '@/types';
import { scanPageForQRCodes } from '@/utils/qr-scanner';
```

## Testing Strategy

### Test Structure

```typescript
describe('Component/Function name', () => {
  beforeEach(() => {
    // Setup
  });

  afterEach(() => {
    // Cleanup
  });

  describe('specific functionality', () => {
    it('should do something expected', () => {
      // Arrange
      const input = 'test';

      // Act
      const result = functionUnderTest(input);

      // Assert
      expect(result).toBe('expected');
    });
  });
});
```

### Mocking Chrome APIs

```typescript
beforeAll(() => {
  global.chrome = {
    storage: {
      local: {
        get: jest.fn(),
        set: jest.fn(),
      },
    },
    runtime: {
      sendMessage: jest.fn(),
    },
  } as any;
});
```

### Coverage Goals

- Minimum coverage: 70%
- Critical paths: 90%
- Utility functions: 95%

## Building and Deployment

### Build Process

```bash
# Development build (with source maps)
npm run dev

# Production build (minified)
npm run build

# Type checking
npm run type-check

# Linting
npm run lint
```

### Build Output

The build creates a `dist/` folder with:
- `manifest.json` - Extension manifest
- `background.js` - Service worker
- `content.js` - Content script
- `popup/` - Popup files
- `_locales/` - Translation files
- `icons/` - Extension icons

### Packaging

```bash
# Create distribution package
npm run package
```

This creates a `qr-code-scanner.zip` ready for Chrome Web Store.

## Security Best Practices

### Content Security Policy

Our CSP configuration:
```json
{
  "extension_pages": "script-src 'self'; object-src 'self'; style-src 'self' 'unsafe-inline';"
}
```

### Input Sanitization

Always sanitize user-facing content:

```typescript
import { sanitizeString } from '@/utils/helpers';

const safeData = sanitizeString(untrustedInput);
element.textContent = safeData; // Safe
element.innerHTML = untrustedInput; // NEVER do this
```

### XSS Prevention

- Use `textContent` instead of `innerHTML`
- Sanitize all external data
- Validate URLs before opening
- Escape special characters

### Data Validation

```typescript
function isValidQRData(data: string): boolean {
  return typeof data === 'string' &&
         data.length > 0 &&
         data.length < 10000;
}
```

## Performance Optimization

### Image Scanning Optimization

Skip small images to reduce processing:

```typescript
if (img.width < 50 || img.height < 50) {
  return null; // Skip tiny images
}
```

### Debouncing

Use debouncing for expensive operations:

```typescript
import { debounce } from '@/utils/helpers';

const debouncedScan = debounce(scanPage, 300);
```

### Memory Management

- Clear canvas contexts after use
- Remove event listeners when done
- Limit history size

### Bundle Optimization

Vite automatically:
- Tree-shakes unused code
- Minifies JavaScript
- Optimizes CSS
- Code-splits where appropriate

## Accessibility Guidelines

### ARIA Labels

```html
<button
  aria-label="Scan current page for QR codes"
  data-i18n="buttonScan"
>
  Scan
</button>
```

### Keyboard Navigation

Ensure all interactive elements are keyboard accessible:
- Tab navigation
- Enter to activate
- Escape to close
- Arrow keys for lists

### Focus Management

```css
button:focus-visible {
  outline: 2px solid var(--color-primary);
  outline-offset: 2px;
}
```

### Screen Reader Support

- Use semantic HTML
- Provide alternative text
- Use `role` attributes appropriately
- Implement `aria-live` for dynamic content

## Internationalization

### Adding New Locales

1. Create folder: `src/_locales/<locale>/`
2. Add `messages.json` with translations
3. Update manifest default_locale if needed

### Message Format

```json
{
  "messageName": {
    "message": "Translated text",
    "description": "Context for translators"
  }
}
```

### Using Messages

```typescript
// In TypeScript
const message = chrome.i18n.getMessage('messageName');

// In HTML
<span data-i18n="messageName">Fallback text</span>
```

### Placeholders

```json
{
  "messageWithPlaceholder": {
    "message": "Found $COUNT$ QR codes",
    "placeholders": {
      "count": {
        "content": "$1",
        "example": "5"
      }
    }
  }
}
```

## Debugging Tips

### Chrome DevTools

1. **Inspect Popup**
   - Right-click extension icon → Inspect popup

2. **Service Worker**
   - chrome://extensions → Service worker → Inspect

3. **Content Script**
   - Regular DevTools on the page

### Logging

Use console methods appropriately:

```typescript
console.log('Info message'); // Development only
console.warn('Warning message'); // Important warnings
console.error('Error message'); // Errors
```

### Common Issues

1. **Content script not injecting**
   - Check manifest permissions
   - Verify matches patterns
   - Check console for errors

2. **Storage not persisting**
   - Verify chrome.storage API usage
   - Check for quota limits
   - Ensure async handling

3. **Messages not received**
   - Return `true` to keep channel open
   - Check sender.tab.id exists
   - Verify message format

## Resources

- [Chrome Extension Docs](https://developer.chrome.com/docs/extensions/)
- [Manifest V3 Migration Guide](https://developer.chrome.com/docs/extensions/mv3/intro/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [Vite Documentation](https://vitejs.dev/)

---

For questions or clarifications, please open an issue on GitHub.
