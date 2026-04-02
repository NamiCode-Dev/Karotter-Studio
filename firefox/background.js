// Import storage and engine for normalization if needed
// importScripts("theme-engine.js", "storage.js");

const storage = self.KarotterThemeStorage;

// Initialize on start
// Note: We no longer need to sync action behavior since side panel is default in Firefox version.

// In Firefox, we manually open the sidebar when the action icon is clicked
chrome.action.onClicked.addListener(() => {
  if (typeof browser !== "undefined" && browser.sidebarAction && browser.sidebarAction.open) {
    browser.sidebarAction.open();
  } else if (chrome.sidebarAction && chrome.sidebarAction.open) {
    chrome.sidebarAction.open();
  }
});

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
