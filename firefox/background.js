// Import storage and engine for normalization if needed
// importScripts("theme-engine.js", "storage.js");

const storage = self.KarotterThemeStorage;

// Initialize on start (nothing for now but keep structure if needed)
// storage.loadSettings().then(syncActionBehavior);

// Handle download requests from content script
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "download_image") {
    chrome.downloads.download({
      url: message.url,
      filename: message.filename,
      saveAs: false
    }, (downloadId) => {
      if (chrome.runtime.lastError) {
        console.error("Download failed:", chrome.runtime.lastError);
        sendResponse({ success: false, error: chrome.runtime.lastError.message });
      } else {
        sendResponse({ success: true, downloadId });
      }
    });
    return true; // Keep message channel open for async sendResponse
  }
});
