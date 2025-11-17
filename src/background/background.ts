/**
 * Background service worker for QR Code Scanner extension
 */

import type { HistoryItem } from '@/types';
import { addToHistory, getSettings } from '@/utils/storage';

/**
 * Handle extension installation or update
 */
chrome.runtime.onInstalled.addListener((details) => {
  if (details.reason === 'install') {
    console.log('QR Code Scanner installed');

    // Open welcome page or set default settings
    chrome.tabs.create({
      url: chrome.runtime.getURL('popup/popup.html'),
    });
  } else if (details.reason === 'update') {
    console.log('QR Code Scanner updated to version', chrome.runtime.getManifest().version);
  }
});

/**
 * Handle messages from content scripts or popup
 */
chrome.runtime.onMessage.addListener(
  (
    request: { action: string; data?: unknown },
    sender: chrome.runtime.MessageSender,
    sendResponse: (response?: unknown) => void
  ) => {
    if (request.action === 'saveToHistory') {
      handleSaveToHistory(request.data as HistoryItem, sender)
        .then(() => sendResponse({ success: true }))
        .catch((error) => sendResponse({ success: false, error: error.message }));
      return true;
    }

    return false;
  }
);

/**
 * Save scan result to history
 * @param item - History item to save
 * @param sender - Message sender info
 */
async function handleSaveToHistory(
  item: HistoryItem,
  sender: chrome.runtime.MessageSender
): Promise<void> {
  const settings = await getSettings();

  if (!settings.enableHistory) {
    return;
  }

  // Add tab info if available
  if (sender.tab) {
    item.url = sender.tab.url || '';
    item.title = sender.tab.title || '';
  }

  await addToHistory(item);

  // Show notification if enabled
  if (settings.showNotifications) {
    chrome.notifications.create({
      type: 'basic',
      iconUrl: chrome.runtime.getURL('icons/icon128.png'),
      title: 'QR Code Found',
      message: `Scanned: ${item.data.substring(0, 50)}${item.data.length > 50 ? '...' : ''}`,
    });
  }
}

/**
 * Handle browser action click (if popup is not available)
 */
chrome.action.onClicked.addListener((tab) => {
  if (tab.id) {
    // Inject content script if not already injected
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      files: ['jsQR.js', 'content.js'],
    }).catch((error) => {
      console.error('Error injecting content script:', error);
    });
  }
});

console.log('QR Code Scanner background service worker loaded');
