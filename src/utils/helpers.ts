/**
 * Utility helper functions
 */

/**
 * Check if a string is a valid URL
 * @param str - String to check
 * @returns True if string is a valid URL
 */
export function isURL(str: string): boolean {
  try {
    new URL(str);
    return true;
  } catch {
    return false;
  }
}

/**
 * Generate a unique ID
 * @returns Unique identifier string
 */
export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Debounce function execution
 * @param func - Function to debounce
 * @param wait - Wait time in milliseconds
 * @returns Debounced function
 */
export function debounce<T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout> | null = null;

  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      timeout = null;
      func(...args);
    };

    if (timeout !== null) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(later, wait);
  };
}

/**
 * Sanitize string to prevent XSS
 * @param str - String to sanitize
 * @returns Sanitized string
 */
export function sanitizeString(str: string): string {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

/**
 * Format timestamp to readable date
 * @param timestamp - Timestamp in milliseconds
 * @returns Formatted date string
 */
export function formatDate(timestamp: number): string {
  const date = new Date(timestamp);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return chrome.i18n.getMessage('timeJustNow') || 'Just now';
  if (diffMins < 60) return chrome.i18n.getMessage('timeMinutesAgo', [String(diffMins)]) || `${diffMins} minutes ago`;
  if (diffHours < 24) return chrome.i18n.getMessage('timeHoursAgo', [String(diffHours)]) || `${diffHours} hours ago`;
  if (diffDays < 7) return chrome.i18n.getMessage('timeDaysAgo', [String(diffDays)]) || `${diffDays} days ago`;

  return date.toLocaleDateString();
}

/**
 * Copy text to clipboard
 * @param text - Text to copy
 * @returns Promise that resolves when copy is complete
 */
export async function copyToClipboard(text: string): Promise<void> {
  try {
    await navigator.clipboard.writeText(text);
  } catch (error) {
    // Fallback for older browsers
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.opacity = '0';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();

    try {
      document.execCommand('copy');
    } finally {
      document.body.removeChild(textArea);
    }
  }
}

/**
 * Get i18n message with fallback
 * @param key - Message key
 * @param fallback - Fallback text
 * @returns Localized message
 */
export function getMessage(key: string, fallback: string): string {
  return chrome.i18n.getMessage(key) || fallback;
}

/**
 * Validate and limit array size
 * @param arr - Array to limit
 * @param maxSize - Maximum size
 * @returns Limited array
 */
export function limitArraySize<T>(arr: T[], maxSize: number): T[] {
  return arr.slice(0, maxSize);
}
