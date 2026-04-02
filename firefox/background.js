// Import storage and engine for normalization if needed
importScripts("theme-engine.js", "storage.js");

const storage = self.KarotterThemeStorage;

async function syncActionBehavior(settings) {
  try {
    // Firefox doesn't have chrome.sidePanel.setPanelBehavior.
    // Instead, we toggle the default popup.
    // If popup is empty, action.onClicked will fire.
    if (settings.useSidePanel) {
      await chrome.action.setPopup({ popup: "" });
    } else {
      await chrome.action.setPopup({ popup: "popup.html" });
    }
  } catch (error) {
    console.error("Failed to sync action behavior:", error);
  }
}

// In Firefox, we must manually handle the click if the user wants the sidebar
chrome.action.onClicked.addListener(async (tab) => {
  const settings = await storage.loadSettings();
  if (settings.useSidePanel) {
    // Use sidebarAction for Firefox
    const sidebar = (typeof browser !== "undefined") ? browser.sidebarAction : chrome.sidebarAction;
    if (sidebar && sidebar.open) {
      sidebar.open();
    }
  }
});

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
