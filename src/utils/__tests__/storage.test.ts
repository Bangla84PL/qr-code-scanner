/**
 * Tests for storage utilities
 */

import {
  getStorage,
  setStorage,
  getSettings,
  saveSettings,
  DEFAULT_SETTINGS,
} from '../storage';
import { StorageKey } from '@/types';

// Mock chrome storage API
const mockStorageData: Record<string, any> = {};

beforeAll(() => {
  global.chrome = {
    storage: {
      local: {
        get: jest.fn((keys, callback) => {
          const result: Record<string, any> = {};

          if (typeof keys === 'string') {
            if (mockStorageData[keys] !== undefined) {
              result[keys] = mockStorageData[keys];
            }
          } else if (typeof keys === 'object' && !Array.isArray(keys)) {
            Object.keys(keys).forEach((key) => {
              result[key] = mockStorageData[key] !== undefined ? mockStorageData[key] : keys[key];
            });
          }

          callback(result);
        }),
        set: jest.fn((items, callback) => {
          Object.assign(mockStorageData, items);
          if (callback) callback();
        }),
        remove: jest.fn((keys, callback) => {
          const keysArray = Array.isArray(keys) ? keys : [keys];
          keysArray.forEach((key) => delete mockStorageData[key]);
          if (callback) callback();
        }),
      },
    },
    runtime: {
      lastError: null,
    },
  } as any;
});

beforeEach(() => {
  // Clear mock storage before each test
  Object.keys(mockStorageData).forEach((key) => delete mockStorageData[key]);
});

describe('Storage utilities', () => {
  describe('getStorage', () => {
    it('should retrieve data from storage', async () => {
      mockStorageData['test_key'] = 'test_value';
      const result = await getStorage<{ test_key: string }>('test_key');
      expect(result.test_key).toBe('test_value');
    });

    it('should return default values for missing keys', async () => {
      const result = await getStorage<{ missing: string }>({ missing: 'default' });
      expect(result.missing).toBe('default');
    });
  });

  describe('setStorage', () => {
    it('should save data to storage', async () => {
      await setStorage({ test_key: 'new_value' });
      expect(mockStorageData['test_key']).toBe('new_value');
    });
  });

  describe('getSettings', () => {
    it('should return default settings when none exist', async () => {
      const settings = await getSettings();
      expect(settings).toEqual(DEFAULT_SETTINGS);
    });

    it('should return saved settings', async () => {
      const customSettings = { ...DEFAULT_SETTINGS, autoCopy: true };
      mockStorageData[StorageKey.SETTINGS] = customSettings;

      const settings = await getSettings();
      expect(settings.autoCopy).toBe(true);
    });
  });

  describe('saveSettings', () => {
    it('should merge and save settings', async () => {
      await saveSettings({ autoCopy: true });
      const settings = await getSettings();

      expect(settings.autoCopy).toBe(true);
      expect(settings.showNotifications).toBe(DEFAULT_SETTINGS.showNotifications);
    });

    it('should update existing settings', async () => {
      await saveSettings({ autoCopy: true });
      await saveSettings({ showNotifications: false });

      const settings = await getSettings();
      expect(settings.autoCopy).toBe(true);
      expect(settings.showNotifications).toBe(false);
    });
  });
});
