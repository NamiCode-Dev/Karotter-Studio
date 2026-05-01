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
    extractColorBtn: document.getElementById("extractColorBtn"),
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
    // Generator Mode
    creationModeControl: document.getElementById("creationModeControl"),
    automaticSettings: document.getElementById("automaticSettings"),
    manualSettings: document.getElementById("manualSettings"),
    manualAccent: document.getElementById("manualAccent"),
    manualAccentHex: document.getElementById("manualAccentHex"),
    manualBg: document.getElementById("manualBg"),
    manualBgHex: document.getElementById("manualBgHex"),
    manualSurface: document.getElementById("manualSurface"),
    manualSurfaceHex: document.getElementById("manualSurfaceHex"),
    manualText: document.getElementById("manualText"),
    manualTextHex: document.getElementById("manualTextHex"),
    // Features
    hideReactions: document.getElementById("hideReactions"),
    customTheme: document.getElementById("customTheme"),
    hideViewCount: document.getElementById("hideViewCount"),
    hideIdentityMark: document.getElementById("hideIdentityMark"),
    hideOperatorMark: document.getElementById("hideOperatorMark"),
    hideVerifiedGroupMark: document.getElementById("hideVerifiedGroupMark"),
    hideVerifiedMark: document.getElementById("hideVerifiedMark"),
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
    showBoardsLink: document.getElementById("showBoardsLink"),
    enableVBotCommands: document.getElementById("enableVBotCommands"),
    enableYandereBotAssistant: document.getElementById("enableYandereBotAssistant"),
    hideReplies: document.getElementById("hideReplies"),
    enableUserProfileLinks: document.getElementById("enableUserProfileLinks"),
    showGlossaryLink: document.getElementById("showGlossaryLink"),
    enableModernLinkPreview: document.getElementById("enableModernLinkPreview"),
    enableContentWidth: document.getElementById("enableContentWidth"),
    contentWidthSubOption: document.getElementById("contentWidthSubOption"),
    contentWidthValue: document.getElementById("contentWidthValue"),
    contentWidthRange: document.getElementById("contentWidthRange"),
    enableThemeScrollbar: document.getElementById("enableThemeScrollbar"),
    enableLinkPreviewHover: document.getElementById("enableLinkPreviewHover"),
    enableConnectionSwitcher: document.getElementById("enableConnectionSwitcher"),
    // Font - bundled
    fontSelect: document.getElementById("fontSelect"),
    fontSegmentedControl: document.getElementById("fontSegmentedControl"),
    // Font - source control
    fontSourceControl: document.getElementById("fontSourceControl"),
    fontSourceSystem: document.getElementById("fontSourceSystem"),
    fontSourceCustom: document.getElementById("fontSourceCustom"),
    fontSourceGoogle: document.getElementById("fontSourceGoogle"),
    // Font - custom upload
    customFontInput: document.getElementById("customFontInput"),
    customFontPickBtn: document.getElementById("customFontPickBtn"),
    customFontClearBtn: document.getElementById("customFontClearBtn"),
    customFontStatus: document.getElementById("customFontStatus"),
    customFontName: document.getElementById("customFontName"),
    // Font - Google Fonts
    googleFontSearch: document.getElementById("googleFontSearch"),
    googleFontsList: document.getElementById("googleFontsList"),
    googleFontSelected: document.getElementById("googleFontSelected"),
    googleFontSelectedName: document.getElementById("googleFontSelectedName"),
    googleFontClearBtn: document.getElementById("googleFontClearBtn"),
    // App Theme
    appThemeControl: document.getElementById("appThemeControl"),
    // Tabs
    tabBtns: document.querySelectorAll(".tab-btn"),
    tabPanes: document.querySelectorAll(".tab-pane")
  };

  let settings = null;
  let autoApplyTimer = null;
  let googleFontsData = null;

  function clearAutoApplyTimer() {
    if (autoApplyTimer) {
      window.clearTimeout(autoApplyTimer);
      autoApplyTimer = null;
    }
  }

  function setStatus(message) {
    void message;
  }

  function updateSegmentedIndicator(indicator, activeSegment) {
    if (!indicator || !activeSegment) return;
    const update = () => {
      if (!activeSegment.offsetWidth) return;
      indicator.style.width = activeSegment.offsetWidth + "px";
      indicator.style.transform = `translateX(${activeSegment.offsetLeft - 4}px)`;
    };
    update();
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(update);
    }
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
        updateSegmentedIndicator(indicator, seg);
      } else {
        seg.classList.remove("active");
      }
    });
    
    elements.modeSelect.value = generator.mode;
    elements.saturationRange.value = String(generator.saturationShift);
    elements.saturationValue.textContent = (generator.saturationShift > 0 ? "+" : "") + generator.saturationShift;
    elements.lightnessRange.value = String(generator.lightnessShift);
    elements.lightnessValue.textContent = (generator.lightnessShift > 0 ? "+" : "") + generator.lightnessShift;

    // Creation Mode
    if (elements.creationModeControl) {
      const modeSegments = elements.creationModeControl.querySelectorAll(".segment");
      const modeIndicator = elements.creationModeControl.querySelector(".segment-indicator");
      
      modeSegments.forEach((seg) => {
        if (seg.dataset.value === (generator.creationMode || "automatic")) {
          seg.classList.add("active");
          updateSegmentedIndicator(modeIndicator, seg);
        } else {
          seg.classList.remove("active");
        }
      });
      
      elements.automaticSettings.style.display = (generator.creationMode === "manual") ? "none" : "";
      elements.manualSettings.style.display = (generator.creationMode === "manual") ? "" : "none";
    }

    if (generator.manualPalette) {
      syncManualPaletteUi(generator.manualPalette);
    }
  }

  function syncManualPaletteUi(palette) {
    if (!palette || palette.length !== 4) return;
    
    elements.manualAccent.value = palette[0];
    elements.manualAccentHex.value = palette[0];
    elements.manualBg.value = palette[1];
    elements.manualBgHex.value = palette[1];
    elements.manualSurface.value = palette[2];
    elements.manualSurfaceHex.value = palette[2];
    elements.manualText.value = palette[3];
    elements.manualTextHex.value = palette[3];
  }

  function syncFontUi(fontFamily) {
    if (!elements.fontSegmentedControl) return;
    const segments = elements.fontSegmentedControl.querySelectorAll(".segment");
    const indicator = elements.fontSegmentedControl.querySelector(".segment-indicator");
    
    segments.forEach((seg) => {
      if (seg.dataset.value === fontFamily) {
        seg.classList.add("active");
        updateSegmentedIndicator(indicator, seg);
      } else {
        seg.classList.remove("active");
      }
    });
    
    elements.fontSelect.value = fontFamily;
  }

  function syncFontSourceUi(fontSource) {
    if (!elements.fontSourceControl) return;
    const segments = elements.fontSourceControl.querySelectorAll(".segment");
    const indicator = elements.fontSourceControl.querySelector(".segment-indicator");
    
    segments.forEach((seg) => {
      if (seg.dataset.value === fontSource) {
        seg.classList.add("active");
        updateSegmentedIndicator(indicator, seg);
      } else {
        seg.classList.remove("active");
      }
    });

    // Show/hide source panels
    elements.fontSourceSystem.style.display = fontSource === "system" ? "" : "none";
    elements.fontSourceCustom.style.display = fontSource === "custom" ? "" : "none";
    elements.fontSourceGoogle.style.display = fontSource === "google" ? "" : "none";
  }

  function renderCustomFontUi() {
    const hasFont = Boolean(settings.customFont && settings.customFont.dataUrl && settings.customFont.name);
    elements.customFontClearBtn.disabled = !hasFont;
    
    if (hasFont) {
      elements.customFontName.textContent = settings.customFont.name;
      elements.customFontStatus.classList.add("has-font");
    } else {
      elements.customFontName.textContent = "フォント未設定";
      elements.customFontStatus.classList.remove("has-font");
    }
  }

  function renderGoogleFontUi() {
    const hasFont = Boolean(settings.googleFont && settings.googleFont.family);
    
    if (hasFont) {
      elements.googleFontSelected.style.display = "flex";
      elements.googleFontSelectedName.textContent = settings.googleFont.family;
    } else {
      elements.googleFontSelected.style.display = "none";
      elements.googleFontSelectedName.textContent = "";
    }

    // Update selected state in list
    const items = elements.googleFontsList.querySelectorAll(".gfont-item");
    items.forEach(item => {
      if (item.dataset.family === (settings.googleFont.family || "")) {
        item.classList.add("selected");
      } else {
        item.classList.remove("selected");
      }
    });
  }

  function syncAppThemeUi(theme) {
    if (!elements.appThemeControl) return;
    const segments = elements.appThemeControl.querySelectorAll(".segment");
    const indicator = elements.appThemeControl.querySelector(".segment-indicator");
    
    segments.forEach((seg) => {
      if (seg.dataset.value === theme) {
        seg.classList.add("active");
        updateSegmentedIndicator(indicator, seg);
      } else {
        seg.classList.remove("active");
      }
    });
  }

  function applyAppTheme(theme, skipAnimation = false) {
    const root = document.documentElement;
    if (!skipAnimation) {
      root.classList.add("theme-transition");
    }
    
    if (theme === "system") {
      root.removeAttribute("data-theme");
    } else {
      root.setAttribute("data-theme", theme);
    }
    
    if (!skipAnimation) {
      setTimeout(() => {
        root.classList.remove("theme-transition");
      }, 500);
    }
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
    elements.swatches.textContent = "";

    previewKeys.forEach(function (key) {
      const swatch = document.createElement("article");
      swatch.className = "swatch";

      const color = document.createElement("div");
      color.className = "swatch-color";
      color.style.background = theme[key] || "var(--border)";

      const copy = document.createElement("div");
      copy.className = "swatch-copy";
      
      const nameSpan = document.createElement("span");
      nameSpan.className = "swatch-name";
      nameSpan.textContent = key;
      
      const valueSpan = document.createElement("span");
      valueSpan.className = "swatch-value";
      valueSpan.textContent = theme[key];
      
      copy.appendChild(nameSpan);
      copy.appendChild(valueSpan);

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
      elements.backgroundLabel.textContent = "画像をドラッグまたは選択 (GIF対応)";
    }

    if (elements.extractColorBtn) {
      elements.extractColorBtn.disabled = !isBackgroundActive;
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
    elements.hideVerifiedMark.checked = settings.features.hideVerifiedMark;
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
    elements.showBoardsLink.checked = settings.features.showBoardsLink;
    elements.enableVBotCommands.checked = settings.features.enableVBotCommands;
    elements.enableYandereBotAssistant.checked = settings.features.enableYandereBotAssistant;
    elements.hideReplies.checked = settings.features.hideReplies;
    elements.enableUserProfileLinks.checked = settings.features.enableUserProfileLinks;
    elements.showGlossaryLink.checked = settings.features.showGlossaryLink;
    elements.enableModernLinkPreview.checked = settings.features.enableModernLinkPreview;
    elements.enableContentWidth.checked = settings.features.enableContentWidth;
    elements.contentWidthRange.value = String(settings.features.contentWidth);
    elements.contentWidthValue.textContent = settings.features.contentWidth + "%";
    elements.enableThemeScrollbar.checked = settings.features.enableThemeScrollbar;
    elements.enableLinkPreviewHover.checked = settings.features.enableLinkPreviewHover;
    elements.enableConnectionSwitcher.checked = settings.features.enableConnectionSwitcher;
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

    const isContentWidthEnabled = elements.enableContentWidth.checked;
    if (elements.contentWidthSubOption) {
      elements.contentWidthSubOption.style.display = isContentWidthEnabled ? "block" : "none";
    }
  }

  function render() {
    elements.enabledToggle.checked = settings.enabled;
    elements.toggleHelp.textContent = settings.enabled ? "Active" : "Disabled";

    syncGeneratorUi(settings.generator);
    syncFontUi(settings.fontFamily || "system");
    syncFontSourceUi(settings.fontSource || "system");
    renderCustomFontUi();
    renderGoogleFontUi();
    syncAppThemeUi(settings.appTheme || "system");
    applyAppTheme(settings.appTheme || "system", true);
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
      creationMode: settings.generator.creationMode || "automatic",
      seed: seed,
      mode: elements.modeSelect.value,
      saturationShift: Number(elements.saturationRange.value),
      lightnessShift: Number(elements.lightnessRange.value),
      manualPalette: [
        elements.manualAccent.value,
        elements.manualBg.value,
        elements.manualSurface.value,
        elements.manualText.value
      ]
    };
  }

  function getGeneratedTheme() {
    const generator = readGeneratorFromUi();
    const theme = generator.creationMode === "manual"
      ? engine.themeFromManualPalette(generator.manualPalette)
      : engine.themeFromSeed(
          generator.seed,
          generator.mode,
          generator.saturationShift,
          generator.lightnessShift
        );

    return {
      generator: generator,
      theme: theme
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

  function extractDominantColor(dataUrl) {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = function () {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        // Scale down for performance
        canvas.width = 50;
        canvas.height = 50;
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        
        const data = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
        let r = 0, g = 0, b = 0, count = 0;
        
        for (let i = 0; i < data.length; i += 4) {
          // Skip transparent or very light/dark pixels if necessary, 
          // but for simple extraction average is often enough for a base color
          r += data[i];
          g += data[i + 1];
          b += data[i + 2];
          count++;
        }
        
        r = Math.floor(r / count);
        g = Math.floor(g / count);
        b = Math.floor(b / count);
        
        resolve(engine.rgbToHex(r, g, b));
      };
      img.src = dataUrl;
    });
  }

  // Event Listeners
  if (elements.extractColorBtn) {
    elements.extractColorBtn.addEventListener("click", async function () {
      if (!settings.background || !settings.background.imageDataUrl) return;
      
      const color = await extractDominantColor(settings.background.imageDataUrl);
      elements.seedHex.value = color;
      elements.seedColor.value = color;
      scheduleThemeAutoApply();
    });
  }

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
        updateSegmentedIndicator(indicator, seg);
      } else {
        seg.classList.remove("active");
      }
    });
    
    scheduleThemeAutoApply();
  });

  // Creation Mode Segmented Control logic
  elements.creationModeControl.addEventListener("click", function (e) {
    const btn = e.target.closest(".segment");
    if (!btn) return;
    
    const value = btn.dataset.value;
    settings.generator.creationMode = value;
    
    const segments = elements.creationModeControl.querySelectorAll(".segment");
    const indicator = elements.creationModeControl.querySelector(".segment-indicator");
    
    segments.forEach((seg) => {
      if (seg === btn) {
        seg.classList.add("active");
        updateSegmentedIndicator(indicator, seg);
      } else {
        seg.classList.remove("active");
      }
    });
    
    elements.automaticSettings.style.display = (value === "manual") ? "none" : "";
    elements.manualSettings.style.display = (value === "manual") ? "" : "none";
    
    scheduleThemeAutoApply();
  });

  // Manual Palette Listeners
  [
    { el: elements.manualAccent, hex: elements.manualAccentHex },
    { el: elements.manualBg, hex: elements.manualBgHex },
    { el: elements.manualSurface, hex: elements.manualSurfaceHex },
    { el: elements.manualText, hex: elements.manualTextHex }
  ].forEach(item => {
    // Sync from color picker to hex input
    item.el.addEventListener("input", function() {
      item.hex.value = item.el.value;
      scheduleThemeAutoApply();
    });

    // Sync from hex input to color picker
    item.hex.addEventListener("input", function() {
      const value = item.hex.value.trim();
      if (engine.isHexColor(value)) {
        const normalized = engine.normalizeHex(value);
        item.el.value = normalized;
        scheduleThemeAutoApply();
      }
    });
  });

  // Font Segmented Control logic (bundled fonts)
  elements.fontSegmentedControl.addEventListener("click", function (e) {
    const btn = e.target.closest(".segment");
    if (!btn) return;
    
    const value = btn.dataset.value;
    elements.fontSelect.value = value;
    
    const segments = elements.fontSegmentedControl.querySelectorAll(".segment");
    const indicator = elements.fontSegmentedControl.querySelector(".segment-indicator");
    
    segments.forEach((seg) => {
      if (seg === btn) {
        seg.classList.add("active");
        updateSegmentedIndicator(indicator, seg);
      } else {
        seg.classList.remove("active");
      }
    });
    
    persist(
      Object.assign({}, settings, { fontFamily: value }),
      "フォントを変更しました。"
    );
  });

  // Font Source Control logic
  elements.fontSourceControl.addEventListener("click", function (e) {
    const btn = e.target.closest(".segment");
    if (!btn) return;
    
    const value = btn.dataset.value;
    
    const segments = elements.fontSourceControl.querySelectorAll(".segment");
    const indicator = elements.fontSourceControl.querySelector(".segment-indicator");
    
    segments.forEach((seg) => {
      if (seg === btn) {
        seg.classList.add("active");
        updateSegmentedIndicator(indicator, seg);
      } else {
        seg.classList.remove("active");
      }
    });

    // Show/hide panels
    elements.fontSourceSystem.style.display = value === "system" ? "" : "none";
    elements.fontSourceCustom.style.display = value === "custom" ? "" : "none";
    elements.fontSourceGoogle.style.display = value === "google" ? "" : "none";

    // Load Google Fonts list if switching to google and not yet loaded
    if (value === "google" && !googleFontsData) {
      loadGoogleFontsList();
    }
    
    persist(
      Object.assign({}, settings, { fontSource: value }),
      "フォントソースを変更しました。"
    );
  });

  // Custom Font Upload
  elements.customFontPickBtn.addEventListener("click", () => elements.customFontInput.click());

  elements.customFontInput.addEventListener("change", async function (event) {
    const file = event.target.files && event.target.files[0];
    if (!file) return;

    const ext = file.name.split(".").pop().toLowerCase();
    const formatMap = {
      "ttf": "truetype",
      "otf": "opentype",
      "woff": "woff",
      "woff2": "woff2"
    };
    const format = formatMap[ext];
    if (!format) {
      alert("未対応のフォント形式です。TTF, OTF, WOFF, WOFF2 のいずれかを選択してください。");
      return;
    }

    try {
      const dataUrl = await readFileAsDataUrl(file);
      const fontName = file.name.replace(/\.[^.]+$/, "");
      await persist(
        Object.assign({}, settings, {
          fontSource: "custom",
          customFont: {
            name: fontName,
            dataUrl: dataUrl,
            format: format
          }
        }),
        "カスタムフォントを適用しました。"
      );
    } catch (error) {
      console.error("Font upload failed:", error);
      alert("フォントの読み込みに失敗しました。");
    } finally {
      elements.customFontInput.value = "";
    }
  });

  elements.customFontClearBtn.addEventListener("click", function () {
    persist(
      Object.assign({}, settings, {
        fontSource: "custom",
        customFont: { name: "", dataUrl: "", format: "" }
      }),
      "カスタムフォントを削除しました。"
    );
  });

  // Google Fonts
  function loadGoogleFontsList() {
    fetch(chrome.runtime.getURL("google-fonts-jp.json"))
      .then(res => res.json())
      .then(data => {
        // Remove duplicates by family name
        const seen = new Set();
        googleFontsData = data.filter(f => {
          if (seen.has(f.family)) return false;
          seen.add(f.family);
          return true;
        });
        renderGoogleFontList(googleFontsData);
      })
      .catch(err => {
        console.error("Failed to load Google Fonts list:", err);
        const errorDiv = document.createElement("div");
        errorDiv.className = "google-fonts-loading";
        errorDiv.textContent = "読み込み失敗";
        elements.googleFontsList.textContent = "";
        elements.googleFontsList.appendChild(errorDiv);
      });
  }

  function renderGoogleFontList(fonts) {
    const CHECK_SVG_HTML = '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-check"><path d="m20 6-11 11-5-5"/></svg>';
    
    elements.googleFontsList.textContent = "";
    
    if (fonts.length === 0) {
      const emptyDiv = document.createElement("div");
      emptyDiv.className = "google-fonts-loading";
      emptyDiv.textContent = "該当するフォントがありません";
      elements.googleFontsList.appendChild(emptyDiv);
      return;
    }

    const fragment = document.createDocumentFragment();
    fonts.forEach(font => {
      const item = document.createElement("div");
      item.className = "gfont-item";
      item.dataset.family = font.family;
      if (settings.googleFont && settings.googleFont.family === font.family) {
        item.classList.add("selected");
      }
      
      const nameSpan = document.createElement("span");
      nameSpan.className = "gfont-item-name";
      nameSpan.textContent = font.label || font.family;
      
      const catSpan = document.createElement("span");
      catSpan.className = "gfont-item-cat";
      catSpan.textContent = font.category;
      
      const checkSpan = document.createElement("span");
      checkSpan.className = "gfont-item-check";
      checkSpan.insertAdjacentHTML("afterbegin", CHECK_SVG_HTML);
      
      item.appendChild(nameSpan);
      item.appendChild(catSpan);
      item.appendChild(checkSpan);
      
      item.addEventListener("click", function () {
        // Deselect previous
        const prev = elements.googleFontsList.querySelector(".gfont-item.selected");
        if (prev) prev.classList.remove("selected");
        item.classList.add("selected");

        persist(
          Object.assign({}, settings, {
            fontSource: "google",
            googleFont: {
              family: font.family,
              category: font.category
            }
          }),
          "Google Font を適用しました。"
        );
      });
      
      fragment.appendChild(item);
    });
    elements.googleFontsList.appendChild(fragment);
  }

  elements.googleFontSearch.addEventListener("input", function () {
    if (!googleFontsData) return;
    const query = elements.googleFontSearch.value.trim().toLowerCase();
    if (!query) {
      renderGoogleFontList(googleFontsData);
      return;
    }
    const filtered = googleFontsData.filter(f => {
      return f.family.toLowerCase().includes(query) ||
        (f.label && f.label.toLowerCase().includes(query)) ||
        f.category.toLowerCase().includes(query);
    });
    renderGoogleFontList(filtered);
  });

  elements.googleFontClearBtn.addEventListener("click", function () {
    persist(
      Object.assign({}, settings, {
        fontSource: "google",
        googleFont: { family: "", category: "" }
      }),
      "Google Font の選択を解除しました。"
    );
  });

  // App Theme Control logic
  elements.appThemeControl.addEventListener("click", function (e) {
    const btn = e.target.closest(".segment");
    if (!btn) return;
    
    const value = btn.dataset.value;
    syncAppThemeUi(value);
    applyAppTheme(value);
    
    persist(
      Object.assign({}, settings, { appTheme: value }),
      "カラーテーマを変更しました。"
    );
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
  ["hideReactions", "customTheme", "hideViewCount", "hideIdentityMark", "hideOperatorMark", "hideVerifiedMark", "hideVerifiedGroupMark", "collapseSidebarSections", "collapseSidebarInitially", "hideSpoilers", "autoExpandMore", "imageDownload", "enhanceVideoPlayer", "hideQrCode", "hideProfileUrl", "enableAdvancedSearch", "enableConnectionSwitcher", "showBoardsLink", "enableVBotCommands", "enableYandereBotAssistant", "hideReplies", "enableUserProfileLinks", "showGlossaryLink", "enableModernLinkPreview", "enableLinkPreviewHover", "enableContentWidth", "enableThemeScrollbar"].forEach(featureKey => {
    const el = elements[featureKey];
    if (el) {
      el.addEventListener("change", function () {
        if (featureKey === "collapseSidebarSections" || featureKey === "hideSpoilers" || featureKey === "enableContentWidth") {
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

      // Scroll to top when switching tabs
      window.scrollTo(0, 0);

      // Re-sync UI that depends on layout/measurements when tab becomes visible
      if (settings) {
        syncGeneratorUi(settings.generator);
        syncFontUi(settings.fontFamily || "system");
        syncFontSourceUi(settings.fontSource || "system");
        syncAppThemeUi(settings.appTheme || "system");
      }
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

  elements.contentWidthRange.addEventListener("input", function () {
    const value = Number(elements.contentWidthRange.value);
    elements.contentWidthValue.textContent = value + "%";
    
    const nextFeatures = Object.assign({}, settings.features, {
      contentWidth: value
    });
    
    schedulePersist(
      Object.assign({}, settings, { features: nextFeatures }),
      settings.theme,
      settings.background,
      "調整中...",
      "幅の設定を保存しました。"
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
    chrome.tabs.create({ url: "https://karotter.com/profile/namicode" });
    window.close();
  });

  storage.loadSettings().then(function (loadedSettings) {
    settings = loadedSettings;
    render();
    // Pre-load Google Fonts list if source is google
    if (settings.fontSource === "google") {
      loadGoogleFontsList();
    }
  });
}());
