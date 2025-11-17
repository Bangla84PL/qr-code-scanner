/**
 * Chrome storage utilities
 */

import type { HistoryItem, UserSettings } from '@/types';
import { StorageKey } from '@/types';

/**
 * Default user settings
 */
export const DEFAULT_SETTINGS: UserSettings = {
  autoCopy: false,
  showNotifications: true,
  maxHistoryItems: 50,
  theme: 'auto',
  enableHistory: true,
};

/**
 * Get items from Chrome storage
 * @param keys - Storage keys to retrieve
 * @returns Promise with storage data
 */
export async function getStorage<T>(
  keys: string | string[] | Record<string, unknown>
): Promise<T> {
  return new Promise((resolve, reject) => {
    chrome.storage.local.get(keys, (result) => {
      if (chrome.runtime.lastError) {
        reject(chrome.runtime.lastError);
      } else {
        resolve(result as T);
      }
    });
  });
}

/**
 * Set items in Chrome storage
 * @param items - Items to store
 * @returns Promise that resolves when complete
 */
export async function setStorage(items: Record<string, unknown>): Promise<void> {
  return new Promise((resolve, reject) => {
    chrome.storage.local.set(items, () => {
      if (chrome.runtime.lastError) {
        reject(chrome.runtime.lastError);
      } else {
        resolve();
      }
    });
  });
}

/**
 * Remove items from Chrome storage
 * @param keys - Keys to remove
 * @returns Promise that resolves when complete
 */
export async function removeStorage(keys: string | string[]): Promise<void> {
  return new Promise((resolve, reject) => {
    chrome.storage.local.remove(keys, () => {
      if (chrome.runtime.lastError) {
        reject(chrome.runtime.lastError);
      } else {
        resolve();
      }
    });
  });
}

/**
 * Get user settings
 * @returns Promise with user settings
 */
export async function getSettings(): Promise<UserSettings> {
  const result = await getStorage<{ [StorageKey.SETTINGS]: UserSettings }>({
    [StorageKey.SETTINGS]: DEFAULT_SETTINGS,
  });
  return result[StorageKey.SETTINGS] || DEFAULT_SETTINGS;
}

/**
 * Save user settings
 * @param settings - Settings to save
 * @returns Promise that resolves when complete
 */
export async function saveSettings(settings: Partial<UserSettings>): Promise<void> {
  const currentSettings = await getSettings();
  const updatedSettings = { ...currentSettings, ...settings };
  await setStorage({ [StorageKey.SETTINGS]: updatedSettings });
}

/**
 * Get scan history
 * @returns Promise with history items
 */
export async function getHistory(): Promise<HistoryItem[]> {
  const result = await getStorage<{ [StorageKey.HISTORY]: HistoryItem[] }>({
    [StorageKey.HISTORY]: [],
  });
  return result[StorageKey.HISTORY] || [];
}

/**
 * Add item to scan history
 * @param item - History item to add
 * @returns Promise that resolves when complete
 */
export async function addToHistory(item: HistoryItem): Promise<void> {
  const settings = await getSettings();
  if (!settings.enableHistory) return;

  const history = await getHistory();

  // Check for duplicates
  const isDuplicate = history.some(
    (h) => h.data === item.data && h.url === item.url
  );

  if (!isDuplicate) {
    history.unshift(item);

    // Limit history size
    const limitedHistory = history.slice(0, settings.maxHistoryItems);
    await setStorage({ [StorageKey.HISTORY]: limitedHistory });
  }
}

/**
 * Clear scan history
 * @returns Promise that resolves when complete
 */
export async function clearHistory(): Promise<void> {
  await setStorage({ [StorageKey.HISTORY]: [] });
}

/**
 * Remove single history item
 * @param id - ID of item to remove
 * @returns Promise that resolves when complete
 */
export async function removeHistoryItem(id: string): Promise<void> {
  const history = await getHistory();
  const filtered = history.filter((item) => item.id !== id);
  await setStorage({ [StorageKey.HISTORY]: filtered });
}
