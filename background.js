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

  // Handle link preview rule management
  if (message.action === "setup_preview_rules") {
    const url = new URL(message.url);
    const domain = url.hostname;

    chrome.declarativeNetRequest.updateDynamicRules({
      removeRuleIds: [1001, 1002],
      addRules: [
        {
          id: 1001,
          priority: 1,
          action: {
            type: "modifyHeaders",
            responseHeaders: [
              { header: "X-Frame-Options", operation: "remove" },
              { header: "Frame-Options", operation: "remove" },
              { header: "Content-Security-Policy", operation: "remove" },
              { header: "Access-Control-Allow-Origin", operation: "set", value: "*" },
              { header: "Access-Control-Allow-Methods", operation: "set", value: "GET, POST, OPTIONS, PUT, DELETE, PATCH" },
              { header: "Access-Control-Allow-Headers", operation: "set", value: "*" },
              { header: "Access-Control-Expose-Headers", operation: "set", value: "*" },
              { header: "Access-Control-Allow-Credentials", operation: "set", value: "true" },
              { header: "Cross-Origin-Resource-Policy", operation: "remove" },
              { header: "Cross-Origin-Embedder-Policy", operation: "remove" },
              { header: "Cross-Origin-Opener-Policy", operation: "remove" }
            ]
          },
          condition: {
            urlFilter: `||${domain}^`,
            resourceTypes: ["main_frame", "sub_frame", "xmlhttprequest", "image", "media", "script", "stylesheet", "font", "other"]
          }
        },
        {
          id: 1002,
          priority: 1,
          action: {
            type: "modifyHeaders",
            responseHeaders: [
              { header: "Content-Security-Policy", operation: "remove" },
              { header: "X-Content-Security-Policy", operation: "remove" }
            ]
          },
          condition: {
            urlFilter: "||karotter.com^",
            resourceTypes: ["main_frame", "sub_frame"]
          }
        }
      ]
    }, () => {
      if (chrome.runtime.lastError) {
        console.error("DNR Error:", chrome.runtime.lastError);
        sendResponse({ success: false });
      } else {
        sendResponse({ success: true });
      }
    });
    return true;
  }

  if (message.action === "clear_preview_rules") {
    chrome.declarativeNetRequest.updateDynamicRules({
      removeRuleIds: [1001, 1002]
    }, () => {
      sendResponse({ success: true });
    });
    return true;
  }
});
