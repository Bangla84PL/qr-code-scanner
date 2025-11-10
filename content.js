// Content script that runs on web pages to detect and scan QR codes

// Listen for messages from the popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "scanPage") {
    scanPageForQRCodes()
      .then(results => {
        sendResponse({ success: true, results: results });
      })
      .catch(error => {
        sendResponse({ success: false, error: error.message });
      });
    return true; // Keep the message channel open for async response
  }
});

async function scanPageForQRCodes() {
  const results = [];

  // Find all images on the page
  const images = document.querySelectorAll('img');
  const canvases = document.querySelectorAll('canvas');

  // Scan regular images
  for (let img of images) {
    try {
      const qrData = await scanImage(img);
      if (qrData) {
        results.push({
          type: 'image',
          data: qrData,
          src: img.src,
          alt: img.alt || 'No description'
        });
      }
    } catch (error) {
      console.log('Error scanning image:', error);
    }
  }

  // Scan canvas elements
  for (let canvas of canvases) {
    try {
      const qrData = await scanCanvas(canvas);
      if (qrData) {
        results.push({
          type: 'canvas',
          data: qrData,
          id: canvas.id || 'Unnamed canvas'
        });
      }
    } catch (error) {
      console.log('Error scanning canvas:', error);
    }
  }

  return results;
}

function scanImage(img) {
  return new Promise((resolve) => {
    // Create a canvas to draw the image
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    // Wait for image to load if not already loaded
    if (!img.complete) {
      img.onload = () => processImage();
      img.onerror = () => resolve(null);
    } else {
      processImage();
    }

    function processImage() {
      try {
        canvas.width = img.naturalWidth || img.width;
        canvas.height = img.naturalHeight || img.height;

        if (canvas.width === 0 || canvas.height === 0) {
          resolve(null);
          return;
        }

        ctx.drawImage(img, 0, 0);
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const code = jsQR(imageData.data, imageData.width, imageData.height);

        if (code) {
          resolve(code.data);
        } else {
          resolve(null);
        }
      } catch (error) {
        console.log('Error processing image:', error);
        resolve(null);
      }
    }
  });
}

function scanCanvas(canvas) {
  return new Promise((resolve) => {
    try {
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        resolve(null);
        return;
      }

      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const code = jsQR(imageData.data, imageData.width, imageData.height);

      if (code) {
        resolve(code.data);
      } else {
        resolve(null);
      }
    } catch (error) {
      console.log('Error scanning canvas:', error);
      resolve(null);
    }
  });
}
