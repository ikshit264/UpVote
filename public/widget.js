(function () {
  if (window.__upvote_widget_initialized) return;
  window.__upvote_widget_initialized = true;

  let currentWidgetDiv = null;
  let config = {};
  let scriptUrl = "";
  let isCreated = false;
  let menuOpen = false;
  let widgetOpen = false;

  // DOM Elements
  let button, feedbackSub, supportSub, container, iframe, style;

  // Get script domain once
  const scripts = document.getElementsByTagName('script');
  for (let i = 0; i < scripts.length; i++) {
    if (scripts[scripts.length - 1 - i].src.includes('widget.js')) {
      try {
        scriptUrl = new URL(scripts[scripts.length - 1 - i].src).origin;
      } catch (e) {
        scriptUrl = window.location.origin;
      }
      break;
    }
  }

  function updateConfig(div) {
    if (!div) return;
    config = {
      applicationId: div.getAttribute('data-application-id'),
      userId: div.getAttribute('data-user-id'),
      email: div.getAttribute('data-email') || '',
      position: div.getAttribute('data-position') || 'right',
      theme: 'light' // Default to light mode
    };
  }

  function validate() {
    return !!config.applicationId;
  }

  function initUI() {
    if (isCreated) return;
    isCreated = true;

    const isLeft = config.position === 'left';
    const positionSide = isLeft ? 'left' : 'right';

    // ============== INJECT KEYFRAMES ==============
    style = document.createElement('style');
    style.id = 'upvote-widget-styles';
    style.textContent = `
      @keyframes upvote-pop-in {
        0% { opacity: 0; transform: scale(0.3) translateY(40px) rotate(-10deg); }
        50% { opacity: 1; transform: scale(1.1) translateY(-10px) rotate(5deg); }
        70% { transform: scale(0.95) translateY(2px) rotate(-2deg); }
        100% { opacity: 1; transform: scale(1) translateY(0) rotate(0); }
      }
      @keyframes upvote-slide-feedback {
        0% { opacity: 0; transform: scale(0) translateY(20px); filter: blur(10px); }
        100% { opacity: 1; transform: scale(1) translateY(-75px); filter: blur(0); }
      }
      @keyframes upvote-slide-support {
        0% { opacity: 0; transform: scale(0) translateY(20px); filter: blur(10px); }
        100% { opacity: 1; transform: scale(1) translateY(var(--upvote-supp-pos, -75px)); filter: blur(0); }
      }
      @keyframes upvote-slide-out {
        0% { opacity: 1; transform: scale(1) translateY(var(--y-pos)); filter: blur(0); }
        100% { opacity: 0; transform: scale(0) translateY(0); filter: blur(10px); }
      }
      @keyframes upvote-label-fade {
        0% { opacity: 0; transform: translateX(${isLeft ? '-20px' : '20px'}) scale(0.8); filter: blur(5px); }
        100% { opacity: 1; transform: translateX(0) scale(1); filter: blur(0); }
      }
      @keyframes upvote-genie-in {
        0% { opacity: 0; transform: scale(0.1) translateY(40px); border-radius: 100px; }
        60% { transform: scale(1.02) translateY(-10px); border-radius: 40px; }
        100% { opacity: 1; transform: scale(1) translateY(0); border-radius: 28px; }
      }
      #upvote-widget-button:hover {
        transform: scale(1.1) !important;
        box-shadow: 0 15px 35px -5px rgba(79, 70, 229, 0.45) !important;
      }
      .upvote-sub-btn:hover {
        transform: scale(1.15) !important;
        box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.25) !important;
      }
    `;
    document.head.appendChild(style);

    // ============== MAIN BUTTON ==============
    button = document.createElement('button');
    button.id = 'upvote-widget-button';
    button.innerHTML = `
      <picture style="display:block;">
        <source srcset="${scriptUrl}/logo-light.png" media="(prefers-color-scheme: dark)">
        <img src="${scriptUrl}/logo-dark.png" alt="UpVote" style="width: 60px; height: 60px; border-radius: 50%;display:block;margin:auto;object-fit:contain;">
      </picture>
    `;
    button.style.cssText = `
      position: fixed;
      bottom: 24px;
      ${positionSide}: 24px;
      z-index: 999999;
      width: 64px;
      height: 64px;
      background: linear-gradient(135deg, #6366f1, #4f46e5);
      border: none;
      cursor: pointer;
      padding: 0;
      border-radius: 10%;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 10px 30px -5px rgba(79, 70, 229, 0.4), 0 0 0 1px rgba(255,255,255,0.15) inset;
      transition: all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
      animation: upvote-pop-in 0.8s cubic-bezier(0.34, 1.56, 0.64, 1);
    `;

    // ============== SUB BUTTONS ==============
    function createSubButton(label, emoji, colorFrom, colorTo, className) {
      const wrapper = document.createElement('div');
      wrapper.style.cssText = `
        position: fixed;
        bottom: 24px;
        ${positionSide}: 24px;
        z-index: 999998;
        display: flex;
        align-items: center;
        gap: 12px;
        flex-direction: ${isLeft ? 'row' : 'row-reverse'};
        opacity: 0;
        pointer-events: none;
        transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
      `;
      wrapper.className = className;

      const btn = document.createElement('button');
      btn.className = 'upvote-sub-btn';
      btn.innerHTML = emoji;
      btn.style.cssText = `
        width: 52px;
        height: 52px;
        border-radius: 18px;
        background: linear-gradient(135deg, ${colorFrom}, ${colorTo});
        border: none;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 22px;
        box-shadow: 0 8px 25px -5px rgba(0, 0, 0, 0.2);
        transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
      `;

      const labelEl = document.createElement('span');
      labelEl.textContent = label;
      labelEl.style.cssText = `
        background: white;
        color: #18181b;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
        font-size: 13px;
        font-weight: 700;
        padding: 8px 16px;
        border-radius: 12px;
        box-shadow: 0 5px 15px -3px rgba(0,0,0,0.12);
        white-space: nowrap;
        opacity: 0;
        pointer-events: none;
        transition: all 0.3s ease;
      `;

      wrapper.appendChild(btn);
      wrapper.appendChild(labelEl);
      return { wrapper, btn, labelEl };
    }

    supportSub = createSubButton('Support', '🎧', '#34d399', '#10b981', 'upvote-support-btn');

    function toggleFeedback() {
      const hasUserId = !!config.userId;
      if (hasUserId && !feedbackSub) {
        feedbackSub = createSubButton('Feedback', '💬', '#818cf8', '#6366f1', 'upvote-feedback-btn');
        document.body.appendChild(feedbackSub.wrapper);
        feedbackSub.btn.onclick = (e) => { e.stopPropagation(); openWidget('feedback'); };
        feedbackSub.labelEl.onclick = (e) => { e.stopPropagation(); openWidget('feedback'); };
        if (menuOpen) showMenu(true);
      } else if (!hasUserId && feedbackSub) {
        if (menuOpen) {
          feedbackSub.wrapper.style.animation = 'upvote-slide-out 0.3s cubic-bezier(0.34, 0, 0.64, 1) forwards';
          setTimeout(() => {
            if (feedbackSub) {
              feedbackSub.wrapper.remove();
              feedbackSub = null;
            }
          }, 300);
        } else {
          feedbackSub.wrapper.remove();
          feedbackSub = null;
        }
      }
    }

    // ============== IFRAME CONTAINER ==============
    container = document.createElement('div');
    container.id = 'upvote-widget-container';
    container.style.cssText = `
      position: fixed;
      bottom: 100px;
      ${positionSide}: 24px;
      width: 440px;
      max-width: calc(100vw - 48px);
      height: 760px;
      max-height: calc(100vh - 140px);
      z-index: 1000000;
      background: #fff;
      border-radius: 32px;
      box-shadow: 0 35px 85px -15px rgba(0,0,0,0.3), 0 0 1px 0 rgba(0,0,0,0.1);
      transition: all 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
      overflow: hidden;
      opacity: 0;
      transform: translateY(40px) scale(0.9);
      pointer-events: none;
      border: 1px solid rgba(0,0,0,0.06);
    `;

    iframe = document.createElement('iframe');
    iframe.style.cssText = 'width:100%;height:100%;border:none;';

    container.appendChild(iframe);
    document.body.appendChild(button);
    document.body.appendChild(supportSub.wrapper);
    document.body.appendChild(container);

    toggleFeedback();

    // Event Handlers
    button.onclick = (e) => {
      e.stopPropagation();
      if (widgetOpen) closeWidget();
      else if (menuOpen) hideMenu();
      else showMenu();
    };

    supportSub.btn.onclick = (e) => { e.stopPropagation(); openWidget('support'); };
    supportSub.labelEl.onclick = (e) => { e.stopPropagation(); openWidget('support'); };

    // Store toggleFeedback globally for the observer
    window.__upvote_toggleFeedback = toggleFeedback;
  }

  function destroyUI() {
    if (!isCreated) return;

    // Explicitly remove all known elements
    if (button && button.remove) button.remove();
    if (container && container.remove) container.remove();
    if (style && style.remove) style.remove();

    // Clear sub-buttons
    if (feedbackSub && feedbackSub.wrapper && feedbackSub.wrapper.remove) {
      feedbackSub.wrapper.remove();
    }
    if (supportSub && supportSub.wrapper && supportSub.wrapper.remove) {
      supportSub.wrapper.remove();
    }

    // Floating element failsafe (search by ID/Class)
    const root = document.getElementById('upvote-widget-container');
    if (root) root.remove();
    const btn = document.getElementById('upvote-widget-button');
    if (btn) btn.remove();

    document.querySelectorAll('.upvote-feedback-btn, .upvote-support-btn').forEach(el => el.remove());

    isCreated = false;
    menuOpen = false;
    widgetOpen = false;
    feedbackSub = null;
    supportSub = null;
  }

  // Global cleanup for SPAs
  window.__upvote_cleanup = destroyUI;

  function showMenu(isRefresh = false) {
    menuOpen = true;
    const hasUserId = !!feedbackSub;

    if (hasUserId) {
      feedbackSub.wrapper.style.pointerEvents = 'auto';
      feedbackSub.wrapper.style.opacity = '1';
      feedbackSub.wrapper.style.animation = 'upvote-slide-feedback 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) forwards';
    }

    supportSub.wrapper.style.setProperty('--upvote-supp-pos', hasUserId ? '-145px' : '-75px');
    supportSub.wrapper.style.pointerEvents = 'auto';
    supportSub.wrapper.style.opacity = '1';
    supportSub.wrapper.style.animation = 'upvote-slide-support 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) forwards';

    if (!isRefresh) {
      setTimeout(() => {
        if (hasUserId) {
          feedbackSub.labelEl.style.opacity = '1';
          feedbackSub.labelEl.style.animation = 'upvote-label-fade 0.4s ease forwards';
          feedbackSub.labelEl.style.pointerEvents = 'auto';
        }
      }, 300);
      setTimeout(() => {
        supportSub.labelEl.style.opacity = '1';
        supportSub.labelEl.style.animation = 'upvote-label-fade 0.4s ease forwards';
        supportSub.labelEl.style.pointerEvents = 'auto';
      }, hasUserId ? 380 : 300);

      // button.style.transform = 'rotate(135deg)';
      button.style.background = 'linear-gradient(135deg, #ef4444, #dc2626)';
      button.style.boxShadow = '0 10px 30px -5px rgba(239, 68, 68, 0.4)';
    }
  }

  function hideMenu() {
    menuOpen = false;
    const hasUserId = !!feedbackSub;

    if (hasUserId) {
      feedbackSub.labelEl.style.opacity = '0';
      feedbackSub.labelEl.style.animation = 'none';
      feedbackSub.labelEl.style.pointerEvents = 'none';
    }
    supportSub.labelEl.style.opacity = '0';
    supportSub.labelEl.style.animation = 'none';
    supportSub.labelEl.style.pointerEvents = 'none';

    supportSub.wrapper.style.setProperty('--y-pos', hasUserId ? '-145px' : '-75px');
    supportSub.wrapper.style.animation = 'upvote-slide-out 0.3s cubic-bezier(0.34, 0, 0.64, 1) forwards';
    supportSub.wrapper.style.pointerEvents = 'none';

    setTimeout(() => {
      if (feedbackSub) {
        feedbackSub.wrapper.style.setProperty('--y-pos', '-75px');
        feedbackSub.wrapper.style.animation = 'upvote-slide-out 0.3s cubic-bezier(0.34, 0, 0.64, 1) forwards';
        feedbackSub.wrapper.style.pointerEvents = 'none';
      }
    }, hasUserId ? 60 : 0);

    button.style.transform = 'rotate(0deg)';
    button.style.background = 'linear-gradient(135deg, #6366f1, #4f46e5)';
    button.style.boxShadow = '0 10px 30px -5px rgba(79, 70, 229, 0.4)';
  }

  function openWidget(mode) {
    widgetOpen = true;
    hideMenu();

    const params = new URLSearchParams({
      applicationId: config.applicationId,
      userId: config.userId || '',
      email: config.email,
      theme: config.theme,
      mode: mode
    });
    iframe.src = `${scriptUrl}/widget?${params.toString()}`;

    setTimeout(() => {
      container.style.opacity = '1';
      container.style.transform = 'translateY(0) scale(1)';
      container.style.animation = 'upvote-genie-in 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)';
      container.style.pointerEvents = 'auto';
      button.style.opacity = '0.5';
      button.style.transform = 'scale(0.8) translateY(10px) rotate(0deg)';
    }, 150);
  }

  function closeWidget() {
    widgetOpen = false;
    container.style.opacity = '0';
    container.style.transform = 'translateY(40px) scale(0.9)';
    container.style.animation = 'none';
    container.style.pointerEvents = 'none';
    button.style.opacity = '1';
    button.style.transform = 'scale(1) rotate(0deg) translateY(0)';
  }

  // ============== INITIALIZE ==============
  // ============== LIFECYCLE MANAGEMENT ==============
  let widgetObserver = null;

  function handleWidgetChange(div) {
    if (!div) {
      if (isCreated) destroyUI();
      return;
    }

    updateConfig(div);
    const isValid = validate();

    if (isValid && !isCreated) {
      initUI();
    } else if (!isValid && isCreated) {
      destroyUI();
    } else if (isValid && isCreated) {
      // Dynamic updates
      if (window.__upvote_toggleFeedback) window.__upvote_toggleFeedback();

      if (widgetOpen && iframe) {
        const url = new URL(iframe.src);
        const currentUserId = url.searchParams.get('userId');
        const currentMode = url.searchParams.get('mode') || 'feedback';

        // Refresh iframe if user ID changed
        if (currentUserId !== (config.userId || '')) {
          openWidget(currentMode);
        }
      }
    }
  }

  function scanForWidget() {
    const div = document.querySelector('.upvote-widget');

    if (div !== currentWidgetDiv) {
      if (widgetObserver) {
        widgetObserver.disconnect();
        widgetObserver = null;
      }

      currentWidgetDiv = div;
      handleWidgetChange(div);

      if (div) {
        widgetObserver = new MutationObserver(() => handleWidgetChange(div));
        widgetObserver.observe(div, { attributes: true });
      }
    }
  }

  // Poll every 500ms to automatically handle SPA route changes & dynamic mounting
  setInterval(scanForWidget, 500);
  scanForWidget();


  // Global Listeners (Shared)
  window.addEventListener('message', (event) => {
    if (event.data.type === 'upvote:close') closeWidget();
  });

  document.addEventListener('click', (event) => {
    if (menuOpen && !button.contains(event.target) &&
      (!feedbackSub || !feedbackSub.wrapper.contains(event.target)) &&
      !supportSub.wrapper.contains(event.target)) {
      hideMenu();
    }
    if (widgetOpen && !container.contains(event.target) && !button.contains(event.target)) {
      closeWidget();
    }
  });
})();
