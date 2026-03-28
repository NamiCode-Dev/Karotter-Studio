// Import storage and engine for normalization if needed
importScripts("theme-engine.js", "storage.js");

const storage = self.KarotterThemeStorage;

async function syncActionBehavior(settings) {
  try {
    if (settings.useSidePanel) {
      await chrome.sidePanel.setPanelBehavior({ openPanelOnActionClick: true });
      await chrome.action.setPopup({ popup: "" });
    } else {
      await chrome.sidePanel.setPanelBehavior({ openPanelOnActionClick: false });
      await chrome.action.setPopup({ popup: "popup.html" });
    }
  } catch (error) {
    console.error("Failed to sync action behavior:", error);
  }
}

// Initialize on start
storage.loadSettings().then(syncActionBehavior);

// Sync on changes
chrome.storage.onChanged.addListener((changes, areaName) => {
  if (areaName === "local" && changes[storage.STORAGE_KEY]) {
    const nextSettings = storage.normalizeSettings(changes[storage.STORAGE_KEY].newValue);
    syncActionBehavior(nextSettings);
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
