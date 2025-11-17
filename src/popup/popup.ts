/**
 * Popup script to handle user interactions
 */

import type {
  QRCodeResult,
  ScanPageMessage,
  ScanResponse,
  HistoryItem,
  UserSettings,
} from '@/types';
import { MessageAction } from '@/types';
import {
  isURL,
  copyToClipboard,
  formatDate,
  sanitizeString,
  generateId,
  getMessage,
} from '@/utils/helpers';
import {
  getSettings,
  saveSettings,
  getHistory,
  clearHistory,
  removeHistoryItem,
  addToHistory,
} from '@/utils/storage';

/**
 * DOM Elements
 */
const elements = {
  // Tabs
  scanTab: document.getElementById('scanTab') as HTMLButtonElement,
  historyTab: document.getElementById('historyTab') as HTMLButtonElement,
  settingsTab: document.getElementById('settingsTab') as HTMLButtonElement,

  // Panels
  scanPanel: document.getElementById('scanPanel') as HTMLElement,
  historyPanel: document.getElementById('historyPanel') as HTMLElement,
  settingsPanel: document.getElementById('settingsPanel') as HTMLElement,

  // Scan panel elements
  scanButton: document.getElementById('scanButton') as HTMLButtonElement,
  loading: document.getElementById('loading') as HTMLDivElement,
  results: document.getElementById('results') as HTMLDivElement,
  resultsList: document.getElementById('resultsList') as HTMLDivElement,
  noResults: document.getElementById('noResults') as HTMLDivElement,
  error: document.getElementById('error') as HTMLDivElement,

  // History panel elements
  historyList: document.getElementById('historyList') as HTMLDivElement,
  clearHistoryButton: document.getElementById('clearHistoryButton') as HTMLButtonElement,

  // Settings panel elements
  autoCopyToggle: document.getElementById('autoCopyToggle') as HTMLInputElement,
  notificationsToggle: document.getElementById('notificationsToggle') as HTMLInputElement,
  historyToggle: document.getElementById('historyToggle') as HTMLInputElement,
  maxHistoryItems: document.getElementById('maxHistoryItems') as HTMLInputElement,
  themeSelect: document.getElementById('themeSelect') as HTMLSelectElement,
  saveSettingsButton: document.getElementById('saveSettingsButton') as HTMLButtonElement,
  settingsSaved: document.getElementById('settingsSaved') as HTMLDivElement,
};

/**
 * Initialize popup
 */
async function init(): Promise<void> {
  // Setup tab navigation
  setupTabs();

  // Setup scan functionality
  elements.scanButton.addEventListener('click', scanCurrentPage);

  // Setup history
  elements.clearHistoryButton.addEventListener('click', handleClearHistory);

  // Setup settings
  elements.saveSettingsButton.addEventListener('click', handleSaveSettings);

  // Load and apply settings
  await loadSettings();

  // Load history if on history tab
  if (!elements.historyPanel.classList.contains('hidden')) {
    await loadHistory();
  }

  // Setup i18n
  applyI18n();

  // Apply theme
  applyTheme();

  // Setup keyboard navigation
  setupKeyboardNavigation();
}

/**
 * Setup tab navigation
 */
function setupTabs(): void {
  const tabs = [elements.scanTab, elements.historyTab, elements.settingsTab];
  const panels = [elements.scanPanel, elements.historyPanel, elements.settingsPanel];

  tabs.forEach((tab, index) => {
    tab.addEventListener('click', async () => {
      // Update tab states
      tabs.forEach((t, i) => {
        const isActive = i === index;
        t.classList.toggle('active', isActive);
        t.setAttribute('aria-selected', String(isActive));
        panels[i].classList.toggle('hidden', !isActive);
        panels[i].classList.toggle('active', isActive);
      });

      // Load data for active tab
      if (index === 1) {
        await loadHistory();
      } else if (index === 2) {
        await loadSettings();
      }
    });
  });
}

/**
 * Scan current page for QR codes
 */
async function scanCurrentPage(): Promise<void> {
  hideAllStatus();

  elements.loading.classList.remove('hidden');
  elements.scanButton.disabled = true;

  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

    if (!tab.id) {
      showError(getMessage('errorNoTab', 'Unable to access current tab'));
      return;
    }

    // Send message to content script
    const message: ScanPageMessage = { action: MessageAction.SCAN_PAGE };

    chrome.tabs.sendMessage(tab.id, message, async (response: ScanResponse) => {
      elements.loading.classList.add('hidden');
      elements.scanButton.disabled = false;

      if (chrome.runtime.lastError) {
        showError(
          getMessage(
            'errorPermission',
            'Unable to scan this page. The extension may not have permission.'
          )
        );
        return;
      }

      if (response && response.success) {
        if (response.results && response.results.length > 0) {
          await showResults(response.results, tab);
        } else {
          elements.noResults.classList.remove('hidden');
        }
      } else {
        showError(response?.error || getMessage('errorGeneric', 'An error occurred while scanning.'));
      }
    });
  } catch (err) {
    elements.loading.classList.add('hidden');
    elements.scanButton.disabled = false;
    const errorMessage = err instanceof Error ? err.message : 'Unknown error';
    showError(getMessage('errorGeneric', 'An error occurred: ') + errorMessage);
  }
}

/**
 * Hide all status elements
 */
function hideAllStatus(): void {
  elements.loading.classList.add('hidden');
  elements.results.classList.add('hidden');
  elements.noResults.classList.add('hidden');
  elements.error.classList.add('hidden');
  elements.resultsList.innerHTML = '';
}

/**
 * Show QR code results
 */
async function showResults(qrCodes: QRCodeResult[], tab: chrome.tabs.Tab): Promise<void> {
  elements.results.classList.remove('hidden');

  const settings = await getSettings();

  qrCodes.forEach((qr, index) => {
    const resultItem = document.createElement('div');
    resultItem.className = 'result-item';
    resultItem.setAttribute('role', 'listitem');

    const header = document.createElement('div');
    header.className = 'result-header';
    header.textContent = getMessage('qrCodeNumber', `QR Code #${index + 1}`).replace(
      '{number}',
      String(index + 1)
    );

    const content = document.createElement('div');
    content.className = 'result-content';

    const dataLabel = document.createElement('strong');
    dataLabel.textContent = getMessage('labelData', 'Data: ');
    content.appendChild(dataLabel);

    const dataText = document.createElement('span');
    dataText.textContent = sanitizeString(qr.data);
    dataText.className = 'qr-data';
    content.appendChild(dataText);

    const buttonContainer = document.createElement('div');
    buttonContainer.className = 'button-container';

    // Copy button
    const copyButton = document.createElement('button');
    copyButton.textContent = getMessage('buttonCopy', 'Copy');
    copyButton.className = 'btn btn-small';
    copyButton.setAttribute('aria-label', `Copy QR code data: ${qr.data.substring(0, 50)}`);
    copyButton.onclick = () => handleCopyClick(qr.data, copyButton);
    buttonContainer.appendChild(copyButton);

    // Open link button
    if (isURL(qr.data)) {
      const openButton = document.createElement('button');
      openButton.textContent = getMessage('buttonOpenLink', 'Open Link');
      openButton.className = 'btn btn-small btn-link';
      openButton.setAttribute('aria-label', `Open URL: ${qr.data}`);
      openButton.onclick = () => window.open(qr.data, '_blank');
      buttonContainer.appendChild(openButton);
    }

    // Source info
    const sourceInfo = document.createElement('div');
    sourceInfo.className = 'source-info';
    if (qr.type === 'image') {
      sourceInfo.textContent = getMessage('sourceImage', `Source: Image (${qr.alt})`).replace(
        '{alt}',
        qr.alt || 'No description'
      );
    } else {
      sourceInfo.textContent = getMessage('sourceCanvas', `Source: Canvas (${qr.id})`).replace(
        '{id}',
        qr.id || 'Unnamed'
      );
    }

    resultItem.appendChild(header);
    resultItem.appendChild(content);
    resultItem.appendChild(buttonContainer);
    resultItem.appendChild(sourceInfo);

    elements.resultsList.appendChild(resultItem);

    // Auto-copy first result if enabled
    if (index === 0 && settings.autoCopy) {
      copyToClipboard(qr.data);
    }

    // Save to history
    const historyItem: HistoryItem = {
      id: generateId(),
      ...qr,
      timestamp: Date.now(),
      url: tab.url || '',
      title: tab.title || '',
    };

    addToHistory(historyItem);
  });
}

/**
 * Show error message
 */
function showError(message: string): void {
  elements.error.classList.remove('hidden');
  const errorText = elements.error.querySelector('p');
  if (errorText) {
    errorText.textContent = message;
  }
}

/**
 * Handle copy button click
 */
async function handleCopyClick(text: string, button: HTMLButtonElement): Promise<void> {
  try {
    await copyToClipboard(text);
    const originalText = button.textContent;
    button.textContent = getMessage('buttonCopied', 'Copied!');
    button.classList.add('success');

    setTimeout(() => {
      button.textContent = originalText;
      button.classList.remove('success');
    }, 2000);
  } catch {
    button.textContent = getMessage('buttonFailed', 'Failed');
    setTimeout(() => {
      button.textContent = getMessage('buttonCopy', 'Copy');
    }, 2000);
  }
}

/**
 * Load and display history
 */
async function loadHistory(): Promise<void> {
  const history = await getHistory();

  elements.historyList.innerHTML = '';

  if (history.length === 0) {
    const emptyState = document.createElement('p');
    emptyState.className = 'empty-state';
    emptyState.textContent = getMessage('messageNoHistory', 'No scan history yet.');
    elements.historyList.appendChild(emptyState);
    return;
  }

  history.forEach((item) => {
    const historyItem = document.createElement('div');
    historyItem.className = 'history-item';
    historyItem.setAttribute('role', 'listitem');

    const header = document.createElement('div');
    header.className = 'history-item-header';

    const data = document.createElement('div');
    data.className = 'history-item-data';
    data.textContent = sanitizeString(item.data);

    const deleteButton = document.createElement('button');
    deleteButton.className = 'history-item-delete';
    deleteButton.textContent = '×';
    deleteButton.setAttribute('aria-label', 'Delete this history item');
    deleteButton.onclick = async () => {
      await removeHistoryItem(item.id);
      await loadHistory();
    };

    header.appendChild(data);
    header.appendChild(deleteButton);

    const meta = document.createElement('div');
    meta.className = 'history-item-meta';

    const time = document.createElement('span');
    time.textContent = formatDate(item.timestamp);

    const source = document.createElement('span');
    source.textContent = item.title || item.url;

    meta.appendChild(time);
    meta.appendChild(source);

    const buttonContainer = document.createElement('div');
    buttonContainer.className = 'button-container';

    const copyButton = document.createElement('button');
    copyButton.textContent = getMessage('buttonCopy', 'Copy');
    copyButton.className = 'btn btn-small';
    copyButton.onclick = () => handleCopyClick(item.data, copyButton);
    buttonContainer.appendChild(copyButton);

    if (isURL(item.data)) {
      const openButton = document.createElement('button');
      openButton.textContent = getMessage('buttonOpenLink', 'Open Link');
      openButton.className = 'btn btn-small btn-link';
      openButton.onclick = () => window.open(item.data, '_blank');
      buttonContainer.appendChild(openButton);
    }

    historyItem.appendChild(header);
    historyItem.appendChild(meta);
    historyItem.appendChild(buttonContainer);

    elements.historyList.appendChild(historyItem);
  });
}

/**
 * Handle clear history
 */
async function handleClearHistory(): Promise<void> {
  if (confirm(getMessage('confirmClearHistory', 'Are you sure you want to clear all history?'))) {
    await clearHistory();
    await loadHistory();
  }
}

/**
 * Load settings into UI
 */
async function loadSettings(): Promise<void> {
  const settings = await getSettings();

  elements.autoCopyToggle.checked = settings.autoCopy;
  elements.notificationsToggle.checked = settings.showNotifications;
  elements.historyToggle.checked = settings.enableHistory;
  elements.maxHistoryItems.value = String(settings.maxHistoryItems);
  elements.themeSelect.value = settings.theme;
}

/**
 * Handle save settings
 */
async function handleSaveSettings(): Promise<void> {
  const settings: Partial<UserSettings> = {
    autoCopy: elements.autoCopyToggle.checked,
    showNotifications: elements.notificationsToggle.checked,
    enableHistory: elements.historyToggle.checked,
    maxHistoryItems: parseInt(elements.maxHistoryItems.value, 10),
    theme: elements.themeSelect.value as 'light' | 'dark' | 'auto',
  };

  await saveSettings(settings);

  // Show success message
  elements.settingsSaved.classList.remove('hidden');
  setTimeout(() => {
    elements.settingsSaved.classList.add('hidden');
  }, 3000);

  // Apply theme
  applyTheme();
}

/**
 * Apply internationalization
 */
function applyI18n(): void {
  document.querySelectorAll('[data-i18n]').forEach((element) => {
    const key = element.getAttribute('data-i18n');
    if (key) {
      const message = chrome.i18n.getMessage(key);
      if (message) {
        if (element.tagName === 'INPUT' || element.tagName === 'BUTTON') {
          if (element.hasAttribute('placeholder')) {
            element.setAttribute('placeholder', message);
          } else {
            element.textContent = message;
          }
        } else {
          element.textContent = message;
        }
      }
    }
  });
}

/**
 * Apply theme
 */
async function applyTheme(): Promise<void> {
  const settings = await getSettings();
  const { theme } = settings;

  if (theme === 'dark') {
    document.body.classList.add('dark-theme');
  } else if (theme === 'light') {
    document.body.classList.remove('dark-theme');
  } else {
    // Auto theme - follow system preference
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    document.body.classList.toggle('dark-theme', prefersDark);
  }
}

/**
 * Setup keyboard navigation
 */
function setupKeyboardNavigation(): void {
  document.addEventListener('keydown', (event) => {
    // Alt+1 for Scan tab
    if (event.altKey && event.key === '1') {
      event.preventDefault();
      elements.scanTab.click();
    }
    // Alt+2 for History tab
    else if (event.altKey && event.key === '2') {
      event.preventDefault();
      elements.historyTab.click();
    }
    // Alt+3 for Settings tab
    else if (event.altKey && event.key === '3') {
      event.preventDefault();
      elements.settingsTab.click();
    }
    // Ctrl+Enter or Cmd+Enter to scan
    else if ((event.ctrlKey || event.metaKey) && event.key === 'Enter') {
      event.preventDefault();
      if (!elements.scanPanel.classList.contains('hidden')) {
        elements.scanButton.click();
      }
    }
  });
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', init);

// Listen for theme changes
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', async () => {
  const settings = await getSettings();
  if (settings.theme === 'auto') {
    applyTheme();
  }
});
