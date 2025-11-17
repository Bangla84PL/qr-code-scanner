/**
 * Tests for helper utilities
 */

import {
  isURL,
  generateId,
  sanitizeString,
  formatDate,
  limitArraySize,
} from '../helpers';

describe('Helper utilities', () => {
  describe('isURL', () => {
    it('should return true for valid URLs', () => {
      expect(isURL('https://example.com')).toBe(true);
      expect(isURL('http://example.com')).toBe(true);
      expect(isURL('https://example.com/path?query=123')).toBe(true);
    });

    it('should return false for invalid URLs', () => {
      expect(isURL('not a url')).toBe(false);
      expect(isURL('example.com')).toBe(false);
      expect(isURL('')).toBe(false);
    });
  });

  describe('generateId', () => {
    it('should generate unique IDs', () => {
      const id1 = generateId();
      const id2 = generateId();

      expect(id1).toBeTruthy();
      expect(id2).toBeTruthy();
      expect(id1).not.toBe(id2);
    });

    it('should generate IDs in correct format', () => {
      const id = generateId();
      expect(id).toMatch(/^\d+-[a-z0-9]+$/);
    });
  });

  describe('sanitizeString', () => {
    it('should escape HTML characters', () => {
      expect(sanitizeString('<script>alert("xss")</script>')).toBe(
        '&lt;script&gt;alert("xss")&lt;/script&gt;'
      );
      expect(sanitizeString('Normal text')).toBe('Normal text');
    });

    it('should handle special characters', () => {
      expect(sanitizeString('A & B')).toBe('A &amp; B');
      expect(sanitizeString('<div>test</div>')).toBe('&lt;div&gt;test&lt;/div&gt;');
    });
  });

  describe('formatDate', () => {
    beforeAll(() => {
      // Mock chrome.i18n
      global.chrome = {
        i18n: {
          getMessage: jest.fn((key: string) => {
            const messages: Record<string, string> = {
              timeJustNow: 'Just now',
              timeMinutesAgo: '$1 minutes ago',
              timeHoursAgo: '$1 hours ago',
              timeDaysAgo: '$1 days ago',
            };
            return messages[key] || '';
          }),
        },
      } as any;
    });

    it('should format recent timestamps correctly', () => {
      const now = Date.now();
      expect(formatDate(now - 30000)).toContain('Just now');
    });

    it('should format timestamps from minutes ago', () => {
      const now = Date.now();
      const fiveMinutesAgo = now - 5 * 60 * 1000;
      expect(formatDate(fiveMinutesAgo)).toContain('minutes ago');
    });

    it('should format timestamps from hours ago', () => {
      const now = Date.now();
      const twoHoursAgo = now - 2 * 60 * 60 * 1000;
      expect(formatDate(twoHoursAgo)).toContain('hours ago');
    });
  });

  describe('limitArraySize', () => {
    it('should limit array to specified size', () => {
      const arr = [1, 2, 3, 4, 5];
      expect(limitArraySize(arr, 3)).toEqual([1, 2, 3]);
    });

    it('should return full array if smaller than limit', () => {
      const arr = [1, 2, 3];
      expect(limitArraySize(arr, 5)).toEqual([1, 2, 3]);
    });

    it('should handle empty arrays', () => {
      expect(limitArraySize([], 5)).toEqual([]);
    });
  });
});
