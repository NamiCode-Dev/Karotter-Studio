(function () {
  const engine = window.KarotterThemeEngine;
  const storage = window.KarotterThemeStorage;
  const STYLE_ID = "karotter-custom-theme-style";
  const FEATURE_STYLE_ID = "karotter-feature-enhancements";
  const COLLAPSE_SVG = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="5" stroke-linecap="round" stroke-linejoin="round" style="transition: transform 0.2s; stroke: var(--neutral-500) !important;" class="lucide lucide-chevron-down"><path d="m6 9 6 6 6-6"/></svg>`;
  let collapseInterval = null;
  let spoilerInterval = null;
  let autoExpandInterval = null;
  let imageDownloadInterval = null;
  let socialMenuInterval = null;
  let videoEnhanceInterval = null;
  let advancedSearchInterval = null;
  let boardsInterval = null;
  let vbotInterval = null;
  let hideRepliesInterval = null;
  let userProfileLinksInterval = null;
  let glossaryInterval = null;
  let vbotCard = null;
  let vbotAttachedTextarea = null;
  let vbotSelectedIndex = 0;
  let vbotFilteredCommands = [];

  // Icons are from Lucide Icons (ISC License: https://lucide.dev/)
  const DOWNLOAD_SVG = `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-download"><path d="M12 15V3"/><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><path d="m7 10 5 5 5-5"/></svg>`;
  const ADVANCED_SEARCH_SVG = `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-settings-2"><path d="M14 17H5"/><path d="M19 7h-9"/><circle cx="17" cy="17" r="3"/><circle cx="7" cy="7" r="3"/></svg>`;
  const BOARDS_SVG = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-panel-right w-5 h-5"><rect width="18" height="18" x="3" y="3" rx="2"/><path d="M15 3v18"/></svg>`;
  const GLOSSARY_SVG = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-book-open-text w-5 h-5"><path d="M12 7v14"/><path d="M16 12h2"/><path d="M16 8h2"/><path d="M3 18a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h5a4 4 0 0 1 4 4 4 4 0 0 1 4-4h5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-6a3 3 0 0 0-3 3 3 3 0 0 0-3-3z"/><path d="M6 12h2"/><path d="M6 8h2"/></svg>`;

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
    if (features.hideIdentityMark) {
      css += "[title='本人マーク'] { display: none !important; }\n";
    }
    if (features.hideOperatorMark) {
      css += "[title='運営マーク'] { display: none !important; }\n";
    }
    if (features.hideVerifiedMark) {
      css += "[title='認証済みマーク'] { display: none !important; }\n";
    }
    if (features.hideVerifiedGroupMark) {
      css += "[title='認証済み団体マーク'] { display: none !important; }\n";
    }
    if (features.hideSpoilers) {
      css += ".karotter-spoiler { background-color: #222 !important; color: #222 !important; cursor: pointer; transition: all 0.2s; border-radius: 3px; padding: 0 4px; margin: 0 1px; display: inline; border: 1px solid rgba(255,255,255,0.1); }\n";
      css += ".karotter-spoiler:hover { color: inherit !important; background-color: rgba(128,128,128,0.1) !important; }\n";
    }

    if (features.collapseSidebarSections) {
      css += ".karotter-sidebar-content { transition: max-height 0.3s ease-in-out, opacity 0.3s ease-in-out, margin-top 0.3s ease-in-out, margin-bottom 0.3s ease-in-out; overflow: hidden; max-height: 2000px; opacity: 1; }\n";
      css += ".karotter-sidebar-collapsed { max-height: 0 !important; opacity: 0 !important; margin-top: 0 !important; margin-bottom: 0 !important; pointer-events: none !important; }\n";
    }

    if (features.enhanceVideoPlayer) {
      css += `
        .karotter-video-container { 
          position: absolute !important; top: 0; left: 0; right: 0; bottom: 0;
          width: 100% !important; height: 100% !important;
          overflow: hidden !important; border-radius: inherit !important;
          background: #000;
          display: flex !important; justify-content: center !important; align-items: center !important;
          z-index: 1;
        }
        .karotter-video-container video {
          display: block !important;
          max-width: 100% !important; max-height: 100% !important;
          width: auto !important; height: auto !important;
          object-fit: contain !important;
        }
        .karotter-video-container:fullscreen {
          display: flex; align-items: center; justify-content: center;
          border-radius: 0 !important;
        }
        .karotter-video-container:fullscreen video {
          max-width: 100%; max-height: 100%;
          width: auto !important; height: auto !important;
        }
        .karotter-video-ui {
          position: absolute; bottom: 0; left: 0; right: 0; height: 100%;
          display: flex; flex-direction: column; justify-content: flex-end;
          padding: 20px; color: white; pointer-events: none;
        }
        .karotter-video-container.user-inactive { cursor: none !important; }
        .karotter-video-controls-wrapper {
          opacity: 0; transition: opacity 0.3s;
          background: linear-gradient(transparent, rgba(0,0,0,0.4));
          padding: 10px; margin: -10px; border-radius: 0 0 12px 12px;
        }
        .karotter-video-container:hover .karotter-video-controls-wrapper { opacity: 1; }
        .karotter-video-container.user-inactive .karotter-video-controls-wrapper { opacity: 0 !important; }
        .karotter-video-container.is-paused .karotter-video-controls-wrapper { opacity: 0 !important; pointer-events: none !important; }
        .karotter-video-controls {
          display: flex; align-items: center; gap: 10px; pointer-events: auto;
          background: var(--surface-card, rgba(15, 23, 42, 0.6));
          backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px);
          padding: 8px 15px; border-radius: 99px; 
          border: 1px solid var(--border-soft, rgba(255,255,255,0.1));
          box-shadow: var(--surface-shadow, 0 8px 32px rgba(0,0,0,0.3));
          color: var(--text-primary, white);
        }
        .karotter-video-btn {
          cursor: pointer; background: none; border: none; 
          color: inherit; padding: 4px;
          display: flex; align-items: center; justify-content: center; transition: all 0.2s;
          border-radius: 6px;
        }
        .karotter-video-btn:hover { background: var(--accent-soft, rgba(255,255,255,0.1)); color: var(--accent, #1d9bf0); }
        .karotter-video-btn svg { width: 18px; height: 18px; }
        .karotter-video-speed-btn { font-size: 11px; font-weight: bold; padding: 4px 8px; min-width: 40px; }
        .karotter-video-progress-container { flex: 1; position: relative; height: 4px; background: var(--neutral-200, rgba(255,255,255,0.2)); border-radius: 2px; cursor: pointer; }
        .karotter-video-progress-bar { height: 100%; background: var(--accent, #1d9bf0); border-radius: 2px; width: 0; position: relative; }
        .karotter-video-progress-bar::after {
          content: ""; position: absolute; right: -7px; top: -5px; width: 14px; height: 14px;
          background: white; border-radius: 50%; 
          box-shadow: 0 2px 4px rgba(0,0,0,0.4), 0 0 0 2px rgba(255,255,255,0.2);
          opacity: 0.8; transition: all 0.2s;
        }
        .karotter-video-progress-container:hover .karotter-video-progress-bar::after,
        .karotter-video-progress-container.dragging .karotter-video-progress-bar::after { 
          opacity: 1; transform: scale(1.15); 
          box-shadow: 0 4px 10px rgba(0,0,0,0.5), 0 0 0 4px var(--accent-soft, rgba(29, 155, 240, 0.2));
        }
        .karotter-video-time { font-family: monospace; font-size: 11px; min-width: 45px; text-align: center; opacity: 0.9; color: inherit; }
        .karotter-video-center-play {
          position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);
          width: 80px; height: 80px; 
          background: var(--surface-card, rgba(0,0,0,0.4)); 
          backdrop-filter: blur(8px); -webkit-backdrop-filter: blur(8px); 
          border: 2px solid var(--border-soft, rgba(255,255,255,0.2));
          border-radius: 50%; pointer-events: auto; cursor: pointer; display: flex;
          align-items: center; justify-content: center; opacity: 0; transition: all 0.3s;
          color: var(--accent, white);
          box-shadow: var(--surface-shadow, 0 4px 20px rgba(0,0,0,0.3));
        }
        .karotter-video-center-play.visible { opacity: 1; transform: translate(-50%, -50%) scale(1); }
        .karotter-video-center-play:hover { 
          background: var(--surface-elevated, rgba(255,255,255,0.1)); 
          border-color: var(--accent, #1d9bf0); 
          transform: translate(-50%, -50%) scale(1.1); 
        }
        .karotter-video-center-play svg { width: 40px; height: 40px; }
      `;
    }

    if (features.enableAdvancedSearch) {
      css += `
        .karotter-adv-search-btn {
          position: absolute; right: 12px; top: 50%; transform: translateY(-50%);
          color: var(--text-muted); cursor: pointer; padding: 4px; border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          transition: all 0.2s; z-index: 5; background: transparent; border: none;
        }
        .karotter-adv-search-btn:hover { background: var(--surface-hover, rgba(0,0,0,0.1)); color: var(--accent); }
        .karotter-adv-search-modal-overlay {
          position: fixed; inset: 0; background: rgba(0,0,0,0.4); backdrop-filter: blur(4px);
          z-index: 9999; display: flex; align-items: center; justify-content: center;
          animation: advModalFadeIn 0.2s ease-out;
        }
        .karotter-adv-search-modal {
          background: var(--surface-card); box-shadow: var(--surface-shadow);
          border: 1px solid var(--border-soft); border-radius: 16px; width: 600px; max-width: 90vw;
          max-height: 90vh; display: flex; flex-direction: column; overflow: hidden;
        }
        .karotter-adv-search-header {
          padding: 16px 20px; border-bottom: 1px solid var(--border-soft); display: flex;
          align-items: center; justify-content: space-between;
        }
        .karotter-adv-search-header h2 { font-size: 20px; font-weight: 800; margin: 0; color: var(--text-primary); }
        .karotter-adv-search-close { cursor: pointer; background: none; border: none; color: var(--text-primary); border-radius: 50%; width: 34px; height: 34px; display: flex; align-items: center; justify-content: center; transition: background 0.2s; }
        .karotter-adv-search-close:hover { background: var(--surface-hover, rgba(0,0,0,0.1)); }
        .karotter-adv-search-body {
          padding: 24px 20px; overflow-y: auto; display: flex; flex-direction: column; gap: 24px;
        }
        .karotter-adv-search-section .section-title { font-size: 15px; font-weight: 800; color: var(--text-primary); margin: 0 0 12px 0; border-bottom: 1px solid var(--border-soft); padding-bottom: 8px; }
        .karotter-adv-search-field { display: flex; flex-direction: column; gap: 4px; margin-bottom: 16px; }
        .karotter-adv-search-field label { font-size: 13px; color: var(--text-secondary); }
        .karotter-adv-search-field input {
          padding: 12px; border-radius: 4px; border: 1px solid var(--border-soft);
          background: var(--app-bg); color: var(--text-primary); font-size: 15px;
        }
        .karotter-adv-search-field input:focus { outline: none; border-color: var(--accent); }
        .karotter-adv-search-footer {
          padding: 16px 20px; border-top: 1px solid var(--border-soft); display: flex; justify-content: flex-end;
        }
        .karotter-adv-search-submit {
          background: var(--text-primary); color: var(--app-bg); font-weight: 700; font-size: 15px;
          padding: 8px 16px; border-radius: 9999px; border: none; cursor: pointer; transition: background 0.2s;
        }
        .karotter-adv-search-submit:hover { opacity: 0.9; }
        @keyframes advModalFadeIn { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }
      `;
    }

    style.textContent = css;

    setupSidebarCollapse(features.collapseSidebarSections, features.collapseSidebarInitially);
    setupSpoilerProtection(features.hideSpoilers, features.spoilerKeywords);
    setupAutoExpandMore(features.autoExpandMore);
    setupImageDownload(features.imageDownload);
    setupProfileButtonsHider(features.hideQrCode, features.hideProfileUrl);
    setupVideoPlayerEnhancer(features.enhanceVideoPlayer);
    setupAdvancedSearch(features.enableAdvancedSearch);
    setupBoardsLink(features.showBoardsLink);
    setupGlossaryLink(features.showGlossaryLink);
    setupVBotCommands(features.enableVBotCommands);
    setupHideReplies(features.hideReplies);
    setupUserProfileLinks(features.enableUserProfileLinks);
  }

  function setupHideReplies(enabled) {
    if (hideRepliesInterval) {
      clearInterval(hideRepliesInterval);
      hideRepliesInterval = null;
    }

    if (!enabled) {
      document.querySelectorAll('[data-karotter-reply-hidden]').forEach(el => {
        el.style.display = '';
        el.removeAttribute('data-karotter-reply-hidden');
      });
      return;
    }

    hideRepliesInterval = setInterval(() => {
      const isRoot = window.location.pathname === "/";
      if (!isRoot) return;

      const elements = document.querySelectorAll('.truncate');
      elements.forEach(el => {
        if (el.textContent.includes("返信先:")) {
          const postContainer = el.closest('div.flex.gap-2\\.5.sm\\:gap-3.p-3.sm\\:p-4');
          if (postContainer && postContainer.style.display !== 'none') {
            postContainer.style.display = 'none';
            postContainer.setAttribute('data-karotter-reply-hidden', 'true');
          }
        }
      });
    }, 100);
  }

  function setupUserProfileLinks(enabled) {
    if (userProfileLinksInterval) {
      clearInterval(userProfileLinksInterval);
      userProfileLinksInterval = null;
    }

    if (!enabled) return;

    // Use interval to handle both initial load and dynamic updates safely
    userProfileLinksInterval = setInterval(() => {
      // Find articles that haven't been processed yet
      const articles = document.querySelectorAll('article');
      
      articles.forEach(article => {
        // Target the post header using the specific classes
        const header = article.querySelector('div.mb-2.flex.flex-wrap.items-center.gap-2');
        if (!header) return;

        // 1. Identify User ID
        // Find a span that starts with '@' (the user identifier)
        const spans = header.querySelectorAll('span');
        let userId = null;
        for (const span of spans) {
          const text = span.textContent.trim();
          if (text.startsWith('@') && text.length > 1) {
            userId = text.substring(1).split(' ')[0]; // Handle cases where ID might be followed by other text
            break;
          }
        }

        if (!userId) return;

        const profileUrl = `${location.protocol}//${location.host}/profile/${userId}`;

        // 2. Wrap Icon Image
        // Selector matches the h-6 w-6 rounded icon
        const icon = header.querySelector('img.h-6.w-6.rounded-full.object-cover');
        if (icon && !icon.closest('a')) {
          const a = document.createElement('a');
          a.href = profileUrl;
          a.className = 'karotter-profile-link';
          a.style.display = 'inline-flex';
          icon.parentNode.insertBefore(a, icon);
          a.appendChild(icon);
        }

        // 3. Wrap Username
        // Selector matches the font-semibold text-primary span
        const username = header.querySelector('span.font-semibold');
        if (username && !username.closest('a') && username.textContent.trim().length > 0) {
          const a = document.createElement('a');
          a.href = profileUrl;
          a.className = 'karotter-profile-link';
          a.style.display = 'inline-block';
          a.style.color = 'inherit';
          a.style.textDecoration = 'none';
          username.parentNode.insertBefore(a, username);
          a.appendChild(username);
        }
      });
    }, 100);
  }

  function setupBoardsLink(enabled) {
    if (boardsInterval) {
      clearInterval(boardsInterval);
      boardsInterval = null;
    }

    if (!enabled) {
      document.querySelectorAll('a[href="/boards"][data-karotter-injected]').forEach(el => el.remove());
      return;
    }

    boardsInterval = setInterval(() => {
      const nav = document.querySelector('nav.space-y-2.flex-1');
      if (!nav) return;

      if (nav.querySelector('a[href="/boards"]')) return;

      const messageLink = nav.querySelector('a[href="/dm"]');
      if (!messageLink) return;

      const boardsLink = document.createElement('a');
      boardsLink.href = '/boards';
      boardsLink.className = 'flex items-center space-x-3 px-4 py-2 rounded-full transition-colors relative text-gray-700 hover:bg-gray-100';
      boardsLink.setAttribute('data-karotter-injected', 'true');

      const svgContainer = document.createElement('div');
      svgContainer.className = 'relative';
      svgContainer.insertAdjacentHTML('afterbegin', BOARDS_SVG);
      
      const labelSpan = document.createElement('span');
      labelSpan.className = 'font-medium text-sm md:text-base';
      labelSpan.textContent = '掲示板';

      boardsLink.appendChild(svgContainer);
      boardsLink.appendChild(labelSpan);

      messageLink.parentNode.insertBefore(boardsLink, messageLink.nextSibling);
    }, 100);
  }

  function setupGlossaryLink(enabled) {
    if (glossaryInterval) {
      clearInterval(glossaryInterval);
      glossaryInterval = null;
    }

    if (!enabled) {
      document.querySelectorAll('a[data-karotter-glossary-link]').forEach(el => el.remove());
      return;
    }

    glossaryInterval = setInterval(() => {
      const nav = document.querySelector('nav.space-y-2.flex-1');
      if (!nav) return;

      if (nav.querySelector('a[data-karotter-glossary-link]')) return;

      const boardsLink = nav.querySelector('a[href="/boards"]');
      const messageLink = nav.querySelector('a[href="/dm"]');
      const targetBase = boardsLink || messageLink;
      if (!targetBase) return;

      const glossaryLink = document.createElement('a');
      glossaryLink.href = 'https://karotter-wiki.vercel.app/index/index.html';
      glossaryLink.target = '_blank';
      glossaryLink.className = 'flex items-center space-x-3 px-4 py-2 rounded-full transition-colors relative text-gray-700 hover:bg-gray-100';
      glossaryLink.setAttribute('data-karotter-glossary-link', 'true');
      glossaryLink.setAttribute('data-karotter-injected', 'true');

      const svgContainer = document.createElement('div');
      svgContainer.className = 'relative';
      svgContainer.insertAdjacentHTML('afterbegin', GLOSSARY_SVG);

      const labelSpan = document.createElement('span');
      labelSpan.className = 'font-medium text-sm md:text-base';
      labelSpan.textContent = '用語辞典';

      glossaryLink.appendChild(svgContainer);
      glossaryLink.appendChild(labelSpan);

      targetBase.parentNode.insertBefore(glossaryLink, targetBase.nextSibling);
    }, 100);
  }

  let profileButtonsInterval = null;
  function setupProfileButtonsHider(hideQr, hideUrl) {
    if (profileButtonsInterval) {
      clearInterval(profileButtonsInterval);
      profileButtonsInterval = null;
    }

    // Restore buttons that should no longer be hidden
    document.querySelectorAll('button[data-karotter-hidden]').forEach(btn => {
      const text = btn.textContent.trim();
      let shouldRestore = false;
      if (!hideQr && text === "QRを表示") shouldRestore = true;
      if (!hideUrl && text.includes("プロフィールURLをコピー")) shouldRestore = true;

      if (shouldRestore) {
        btn.style.setProperty('display', '', 'important');
        btn.removeAttribute('data-karotter-hidden');
      }
    });

    if (!hideQr && !hideUrl) return;

    profileButtonsInterval = setInterval(() => {
      const buttons = document.querySelectorAll('button:not([data-karotter-hidden])');
      buttons.forEach(btn => {
        const text = btn.textContent.trim();
        if (hideQr && text === "QRを表示") {
          btn.style.setProperty('display', 'none', 'important');
          btn.setAttribute('data-karotter-hidden', 'true');
        } else if (hideUrl && text.includes("プロフィールURLをコピー")) {
          btn.style.setProperty('display', 'none', 'important');
          btn.setAttribute('data-karotter-hidden', 'true');
        }
      });
    }, 200);
  }

  function setupVideoPlayerEnhancer(enabled) {
    if (videoEnhanceInterval) {
      clearInterval(videoEnhanceInterval);
      videoEnhanceInterval = null;
    }

    if (!enabled) {
      document.querySelectorAll('.karotter-video-ui').forEach(ui => ui.remove());
      document.querySelectorAll('[data-karotter-video-parent-hidden]').forEach(el => {
        el.style.display = '';
        el.removeAttribute('data-karotter-video-parent-hidden');
      });
      document.querySelectorAll('.karotter-video-container').forEach(container => {
        const video = container.querySelector('video');
        if (video) {
          container.parentNode.insertBefore(video, container);
          video.controls = true;
          video.removeAttribute('data-karotter-video-enhanced');
        }
        container.remove();
      });
      return;
    }

    const PLAY_ICON = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-square-play"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M9 9.003a1 1 0 0 1 1.517-.859l4.997 2.997a1 1 0 0 1 0 1.718l-4.997 2.997A1 1 0 0 1 9 14.996z"/></svg>`;
    const PAUSE_ICON = `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>`;
    const FULLSCREEN_ICON = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"/></svg>`;
    const DOWNLOAD_UI_SVG = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-download"><path d="M12 15V3"/><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><path d="m7 10 5 5 5-5"/></svg>`;

    videoEnhanceInterval = setInterval(() => {
      const videos = document.querySelectorAll('video:not([data-karotter-video-enhanced])');
      videos.forEach(video => {
        if (video.closest('.karotter-video-container')) return;

        // Skip blob URLs as requested
        const src = video.src || (video.currentSrc ? video.currentSrc : "");
        if (src.startsWith('blob:')) return;

        video.setAttribute('data-karotter-video-enhanced', 'true');
        video.controls = false;

        const container = document.createElement('div');
        container.className = 'karotter-video-container';
        video.parentNode.insertBefore(container, video);
        container.appendChild(video);

        // Hide parent's 2nd child as requested
        const parent = container.parentElement;
        if (parent && parent.children[1] && parent.children[1] !== container) {
          parent.children[1].style.setProperty('display', 'none', 'important');
          parent.children[1].setAttribute('data-karotter-video-parent-hidden', 'true');
        }

        const ui = document.createElement('div');
        ui.className = 'karotter-video-ui';
        
        const centerPlay = document.createElement('div');
        centerPlay.className = 'karotter-video-center-play visible';
        centerPlay.insertAdjacentHTML('afterbegin', PLAY_ICON);

        const controlsWrapper = document.createElement('div');
        controlsWrapper.className = 'karotter-video-controls-wrapper';
        
        const controls = document.createElement('div');
        controls.className = 'karotter-video-controls';
        controls.onclick = (e) => e.stopPropagation();

        const pBtn = document.createElement('button');
        pBtn.className = 'karotter-video-btn play-pause';
        pBtn.insertAdjacentHTML('afterbegin', PLAY_ICON);

        const cTime = document.createElement('div');
        cTime.className = 'karotter-video-time current';
        cTime.textContent = '0:00';

        const pContainer = document.createElement('div');
        pContainer.className = 'karotter-video-progress-container';
        const pBar = document.createElement('div');
        pBar.className = 'karotter-video-progress-bar';
        pContainer.appendChild(pBar);

        const dTime = document.createElement('div');
        dTime.className = 'karotter-video-time duration';
        dTime.textContent = '0:00';

        const sBtn = document.createElement('button');
        sBtn.className = 'karotter-video-btn karotter-video-speed-btn';
        sBtn.textContent = '1.0x';

        const dlBtn = document.createElement('button');
        dlBtn.className = 'karotter-video-btn download-video';
        dlBtn.insertAdjacentHTML('afterbegin', DOWNLOAD_UI_SVG);

        const fsBtn = document.createElement('button');
        fsBtn.className = 'karotter-video-btn fullscreen';
        fsBtn.insertAdjacentHTML('afterbegin', FULLSCREEN_ICON);

        controls.appendChild(pBtn);
        controls.appendChild(cTime);
        controls.appendChild(pContainer);
        controls.appendChild(dTime);
        controls.appendChild(sBtn);
        controls.appendChild(dlBtn);
        controls.appendChild(fsBtn);
        
        controlsWrapper.appendChild(controls);
        ui.appendChild(centerPlay);
        ui.appendChild(controlsWrapper);
        container.appendChild(ui);

        const playBtn = ui.querySelector('.play-pause');
        const progressBar = ui.querySelector('.karotter-video-progress-bar');
        const progressContainer = ui.querySelector('.karotter-video-progress-container');
        const currentTimeEl = ui.querySelector('.current');
        const durationEl = ui.querySelector('.duration');
        const fullscreenBtn = ui.querySelector('.fullscreen');
        const speedBtn = ui.querySelector('.karotter-video-speed-btn');
        const downloadBtn = ui.querySelector('.download-video');
        const centerPlayBtn = ui.querySelector('.karotter-video-center-play');

        const formatTime = (time) => {
          const min = Math.floor(time / 60);
          const sec = Math.floor(time % 60);
          return `${min}:${sec.toString().padStart(2, '0')}`;
        };

        const updateProgress = () => {
          const percent = (video.currentTime / video.duration) * 100;
          progressBar.style.width = `${percent}%`;
          currentTimeEl.textContent = formatTime(video.currentTime);
        };

        video.addEventListener('play', () => {
          playBtn.innerHTML = PAUSE_ICON;
          centerPlayBtn.classList.remove('visible');
          container.classList.remove('is-paused');
          resetHideTimer();
        });
        video.addEventListener('pause', () => {
          playBtn.innerHTML = PLAY_ICON;
          // Keep centerPlayBtn hidden as requested
          container.classList.remove('is-paused');
          clearTimeout(hideTimer);
        });

        // Initialize state (Splash screen)
        if (video.paused && video.currentTime === 0) {
          container.classList.add('is-paused');
          centerPlayBtn.classList.add('visible');
        } else if (!video.paused) {
          resetHideTimer();
        }

        video.addEventListener('timeupdate', updateProgress);
        video.addEventListener('loadedmetadata', () => {
          durationEl.textContent = formatTime(video.duration);
        });

        playBtn.onclick = (e) => {
          e.stopPropagation();
          video.paused ? video.play() : video.pause();
        };

        centerPlayBtn.onclick = (e) => {
          e.stopPropagation();
          video.play();
        };

        progressContainer.onclick = (e) => {
          e.stopPropagation();
          const rect = progressContainer.getBoundingClientRect();
          const pos = (e.clientX - rect.left) / rect.width;
          video.currentTime = pos * video.duration;
        };

        // Auto-hide controls and cursor after 3s of inactivity
        let hideTimer;
        const resetHideTimer = () => {
          container.classList.remove('user-inactive');
          clearTimeout(hideTimer);
          if (!video.paused) {
            hideTimer = setTimeout(() => {
              container.classList.add('user-inactive');
            }, 3000);
          }
        };

        container.onmousemove = resetHideTimer;
        container.onclick = resetHideTimer;
        container.onpointerdown = resetHideTimer;
        video.addEventListener('play', resetHideTimer);
        video.addEventListener('pause', () => {
          container.classList.remove('user-inactive');
          clearTimeout(hideTimer);
        });

        // Initialize timer if already playing
        if (!video.paused) resetHideTimer();

        // Draggable seek logic
        let isDragging = false;
        const scrub = (e) => {
          const rect = progressContainer.getBoundingClientRect();
          const pos = Math.min(Math.max(0, (e.clientX - rect.left) / rect.width), 1);
          video.currentTime = pos * video.duration;
        };

        progressContainer.onpointerdown = (e) => {
          if (e.button !== 0) return; // Left click only
          isDragging = true;
          progressContainer.classList.add('dragging');
          scrub(e);
          progressContainer.setPointerCapture(e.pointerId);
        };

        progressContainer.onpointermove = (e) => {
          if (isDragging) scrub(e);
        };

        progressContainer.onpointerup = (e) => {
          isDragging = false;
          progressContainer.classList.remove('dragging');
          progressContainer.releasePointerCapture(e.pointerId);
        };

        fullscreenBtn.onclick = (e) => {
          e.stopPropagation();
          if (document.fullscreenElement) {
            document.exitFullscreen();
          } else {
            container.requestFullscreen();
          }
        };

        const speeds = [1, 1.25, 1.5, 2, 0.5];
        let currentSpeedIdx = 0;
        speedBtn.onclick = (e) => {
          e.stopPropagation();
          currentSpeedIdx = (currentSpeedIdx + 1) % speeds.length;
          const newSpeed = speeds[currentSpeedIdx];
          video.playbackRate = newSpeed;
          speedBtn.textContent = `${newSpeed}x`;
        };

        downloadBtn.onclick = (e) => {
          e.stopPropagation();
          const filename = video.src.split('/').pop().split('?')[0] || 'karotter_video.mp4';
          chrome.runtime.sendMessage({
            action: "download_image",
            url: video.src,
            filename: `karotter_${filename}`
          });
        };

        // Pause/Play on video click
        video.onclick = () => {
          video.paused ? video.play() : video.pause();
        };
      });
    }, 100);
  }

  function setupSocialMenuBackdrop(enabled) {
    if (socialMenuInterval) {
      clearInterval(socialMenuInterval);
      socialMenuInterval = null;
    }

    if (!enabled) {
      document.querySelectorAll('[data-karotter-blur]').forEach(el => {
        el.style.backdropFilter = "";
        el.style.webkitBackdropFilter = "";
        el.removeAttribute('data-karotter-blur');
      });
      return;
    }

    socialMenuInterval = setInterval(() => {
      const socialLink = document.querySelector('a[href="/social"]');
      if (socialLink) {
        const container = socialLink.closest('div');
        if (container && (container.style.backdropFilter === "" || !container.hasAttribute('data-karotter-blur'))) {
          container.style.setProperty('backdrop-filter', 'blur(8px)', 'important');
          container.style.setProperty('-webkit-backdrop-filter', 'blur(8px)', 'important');
          container.setAttribute('data-karotter-blur', 'true');
        }
      }
    }, 100);
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
        btn.insertAdjacentHTML('afterbegin', DOWNLOAD_SVG);
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
        btn.insertAdjacentHTML('afterbegin', COLLAPSE_SVG);
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

  function setupAdvancedSearch(enabled) {
    if (advancedSearchInterval) {
      clearInterval(advancedSearchInterval);
      advancedSearchInterval = null;
    }

    if (!enabled) {
      document.querySelectorAll('.karotter-adv-search-btn').forEach(btn => btn.remove());
      const modal = document.querySelector('.karotter-adv-search-modal-overlay');
      if (modal) modal.remove();
      return;
    }

    advancedSearchInterval = setInterval(() => {
      const inputs = document.querySelectorAll('input[placeholder="Karotterを検索"], input[placeholder="検索"]');
      inputs.forEach(input => {
        const container = input.parentElement;
        if (!container || container.querySelector('.karotter-adv-search-btn')) return;

        // Ensure container is positioned
        const style = window.getComputedStyle(container);
        if (style.position === 'static') {
          container.style.position = 'relative';
        }

        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'karotter-adv-search-btn';
        btn.insertAdjacentHTML('afterbegin', ADVANCED_SEARCH_SVG);
        btn.title = '高度な検索';

        btn.onclick = (e) => {
          e.preventDefault();
          e.stopPropagation();
          openAdvancedSearchModal();
        };

        container.appendChild(btn);
        // Adjust input padding to not overlap with the button
        input.style.paddingRight = '36px';
      });
    }, 100);
  }

  function openAdvancedSearchModal() {
    let overlay = document.querySelector('.karotter-adv-search-modal-overlay');
    if (overlay) return; // Already open

    const CLOSE_SVG = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="20" height="20"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>`;

    overlay = document.createElement('div');
    overlay.className = 'karotter-adv-search-modal-overlay';

    // Stop propagation so clicking inside doesn't close
    overlay.onclick = (e) => {
      if (e.target === overlay) {
        overlay.remove();
      }
    };

    const modal = document.createElement('div');
    modal.className = 'karotter-adv-search-modal';
    modal.onclick = (e) => e.stopPropagation();

    const header = document.createElement('div');
    header.className = 'karotter-adv-search-header';
    const title = document.createElement('h2');
    title.textContent = '高度な検索';
    const closeBtnInner = document.createElement('button');
    closeBtnInner.className = 'karotter-adv-search-close';
    closeBtnInner.title = '閉じる';
    closeBtnInner.insertAdjacentHTML('afterbegin', CLOSE_SVG);
    header.appendChild(title);
    header.appendChild(closeBtnInner);

    const body = document.createElement('div');
    body.className = 'karotter-adv-search-body';

    function addSection(titleText, fields) {
      const section = document.createElement('div');
      section.className = 'karotter-adv-search-section';
      const sTitle = document.createElement('div');
      sTitle.className = 'section-title';
      sTitle.textContent = titleText;
      section.appendChild(sTitle);
      
      fields.forEach(f => {
        const field = document.createElement('div');
        field.className = 'karotter-adv-search-field';
        if (f.style) field.style.cssText = f.style;
        const label = document.createElement('label');
        label.textContent = f.label;
        const input = document.createElement('input');
        input.type = f.type || 'text';
        input.id = f.id;
        if (f.placeholder) input.placeholder = f.placeholder;
        field.appendChild(label);
        field.appendChild(input);
        section.appendChild(field);
      });
      return section;
    }

    body.appendChild(addSection('単語', [
      { label: 'すべてのキーワードを含む', id: 'adv-all', placeholder: '例: Karotter Studio' },
      { label: '次のフレーズに完全一致', id: 'adv-exact', placeholder: '例: Karotter Studio 最高' },
      { label: 'いずれかのキーワードを含む', id: 'adv-any', placeholder: '例: アニメ OR 漫画' },
      { label: '次のキーワードを含まない', id: 'adv-none', placeholder: '例: ネタバレ' }
    ]));

    body.appendChild(addSection('アカウント', [
      { label: '次のアカウントからの送信', id: 'adv-from', placeholder: '例: @KarotterApp' },
      { label: '次のアカウントへの返信', id: 'adv-to', placeholder: '例: @KarotterApp' }
    ]));

    const dateSection = document.createElement('div');
    dateSection.className = 'karotter-adv-search-section';
    const dateTitle = document.createElement('div');
    dateTitle.className = 'section-title';
    dateTitle.textContent = '日付';
    dateSection.appendChild(dateTitle);
    
    const dateFlex = document.createElement('div');
    dateFlex.style.cssText = 'display: flex; gap: 16px;';
    
    const addDateField = (labelStr, idStr) => {
      const field = document.createElement('div');
      field.className = 'karotter-adv-search-field';
      field.style.flex = '1';
      const label = document.createElement('label');
      label.textContent = labelStr;
      const input = document.createElement('input');
      input.type = 'date';
      input.id = idStr;
      field.appendChild(label);
      field.appendChild(input);
      return field;
    };
    
    dateFlex.appendChild(addDateField('開始（Since）', 'adv-since'));
    dateFlex.appendChild(addDateField('終了（Until）', 'adv-until'));
    dateSection.appendChild(dateFlex);
    body.appendChild(dateSection);

    const footer = document.createElement('div');
    footer.className = 'karotter-adv-search-footer';
    const submitBtn = document.createElement('button');
    submitBtn.className = 'karotter-adv-search-submit';
    submitBtn.textContent = '検索';
    footer.appendChild(submitBtn);

    modal.appendChild(header);
    modal.appendChild(body);
    modal.appendChild(footer);


    overlay.appendChild(modal);
    document.body.appendChild(overlay);

    const closeBtn = modal.querySelector('.karotter-adv-search-close');
    closeBtn.onclick = () => overlay.remove();

    const searchSubmitBtn = modal.querySelector('.karotter-adv-search-submit');
    searchSubmitBtn.onclick = () => {
      const allWords = modal.querySelector('#adv-all').value.trim();
      const exactPhrase = modal.querySelector('#adv-exact').value.trim();
      const anyWords = modal.querySelector('#adv-any').value.trim();
      const noneWords = modal.querySelector('#adv-none').value.trim();
      const fromAcc = modal.querySelector('#adv-from').value.trim().replace(/^@/, '');
      const toAcc = modal.querySelector('#adv-to').value.trim().replace(/^@/, '');
      const sinceDate = modal.querySelector('#adv-since').value;
      const untilDate = modal.querySelector('#adv-until').value;

      let queryParts = [];

      if (allWords) queryParts.push(allWords);
      if (exactPhrase) queryParts.push(`"${exactPhrase}"`);
      if (anyWords) {
        const anyTerms = anyWords.split(/\s+/).filter(Boolean);
        if (anyTerms.length > 0) {
          queryParts.push(anyTerms.join(' OR '));
        }
      }
      if (noneWords) {
        const noneTerms = noneWords.split(/\s+/).filter(Boolean);
        noneTerms.forEach(term => queryParts.push(`-${term}`));
      }
      if (fromAcc) queryParts.push(`from:${fromAcc}`);
      if (toAcc) queryParts.push(`to:${toAcc}`);
      if (sinceDate) queryParts.push(`since:${sinceDate}`);
      if (untilDate) queryParts.push(`until:${untilDate}`);

      const finalQuery = queryParts.join(' ');
      if (finalQuery) {
        window.location.href = `/search?q=${encodeURIComponent(finalQuery)}`;
      }
      overlay.remove();
    };

    // Focus first input
    const firstInput = modal.querySelector('input');
    if (firstInput) firstInput.focus();
  }

  function setupVBotCommands(enabled) {
    if (vbotInterval) {
      clearInterval(vbotInterval);
      vbotInterval = null;
    }

    if (!enabled) {
      hideVBotCard();
      return;
    }

    vbotInterval = setInterval(() => {
      const textarea = document.querySelector('textarea[placeholder="いまどうしてる？"]');
      if (!textarea) {
        hideVBotCard();
        return;
      }

      if (vbotAttachedTextarea !== textarea) {
        if (vbotAttachedTextarea) {
          vbotAttachedTextarea.removeEventListener('input', handleVBotInput);
          vbotAttachedTextarea.removeEventListener('keydown', handleVBotKeyDown);
          vbotAttachedTextarea.removeEventListener('blur', handleVBotBlur);
        }
        vbotAttachedTextarea = textarea;
        vbotAttachedTextarea.addEventListener('input', handleVBotInput);
        vbotAttachedTextarea.addEventListener('keydown', handleVBotKeyDown);
        vbotAttachedTextarea.addEventListener('blur', handleVBotBlur);
      }
    }, 100);
  }

  const VBOT_COMMAND_DATA = [
    { cat: "基本", catIcon: `<svg viewBox="0 0 24 24" width="12" height="12" stroke="currentColor" stroke-width="3" fill="none"><polyline points="4 17 10 11 4 5" /><line x1="12" x2="20" y1="19" y2="19" /></svg>`, cmd: "ping", desc: "ボットの生存確認を行います。", icon: `<svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" stroke-width="2.5" fill="none"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>` },
    { cat: "ユーザー情報", catIcon: `<svg viewBox="0 0 24 24" width="12" height="12" stroke="currentColor" stroke-width="3" fill="none"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>`, cmd: "info", desc: "自分のユーザー情報を表示します。", icon: `<svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" stroke-width="2.5" fill="none"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>` },
    { cat: "ユーザー情報", catIcon: `<svg viewBox="0 0 24 24" width="12" height="12" stroke="currentColor" stroke-width="3" fill="none"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>`, cmd: "info @user", desc: "指定したユーザーの情報を表示します。", icon: `<svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" stroke-width="2.5" fill="none"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>` },
    { cat: "Make it a Quote", catIcon: `<svg viewBox="0 0 24 24" width="12" height="12" stroke="currentColor" stroke-width="3" fill="none"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg>`, cmd: "quote", desc: "返信元の投稿を画像として引用します。", icon: `<svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" stroke-width="2.5" fill="none"><path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1zM11 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-2c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1z"/></svg>` },
    { cat: "用語辞典（wiki）", catIcon: `<svg viewBox="0 0 24 24" width="12" height="12" stroke="currentColor" stroke-width="3" fill="none"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>`, cmd: "wiki", desc: "用語辞典から情報を取得します。", icon: `<svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" stroke-width="2.5" fill="none"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>` },
    { cat: "用語辞典（wiki）", catIcon: `<svg viewBox="0 0 24 24" width="12" height="12" stroke="currentColor" stroke-width="3" fill="none"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>`, cmd: "wiki search", desc: "用語辞典を検索します。", icon: `<svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" stroke-width="2.5" fill="none"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>` },
    { cat: "辞書管理", catIcon: `<svg viewBox="0 0 24 24" width="12" height="12" stroke="currentColor" stroke-width="3" fill="none"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>`, cmd: "dict", desc: "辞書の一覧を表示します。", icon: `<svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" stroke-width="2.5" fill="none"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>` },
    { cat: "辞書管理", catIcon: `<svg viewBox="0 0 24 24" width="12" height="12" stroke="currentColor" stroke-width="3" fill="none"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>`, cmd: "dict add", desc: "辞書に新用語を追加します。", icon: `<svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" stroke-width="2.5" fill="none"><circle cx="12" cy="12" r="10"/><path d="M12 8v8"/><path d="M8 12h8"/></svg>` },
    { cat: "辞書管理", catIcon: `<svg viewBox="0 0 24 24" width="12" height="12" stroke="currentColor" stroke-width="3" fill="none"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>`, cmd: "dict del", desc: "辞書から用語を削除します。", icon: `<svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" stroke-width="2.5" fill="none"><circle cx="12" cy="12" r="10"/><path d="M8 12h8"/></svg>` },
    { cat: "評価", catIcon: `<svg viewBox="0 0 24 24" width="12" height="12" stroke="currentColor" stroke-width="3" fill="none"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>`, cmd: "rate", desc: "自分を評価します。", icon: `<svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" stroke-width="2.5" fill="none"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>` },
    { cat: "投稿取得", catIcon: `<svg viewBox="0 0 24 24" width="12" height="12" stroke="currentColor" stroke-width="3" fill="none"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/></svg>`, cmd: "posts", desc: "最新の投稿を取得します。", icon: `<svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" stroke-width="2.5" fill="none"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/></svg>` },
    { cat: "フォロワー", catIcon: `<svg viewBox="0 0 24 24" width="12" height="12" stroke="currentColor" stroke-width="3" fill="none"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>`, cmd: "followers", desc: "フォロワーの一覧を表示します。", icon: `<svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" stroke-width="2.5" fill="none"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>` },
    { cat: "フォロワー", catIcon: `<svg viewBox="0 0 24 24" width="12" height="12" stroke="currentColor" stroke-width="3" fill="none"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>`, cmd: "followers @user", desc: "指定したユーザーのフォロワーを表示します。", icon: `<svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" stroke-width="2.5" fill="none"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>` },
    { cat: "ランキング", catIcon: `<svg viewBox="0 0 24 24" width="12" height="12" stroke="currentColor" stroke-width="3" fill="none"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"/></svg>`, cmd: "ranking", desc: "総合ランキングを表示します。", icon: `<svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" stroke-width="2.5" fill="none"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"/></svg>` },
    { cat: "ランキング", catIcon: `<svg viewBox="0 0 24 24" width="12" height="12" stroke="currentColor" stroke-width="3" fill="none"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"/></svg>`, cmd: "ranking @user", desc: "指定ユーザーの順位を表示します。", icon: `<svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" stroke-width="2.5" fill="none"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"/></svg>` },
    { cat: "ランキング", catIcon: `<svg viewBox="0 0 24 24" width="12" height="12" stroke="currentColor" stroke-width="3" fill="none"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>`, cmd: "ranking followers", desc: "フォロワー数ランキングを表示します。", icon: `<svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" stroke-width="2.5" fill="none"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>` },
    { cat: "ランキング", catIcon: `<svg viewBox="0 0 24 24" width="12" height="12" stroke="currentColor" stroke-width="3" fill="none"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>`, cmd: "ranking rate", desc: "評価ランキングを表示します。", icon: `<svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" stroke-width="2.5" fill="none"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>` },
    { cat: "ランキング", catIcon: `<svg viewBox="0 0 24 24" width="12" height="12" stroke="currentColor" stroke-width="3" fill="none"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/></svg>`, cmd: "ranking posts", desc: "投稿数ランキングを表示します。", icon: `<svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" stroke-width="2.5" fill="none"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/></svg>` }
  ];

  function handleVBotInput(e) {
    const textarea = e.target;
    const text = textarea.value;
    const cursorPos = textarea.selectionStart;

    // Find the start of the current word
    const lastAtPos = text.lastIndexOf('@vbot ', cursorPos);
    if (lastAtPos === -1 || lastAtPos + 6 > cursorPos) {
      hideVBotCard();
      return;
    }

    const query = text.substring(lastAtPos + 6, cursorPos).trim().toLowerCase();
    vbotFilteredCommands = VBOT_COMMAND_DATA.filter(c => c.cmd.toLowerCase().includes(query) || query === "");

    if (vbotFilteredCommands.length === 0) {
      hideVBotCard();
      return;
    }

    showVBotCard(textarea, lastAtPos, query);
  }

  function handleVBotKeyDown(e) {
    if (!vbotCard || vbotCard.style.display === 'none') return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      vbotSelectedIndex = (vbotSelectedIndex + 1) % vbotFilteredCommands.length;
      renderVBotCommands();
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      vbotSelectedIndex = (vbotSelectedIndex - 1 + vbotFilteredCommands.length) % vbotFilteredCommands.length;
      renderVBotCommands();
    } else if (e.key === 'Enter') {
      e.preventDefault();
      selectVBotCommand(vbotFilteredCommands[vbotSelectedIndex]);
    } else if (e.key === 'Escape') {
      e.preventDefault();
      hideVBotCard();
    }
  }

  function handleVBotBlur() {
    // Small delay to allow click selection
    setTimeout(hideVBotCard, 200);
  }

  function showVBotCard(textarea, atPos, query) {
    if (!vbotCard) {
      vbotCard = document.createElement('div');
      vbotCard.id = 'vbot-assistant-card';
      vbotCard.style.cssText = `
        position: fixed;
        width: 320px;
        max-width: 90vw;
        background: var(--surface-card, #fff);
        border: 1px solid var(--border-soft, #eee);
        border-radius: 12px;
        box-shadow: 0 8px 24px rgba(0,0,0,0.15);
        z-index: 10000;
        overflow: hidden;
        display: none;
        flex-direction: column;
        touch-action: manipulation;
      `;

      const header = document.createElement('div');
      header.style.cssText = `
        padding: 12px 16px;
        background: var(--accent, #1d9bf0);
        color: #fff;
        font-weight: 800;
        font-size: 13px;
        display: flex;
        align-items: center;
        gap: 8px;
        min-height: 44px;
      `;
      header.insertAdjacentHTML('afterbegin', `<svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" stroke-width="3" fill="none"><polyline points="4 17 10 11 4 5" /><line x1="12" x2="20" y1="19" y2="19" /></svg>`);
      const headerTitle = document.createElement('span');
      headerTitle.textContent = 'vbot コマンド一覧';
      header.appendChild(headerTitle);
      vbotCard.appendChild(header);

      const list = document.createElement('div');
      list.id = 'vbot-command-list';
      list.style.cssText = `
        max-height: 300px;
        overflow-y: auto;
        padding: 8px 0;
        -webkit-overflow-scrolling: touch;
      `;
      vbotCard.appendChild(list);

      const footer = document.createElement('div');
      footer.id = 'vbot-assistant-footer';
      footer.style.cssText = `
        padding: 8px 16px;
        border-top: 1px solid var(--border-soft, #eee);
        font-size: 10px;
        color: var(--text-faint, #888);
        background: var(--bg-subtle, #f9f9f9);
      `;
      const footerHelp = document.createElement('span');
      footerHelp.className = 'vbot-desktop-help';
      footerHelp.textContent = '↑↓ で選択 • Enter で決定 • Esc で閉じる';
      footer.appendChild(footerHelp);
      vbotCard.appendChild(footer);

      // Add responsive style for the footer
      const styleTag = document.createElement('style');
      styleTag.textContent = `
        @media (max-width: 768px) {
          #vbot-assistant-footer { display: none !important; }
        }
      `;
      document.head.appendChild(styleTag);

      document.body.appendChild(vbotCard);
    }

    vbotSelectedIndex = 0;
    renderVBotCommands();

    const coords = getCaretCoordinates(textarea, atPos);
    const rect = textarea.getBoundingClientRect();

    // Position the card above the caret if possible, otherwise below
    vbotCard.style.display = 'flex';
    const cardHeight = vbotCard.offsetHeight;
    const cardWidth = vbotCard.offsetWidth;
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    let top = rect.top + coords.top - cardHeight - 10;
    if (top < 10) {
      top = rect.top + coords.top + 24; // Below caret if no space above
      if (top + cardHeight > viewportHeight - 10) {
        top = viewportHeight - cardHeight - 10; // Clamp if also no space below
      }
    }

    let left = rect.left + coords.left;
    // Horizontal clamping
    if (left + cardWidth > viewportWidth - 10) {
      left = viewportWidth - cardWidth - 10;
    }
    if (left < 10) left = 10;

    vbotCard.style.left = `${left}px`;
    vbotCard.style.top = `${top}px`;
  }

  function renderVBotCommands() {
    const list = vbotCard.querySelector('#vbot-command-list');
    list.innerHTML = '';

    let lastCat = null;
    vbotFilteredCommands.forEach((c, index) => {
      if (c.cat !== lastCat) {
        const cat = document.createElement('div');
        cat.style.cssText = `
          padding: 12px 16px 4px;
          font-size: 10px;
          font-weight: 800;
          color: var(--accent, #1d9bf0);
          text-transform: uppercase;
          letter-spacing: 0.05em;
          display: flex;
          align-items: center;
          gap: 6px;
        `;
        const catIconSpan = document.createElement('span');
        catIconSpan.style.cssText = 'display: flex; align-items: center; opacity: 0.8;';
        catIconSpan.insertAdjacentHTML('afterbegin', c.catIcon);
        
        const catNameSpan = document.createElement('span');
        catNameSpan.textContent = c.cat;
        
        cat.appendChild(catIconSpan);
        cat.appendChild(catNameSpan);
        list.appendChild(cat);
        lastCat = c.cat;
      }

      const item = document.createElement('div');
      const isActive = index === vbotSelectedIndex;
      item.style.cssText = `
        padding: 10px 16px;
        cursor: pointer;
        display: flex;
        align-items: center;
        gap: 12px;
        background: ${isActive ? 'var(--accent-soft, #eef8ff)' : 'transparent'};
        border-left: 3px solid ${isActive ? 'var(--accent, #1d9bf0)' : 'transparent'};
        min-height: 48px;
        user-select: none;
      `;
      const iconDiv = document.createElement('div');
      iconDiv.style.cssText = `flex-shrink: 0; color: ${isActive ? 'var(--accent, #1d9bf0)' : 'var(--text-dim, #888)'}`;
      iconDiv.insertAdjacentHTML('afterbegin', c.icon);
      
      const textWrap = document.createElement('div');
      textWrap.style.cssText = 'display: flex; flex-direction: column; gap: 2px;';
      
      const cmdDiv = document.createElement('div');
      cmdDiv.style.cssText = `font-weight: 700; font-size: 13px; color: ${isActive ? 'var(--accent, #1d9bf0)' : 'var(--text-primary, #000)'}`;
      cmdDiv.textContent = `@vbot ${c.cmd}`;
      
      const descDiv = document.createElement('div');
      descDiv.style.cssText = 'font-size: 11px; color: var(--text-dim, #666)';
      descDiv.textContent = c.desc;
      
      textWrap.appendChild(cmdDiv);
      textWrap.appendChild(descDiv);
      
      item.appendChild(iconDiv);
      item.appendChild(textWrap);

      item.onclick = (e) => {
        e.preventDefault();
        e.stopPropagation();
        selectVBotCommand(c);
      };

      list.appendChild(item);
      if (isActive) {
        item.scrollIntoView({ block: 'nearest' });
      }
    });
  }

  function selectVBotCommand(command) {
    if (!vbotAttachedTextarea) return;
    const textarea = vbotAttachedTextarea;
    const text = textarea.value;
    const cursorPos = textarea.selectionStart;
    const lastAtPos = text.lastIndexOf('@vbot', cursorPos);

    const before = text.substring(0, lastAtPos);
    const after = text.substring(cursorPos);

    let cmdToInsert = command.cmd;
    if (cmdToInsert.includes('@user')) {
      cmdToInsert = cmdToInsert.replace('@user', '@');
    } else {
      cmdToInsert += ' ';
    }

    const newVal = before + `@vbot ${cmdToInsert}` + after;

    textarea.value = newVal;
    textarea.focus();
    const nextPos = lastAtPos + 6 + cmdToInsert.length;
    textarea.setSelectionRange(nextPos, nextPos);

    // Trigger input event to let the site know it changed
    textarea.dispatchEvent(new Event('input', { bubbles: true }));

    hideVBotCard();
  }

  function hideVBotCard() {
    if (vbotCard) {
      vbotCard.style.display = 'none';
    }
  }

  // Textarea caret position estimation (https://github.com/component/textarea-caret-position)
  function getCaretCoordinates(element, position) {
    const properties = [
      'direction', 'boxSizing', 'width', 'height', 'overflowX', 'overflowY',
      'borderTopWidth', 'borderRightWidth', 'borderBottomWidth', 'borderLeftWidth', 'borderStyle',
      'paddingTop', 'paddingRight', 'paddingBottom', 'paddingLeft',
      'fontStyle', 'fontVariant', 'fontWeight', 'fontStretch', 'fontSize', 'fontSizeAdjust', 'lineHeight', 'fontFamily',
      'textAlign', 'textTransform', 'textIndent', 'textDecoration', 'letterSpacing', 'wordSpacing', 'tabSize', 'MozTabSize'
    ];

    const div = document.createElement('div');
    div.id = 'input-textarea-caret-position-mirror-div';
    document.body.appendChild(div);

    const style = div.style;
    const computed = window.getComputedStyle(element);

    style.whiteSpace = 'pre-wrap';
    style.wordWrap = 'break-word';
    style.position = 'absolute';
    style.visibility = 'hidden';

    properties.forEach(prop => {
      style[prop] = computed[prop];
    });

    div.textContent = element.value.substring(0, position);

    const span = document.createElement('span');
    span.textContent = element.value.substring(position) || '.';
    div.appendChild(span);

    const coordinates = {
      top: span.offsetTop + parseInt(computed['borderTopWidth']),
      left: span.offsetLeft + parseInt(computed['borderLeftWidth'])
    };

    document.body.removeChild(div);
    return coordinates;
  }

  function applySettings(settings) {
    if (!settings.enabled) {
      clearTheme();
      return;
    }

    const style = ensureStyleElement();
    style.textContent = engine.buildAppliedCss(settings);

    applyFeatures(settings.features || {});
    setupSocialMenuBackdrop(settings.background.enabled);
  }

  storage.loadSettings().then(applySettings);

  chrome.storage.onChanged.addListener(function (changes, areaName) {
    if (areaName !== "local" || !changes[storage.STORAGE_KEY]) {
      return;
    }
    applySettings(storage.normalizeSettings(changes[storage.STORAGE_KEY].newValue));
  });
}());
