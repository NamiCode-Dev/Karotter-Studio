(function () {
  const engine = window.KarotterThemeEngine;
  const storage = window.KarotterThemeStorage;
  const previewKeys = ["app-bg", "surface-card", "accent", "text-primary"];
  const AUTO_APPLY_DELAY_MS = 200;

  const elements = {
    enabledToggle: document.getElementById("enabledToggle"),
    toggleHelp: document.getElementById("toggleHelp"),
    seedColor: document.getElementById("seedColor"),
    seedHex: document.getElementById("seedHex"),
    modeSelect: document.getElementById("modeSelect"),
    modeSegmentedControl: document.getElementById("modeSegmentedControl"),
    saturationRange: document.getElementById("saturationRange"),
    saturationValue: document.getElementById("saturationValue"),
    lightnessRange: document.getElementById("lightnessRange"),
    lightnessValue: document.getElementById("lightnessValue"),
    backgroundToggle: document.getElementById("backgroundToggle"),
    backgroundHelp: document.getElementById("backgroundHelp"),
    backgroundInput: document.getElementById("backgroundInput"),
    backgroundPickBtn: document.getElementById("backgroundPickBtn"),
    backgroundClearBtn: document.getElementById("backgroundClearBtn"),
    backgroundPreview: document.getElementById("backgroundPreview"),
    backgroundLabel: document.getElementById("backgroundLabel"),
    imageOpacityRange: document.getElementById("imageOpacityRange"),
    surfaceOpacityRange: document.getElementById("surfaceOpacityRange"),
    swatches: document.getElementById("swatches"),
    resetBtn: document.getElementById("resetBtn"),
    openSiteBtn: document.getElementById("openSiteBtn"),
    // New features
    hideReactions: document.getElementById("hideReactions"),
    customTheme: document.getElementById("customTheme"),
    hideViewCount: document.getElementById("hideViewCount"),
    hideIdentityMark: document.getElementById("hideIdentityMark"),
    hideOperatorMark: document.getElementById("hideOperatorMark"),
    hideVerifiedGroupMark: document.getElementById("hideVerifiedGroupMark"),
    collapseSidebarSections: document.getElementById("collapseSidebarSections"),
    collapseSidebarInitially: document.getElementById("collapseSidebarInitially"),
    useSidePanel: document.getElementById("useSidePanel"),
    hideSpoilers: document.getElementById("hideSpoilers"),
    spoilerKeywords: document.getElementById("spoilerKeywords"),
    saveSpoilersBtn: document.getElementById("saveSpoilersBtn"),
    autoExpandMore: document.getElementById("autoExpandMore"),
    imageDownload: document.getElementById("imageDownload"),
    enhanceVideoPlayer: document.getElementById("enhanceVideoPlayer"),
    hideQrCode: document.getElementById("hideQrCode"),
    hideProfileUrl: document.getElementById("hideProfileUrl"),
    enableAdvancedSearch: document.getElementById("enableAdvancedSearch"),
    tabBtns: document.querySelectorAll(".tab-btn"),
    tabPanes: document.querySelectorAll(".tab-pane")
  };

  let settings = null;
  let autoApplyTimer = null;

  function clearAutoApplyTimer() {
    if (autoApplyTimer) {
      window.clearTimeout(autoApplyTimer);
      autoApplyTimer = null;
    }
  }

  function setStatus(message) {
    void message;
  }

  function syncGeneratorUi(generator) {
    elements.seedColor.value = generator.seed;
    elements.seedHex.value = generator.seed;
    
    // Sync Segmented Control
    const segments = elements.modeSegmentedControl.querySelectorAll(".segment");
    const indicator = elements.modeSegmentedControl.querySelector(".segment-indicator");
    
    segments.forEach((seg, index) => {
      if (seg.dataset.value === generator.mode) {
        seg.classList.add("active");
        indicator.style.width = seg.offsetWidth + "px";
        indicator.style.transform = `translateX(${seg.offsetLeft - 4}px)`;
      } else {
        seg.classList.remove("active");
      }
    });
    
    elements.modeSelect.value = generator.mode;
    elements.saturationRange.value = String(generator.saturationShift);
    elements.saturationValue.textContent = (generator.saturationShift > 0 ? "+" : "") + generator.saturationShift;
    elements.lightnessRange.value = String(generator.lightnessShift);
    elements.lightnessValue.textContent = (generator.lightnessShift > 0 ? "+" : "") + generator.lightnessShift;
  }

  function getPreviewBackground(background) {
    const nextBackground = Object.assign({}, settings.background, background || {});
    if (!settings.enabled) {
      nextBackground.enabled = false;
    }
    return nextBackground;
  }

  function getPreviewTheme(theme, background) {
    return engine.buildBackgroundTheme(theme, background);
  }

  function renderSwatches(theme) {
    elements.swatches.innerHTML = "";

    previewKeys.forEach(function (key) {
      const swatch = document.createElement("article");
      swatch.className = "swatch";

      const color = document.createElement("div");
      color.className = "swatch-color";
      color.style.background = theme[key];

      const copy = document.createElement("div");
      copy.className = "swatch-copy";
      copy.innerHTML = "<span class=\"swatch-name\">" + key + "</span><span class=\"swatch-value\">" + theme[key] + "</span>";

      swatch.appendChild(color);
      swatch.appendChild(copy);
      elements.swatches.appendChild(swatch);
    });
  }

  function renderBackgroundUi() {
    const hasImage = Boolean(settings.background.imageDataUrl);
    const isBackgroundConfigured = Boolean(settings.background.enabled && hasImage);
    const isBackgroundActive = Boolean(settings.enabled && isBackgroundConfigured);

    elements.backgroundToggle.checked = settings.background.enabled;
    elements.backgroundToggle.disabled = !hasImage;
    elements.backgroundClearBtn.disabled = !hasImage;
    elements.imageOpacityRange.disabled = !hasImage;
    elements.surfaceOpacityRange.disabled = !hasImage;
    elements.imageOpacityRange.value = String(settings.background.imageOpacity);
    elements.surfaceOpacityRange.value = String(settings.background.surfaceOpacity);

    if (isBackgroundActive) {
      elements.backgroundHelp.textContent = "適用中";
    } else if (isBackgroundConfigured) {
      elements.backgroundHelp.textContent = "待機中";
    } else if (hasImage) {
      elements.backgroundHelp.textContent = "準備完了";
    } else {
      elements.backgroundHelp.textContent = "画像未設定";
    }

    if (hasImage) {
      elements.backgroundPreview.style.backgroundImage = "url(\"" + settings.background.imageDataUrl + "\")";
      elements.backgroundPreview.classList.add("has-image");
      elements.backgroundLabel.textContent = isBackgroundActive ? "ページ背景に適用中" : "保存済み画像";
    } else {
      elements.backgroundPreview.style.backgroundImage = "";
      elements.backgroundPreview.classList.remove("has-image");
      elements.backgroundLabel.textContent = "画像をドラッグまたは選択";
    }
  }

  function renderFeaturesUi() {
    if (!settings.features) return;
    elements.hideReactions.checked = settings.features.hideReactions;
    elements.customTheme.checked = settings.features.customTheme;
    elements.hideViewCount.checked = settings.features.hideViewCount;
    elements.hideIdentityMark.checked = settings.features.hideIdentityMark;
    elements.hideOperatorMark.checked = settings.features.hideOperatorMark;
    elements.hideVerifiedGroupMark.checked = settings.features.hideVerifiedGroupMark;
    elements.collapseSidebarSections.checked = settings.features.collapseSidebarSections;
    elements.collapseSidebarInitially.checked = settings.features.collapseSidebarInitially;
    elements.useSidePanel.checked = settings.useSidePanel;
    elements.hideSpoilers.checked = settings.features.hideSpoilers;
    elements.spoilerKeywords.value = settings.features.spoilerKeywords;
    elements.autoExpandMore.checked = settings.features.autoExpandMore;
    elements.imageDownload.checked = settings.features.imageDownload;
    elements.enhanceVideoPlayer.checked = settings.features.enhanceVideoPlayer;
    elements.hideQrCode.checked = settings.features.hideQrCode;
    elements.hideProfileUrl.checked = settings.features.hideProfileUrl;
    elements.enableAdvancedSearch.checked = settings.features.enableAdvancedSearch;
    updateSubOptionStates();
  }

  function updateSubOptionStates() {
    const isSidebarCollapseEnabled = elements.collapseSidebarSections.checked;
    const sidebarSub = elements.collapseSidebarInitially.closest(".sub-option");
    if (sidebarSub) {
      sidebarSub.style.opacity = isSidebarCollapseEnabled ? "1" : "0.5";
      sidebarSub.style.pointerEvents = isSidebarCollapseEnabled ? "auto" : "none";
    }

    const isSpoilerEnabled = elements.hideSpoilers.checked;
    const spoilerSub = document.getElementById("spoilerKeywordsContainer");
    if (spoilerSub) {
      spoilerSub.style.opacity = isSpoilerEnabled ? "1" : "0.5";
      spoilerSub.style.pointerEvents = isSpoilerEnabled ? "auto" : "none";
    }
  }

  function render() {
    elements.enabledToggle.checked = settings.enabled;
    elements.toggleHelp.textContent = settings.enabled ? "Active" : "Disabled";

    syncGeneratorUi(settings.generator);
    renderWithPreview(settings.theme, getPreviewBackground(settings.background));
    renderBackgroundUi();
    renderFeaturesUi();
  }

  function renderWithPreview(theme, background) {
    renderSwatches(getPreviewTheme(theme, background));
  }

  function readGeneratorFromUi() {
    const seed = engine.isHexColor(elements.seedHex.value)
      ? engine.normalizeHex(elements.seedHex.value)
      : elements.seedColor.value;

    return {
      seed: seed,
      mode: elements.modeSelect.value,
      saturationShift: Number(elements.saturationRange.value),
      lightnessShift: Number(elements.lightnessRange.value)
    };
  }

  function getGeneratedTheme() {
    const generator = readGeneratorFromUi();
    return {
      generator: generator,
      theme: engine.themeFromSeed(
        generator.seed,
        generator.mode,
        generator.saturationShift,
        generator.lightnessShift
      )
    };
  }

  async function persist(nextSettings, message) {
    const prevUseSidePanel = settings ? settings.useSidePanel : null;
    settings = await storage.saveSettings(nextSettings);
    render();
    if (message) {
      setStatus(message);
    }
    // If the sidebar toggle was changed, we might want to alert the user that it will take effect on next click
    if (prevUseSidePanel !== null && prevUseSidePanel !== settings.useSidePanel) {
      if (settings.useSidePanel === true) {
        setStatus("次回からサイドパネルで開きます。");
      } else {
        setStatus("次回からポップアップで開きます。");
      }
    }
  }

  function schedulePersist(nextSettings, previewTheme, previewBackground, pendingMessage, savedMessage) {
    clearAutoApplyTimer();

    if (previewTheme) {
      renderWithPreview(previewTheme, previewBackground);
    }
    
    autoApplyTimer = window.setTimeout(function () {
      persist(nextSettings, savedMessage);
    }, AUTO_APPLY_DELAY_MS);
  }

  function scheduleThemeAutoApply() {
    if (!settings) return;

    const generated = getGeneratedTheme();
    const nextSettings = Object.assign({}, settings, {
      enabled: true,
      generator: generated.generator,
      theme: generated.theme
    });
    
    schedulePersist(
      nextSettings,
      generated.theme,
      Object.assign({}, nextSettings.background),
      "テーマを生成中...",
      "テーマを生成し、反映しました。"
    );
  }

  function scheduleBackgroundSettingsSave(nextBackground, pendingMessage, savedMessage) {
    if (!settings) return;

    const nextSettings = Object.assign({}, settings, {
      background: nextBackground
    });

    settings = nextSettings;
    renderBackgroundUi();

    schedulePersist(
      nextSettings,
      settings.theme,
      getPreviewBackground(nextBackground),
      "更新中...",
      "保存しました。"
    );
  }

  function readFileAsDataUrl(file) {
    return new Promise(function (resolve, reject) {
      const reader = new FileReader();
      reader.onload = function () {
        resolve(String(reader.result || ""));
      };
      reader.onerror = function () {
        reject(reader.error || new Error("image read failed"));
      };
      reader.readAsDataURL(file);
    });
  }

  // Event Listeners
  elements.seedColor.addEventListener("input", function () {
    elements.seedHex.value = elements.seedColor.value;
    scheduleThemeAutoApply();
  });

  elements.seedHex.addEventListener("input", function () {
    if (engine.isHexColor(elements.seedHex.value)) {
      const hex = engine.normalizeHex(elements.seedHex.value);
      elements.seedColor.value = hex;
    }
    scheduleThemeAutoApply();
  });

  // Segmented Control logic
  elements.modeSegmentedControl.addEventListener("click", function (e) {
    const btn = e.target.closest(".segment");
    if (!btn) return;
    
    const value = btn.dataset.value;
    elements.modeSelect.value = value;
    
    const segments = elements.modeSegmentedControl.querySelectorAll(".segment");
    const indicator = elements.modeSegmentedControl.querySelector(".segment-indicator");
    
    segments.forEach((seg, index) => {
      if (seg === btn) {
        seg.classList.add("active");
        indicator.style.width = seg.offsetWidth + "px";
        indicator.style.transform = `translateX(${seg.offsetLeft - 4}px)`;
      } else {
        seg.classList.remove("active");
      }
    });
    
    scheduleThemeAutoApply();
  });

  elements.useSidePanel.addEventListener("change", function () {
    persist(
      Object.assign({}, settings, { useSidePanel: elements.useSidePanel.checked }),
      elements.useSidePanel.checked ? "サイドパネルモードを有効にしました。" : "ポップアップモードに戻しました。"
    );
  });

  elements.saturationRange.addEventListener("input", function () {
    const val = Number(elements.saturationRange.value);
    elements.saturationValue.textContent = (val > 0 ? "+" : "") + val;
    scheduleThemeAutoApply();
  });

  elements.lightnessRange.addEventListener("input", function () {
    const val = Number(elements.lightnessRange.value);
    elements.lightnessValue.textContent = (val > 0 ? "+" : "") + val;
    scheduleThemeAutoApply();
  });

  elements.enabledToggle.addEventListener("change", function () {
    clearAutoApplyTimer();
    persist(
      Object.assign({}, settings, { enabled: elements.enabledToggle.checked }),
      elements.enabledToggle.checked ? "テーマを有効にしました。" : "テーマを無効にしました。"
    );
  });

  elements.backgroundToggle.addEventListener("change", function () {
    clearAutoApplyTimer();

    if (!settings.background.imageDataUrl) {
      elements.backgroundToggle.checked = false;
      setStatus("先に画像を選択してください。");
      return;
    }

    persist(
      Object.assign({}, settings, {
        enabled: elements.backgroundToggle.checked ? true : settings.enabled,
        background: Object.assign({}, settings.background, {
          enabled: elements.backgroundToggle.checked
        })
      }),
      elements.backgroundToggle.checked ? "背景画像を有効にしました。" : "背景画像を無効にしました。"
    );
  });

  // Feature Toggles
  ["hideReactions", "customTheme", "hideViewCount", "hideIdentityMark", "hideOperatorMark", "hideVerifiedGroupMark", "collapseSidebarSections", "collapseSidebarInitially", "hideSpoilers", "autoExpandMore", "imageDownload", "enhanceVideoPlayer", "hideQrCode", "hideProfileUrl", "enableAdvancedSearch"].forEach(featureKey => {
    const el = elements[featureKey];
    if (el) {
      el.addEventListener("change", function () {
        if (featureKey === "collapseSidebarSections" || featureKey === "hideSpoilers") {
          updateSubOptionStates();
        }
        const nextFeatures = Object.assign({}, settings.features, {
          [featureKey]: el.checked
        });
        persist(
          Object.assign({}, settings, { features: nextFeatures }),
          "設定を更新しました。"
        );
      });
    }
  });

  elements.saveSpoilersBtn.addEventListener("click", function () {
    const nextFeatures = Object.assign({}, settings.features, {
      spoilerKeywords: elements.spoilerKeywords.value
    });
    persist(
      Object.assign({}, settings, { features: nextFeatures }),
      "キーワードを保存しました。"
    );
  });

  // Tab Switching
  elements.tabBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      const tabId = btn.dataset.tab;
      elements.tabBtns.forEach(b => b.classList.toggle("active", b === btn));
      elements.tabPanes.forEach(p => p.classList.toggle("active", p.id === `${tabId}Tab`));
    });
  });

  elements.surfaceOpacityRange.addEventListener("input", function () {
    const surfaceOpacity = Number(elements.surfaceOpacityRange.value);
    scheduleBackgroundSettingsSave(
      Object.assign({}, settings.background, { surfaceOpacity: surfaceOpacity }),
      "更新中...",
      "保存しました。"
    );
  });

  elements.imageOpacityRange.addEventListener("input", function () {
    const imageOpacity = Number(elements.imageOpacityRange.value);
    scheduleBackgroundSettingsSave(
      Object.assign({}, settings.background, { imageOpacity: imageOpacity }),
      "更新中...",
      "保存しました。"
    );
  });

  elements.backgroundPickBtn.addEventListener("click", () => elements.backgroundInput.click());
  elements.backgroundPreview.addEventListener("click", () => elements.backgroundInput.click());

  elements.backgroundInput.addEventListener("change", async function (event) {
    const file = event.target.files && event.target.files[0];
    if (!file || !/^image\//i.test(file.type)) return;

    try {
      const imageDataUrl = await readFileAsDataUrl(file);
      await persist(
        Object.assign({}, settings, {
          enabled: true,
          background: {
            enabled: true,
            imageDataUrl: imageDataUrl,
            imageOpacity: settings.background.imageOpacity,
            surfaceOpacity: settings.background.surfaceOpacity
          }
        }),
        "画像を適用しました。"
      );
    } catch (error) {
      console.error(error);
    } finally {
      elements.backgroundInput.value = "";
    }
  });

  elements.backgroundClearBtn.addEventListener("click", function () {
    clearAutoApplyTimer();
    persist(
      Object.assign({}, settings, {
        background: {
          enabled: false,
          imageDataUrl: "",
          imageOpacity: settings.background.imageOpacity,
          surfaceOpacity: settings.background.surfaceOpacity
        }
      }),
      "画像を削除しました。"
    );
  });

  elements.resetBtn.addEventListener("click", function () {
    if (!confirm("設定を初期状態に戻しますか？（背景画像は保持されます）")) {
      return;
    }
    clearAutoApplyTimer();
    const defaults = storage.getDefaultSettings();
    defaults.background = Object.assign({}, defaults.background, {
      imageDataUrl: settings.background.imageDataUrl,
      imageOpacity: settings.background.imageOpacity,
      surfaceOpacity: settings.background.surfaceOpacity,
      enabled: false
    });
    persist(defaults, "設定をリセットしました。");
  });

  elements.openSiteBtn.addEventListener("click", function () {
    chrome.tabs.create({ url: "https://karotter.com/" });
    window.close();
  });

  storage.loadSettings().then(function (loadedSettings) {
    settings = loadedSettings;
    render();
  });
}());
