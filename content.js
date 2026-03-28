(function () {
  const engine = window.KarotterThemeEngine;
  const storage = window.KarotterThemeStorage;
  const STYLE_ID = "karotter-custom-theme-style";
  const FEATURE_STYLE_ID = "karotter-feature-enhancements";
  const COLLAPSE_SVG = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="5" stroke-linecap="round" stroke-linejoin="round" style="transition: transform 0.2s; stroke: var(--neutral-500) !important;"><polyline points="18 15 12 9 6 15"></polyline></svg>`;
  let collapseInterval = null;
  let spoilerInterval = null;
  let autoExpandInterval = null;
  let imageDownloadInterval = null;
  const DOWNLOAD_SVG = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>`;

  function ensureStyleElement() {
    let style = document.getElementById(STYLE_ID);
    if (!style) {
      style = document.createElement("style");
      style.id = STYLE_ID;
      (document.documentElement || document.head || document.body).appendChild(style);
    }
    return style;
  }

  function clearTheme() {
    const style = document.getElementById(STYLE_ID);
    if (style) {
      style.remove();
    }
  }

  function applyFeatures(features) {
    let style = document.getElementById(FEATURE_STYLE_ID);
    if (!style) {
      style = document.createElement("style");
      style.id = FEATURE_STYLE_ID;
      (document.documentElement || document.head || document.body).appendChild(style);
    }

    let css = "";
    if (features.hideReactions) {
      css += "div.mt-3.flex.flex-wrap.items-center.gap-2 { display: none !important; }\n";
    }
    if (features.hideViewCount) {
      css += "button[title='表示回数'], .view-count, [aria-label*='views'] { display: none !important; }\n";
    }
    if (features.hideVerificationMark) {
      css += "span[title='公式マーク'] { display: none !important; }\n";
    }
    if (features.hideSpoilers) {
      css += ".karotter-spoiler { background-color: #222 !important; color: #222 !important; cursor: pointer; transition: all 0.2s; border-radius: 3px; padding: 0 4px; margin: 0 1px; display: inline; border: 1px solid rgba(255,255,255,0.1); }\n";
      css += ".karotter-spoiler:hover { color: inherit !important; background-color: rgba(128,128,128,0.1) !important; }\n";
    }

    if (features.collapseSidebarSections) {
      css += ".karotter-sidebar-content { transition: max-height 0.3s ease-in-out, opacity 0.3s ease-in-out, margin-top 0.3s ease-in-out, margin-bottom 0.3s ease-in-out; overflow: hidden; max-height: 2000px; opacity: 1; }\n";
      css += ".karotter-sidebar-collapsed { max-height: 0 !important; opacity: 0 !important; margin-top: 0 !important; margin-bottom: 0 !important; pointer-events: none !important; }\n";
    }
    
    style.textContent = css;

    setupSidebarCollapse(features.collapseSidebarSections, features.collapseSidebarInitially);
    setupSpoilerProtection(features.hideSpoilers, features.spoilerKeywords);
    setupAutoExpandMore(features.autoExpandMore);
    setupImageDownload(features.imageDownload);
  }

  function setupImageDownload(enabled) {
    if (imageDownloadInterval) {
      clearInterval(imageDownloadInterval);
      imageDownloadInterval = null;
    }

    if (!enabled) {
      document.querySelectorAll('.karotter-img-download-btn').forEach(btn => btn.remove());
      return;
    }

    imageDownloadInterval = setInterval(() => {
      // Target images that are likely post images
      const imgs = document.querySelectorAll('img[src*="/uploads/posts/"]');
      
      imgs.forEach(img => {
        // Find a suitable container (the immediate parent or common wrapper)
        const container = img.parentElement;
        if (!container || container.querySelector('.karotter-img-download-btn')) return;

        // Ensure container can hold absolute positioned children
        const style = window.getComputedStyle(container);
        if (style.position === 'static') {
          container.style.position = 'relative';
        }

        const btn = document.createElement('button');
        btn.className = 'karotter-img-download-btn';
        btn.innerHTML = DOWNLOAD_SVG;
        btn.style.cssText = 'position: absolute; right: 8px; bottom: 8px; cursor: pointer; padding: 8px; border-radius: 10px; background: rgba(0,0,0,0.6); border: 1px solid rgba(255,255,255,0.2); backdrop-filter: blur(4px); display: flex; align-items: center; justify-content: center; transition: all 0.2s ease; box-shadow: 0 4px 12px rgba(0,0,0,0.3);';
        
        btn.title = '画像をダウンロード';
        btn.onmouseover = () => { 
          btn.style.transform = 'scale(1.1)'; 
          btn.style.background = 'rgba(0,0,0,0.8)';
          btn.style.borderColor = 'rgba(255,255,255,0.4)';
        };
        btn.onmouseout = () => { 
          btn.style.transform = 'scale(1)'; 
          btn.style.background = 'rgba(0,0,0,0.6)';
          btn.style.borderColor = 'rgba(255,255,255,0.2)';
        };

        btn.onclick = (e) => {
          e.preventDefault();
          e.stopPropagation();
          
          btn.style.opacity = '0.5';
          btn.style.pointerEvents = 'none';

          const filename = img.src.split('/').pop().split('?')[0] || 'karotter_image.png';
          
          chrome.runtime.sendMessage({
            action: "download_image",
            url: img.src,
            filename: `karotter_${filename}`
          }, (response) => {
            btn.style.opacity = '1';
            btn.style.pointerEvents = 'auto';
            
            if (response && !response.success) {
              console.error('Download message failed:', response.error);
              // Final fallback: open in new tab if even background download fails
              window.open(img.src, '_blank');
            }
          });
        };

        container.appendChild(btn);
      });
    }, 100);
  }

  function setupAutoExpandMore(enabled) {
    if (autoExpandInterval) {
      clearInterval(autoExpandInterval);
      autoExpandInterval = null;
    }

    if (!enabled) return;

    autoExpandInterval = setInterval(() => {
      // Find all buttons that contain the text "もっと見る" and haven't been marked yet
      const buttons = document.querySelectorAll('button:not([data-karotter-auto-expanded])');
      buttons.forEach(btn => {
        // Only click if text matches AND there's no SVG child (to avoid clicking media controls, etc.)
        if (btn.textContent.trim() === "もっと見る" && !btn.querySelector('svg')) {
          btn.setAttribute('data-karotter-auto-expanded', 'true');
          btn.click();
        }
      });
    }, 100);
  }

  function setupSpoilerProtection(enabled, keywordsStr) {
    if (spoilerInterval) {
      clearInterval(spoilerInterval);
      spoilerInterval = null;
    }

    // Always restore existing spoilers to start fresh
    const existingSpoilers = document.querySelectorAll('.karotter-spoiler');
    existingSpoilers.forEach(span => {
      const parent = span.parentNode;
      span.replaceWith(document.createTextNode(span.textContent));
      if (parent) parent.normalize(); // Merge adjacent text nodes
    });
    
    // Reset scanned status
    document.querySelectorAll('p[data-karotter-spoiler-scanned]').forEach(p => {
      p.removeAttribute('data-karotter-spoiler-scanned');
    });

    if (!enabled || !keywordsStr.trim()) return;

    const keywords = keywordsStr.split(',').map(k => k.trim()).filter(Boolean);
    if (keywords.length === 0) return;

    const regex = new RegExp(`(${keywords.map(k => k.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|')})`, 'gi');

    spoilerInterval = setInterval(() => {
      // Find <p> tags that haven't been fully processed
      const ps = document.querySelectorAll('p:not([data-karotter-spoiler-scanned])');
      
      ps.forEach(p => {
        // Tag as scanned immediately to avoid re-evaluating
        p.setAttribute('data-karotter-spoiler-scanned', 'true');

        // Simple approach: search in text nodes only
        const walker = document.createTreeWalker(p, NodeFilter.SHOW_TEXT, null, false);
        let textNode;
        const nodesToReplace = [];
        
        while (textNode = walker.nextNode()) {
          if (regex.test(textNode.nodeValue)) {
            nodesToReplace.push(textNode);
          }
        }

        nodesToReplace.forEach(node => {
          const content = node.nodeValue;
          const fragments = document.createDocumentFragment();
          let lastIndex = 0;
          
          content.replace(regex, (match, p1, offset) => {
            // Text before match
            fragments.appendChild(document.createTextNode(content.substring(lastIndex, offset)));
            
            // The match itself, wrapped
            const span = document.createElement('span');
            span.className = 'karotter-spoiler';
            span.textContent = match;
            fragments.appendChild(span);
            
            lastIndex = offset + match.length;
          });
          
          // Text after last match
          fragments.appendChild(document.createTextNode(content.substring(lastIndex)));
          
          // Replace original node
          node.parentNode.replaceChild(fragments, node);
        });
      });
    }, 100);
  }

  function setupSidebarCollapse(enabled, initiallyCollapsed) {
    if (collapseInterval) {
      clearInterval(collapseInterval);
      collapseInterval = null;
    }

    if (!enabled) {
      document.querySelectorAll('.karotter-collapse-btn').forEach(btn => btn.remove());
      return;
    }

    collapseInterval = setInterval(() => {
      const headers = document.querySelectorAll('div.border-b.border-gray-200.px-5.py-4');
      headers.forEach(header => {
        if (header.querySelector('.karotter-collapse-btn')) return;

        const section = header.closest('section');
        if (!section) return;

        const btn = document.createElement('button');
        btn.className = 'karotter-collapse-btn';
        btn.innerHTML = COLLAPSE_SVG;
        btn.style.cssText = 'position: absolute; right: 12px; top: 12px; cursor: pointer; padding: 4px; border-radius: 6px; color: inherit; opacity: 0.5; transition: .2s; border: none; background: transparent; display: flex; align-items: center; justify-content: center; z-index: 10;';
        
        btn.onmouseover = () => { btn.style.opacity = '1'; btn.style.backgroundColor = 'rgba(128,128,128,0.1)'; };
        btn.onmouseout = () => { btn.style.opacity = '0.5'; btn.style.backgroundColor = 'transparent'; };

        header.style.position = 'relative';
        header.appendChild(btn);

        const content = section.children[1];
        if (content) {
          content.classList.add('karotter-sidebar-content');
          if (initiallyCollapsed) {
            // Apply collapsed state without animation initially if needed,
            // but for simplicity we just toggle the class.
            content.classList.add('karotter-sidebar-collapsed');
            btn.querySelector('svg').style.transform = 'rotate(180deg)';
          }
        }

        btn.onclick = (e) => {
          e.preventDefault();
          e.stopPropagation();
          if (content) {
            const isCollapsed = content.classList.toggle('karotter-sidebar-collapsed');
            btn.querySelector('svg').style.transform = isCollapsed ? 'rotate(180deg)' : 'rotate(0deg)';
          }
        };
      });
    }, 100);
  }

  function applySettings(settings) {
    if (!settings.enabled) {
      clearTheme();
      return;
    }

    const style = ensureStyleElement();
    style.textContent = engine.buildAppliedCss(settings);

    applyFeatures(settings.features || {});
  }

  storage.loadSettings().then(applySettings);

  chrome.storage.onChanged.addListener(function (changes, areaName) {
    if (areaName !== "local" || !changes[storage.STORAGE_KEY]) {
      return;
    }
    applySettings(storage.normalizeSettings(changes[storage.STORAGE_KEY].newValue));
  });
}());
