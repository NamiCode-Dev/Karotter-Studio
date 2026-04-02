(function (global) {
  const defaultTheme = {
    "app-bg": "#eef3f8",
    "surface-card": "#ffffff",
    "surface-elevated": "#f8fbff",
    "surface-soft": "#eef4fa",
    "text-primary": "#102132",
    "text-secondary": "#38516a",
    "text-muted": "#667b93",
    "border-soft": "rgba(152, 168, 187, .28)",
    "accent": "#1d9bf0",
    "accent-soft": "rgba(29, 155, 240, .14)",
    "link-accent": "#147fd0",
    "link-accent-hover": "#0f70b8",
    "surface-shadow": "0 18px 38px rgba(16, 33, 50, .08)",
    "neutral-50": "#f7fafc",
    "neutral-100": "#eff4f8",
    "neutral-200": "#dce6ef",
    "neutral-300": "#c6d5e4",
    "neutral-400": "#9cb0c3",
    "neutral-500": "#70869d",
    "neutral-600": "#566e86",
    "neutral-700": "#415a74",
    "neutral-800": "#2f475f",
    "neutral-900": "#142535",
    "neutral-950": "#0b1824"
  };

  const editableSections = [
    {
      title: "Base Surfaces",
      keys: ["app-bg", "surface-card", "surface-elevated", "surface-soft", "surface-shadow", "border-soft"]
    },
    {
      title: "Typography",
      keys: ["text-primary", "text-secondary", "text-muted"]
    },
    {
      title: "Accent & Links",
      keys: ["accent", "accent-soft", "link-accent", "link-accent-hover"]
    },
    {
      title: "Neutral Palette",
      keys: [
        "neutral-50",
        "neutral-100",
        "neutral-200",
        "neutral-300",
        "neutral-400",
        "neutral-500",
        "neutral-600",
        "neutral-700",
        "neutral-800",
        "neutral-900",
        "neutral-950"
      ]
    }
  ];

  const showPaletteKeys = [
    "app-bg",
    "surface-card",
    "surface-elevated",
    "surface-soft",
    "accent",
    "link-accent",
    "neutral-100",
    "neutral-300",
    "neutral-500",
    "neutral-700",
    "neutral-900",
    "neutral-950"
  ];

  const colorLikeKeys = [
    "app-bg",
    "surface-card",
    "surface-elevated",
    "surface-soft",
    "text-primary",
    "text-secondary",
    "text-muted",
    "accent",
    "link-accent",
    "link-accent-hover",
    "neutral-50",
    "neutral-100",
    "neutral-200",
    "neutral-300",
    "neutral-400",
    "neutral-500",
    "neutral-600",
    "neutral-700",
    "neutral-800",
    "neutral-900",
    "neutral-950"
  ];

  const generatorModes = ["light", "soft", "dim", "dark"];
  const opaqueColorKeys = {
    "text-primary": true,
    "text-secondary": true,
    "text-muted": true,
    "link-accent": true,
    "link-accent-hover": true
  };

  const translucentAlphaByKey = {
    "app-bg": 0.42,
    "surface-card": 0.74,
    "surface-elevated": 0.68,
    "surface-soft": 0.58,
    "border-soft": 0.24,
    "accent": 0.78,
    "accent-soft": 0.18,
    "surface-shadow": 0.16
  };
  
  const fontMap = {
    "mushin": {
      name: "無心",
      file: "mushin.otf",
      format: "opentype"
    },
    "timemachine-wa": {
      name: "タイム",
      file: "timemachine-wa.ttf",
      format: "truetype"
    }
  };

  function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
  }

  function isHexColor(value) {
    return /^#([0-9a-f]{3}|[0-9a-f]{6})$/i.test(String(value).trim());
  }

  function normalizeHex(hex) {
    let value = String(hex).trim();
    if (!value.startsWith("#")) {
      value = "#" + value;
    }
    if (/^#([0-9a-f]{3})$/i.test(value)) {
      value = "#" + value.slice(1).split("").map((char) => char + char).join("");
    }
    return value.toLowerCase();
  }

  function hexToRgb(hex) {
    const parsed = parseInt(normalizeHex(hex).replace("#", ""), 16);
    return {
      r: (parsed >> 16) & 255,
      g: (parsed >> 8) & 255,
      b: parsed & 255
    };
  }

  function rgbToHex(r, g, b) {
    return "#" + [r, g, b].map((value) => clamp(Math.round(value), 0, 255).toString(16).padStart(2, "0")).join("");
  }

  function rgbToHsl(r, g, b) {
    let nr = r / 255;
    let ng = g / 255;
    let nb = b / 255;
    const max = Math.max(nr, ng, nb);
    const min = Math.min(nr, ng, nb);
    const lightness = (max + min) / 2;
    let hue = 0;
    let saturation = 0;

    if (max !== min) {
      const delta = max - min;
      saturation = lightness > 0.5 ? delta / (2 - max - min) : delta / (max + min);
      switch (max) {
        case nr:
          hue = (ng - nb) / delta + (ng < nb ? 6 : 0);
          break;
        case ng:
          hue = (nb - nr) / delta + 2;
          break;
        default:
          hue = (nr - ng) / delta + 4;
          break;
      }
      hue /= 6;
    }

    return {
      h: hue * 360,
      s: saturation * 100,
      l: lightness * 100
    };
  }

  function hslToRgb(h, s, l) {
    const hue = h / 360;
    const saturation = s / 100;
    const lightness = l / 100;

    if (saturation === 0) {
      const gray = lightness * 255;
      return { r: gray, g: gray, b: gray };
    }

    function hue2rgb(p, q, t) {
      let shifted = t;
      if (shifted < 0) {
        shifted += 1;
      }
      if (shifted > 1) {
        shifted -= 1;
      }
      if (shifted < 1 / 6) {
        return p + (q - p) * 6 * shifted;
      }
      if (shifted < 1 / 2) {
        return q;
      }
      if (shifted < 2 / 3) {
        return p + (q - p) * (2 / 3 - shifted) * 6;
      }
      return p;
    }

    const q = lightness < 0.5 ? lightness * (1 + saturation) : lightness + saturation - lightness * saturation;
    const p = 2 * lightness - q;

    return {
      r: hue2rgb(p, q, hue + 1 / 3) * 255,
      g: hue2rgb(p, q, hue) * 255,
      b: hue2rgb(p, q, hue - 1 / 3) * 255
    };
  }

  function hslToHex(h, s, l) {
    const rgb = hslToRgb(h, s, l);
    return rgbToHex(rgb.r, rgb.g, rgb.b);
  }

  function relativeLuminance(hex) {
    const rgb = hexToRgb(hex);
    const normalize = function (value) {
      const channel = value / 255;
      return channel <= 0.03928 ? channel / 12.92 : Math.pow((channel + 0.055) / 1.055, 2.4);
    };
    return 0.2126 * normalize(rgb.r) + 0.7152 * normalize(rgb.g) + 0.0722 * normalize(rgb.b);
  }

  function contrastRatio(a, b) {
    const first = relativeLuminance(a);
    const second = relativeLuminance(b);
    return (Math.max(first, second) + 0.05) / (Math.min(first, second) + 0.05);
  }

  function themeFromSeed(seedHex, mode, saturationShift, lightnessShift) {
    const normalizedMode = generatorModes.includes(mode) ? mode : "light";
    const seed = isHexColor(seedHex) ? normalizeHex(seedHex) : "#1d9bf0";
    const shifts = {
      saturation: clamp(Number(saturationShift) || 0, -40, 40),
      lightness: clamp(Number(lightnessShift) || 0, -30, 30)
    };

    const rgb = hexToRgb(seed);
    const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
    const adjustedSaturation = clamp(hsl.s + shifts.saturation, 10, 95);
    const adjustedLightness = clamp(hsl.l + shifts.lightness, 20, 82);

    const profiles = {
      dark: {
        bgL: 10,
        cardL: 16,
        elevL: 14,
        softL: 21,
        text1L: 96,
        text2L: 87,
        text3L: 76,
        neutralStart: 15,
        neutralEnd: 84,
        neutralSFactor: 0.35,
        surfaceSFactor: 0.45,
        textSFactor: 0.18
      },
      dim: {
        bgL: 16,
        cardL: 22,
        elevL: 20,
        softL: 28,
        text1L: 97,
        text2L: 89,
        text3L: 78,
        neutralStart: 19,
        neutralEnd: 86,
        neutralSFactor: 0.28,
        surfaceSFactor: 0.35,
        textSFactor: 0.14
      },
      light: {
        bgL: 96,
        cardL: 99,
        elevL: 97,
        softL: 92,
        text1L: 12,
        text2L: 24,
        text3L: 38,
        neutralStart: 94,
        neutralEnd: 20,
        neutralSFactor: 0.18,
        surfaceSFactor: 0.2,
        textSFactor: 0.26
      },
      soft: {
        bgL: 92,
        cardL: 96,
        elevL: 94,
        softL: 88,
        text1L: 15,
        text2L: 28,
        text3L: 42,
        neutralStart: 90,
        neutralEnd: 22,
        neutralSFactor: 0.35,
        surfaceSFactor: 0.4,
        textSFactor: 0.22
      }
    };

    const profile = profiles[normalizedMode];
    const neutralSaturation = clamp(adjustedSaturation * profile.neutralSFactor, 4, 32);
    const surfaceSaturation = clamp(adjustedSaturation * profile.surfaceSFactor, 6, 42);
    const textSaturation = clamp(adjustedSaturation * profile.textSFactor, 2, 24);
    const accent = hslToHex(hsl.h, clamp(adjustedSaturation, 38, 95), adjustedLightness);
    const linkAccent = hslToHex(
      hsl.h,
      clamp(adjustedSaturation + 5, 40, 98),
      clamp(adjustedLightness + (normalizedMode === "light" || normalizedMode === "soft" ? -8 : 10), 35, 82)
    );
    const linkAccentHover = hslToHex(
      hsl.h,
      clamp(adjustedSaturation, 36, 95),
      clamp(adjustedLightness + (normalizedMode === "light" || normalizedMode === "soft" ? -14 : 18), 28, 90)
    );
    const borderAlpha = (normalizedMode === "light" || normalizedMode === "soft") ? 0.1 : 0.3;
    const accentAlpha = (normalizedMode === "light" || normalizedMode === "soft") ? 0.08 : 0.18;
    const surfaceShadow = (normalizedMode === "light" || normalizedMode === "soft")
      ? "0 18px 38px rgba(16, 33, 50, .08)"
      : "0 24px 55px rgba(0, 0, 0, .35)";

    const neutralSteps = (normalizedMode === "light" || normalizedMode === "soft")
      ? [96, 92, 88, 80, 68, 56, 44, 32, 22, 14, 8]
      : [16, 22, 30, 40, 52, 62, 72, 82, 26, 18, 12];

    return {
      "app-bg": hslToHex(
        hsl.h,
        surfaceSaturation,
        clamp(profile.bgL + (normalizedMode === "light" || normalizedMode === "soft" ? shifts.lightness * 0.4 : shifts.lightness * 0.15), 4, 99)
      ),
      "surface-card": hslToHex(
        hsl.h,
        surfaceSaturation,
        clamp(profile.cardL + (normalizedMode === "light" || normalizedMode === "soft" ? shifts.lightness * 0.25 : shifts.lightness * 0.18), 6, 99)
      ),
      "surface-elevated": hslToHex(
        hsl.h,
        surfaceSaturation,
        clamp(profile.elevL + (normalizedMode === "light" || normalizedMode === "soft" ? shifts.lightness * 0.2 : shifts.lightness * 0.16), 6, 99)
      ),
      "surface-soft": hslToHex(
        hsl.h,
        clamp(surfaceSaturation + (normalizedMode === "light" || normalizedMode === "soft" ? 2 : 4), 6, 40),
        clamp(profile.softL + (normalizedMode === "light" || normalizedMode === "soft" ? shifts.lightness * 0.2 : shifts.lightness * 0.18), 8, 96)
      ),
      "text-primary": hslToHex(hsl.h, textSaturation, profile.text1L),
      "text-secondary": hslToHex(hsl.h, textSaturation, profile.text2L),
      "text-muted": hslToHex(hsl.h, textSaturation, profile.text3L),
      "border-soft": "hsla(" + Math.round(hsl.h) + "," + Math.round(clamp(neutralSaturation + 4, 4, 30)) + "%," +
        (normalizedMode === "light" || normalizedMode === "soft" ? 38 : 72) + "%," + borderAlpha + ")",
      "accent": accent,
      "accent-soft": "hsla(" + Math.round(hsl.h) + "," + Math.round(clamp(adjustedSaturation, 38, 95)) + "%," +
        Math.round(adjustedLightness) + "%," + accentAlpha + ")",
      "link-accent": linkAccent,
      "link-accent-hover": linkAccentHover,
      "surface-shadow": surfaceShadow,
      "neutral-50": hslToHex(hsl.h, neutralSaturation, neutralSteps[0]),
      "neutral-100": hslToHex(hsl.h, neutralSaturation, neutralSteps[1]),
      "neutral-200": hslToHex(hsl.h, neutralSaturation, neutralSteps[2]),
      "neutral-300": hslToHex(hsl.h, neutralSaturation, neutralSteps[3]),
      "neutral-400": hslToHex(hsl.h, neutralSaturation, neutralSteps[4]),
      "neutral-500": hslToHex(hsl.h, neutralSaturation, neutralSteps[5]),
      "neutral-600": hslToHex(hsl.h, neutralSaturation, neutralSteps[6]),
      "neutral-700": hslToHex(hsl.h, neutralSaturation, neutralSteps[7]),
      "neutral-800": hslToHex(hsl.h, neutralSaturation, neutralSteps[8]),
      "neutral-900": hslToHex(hsl.h, neutralSaturation, neutralSteps[9]),
      "neutral-950": hslToHex(hsl.h, neutralSaturation, neutralSteps[10])
    };
  }

  function autoFixTextContrast(theme) {
    const nextTheme = sanitizeTheme(theme);
    const background = nextTheme["surface-card"];
    const isLightSurface = relativeLuminance(nextTheme["app-bg"]) > 0.5;
    const backgroundHsl = rgbToHsl.apply(null, Object.values(hexToRgb(background)));

    if (!isLightSurface) {
      if (contrastRatio(nextTheme["text-primary"], background) < 7) {
        nextTheme["text-primary"] = hslToHex(backgroundHsl.h, 8, 97);
      }
      if (contrastRatio(nextTheme["text-secondary"], background) < 4.5) {
        nextTheme["text-secondary"] = hslToHex(backgroundHsl.h, 8, 88);
      }
      if (contrastRatio(nextTheme["text-muted"], background) < 3.2) {
        nextTheme["text-muted"] = hslToHex(backgroundHsl.h, 8, 77);
      }
    } else {
      if (contrastRatio(nextTheme["text-primary"], background) < 7) {
        nextTheme["text-primary"] = hslToHex(backgroundHsl.h, 14, 12);
      }
      if (contrastRatio(nextTheme["text-secondary"], background) < 4.5) {
        nextTheme["text-secondary"] = hslToHex(backgroundHsl.h, 12, 24);
      }
      if (contrastRatio(nextTheme["text-muted"], background) < 3.2) {
        nextTheme["text-muted"] = hslToHex(backgroundHsl.h, 10, 38);
      }
    }

    return nextTheme;
  }

  function sanitizeTheme(theme) {
    const nextTheme = Object.assign({}, defaultTheme);
    const input = theme && typeof theme === "object" ? theme : {};

    Object.keys(defaultTheme).forEach(function (key) {
      if (typeof input[key] === "string" && input[key].trim()) {
        nextTheme[key] = input[key].trim();
      }
    });

    return nextTheme;
  }

  function buildCssOutput(theme, selector) {
    const cssSelector = selector || ":root";
    const mergedTheme = sanitizeTheme(theme);
    const lines = Object.keys(mergedTheme).map(function (key) {
      return "  --" + key + ": " + mergedTheme[key] + " !important;";
    });
    return cssSelector + " {\n" + lines.join("\n") + "\n}";
  }

  function applyAlphaToColor(color, alpha) {
    const value = String(color).trim();

    if (/^#([0-9a-f]{3}|[0-9a-f]{6})$/i.test(value)) {
      const rgb = hexToRgb(value);
      return "rgba(" + rgb.r + ", " + rgb.g + ", " + rgb.b + ", " + alpha + ")";
    }

    const rgbaMatch = value.match(/^rgba?\(([^)]+)\)$/i);
    if (rgbaMatch) {
      const parts = rgbaMatch[1].split(",").map(function (part) {
        return part.trim();
      });

      if (parts.length >= 3) {
        const existingAlpha = parts.length >= 4 ? parseFloat(parts[3]) : 1;
        const nextAlpha = Number.isFinite(existingAlpha) ? Math.min(existingAlpha, alpha) : alpha;
        return "rgba(" + parts[0] + ", " + parts[1] + ", " + parts[2] + ", " + nextAlpha + ")";
      }
    }

    const hslaMatch = value.match(/^hsla?\(([^)]+)\)$/i);
    if (hslaMatch) {
      const parts = hslaMatch[1].split(",").map(function (part) {
        return part.trim();
      });

      if (parts.length >= 3) {
        const existingAlpha = parts.length >= 4 ? parseFloat(parts[3]) : 1;
        const nextAlpha = Number.isFinite(existingAlpha) ? Math.min(existingAlpha, alpha) : alpha;
        return "hsla(" + parts[0] + ", " + parts[1] + ", " + parts[2] + ", " + nextAlpha + ")";
      }
    }

    return value;
  }

  function applyAlphaToString(value, alpha) {
    return String(value).replace(/rgba?\([^)]+\)|hsla?\([^)]+\)|#[0-9a-f]{3,6}\b/gi, function (match) {
      return applyAlphaToColor(match, alpha);
    });
  }

  function buildBackgroundTheme(theme, background) {
    const mergedTheme = sanitizeTheme(theme);
    const isBackgroundEnabled = Boolean(background && background.enabled && background.imageDataUrl);

    if (!isBackgroundEnabled) {
      return mergedTheme;
    }

    const surfaceOpacityFactor = clamp(Number(background.surfaceOpacity) || 100, 0, 100) / 100;
    const nextTheme = Object.assign({}, mergedTheme);

    Object.keys(nextTheme).forEach(function (key) {
      if (opaqueColorKeys[key]) {
        return;
      }

      const alpha = Object.prototype.hasOwnProperty.call(translucentAlphaByKey, key)
        ? translucentAlphaByKey[key]
        : 0.72;

      nextTheme[key] = applyAlphaToString(nextTheme[key], alpha * surfaceOpacityFactor);
    });

    return nextTheme;
  }

  function buildUtilityOverrideCss() {
    return [
      "html, body, #root { font-family: var(--app-font, inherit) !important; }",
      ".bg-blue-50{background-color:var(--accent-soft)!important;}",
      ".bg-blue-600{background-color:var(--accent)!important;border-color:var(--accent)!important;}",
      ".border-blue-600{--tw-border-opacity:1!important;border-color:var(--accent)!important;}",
      ".hover\\:bg-blue-700:hover{background-color:var(--link-accent-hover)!important;border-color:var(--link-accent-hover)!important;}",
      ".disabled\\:bg-blue-300:disabled{background-color:color-mix(in srgb,var(--accent) 38%,#ffffff 62%)!important;}",
      ".focus\\:border-blue-500:focus{border-color:var(--accent)!important;}",
      ".focus\\:ring-blue-500:focus{--tw-ring-color: var(--accent-soft)!important;}",
      ".bg-white\\/80{background-color:var(--surface-card)!important;backdrop-filter:blur(8px)!important;}",
      "select, option, optgroup { background-color: var(--surface-card) !important; color: var(--text-primary) !important; border-color: var(--border-soft) !important; }",
      "div.min-h-screen.px-3.py-4.md\\:px-5.md\\:py-6 { background: var(--app-bg) !important; color: var(--text-primary) !important; --board-panel: var(--surface-card) !important; --board-panel-soft: var(--surface-soft) !important; --board-border: var(--border-soft) !important; --board-highlight: var(--accent) !important; --board-highlight-text: var(--app-bg) !important; --board-muted: var(--text-muted) !important; }"
    ].join("\n");
  }

  function buildFontFaceCss() {
    return Object.keys(fontMap).map(function (key) {
      const font = fontMap[key];
      const url = typeof chrome !== 'undefined' && chrome.runtime && chrome.runtime.getURL
        ? chrome.runtime.getURL("font/" + font.file)
        : "font/" + font.file;
      return [
        "@font-face {",
        "  font-family: '" + key + "';",
        "  src: url('" + url + "') format('" + font.format + "');",
        "  font-weight: normal;",
        "  font-style: normal;",
        "  font-display: swap;",
        "}"
      ].join("\n");
    }).join("\n");
  }

  function buildBackgroundImageCss(background) {
    if (!background || !background.enabled || !background.imageDataUrl) {
      return "";
    }

    const imageOpacity = clamp(Number(background.imageOpacity) || 100, 0, 100) / 100;
    const safeUrl = background.imageDataUrl
      .replace(/\\/g, "\\\\")
      .replace(/"/g, "\\\"")
      .replace(/\r?\n/g, "");

    return [
      "html, body { background: transparent !important; }",
      "body {",
      "  position: relative !important;",
      "  isolation: isolate !important;",
      "  background: transparent !important;",
      "}",
      "body::before, body::after {",
      "  content: \"\" !important;",
      "  position: fixed !important;",
      "  inset: 0 !important;",
      "  pointer-events: none !important;",
      "}",
      "body::before {",
      "  z-index: -2 !important;",
      "  opacity: " + imageOpacity + " !important;",
      "  background: url(\"" + safeUrl + "\") center center / cover no-repeat fixed !important;",
      "}",
      "body::after {",
      "  z-index: -1 !important;",
      "  background: linear-gradient(var(--app-bg), var(--app-bg)) center center / cover no-repeat fixed !important;",
      "}",
      "#root { position: relative !important; z-index: 0 !important; }",
      ".bg-white, .bg-gray-50, .bg-gray-100, .bg-gray-200, .bg-gray-300 { backdrop-filter: blur(8px); }"
    ].join("\n");
  }

  function buildCustomFontFaceCss(customFont) {
    if (!customFont || !customFont.dataUrl || !customFont.name) {
      return "";
    }
    return [
      "@font-face {",
      "  font-family: 'karotter-custom-font';",
      "  src: url('" + customFont.dataUrl + "') format('" + (customFont.format || 'truetype') + "');",
      "  font-weight: normal;",
      "  font-style: normal;",
      "  font-display: swap;",
      "}"
    ].join("\n");
  }

  function buildGoogleFontImportCss(googleFont) {
    if (!googleFont || !googleFont.family) {
      return "";
    }
    const encodedFamily = encodeURIComponent(googleFont.family);
    return "@import url('https://fonts.googleapis.com/css2?family=" + encodedFamily + "&display=swap');";
  }

  function buildAppliedCss(settings) {
    const source = settings && typeof settings === "object" ? settings : {};
    const features = source.features || {};
    const background = source.background && typeof source.background === "object" ? source.background : null;
    const fontFamily = source.fontFamily || "system";
    const fontSource = source.fontSource || "system";
    const customFont = source.customFont || {};
    const googleFont = source.googleFont || {};
    const appliedTheme = buildBackgroundTheme(source.theme, background);

    const parts = [];

    // Google Fonts import must come first (CSS @import rule)
    if (fontSource === "google" && googleFont.family) {
      parts.push(buildGoogleFontImportCss(googleFont));
    }

    // Bundled font faces
    parts.push(buildFontFaceCss());

    // Custom font face
    if (fontSource === "custom" && customFont.dataUrl) {
      parts.push(buildCustomFontFaceCss(customFont));
    }

    let rootVars = buildCssOutput(appliedTheme, ":root");

    // Determine the font-family value based on fontSource
    let fontFamilyValue = "inherit";
    if (fontSource === "system") {
      if (fontFamily !== "system" && fontMap[fontFamily]) {
        fontFamilyValue = "'" + fontFamily + "', sans-serif";
      } else {
        fontFamilyValue = "inherit";
      }
    } else if (fontSource === "custom" && customFont.dataUrl && customFont.name) {
      fontFamilyValue = "'karotter-custom-font', sans-serif";
    } else if (fontSource === "google" && googleFont.family) {
      const fallback = googleFont.category || "sans-serif";
      fontFamilyValue = "'" + googleFont.family + "', " + fallback;
    }

    rootVars = rootVars.replace("}", "  --app-font: " + fontFamilyValue + " !important;\n}");
    
    if (features.customTheme !== false) {
      parts.push(rootVars);
      parts.push(buildUtilityOverrideCss());
    }
    parts.push(buildBackgroundImageCss(background));

    return parts.filter(Boolean).join("\n");
  }

  function parseCssText(text, baseTheme) {
    const matches = String(text || "").matchAll(/--([a-zA-Z0-9-]+)\s*:\s*([^;!]+?)(?:\s*!important)?\s*;/g);
    const parsed = sanitizeTheme(baseTheme || defaultTheme);
    let found = false;

    for (const match of matches) {
      const key = match[1].trim();
      const value = match[2].trim();
      if (Object.prototype.hasOwnProperty.call(parsed, key)) {
        parsed[key] = value;
        found = true;
      }
    }

    return found ? parsed : null;
  }

  global.KarotterThemeEngine = {
    defaultTheme: defaultTheme,
    editableSections: editableSections,
    showPaletteKeys: showPaletteKeys,
    colorLikeKeys: colorLikeKeys,
    generatorModes: generatorModes,
    clamp: clamp,
    isHexColor: isHexColor,
    normalizeHex: normalizeHex,
    hexToRgb: hexToRgb,
    rgbToHex: rgbToHex,
    rgbToHsl: rgbToHsl,
    hslToRgb: hslToRgb,
    hslToHex: hslToHex,
    relativeLuminance: relativeLuminance,
    contrastRatio: contrastRatio,
    themeFromSeed: themeFromSeed,
    autoFixTextContrast: autoFixTextContrast,
    sanitizeTheme: sanitizeTheme,
    buildBackgroundTheme: buildBackgroundTheme,
    buildCssOutput: buildCssOutput,
    buildUtilityOverrideCss: buildUtilityOverrideCss,
    buildFontFaceCss: buildFontFaceCss,
    buildCustomFontFaceCss: buildCustomFontFaceCss,
    buildGoogleFontImportCss: buildGoogleFontImportCss,
    buildBackgroundImageCss: buildBackgroundImageCss,
    buildAppliedCss: buildAppliedCss,
    fontMap: fontMap,
    parseCssText: parseCssText
  };
})(typeof window !== "undefined" ? window : self);
