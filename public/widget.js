(function () {
  if (window.__monkfeed_widget_initialized) return;
  window.__monkfeed_widget_initialized = true;

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
    
    let resolvedLogo = div.getAttribute('data-logo-url') || '';
    if (resolvedLogo && !resolvedLogo.startsWith('http') && !resolvedLogo.startsWith('data:')) {
      try {
        resolvedLogo = new URL(resolvedLogo, window.location.href).href;
      } catch(e) {}
    }

    config = {
      applicationId: div.getAttribute('data-application-id'),
      userId: div.getAttribute('data-user-id') || null,
      email: div.getAttribute('data-email') || null,
      position: div.getAttribute('data-position') || 'right',
      // Custom widget configuration
      logoUrl: resolvedLogo,
      productOverview: div.getAttribute('data-product-overview') || '',
      aboutText: div.getAttribute('data-about-text') || '',
      faqs: div.getAttribute('data-faqs') ? JSON.parse(div.getAttribute('data-faqs')) : [],
      primaryColor: div.getAttribute('data-primary-color') || '#4f46e5',
      secondaryColor: div.getAttribute('data-secondary-color') || '#6366f1',
      bgColor: div.getAttribute('data-bg-color') || '#ffffff',
      textColor: div.getAttribute('data-text-color') || '#18181b',
      launcherColor: div.getAttribute('data-launcher-color') || '#4f46e5',
      launcherActiveColor: div.getAttribute('data-launcher-active-color') || '#ef4444',
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
    style.id = 'monkfeed-widget-styles';
    style.textContent = `
      @keyframes monkfeed-fade-in {
        0% { opacity: 0; transform: scale(0.95); }
        100% { opacity: 1; transform: scale(1); }
      }
      @keyframes monkfeed-slide-up-feedback {
        0% { opacity: 0; transform: translateY(20px); }
        100% { opacity: 1; transform: translateY(-75px); }
      }
      @keyframes monkfeed-slide-up-support {
        0% { opacity: 0; transform: translateY(20px); }
        100% { opacity: 1; transform: translateY(var(--monkfeed-supp-pos, -75px)); }
      }
      @keyframes monkfeed-fade-out {
        0% { opacity: 1; transform: translateY(0); }
        100% { opacity: 0; transform: translateY(10px); }
      }
      @keyframes monkfeed-label-appear {
        0% { opacity: 0; transform: translateX(${isLeft ? '-10px' : '10px'}); }
        100% { opacity: 1; transform: translateX(0); }
      }
      @keyframes monkfeed-container-enter {
        0% { opacity: 0; transform: translateY(20px); }
        100% { opacity: 1; transform: translateY(0); }
      }
      @keyframes monkfeed-orbit {
        0% { 
          transform: rotate(0deg) translateX(28px) rotate(0deg);
        }
        100% { 
          transform: rotate(360deg) translateX(28px) rotate(-360deg);
        }
      }
      #monkfeed-widget-button:hover {
        transform: scale(1.05) !important;
        box-shadow: 0 8px 20px rgba(79, 70, 229, 0.3) !important;
      }
      .monkfeed-sub-btn:hover {
        transform: scale(1.08) !important;
        box-shadow: 0 6px 15px rgba(0, 0, 0, 0.15) !important;
      }
    `;
    document.head.appendChild(style);

    // ============== MAIN BUTTON ==============
    button = document.createElement('button');
    button.id = 'monkfeed-widget-button';
    const logoSrc = config.logoUrl || `${scriptUrl}/favicon.png`;
    button.innerHTML = `
      <div style="position: relative; width: 100%; height: 100%; display: flex; align-items: center; justify-content: center;">
        <span style="position: absolute; width: 8px; height: 8px; background: #ef4444; border-radius: 50%; box-shadow: 0 2px 4px rgba(239, 68, 68, 0.4); z-index: 1; animation: monkfeed-orbit 3s linear infinite; "></span>
        <img src="${logoSrc}" alt="Widget" style="width: 32px; height: 32px; border-radius: 50%;display:block;margin:auto;object-fit:contain;">
      </div>
    `;
    button.style.cssText = `
      position: fixed;
      bottom: 24px;
      ${positionSide}: 24px;
      z-index: 999999;
      width: 56px;
      height: 56px;
      background: ${config.launcherColor};
      border: 2px solid rgba(255, 255, 255, 0.9);
      cursor: pointer;
      padding: 0;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 4px 12px ${config.launcherColor}66, 0 0 0 1px rgba(0,0,0,0.05);
      transition: all 0.2s ease-out;
      animation: monkfeed-fade-in 0.25s ease-out;
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
        gap: 10px;
        flex-direction: ${isLeft ? 'row' : 'row-reverse'};
        opacity: 0;
        pointer-events: none;
        transition: all 0.2s ease-out;
      `;
      wrapper.className = className;

      const btn = document.createElement('button');
      btn.className = 'monkfeed-sub-btn';
      btn.innerHTML = emoji;
      btn.style.cssText = `
        width: 44px;
        height: 44px;
        border-radius: 12px;
        background: white;
        border: 2px solid ${colorFrom};
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 20px;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
        transition: all 0.2s ease-out;
      `;

      const labelEl = document.createElement('span');
      labelEl.textContent = label;
      labelEl.style.cssText = `
        background: white;
        color: #18181b;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
        font-size: 12px;
        font-weight: 600;
        padding: 6px 12px;
        border-radius: 8px;
        box-shadow: 0 2px 8px rgba(0,0,0,0.08);
        white-space: nowrap;
        opacity: 0;
        pointer-events: none;
        transition: all 0.2s ease-out;
        border: 1px solid rgba(0,0,0,0.06);
      `;

      wrapper.appendChild(btn);
      wrapper.appendChild(labelEl);
      return { wrapper, btn, labelEl };
    }

    supportSub = createSubButton('Support', '🎧', '#34d399', '#10b981', 'monkfeed-support-btn');

    function toggleFeedback() {
      const hasUserId = !!config.userId;
      if (hasUserId && !feedbackSub) {
        feedbackSub = createSubButton('Feedback', '💬', '#818cf8', '#6366f1', 'monkfeed-feedback-btn');
        document.body.appendChild(feedbackSub.wrapper);
        feedbackSub.btn.onclick = (e) => { e.stopPropagation(); openWidget('feedback'); };
        feedbackSub.labelEl.onclick = (e) => { e.stopPropagation(); openWidget('feedback'); };
        if (menuOpen) hideMenu(true);
      } else if (!hasUserId && feedbackSub) {
        if (menuOpen) {
          feedbackSub.wrapper.style.animation = 'monkfeed-fade-out 0.2s ease-out forwards';
          setTimeout(() => {
            if (feedbackSub) {
              feedbackSub.wrapper.remove();
              feedbackSub = null;
            }
          }, 200);
        } else {
          feedbackSub.wrapper.remove();
          feedbackSub = null;
        }
      }
    }

    // ============== IFRAME CONTAINER ==============
    container = document.createElement('div');
    container.id = 'monkfeed-widget-container';
    container.style.cssText = `
      position: fixed;
      bottom: 100px;
      ${positionSide}: 24px;
      width: 420px;
      max-width: calc(100vw - 48px);
      height: 720px;
      max-height: calc(100vh - 120px);
      z-index: 1000000;
      background: #fff;
      border-radius: 16px;
      box-shadow: 0 8px 30px rgba(0,0,0,0.12), 0 0 0 1px rgba(0,0,0,0.06);
      transition: all 0.25s ease-out;
      overflow: hidden;
      opacity: 0;
      transform: translateY(20px);
      pointer-events: none;
      border: 1px solid rgba(0,0,0,0.08);
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
    window.__monkfeed_toggleFeedback = toggleFeedback;
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
    const root = document.getElementById('monkfeed-widget-container');
    if (root) root.remove();
    const btn = document.getElementById('monkfeed-widget-button');
    if (btn) btn.remove();

    document.querySelectorAll('.monkfeed-feedback-btn, .monkfeed-support-btn').forEach(el => el.remove());

    isCreated = false;
    menuOpen = false;
    widgetOpen = false;
    feedbackSub = null;
    supportSub = null;
  }

  // Global cleanup for SPAs
  window.__monkfeed_cleanup = destroyUI;

  function showMenu(isRefresh = false) {
    menuOpen = true;
    const hasUserId = !!feedbackSub;

    if (hasUserId) {
      feedbackSub.wrapper.style.pointerEvents = 'auto';
      feedbackSub.wrapper.style.opacity = '1';
      feedbackSub.wrapper.style.animation = 'monkfeed-slide-up-feedback 0.25s ease-out forwards';
    }

    supportSub.wrapper.style.setProperty('--monkfeed-supp-pos', hasUserId ? '-135px' : '-65px');
    supportSub.wrapper.style.pointerEvents = 'auto';
    supportSub.wrapper.style.opacity = '1';
    supportSub.wrapper.style.animation = 'monkfeed-slide-up-support 0.25s ease-out forwards';

    if (!isRefresh) {
      setTimeout(() => {
        if (hasUserId) {
          feedbackSub.labelEl.style.opacity = '1';
          feedbackSub.labelEl.style.animation = 'monkfeed-label-appear 0.2s ease-out forwards';
          feedbackSub.labelEl.style.pointerEvents = 'auto';
        }
      }, 150);
      setTimeout(() => {
        supportSub.labelEl.style.opacity = '1';
        supportSub.labelEl.style.animation = 'monkfeed-label-appear 0.2s ease-out forwards';
        supportSub.labelEl.style.pointerEvents = 'auto';
      }, hasUserId ? 200 : 150);

      button.style.background = config.launcherActiveColor;
      button.style.boxShadow = `0 4px 12px ${config.launcherActiveColor}66`;
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

    supportSub.wrapper.style.setProperty('--y-pos', hasUserId ? '-135px' : '-65px');
    supportSub.wrapper.style.animation = 'monkfeed-fade-out 0.2s ease-out forwards';
    supportSub.wrapper.style.pointerEvents = 'none';

    setTimeout(() => {
      if (feedbackSub) {
        feedbackSub.wrapper.style.setProperty('--y-pos', '-65px');
        feedbackSub.wrapper.style.animation = 'monkfeed-fade-out 0.2s ease-out forwards';
        feedbackSub.wrapper.style.pointerEvents = 'none';
      }
      supportSub.wrapper.style.animation = 'monkfeed-fade-out 0.2s ease-out forwards';
    }, hasUserId ? 40 : 0);

    button.style.background = config.launcherColor;
    button.style.boxShadow = `0 4px 12px ${config.launcherColor}66, 0 0 0 1px rgba(0,0,0,0.05)`;
  }

  function openWidget(mode) {
    widgetOpen = true;
    hideMenu();

    const params = new URLSearchParams({
      applicationId: config.applicationId,
      userId: config.userId || '',
      email: config.email || '',
      mode: mode,
      // Pass custom widget configuration
      logoUrl: config.logoUrl || '',
      productOverview: config.productOverview || '',
      aboutText: config.aboutText || '',
      faqs: config.faqs ? JSON.stringify(config.faqs) : '',
      primaryColor: config.primaryColor,
      secondaryColor: config.secondaryColor,
      bgColor: config.bgColor,
      textColor: config.textColor
    });
    iframe.src = `${scriptUrl}/widget?${params.toString()}`;

    setTimeout(() => {
      container.style.opacity = '1';
      container.style.transform = 'translateY(0)';
      container.style.animation = 'monkfeed-container-enter 0.3s ease-out forwards';
      container.style.pointerEvents = 'auto';
      button.style.opacity = '0.6';
      button.style.transform = 'scale(0.9)';
    }, 100);
  }

  function closeWidget() {
    widgetOpen = false;
    container.style.opacity = '0';
    container.style.transform = 'translateY(20px)';
    container.style.animation = 'none';
    container.style.pointerEvents = 'none';
    button.style.opacity = '1';
    button.style.transform = 'scale(1)';
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
      if (window.__monkfeed_toggleFeedback) window.__monkfeed_toggleFeedback();

      if (widgetOpen && iframe) {
        const url = new URL(iframe.src);
        const currentUserId = url.searchParams.get('userId');
        const currentMode = url.searchParams.get('mode') || 'feedback';
        const currentLogoUrl = config.logoUrl;
        const currentProductOverview = config.productOverview;
        const currentAboutText = config.aboutText;
        const currentFaqs = config.faqs ? JSON.stringify(config.faqs) : '';
        const currentPrimaryColor = config.primaryColor;
        const currentSecondaryColor = config.secondaryColor;
        const currentBgColor = config.bgColor;
        const currentTextColor = config.textColor;

        // Refresh iframe if user ID or configuration changed
        if (currentUserId !== (config.userId || '') || 
            currentLogoUrl !== config.logoUrl ||
            currentProductOverview !== config.productOverview ||
            currentAboutText !== config.aboutText ||
            currentFaqs !== (config.faqs ? JSON.stringify(config.faqs) : '') ||
            currentPrimaryColor !== url.searchParams.get('primaryColor') ||
            currentSecondaryColor !== url.searchParams.get('secondaryColor') ||
            currentBgColor !== url.searchParams.get('bgColor') ||
            currentTextColor !== url.searchParams.get('textColor')) {
          openWidget(currentMode);
        }
      }
    }
  }

  function scanForWidget() {
    const div = document.querySelector('.monkfeed-widget');

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
    if (event.data.type === 'monkfeed:close') closeWidget();
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
