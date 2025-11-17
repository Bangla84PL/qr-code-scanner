/**
 * Type definitions for QR Code Scanner Chrome Extension
 */

/**
 * QR code scan result from an image source
 */
export interface QRCodeResult {
  /** Type of source element */
  type: 'image' | 'canvas';
  /** Decoded QR code data */
  data: string;
  /** Source URL for image type */
  src?: string;
  /** Alt text for image type */
  alt?: string;
  /** Canvas element ID */
  id?: string;
  /** Timestamp when scanned */
  timestamp?: number;
}

/**
 * Message types for communication between components
 */
export enum MessageAction {
  SCAN_PAGE = 'scanPage',
  GET_HISTORY = 'getHistory',
  CLEAR_HISTORY = 'clearHistory',
  SAVE_SETTINGS = 'saveSettings',
  GET_SETTINGS = 'getSettings',
}

/**
 * Base message structure
 */
export interface BaseMessage {
  action: MessageAction;
}

/**
 * Scan page message
 */
export interface ScanPageMessage extends BaseMessage {
  action: MessageAction.SCAN_PAGE;
}

/**
 * Response for scan operation
 */
export interface ScanResponse {
  success: boolean;
  results?: QRCodeResult[];
  error?: string;
}

/**
 * Scan history item
 */
export interface HistoryItem extends QRCodeResult {
  id: string;
  timestamp: number;
  url: string;
  title: string;
}

/**
 * User settings
 */
export interface UserSettings {
  /** Auto-copy QR code data to clipboard */
  autoCopy: boolean;
  /** Show notifications */
  showNotifications: boolean;
  /** Maximum history items */
  maxHistoryItems: number;
  /** Theme preference */
  theme: 'light' | 'dark' | 'auto';
  /** Enable scan history */
  enableHistory: boolean;
}

/**
 * Storage keys
 */
export enum StorageKey {
  HISTORY = 'qr_history',
  SETTINGS = 'qr_settings',
}

/**
 * Chrome storage area
 */
export type StorageArea = 'local' | 'sync';

/**
 * jsQR library types
 */
export interface QRCode {
  data: string;
  location: {
    topLeftCorner: Point;
    topRightCorner: Point;
    bottomLeftCorner: Point;
    bottomRightCorner: Point;
  };
  version: number;
}

export interface Point {
  x: number;
  y: number;
}

/**
 * Global jsQR function type
 */
declare global {
  function jsQR(
    data: Uint8ClampedArray,
    width: number,
    height: number,
    options?: {
      inversionAttempts?: 'dontInvert' | 'onlyInvert' | 'attemptBoth' | 'invertFirst';
    }
  ): QRCode | null;
}
