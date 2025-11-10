// Popup script to handle user interactions

document.addEventListener('DOMContentLoaded', () => {
  const scanButton = document.getElementById('scanButton');
  const loading = document.getElementById('loading');
  const results = document.getElementById('results');
  const resultsList = document.getElementById('resultsList');
  const noResults = document.getElementById('noResults');
  const error = document.getElementById('error');

  scanButton.addEventListener('click', scanCurrentPage);

  async function scanCurrentPage() {
    // Hide all status divs
    hideAllStatus();

    // Show loading
    loading.classList.remove('hidden');
    scanButton.disabled = true;

    try {
      // Get the active tab
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

      // Send message to content script
      chrome.tabs.sendMessage(tab.id, { action: 'scanPage' }, (response) => {
        loading.classList.add('hidden');
        scanButton.disabled = false;

        if (chrome.runtime.lastError) {
          showError('Unable to scan this page. The extension may not have permission.');
          return;
        }

        if (response && response.success) {
          if (response.results.length > 0) {
            showResults(response.results);
          } else {
            noResults.classList.remove('hidden');
          }
        } else {
          showError(response?.error || 'An error occurred while scanning.');
        }
      });
    } catch (err) {
      loading.classList.add('hidden');
      scanButton.disabled = false;
      showError('An error occurred: ' + err.message);
    }
  }

  function hideAllStatus() {
    loading.classList.add('hidden');
    results.classList.add('hidden');
    noResults.classList.add('hidden');
    error.classList.add('hidden');
    resultsList.innerHTML = '';
  }

  function showResults(qrCodes) {
    results.classList.remove('hidden');

    qrCodes.forEach((qr, index) => {
      const resultItem = document.createElement('div');
      resultItem.className = 'result-item';

      const header = document.createElement('div');
      header.className = 'result-header';
      header.textContent = `QR Code #${index + 1}`;

      const content = document.createElement('div');
      content.className = 'result-content';

      const dataLabel = document.createElement('strong');
      dataLabel.textContent = 'Data: ';
      content.appendChild(dataLabel);

      const dataText = document.createElement('span');
      dataText.textContent = qr.data;
      dataText.className = 'qr-data';
      content.appendChild(dataText);

      // Add copy button
      const copyButton = document.createElement('button');
      copyButton.textContent = 'Copy';
      copyButton.className = 'btn btn-small';
      copyButton.onclick = () => copyToClipboard(qr.data, copyButton);

      const buttonContainer = document.createElement('div');
      buttonContainer.className = 'button-container';
      buttonContainer.appendChild(copyButton);

      // Add source info
      const sourceInfo = document.createElement('div');
      sourceInfo.className = 'source-info';
      if (qr.type === 'image') {
        sourceInfo.textContent = `Source: Image (${qr.alt})`;
      } else {
        sourceInfo.textContent = `Source: Canvas (${qr.id})`;
      }

      resultItem.appendChild(header);
      resultItem.appendChild(content);
      resultItem.appendChild(buttonContainer);
      resultItem.appendChild(sourceInfo);

      // If it's a URL, add an open link button
      if (isURL(qr.data)) {
        const openButton = document.createElement('button');
        openButton.textContent = 'Open Link';
        openButton.className = 'btn btn-small btn-link';
        openButton.onclick = () => window.open(qr.data, '_blank');
        buttonContainer.appendChild(openButton);
      }

      resultsList.appendChild(resultItem);
    });
  }

  function showError(message) {
    error.classList.remove('hidden');
    error.querySelector('p').textContent = message;
  }

  function copyToClipboard(text, button) {
    navigator.clipboard.writeText(text).then(() => {
      const originalText = button.textContent;
      button.textContent = 'Copied!';
      button.classList.add('success');
      setTimeout(() => {
        button.textContent = originalText;
        button.classList.remove('success');
      }, 2000);
    }).catch(() => {
      button.textContent = 'Failed';
      setTimeout(() => {
        button.textContent = 'Copy';
      }, 2000);
    });
  }

  function isURL(string) {
    try {
      new URL(string);
      return true;
    } catch (_) {
      return false;
    }
  }
});
