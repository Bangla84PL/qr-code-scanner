/**
 * Content script that runs on web pages to detect and scan QR codes
 */

import { scanPageForQRCodes } from '@/utils/qr-scanner';
import type { ScanPageMessage, ScanResponse } from '@/types';
import { MessageAction } from '@/types';

/**
 * Listen for messages from popup or background script
 */
chrome.runtime.onMessage.addListener(
  (
    request: ScanPageMessage,
    _sender: chrome.runtime.MessageSender,
    sendResponse: (response: ScanResponse) => void
  ) => {
    if (request.action === MessageAction.SCAN_PAGE) {
      handleScanRequest(sendResponse);
      return true; // Keep the message channel open for async response
    }
    return false;
  }
);

/**
 * Handle scan page request
 * @param sendResponse - Function to send response
 */
async function handleScanRequest(sendResponse: (response: ScanResponse) => void): Promise<void> {
  try {
    const results = await scanPageForQRCodes();

    sendResponse({
      success: true,
      results,
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';

    console.error('Error scanning page:', error);
    sendResponse({
      success: false,
      error: errorMessage,
    });
  }
}

/**
 * Log content script initialization
 */
console.log('QR Code Scanner content script loaded');
