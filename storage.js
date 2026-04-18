(function (global) {
  const engine = global.KarotterThemeEngine;
  const STORAGE_KEY = "karotterThemeSettings";

  function getDefaultSettings() {
    return {
      version: 1,
      enabled: false,
      theme: Object.assign({}, engine.defaultTheme),
      background: {
        enabled: false,
        imageDataUrl: "",
        imageOpacity: 100,
        surfaceOpacity: 100
      },
      generator: {
        seed: "#1d9bf0",
        mode: "light",
        saturationShift: 0,
        lightnessShift: 0
      },
      features: {
        customTheme: true,
        hideReactions: false,
        hideViewCount: false,
        hideIdentityMark: false,
        hideOperatorMark: false,
        hideVerifiedGroupMark: false,
        hideVerifiedMark: false,
        enhanceVideoPlayer: false,
        collapseSidebarSections: false,
        collapseSidebarInitially: false,
        hideSpoilers: false,
        spoilerKeywords: "",
        autoExpandMore: false,
        imageDownload: false,
        hideQrCode: false,
        hideProfileUrl: false,
        enableAdvancedSearch: false,
        showBoardsLink: false,
        enableVBotCommands: false,
        hideReplies: false,
        enableUserProfileLinks: false,
        showGlossaryLink: false
      },
      fontFamily: "system",
      fontSource: "system",
      customFont: {
        name: "",
        dataUrl: "",
        format: ""
      },
      googleFont: {
        family: "",
        category: ""
      },
      useSidePanel: false,
      appTheme: "system"
    };
  }

  function normalizeGenerator(input) {
    const generator = input && typeof input === "object" ? input : {};
    return {
      seed: engine.isHexColor(generator.seed) ? engine.normalizeHex(generator.seed) : "#1d9bf0",
      mode: engine.generatorModes.includes(generator.mode) ? generator.mode : "light",
      saturationShift: engine.clamp(Number(generator.saturationShift) || 0, -40, 40),
      lightnessShift: engine.clamp(Number(generator.lightnessShift) || 0, -30, 30)
    };
  }

  function normalizeBackground(input) {
    const background = input && typeof input === "object" ? input : {};
    const imageDataUrl = typeof background.imageDataUrl === "string" && /^data:image\//i.test(background.imageDataUrl)
      ? background.imageDataUrl
      : "";
    const legacyOpacity = engine.clamp(Number(background.opacity) || 100, 0, 100);

    return {
      enabled: Boolean(background.enabled && imageDataUrl),
      imageDataUrl: imageDataUrl,
      imageOpacity: engine.clamp(Number(background.imageOpacity) || 100, 0, 100),
      surfaceOpacity: engine.clamp(Number(background.surfaceOpacity) || legacyOpacity, 0, 100)
    };
  }

  function normalizeFeatures(input) {
    const f = input && typeof input === "object" ? input : {};
    return {
      customTheme: typeof f.customTheme === "boolean" ? f.customTheme : true,
      hideReactions: Boolean(f.hideReactions),
      hideViewCount: Boolean(f.hideViewCount),
      hideIdentityMark: Boolean(f.hideIdentityMark),
      hideOperatorMark: Boolean(f.hideOperatorMark),
      hideVerifiedGroupMark: Boolean(f.hideVerifiedGroupMark),
      hideVerifiedMark: Boolean(f.hideVerifiedMark),
      enhanceVideoPlayer: Boolean(f.enhanceVideoPlayer),
      collapseSidebarSections: Boolean(f.collapseSidebarSections),
      collapseSidebarInitially: Boolean(f.collapseSidebarInitially),
      hideSpoilers: Boolean(f.hideSpoilers),
      spoilerKeywords: typeof f.spoilerKeywords === "string" ? f.spoilerKeywords : "",
      autoExpandMore: Boolean(f.autoExpandMore),
      imageDownload: !!f.imageDownload,
      hideQrCode: !!f.hideQrCode,
      hideProfileUrl: !!f.hideProfileUrl,
      enableAdvancedSearch: !!f.enableAdvancedSearch,
      showBoardsLink: !!f.showBoardsLink,
      enableVBotCommands: !!f.enableVBotCommands,
      hideReplies: !!f.hideReplies,
      enableUserProfileLinks: !!f.enableUserProfileLinks,
      showGlossaryLink: !!f.showGlossaryLink
    };
  }

  function normalizeCustomFont(input) {
    const font = input && typeof input === "object" ? input : {};
    const validFormats = ["truetype", "opentype", "woff", "woff2"];
    return {
      name: typeof font.name === "string" ? font.name : "",
      dataUrl: typeof font.dataUrl === "string" && /^data:/i.test(font.dataUrl) ? font.dataUrl : "",
      format: validFormats.includes(font.format) ? font.format : ""
    };
  }

  function normalizeGoogleFont(input) {
    const font = input && typeof input === "object" ? input : {};
    return {
      family: typeof font.family === "string" ? font.family : "",
      category: typeof font.category === "string" ? font.category : ""
    };
  }

  function normalizeSettings(input) {
    const defaults = getDefaultSettings();
    const source = input && typeof input === "object" ? input : {};
    const validSources = ["system", "custom", "google"];
    return {
      version: typeof source.version === "number" ? source.version : defaults.version,
      enabled: typeof source.enabled === "boolean" ? source.enabled : defaults.enabled,
      theme: engine.sanitizeTheme(source.theme),
      background: normalizeBackground(source.background),
      generator: normalizeGenerator(source.generator),
      features: normalizeFeatures(source.features),
      fontFamily: typeof source.fontFamily === "string" ? source.fontFamily : defaults.fontFamily,
      fontSource: validSources.includes(source.fontSource) ? source.fontSource : defaults.fontSource,
      customFont: normalizeCustomFont(source.customFont),
      googleFont: normalizeGoogleFont(source.googleFont),
      useSidePanel: typeof source.useSidePanel === "boolean" ? source.useSidePanel : false,
      appTheme: ["system", "light", "dark"].includes(source.appTheme) ? source.appTheme : "system"
    };
  }

  function loadSettings() {
    return new Promise(function (resolve) {
      chrome.storage.local.get([STORAGE_KEY], function (result) {
        resolve(normalizeSettings(result[STORAGE_KEY]));
      });
    });
  }

  function saveSettings(settings) {
    const normalized = normalizeSettings(settings);
    return new Promise(function (resolve) {
      chrome.storage.local.set({ [STORAGE_KEY]: normalized }, function () {
        resolve(normalized);
      });
    });
  }

  function updateSettings(mutator) {
    return loadSettings().then(function (current) {
      const next = typeof mutator === "function" ? mutator(current) || current : current;
      return saveSettings(next);
    });
  }

  global.KarotterThemeStorage = {
    STORAGE_KEY: STORAGE_KEY,
    getDefaultSettings: getDefaultSettings,
    normalizeSettings: normalizeSettings,
    normalizeBackground: normalizeBackground,
    normalizeGenerator: normalizeGenerator,
    normalizeFeatures: normalizeFeatures,
    normalizeCustomFont: normalizeCustomFont,
    normalizeGoogleFont: normalizeGoogleFont,
    loadSettings: loadSettings,
    saveSettings: saveSettings,
    updateSettings: updateSettings
  };
})(typeof window !== "undefined" ? window : self);
