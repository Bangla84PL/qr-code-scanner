/**
 * QR Code scanning utilities
 */

import type { QRCodeResult } from '@/types';

/**
 * Scan an image element for QR codes
 * @param img - Image element to scan
 * @returns Promise with QR code data or null
 */
export async function scanImage(img: HTMLImageElement): Promise<string | null> {
  return new Promise((resolve) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    if (!ctx) {
      resolve(null);
      return;
    }

    const processImage = () => {
      try {
        canvas.width = img.naturalWidth || img.width;
        canvas.height = img.naturalHeight || img.height;

        if (canvas.width === 0 || canvas.height === 0) {
          resolve(null);
          return;
        }

        ctx.drawImage(img, 0, 0);
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

        // jsQR is loaded globally via content script
        if (typeof jsQR === 'function') {
          const code = jsQR(imageData.data, imageData.width, imageData.height, {
            inversionAttempts: 'attemptBoth',
          });

          resolve(code ? code.data : null);
        } else {
          console.error('jsQR library not loaded');
          resolve(null);
        }
      } catch (error) {
        console.error('Error processing image:', error);
        resolve(null);
      }
    };

    // Wait for image to load if not already loaded
    if (!img.complete || img.naturalWidth === 0) {
      img.onload = processImage;
      img.onerror = () => resolve(null);

      // Timeout after 5 seconds
      setTimeout(() => resolve(null), 5000);
    } else {
      processImage();
    }
  });
}

/**
 * Scan a canvas element for QR codes
 * @param canvas - Canvas element to scan
 * @returns Promise with QR code data or null
 */
export async function scanCanvas(canvas: HTMLCanvasElement): Promise<string | null> {
  return new Promise((resolve) => {
    try {
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        resolve(null);
        return;
      }

      if (canvas.width === 0 || canvas.height === 0) {
        resolve(null);
        return;
      }

      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

      // jsQR is loaded globally via content script
      if (typeof jsQR === 'function') {
        const code = jsQR(imageData.data, imageData.width, imageData.height, {
          inversionAttempts: 'attemptBoth',
        });

        resolve(code ? code.data : null);
      } else {
        console.error('jsQR library not loaded');
        resolve(null);
      }
    } catch (error) {
      console.error('Error scanning canvas:', error);
      resolve(null);
    }
  });
}

/**
 * Scan entire page for QR codes in images and canvas elements
 * @returns Promise with array of QR code results
 */
export async function scanPageForQRCodes(): Promise<QRCodeResult[]> {
  const results: QRCodeResult[] = [];
  const timestamp = Date.now();

  // Find all images and canvas elements
  const images = document.querySelectorAll('img');
  const canvases = document.querySelectorAll('canvas');

  // Scan images with performance optimization
  const imagePromises = Array.from(images).map(async (img) => {
    try {
      // Skip very small images (likely icons)
      if (img.width < 50 || img.height < 50) {
        return null;
      }

      const qrData = await scanImage(img);
      if (qrData) {
        return {
          type: 'image' as const,
          data: qrData,
          src: img.src,
          alt: img.alt || 'No description',
          timestamp,
        };
      }
    } catch (error) {
      console.error('Error scanning image:', error);
    }
    return null;
  });

  // Scan canvas elements
  const canvasPromises = Array.from(canvases).map(async (canvas) => {
    try {
      // Skip very small canvases
      if (canvas.width < 50 || canvas.height < 50) {
        return null;
      }

      const qrData = await scanCanvas(canvas);
      if (qrData) {
        return {
          type: 'canvas' as const,
          data: qrData,
          id: canvas.id || 'Unnamed canvas',
          timestamp,
        };
      }
    } catch (error) {
      console.error('Error scanning canvas:', error);
    }
    return null;
  });

  // Wait for all scans to complete
  const allResults = await Promise.all([...imagePromises, ...canvasPromises]);

  // Filter out null results and duplicates
  const seen = new Set<string>();
  for (const result of allResults) {
    if (result && !seen.has(result.data)) {
      seen.add(result.data);
      results.push(result);
    }
  }

  return results;
}

/**
 * Validate QR code data
 * @param data - QR code data to validate
 * @returns True if data is valid
 */
export function isValidQRData(data: string): boolean {
  return typeof data === 'string' && data.length > 0 && data.length < 10000;
}
