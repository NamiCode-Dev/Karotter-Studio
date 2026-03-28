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
  let socialMenuInterval = null;
  let videoEnhanceInterval = null;
  let advancedSearchInterval = null;
  const DOWNLOAD_SVG = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>`;
  const ADVANCED_SEARCH_SVG = `<svg viewBox="0 0 24 24" aria-hidden="true" fill="currentColor" width="18" height="18"><g><path d="M10.54 1.75h2.92l1.57 2.36c.11.17.32.25.53.21l2.53-.59 2.17 2.17-.58 2.54c-.05.2.04.41.22.53l2.36 1.57v2.92l-2.36 1.57c-.18.12-.27.33-.22.53l.58 2.54-2.17 2.17-2.53-.59c-.21-.04-.42.04-.53.21l-1.57 2.36h-2.92l-1.57-2.36c-.11-.17-.32-.25-.53-.21l-2.53.59-2.17-2.17.58-2.54c.05-.2-.04-.41-.22-.53l-2.36-1.57v-2.92l2.36-1.57c.18-.12.27-.33.22-.53l-.58-2.54 2.17-2.17 2.53.59c.21.04.42-.04.53-.21l1.57-2.36zm1.71 1.98l-1.12 1.68c-.46.69-1.34 1.01-2.14.82l-1.81-.42-1.3 1.3.42 1.81c.19.8.19 1.68-.42 2.14l-1.68 1.12v1.64l1.68 1.12c.69.46 1.01 1.34.82 2.14l-.42 1.81 1.3 1.3 1.81-.42c.8-.19 1.68.13 2.14.82l1.12 1.68h1.64l1.12-1.68c.46-.69 1.34-1.01 2.14-.82l1.81.42 1.3-1.3-.42-1.81c-.19-.8.13-1.68.82-2.14l1.68-1.12v-1.64l-1.68-1.12c-.69-.46-1.01-1.34-.82-2.14l.42-1.81-1.3-1.3-1.81.42c-.8.19-1.68-.13-2.14-.82l-1.12-1.68h-1.64zM12 7.75c-2.35 0-4.25 1.9-4.25 4.25s1.9 4.25 4.25 4.25 4.25-1.9 4.25-4.25-1.9-4.25-4.25-4.25zm0 2c1.24 0 2.25 1.01 2.25 2.25s-1.01 2.25-2.25 2.25-2.25-1.01-2.25-2.25 1.01-2.25 2.25-2.25z"></path></g></svg>`;

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
          position: absolute !important; top: 0; left: 0;
          width: 100% !important; height: 100% !important;
          max-width: 100% !important; max-height: 100% !important;
          object-fit: contain !important; margin: auto !important;
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

    const PLAY_ICON = `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>`;
    const PAUSE_ICON = `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>`;
    const FULLSCREEN_ICON = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"/></svg>`;
    const DOWNLOAD_UI_SVG = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>`;

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
        ui.innerHTML = `
          <div class="karotter-video-center-play visible">${PLAY_ICON}</div>
          <div class="karotter-video-controls-wrapper">
            <div class="karotter-video-controls" onclick="e => e.stopPropagation()">
              <button class="karotter-video-btn play-pause">${PLAY_ICON}</button>
              <div class="karotter-video-time current">0:00</div>
              <div class="karotter-video-progress-container">
                <div class="karotter-video-progress-bar"></div>
              </div>
              <div class="karotter-video-time duration">0:00</div>
              <button class="karotter-video-btn karotter-video-speed-btn">1.0x</button>
              <button class="karotter-video-btn download-video">${DOWNLOAD_UI_SVG}</button>
              <button class="karotter-video-btn fullscreen">${FULLSCREEN_ICON}</button>
            </div>
          </div>
        `;
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
        btn.innerHTML = ADVANCED_SEARCH_SVG;
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

    modal.innerHTML = `
      <div class="karotter-adv-search-header">
        <h2>高度な検索</h2>
        <button class="karotter-adv-search-close" title="閉じる">${CLOSE_SVG}</button>
      </div>
      <div class="karotter-adv-search-body">
        <div class="karotter-adv-search-section">
          <div class="section-title">単語</div>
          <div class="karotter-adv-search-field">
            <label>すべてのキーワードを含む</label>
            <input type="text" id="adv-all" placeholder="例: Karotter Studio">
          </div>
          <div class="karotter-adv-search-field">
            <label>次のフレーズに完全一致</label>
            <input type="text" id="adv-exact" placeholder="例: Karotter Studio 最高">
          </div>
          <div class="karotter-adv-search-field">
            <label>いずれかのキーワードを含む</label>
            <input type="text" id="adv-any" placeholder="例: アニメ OR 漫画">
          </div>
          <div class="karotter-adv-search-field">
            <label>次のキーワードを含まない</label>
            <input type="text" id="adv-none" placeholder="例: ネタバレ">
          </div>
        </div>
        
        <div class="karotter-adv-search-section">
          <div class="section-title">アカウント</div>
          <div class="karotter-adv-search-field">
            <label>次のアカウントからの送信</label>
            <input type="text" id="adv-from" placeholder="例: @KarotterApp">
          </div>
          <div class="karotter-adv-search-field">
            <label>次のアカウントへの返信</label>
            <input type="text" id="adv-to" placeholder="例: @KarotterApp">
          </div>
        </div>

        <div class="karotter-adv-search-section">
          <div class="section-title">日付</div>
          <div style="display: flex; gap: 16px;">
            <div class="karotter-adv-search-field" style="flex: 1;">
              <label>開始（Since）</label>
              <input type="date" id="adv-since">
            </div>
            <div class="karotter-adv-search-field" style="flex: 1;">
              <label>終了（Until）</label>
              <input type="date" id="adv-until">
            </div>
          </div>
        </div>
      </div>
      <div class="karotter-adv-search-footer">
        <button class="karotter-adv-search-submit">検索</button>
      </div>
    `;

    overlay.appendChild(modal);
    document.body.appendChild(overlay);

    const closeBtn = modal.querySelector('.karotter-adv-search-close');
    closeBtn.onclick = () => overlay.remove();

    const submitBtn = modal.querySelector('.karotter-adv-search-submit');
    submitBtn.onclick = () => {
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
