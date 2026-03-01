(function () {
  const widgetDiv = document.querySelector('.upvote-widget');
  if (!widgetDiv) return;

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

  function updateConfig() {
    config = {
      applicationId: widgetDiv.getAttribute('data-application-id'),
      userId: widgetDiv.getAttribute('data-user-id'),
      email: widgetDiv.getAttribute('data-email') || '',
      position: widgetDiv.getAttribute('data-position') || 'right',
      theme: widgetDiv.getAttribute('data-theme') || 'light'
    };
  }

  function validate() {
    return !!(config.applicationId && config.userId && config.email);
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
        0% { opacity: 0; transform: scale(0.3) translateY(20px); }
        60% { transform: scale(1.08) translateY(-4px); }
        100% { opacity: 1; transform: scale(1) translateY(0); }
      }
      @keyframes upvote-slide-feedback {
        0% { opacity: 0; transform: translate(0, 0) scale(0.4); }
        40% { opacity: 1; transform: translate(${isLeft ? '15px' : '-15px'}, -50px) scale(0.9); }
        70% { transform: translate(${isLeft ? '-3px' : '3px'}, -78px) scale(1.05); }
        100% { opacity: 1; transform: translate(0, -75px) scale(1); }
      }
      @keyframes upvote-slide-support {
        0% { opacity: 0; transform: translate(0, 0) scale(0.4); }
        40% { opacity: 1; transform: translate(${isLeft ? '25px' : '-25px'}, -110px) scale(0.9); }
        70% { transform: translate(${isLeft ? '-5px' : '5px'}, -148px) scale(1.05); }
        100% { opacity: 1; transform: translate(0, -145px) scale(1); }
      }
      @keyframes upvote-slide-out-feedback {
        0% { opacity: 1; transform: translate(0, -75px) scale(1); }
        100% { opacity: 0; transform: translate(0, 0) scale(0.3); }
      }
      @keyframes upvote-slide-out-support {
        0% { opacity: 1; transform: translate(0, -145px) scale(1); }
        100% { opacity: 0; transform: translate(0, 0) scale(0.3); }
      }
      @keyframes upvote-label-fade {
        0% { opacity: 0; transform: translateX(${isLeft ? '-8px' : '8px'}); }
        100% { opacity: 1; transform: translateX(0); }
      }
      #upvote-widget-button:hover {
        transform: scale(1.08) !important;
        box-shadow: 0 12px 32px -4px rgba(79, 70, 229, 0.35) !important;
      }
      .upvote-sub-btn:hover {
        transform: scale(1.12) !important;
        box-shadow: 0 8px 24px -4px rgba(0, 0, 0, 0.2) !important;
      }
    `;
    document.head.appendChild(style);

    // ============== MAIN BUTTON ==============
    button = document.createElement('button');
    button.id = 'upvote-widget-button';
    button.innerHTML = `<img src="${scriptUrl}/icon.png" alt="UpVote" style="width:36px;height:36px;display:block;">`;
    button.style.cssText = `
      position: fixed;
      bottom: 24px;
      ${positionSide}: 24px;
      z-index: 999999;
      width: 64px;
      height: 64px;
      background: linear-gradient(135deg, #6366f1, #4f46e5);
      border: none;
      border-radius: 20px;
      cursor: pointer;
      padding: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 8px 24px -4px rgba(79, 70, 229, 0.4), 0 0 0 1px rgba(255,255,255,0.1) inset;
      transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
      animation: upvote-pop-in 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
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
        transition: none;
      `;
      wrapper.className = className;

      const btn = document.createElement('button');
      btn.className = 'upvote-sub-btn';
      btn.innerHTML = emoji;
      btn.style.cssText = `
        width: 52px;
        height: 52px;
        border-radius: 16px;
        background: linear-gradient(135deg, ${colorFrom}, ${colorTo});
        border: none;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 22px;
        box-shadow: 0 6px 20px -4px rgba(0, 0, 0, 0.15);
        transition: transform 0.2s ease, box-shadow 0.2s ease;
      `;

      const labelEl = document.createElement('span');
      labelEl.textContent = label;
      labelEl.style.cssText = `
        background: white;
        color: #18181b;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
        font-size: 13px;
        font-weight: 700;
        padding: 6px 14px;
        border-radius: 10px;
        box-shadow: 0 4px 12px -2px rgba(0,0,0,0.1);
        white-space: nowrap;
        opacity: 0;
        pointer-events: none;
      `;

      wrapper.appendChild(btn);
      wrapper.appendChild(labelEl);
      return { wrapper, btn, labelEl };
    }

    feedbackSub = createSubButton('Feedback', '💬', '#818cf8', '#6366f1', 'upvote-feedback-btn');
    supportSub = createSubButton('Support', '🎧', '#34d399', '#10b981', 'upvote-support-btn');

    // ============== IFRAME CONTAINER ==============
    container = document.createElement('div');
    container.id = 'upvote-widget-container';
    container.style.cssText = `
      position: fixed;
      bottom: 100px;
      ${positionSide}: 24px;
      width: 420px;
      max-width: calc(100vw - 48px);
      height: 720px;
      max-height: calc(100vh - 130px);
      z-index: 1000000;
      background: #fff;
      border-radius: 28px;
      box-shadow: 0 25px 65px -12px rgba(0,0,0,0.25), 0 0 1px 0 rgba(0,0,0,0.1);
      transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
      overflow: hidden;
      opacity: 0;
      transform: translateY(20px) scale(0.95);
      pointer-events: none;
      border: 1px solid rgba(0,0,0,0.05);
    `;

    iframe = document.createElement('iframe');
    iframe.style.cssText = 'width:100%;height:100%;border:none;';

    container.appendChild(iframe);
    document.body.appendChild(button);
    document.body.appendChild(feedbackSub.wrapper);
    document.body.appendChild(supportSub.wrapper);
    document.body.appendChild(container);

    // Event Handlers
    button.onclick = (e) => {
      e.stopPropagation();
      if (widgetOpen) closeWidget();
      else if (menuOpen) hideMenu();
      else showMenu();
    };

    feedbackSub.btn.onclick = (e) => { e.stopPropagation(); openWidget('feedback'); };
    feedbackSub.labelEl.onclick = (e) => { e.stopPropagation(); openWidget('feedback'); };
    supportSub.btn.onclick = (e) => { e.stopPropagation(); openWidget('support'); };
    supportSub.labelEl.onclick = (e) => { e.stopPropagation(); openWidget('support'); };
  }

  function destroyUI() {
    if (!isCreated) return;
    if (button) button.remove();
    if (feedbackSub) feedbackSub.wrapper.remove();
    if (supportSub) supportSub.wrapper.remove();
    if (container) container.remove();
    if (style) style.remove();
    isCreated = false;
    menuOpen = false;
    widgetOpen = false;
  }

  function showMenu() {
    menuOpen = true;
    feedbackSub.wrapper.style.pointerEvents = 'auto';
    feedbackSub.wrapper.style.opacity = '1';
    feedbackSub.wrapper.style.animation = 'upvote-slide-feedback 0.45s cubic-bezier(0.34, 1.56, 0.64, 1) forwards';

    setTimeout(() => {
      supportSub.wrapper.style.pointerEvents = 'auto';
      supportSub.wrapper.style.opacity = '1';
      supportSub.wrapper.style.animation = 'upvote-slide-support 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) forwards';
    }, 80);

    setTimeout(() => {
      feedbackSub.labelEl.style.opacity = '1';
      feedbackSub.labelEl.style.animation = 'upvote-label-fade 0.3s ease forwards';
      feedbackSub.labelEl.style.pointerEvents = 'auto';
    }, 300);
    setTimeout(() => {
      supportSub.labelEl.style.opacity = '1';
      supportSub.labelEl.style.animation = 'upvote-label-fade 0.3s ease forwards';
      supportSub.labelEl.style.pointerEvents = 'auto';
    }, 380);

    button.style.transform = 'rotate(45deg)';
  }

  function hideMenu() {
    menuOpen = false;
    feedbackSub.labelEl.style.opacity = '0';
    feedbackSub.labelEl.style.animation = 'none';
    feedbackSub.labelEl.style.pointerEvents = 'none';
    supportSub.labelEl.style.opacity = '0';
    supportSub.labelEl.style.animation = 'none';
    supportSub.labelEl.style.pointerEvents = 'none';

    supportSub.wrapper.style.animation = 'upvote-slide-out-support 0.25s cubic-bezier(0.55, 0, 1, 0.45) forwards';
    supportSub.wrapper.style.pointerEvents = 'none';

    setTimeout(() => {
      feedbackSub.wrapper.style.animation = 'upvote-slide-out-feedback 0.25s cubic-bezier(0.55, 0, 1, 0.45) forwards';
      feedbackSub.wrapper.style.pointerEvents = 'none';
    }, 60);

    button.style.transform = 'rotate(0deg)';
  }

  function openWidget(mode) {
    widgetOpen = true;
    hideMenu();

    const params = new URLSearchParams({
      applicationId: config.applicationId,
      userId: config.userId,
      email: config.email,
      theme: config.theme,
      mode: mode
    });
    iframe.src = `${scriptUrl}/widget?${params.toString()}`;

    setTimeout(() => {
      container.style.opacity = '1';
      container.style.transform = 'translateY(0) scale(1)';
      container.style.pointerEvents = 'auto';
      button.style.opacity = '0.7';
      button.style.transform = 'scale(0.9)';
    }, 200);
  }

  function closeWidget() {
    widgetOpen = false;
    container.style.opacity = '0';
    container.style.transform = 'translateY(20px) scale(0.95)';
    container.style.pointerEvents = 'none';
    button.style.opacity = '1';
    button.style.transform = 'scale(1) rotate(0deg)';
  }

  // ============== INITIALIZE ==============
  updateConfig();
  if (validate()) {
    initUI();
  }

  // ============== OBSERVE CHANGES ==============
  const observer = new MutationObserver(() => {
    updateConfig();
    const isValid = validate();

    if (isValid && !isCreated) {
      initUI();
    } else if (!isValid && isCreated) {
      destroyUI();
    } else if (isValid && isCreated) {
      // Re-initialize if essential params changed (like user switch)
      if (widgetOpen) {
        // If widget is open, refresh the iframe with new config
        const currentMode = new URL(iframe.src).searchParams.get('mode') || 'feedback';
        openWidget(currentMode);
      }
    }
  });

  observer.observe(widgetDiv, { attributes: true });

  // Global Listeners (Shared)
  window.addEventListener('message', (event) => {
    if (event.data.type === 'upvote:close') closeWidget();
  });

  document.addEventListener('click', (event) => {
    if (menuOpen && !button.contains(event.target) &&
      !feedbackSub.wrapper.contains(event.target) &&
      !supportSub.wrapper.contains(event.target)) {
      hideMenu();
    }
    if (widgetOpen && !container.contains(event.target) && !button.contains(event.target)) {
      closeWidget();
    }
  });
})();
