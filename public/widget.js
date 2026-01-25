(function () {
  // Find widget div
  const widgetDiv = document.querySelector('.upvote-widget');

  let config = {};
  if (widgetDiv) {
    config = {
      applicationId: widgetDiv.getAttribute('data-application-id'),
      userId: widgetDiv.getAttribute('data-user-id'),
      position: widgetDiv.getAttribute('data-position') || 'right',
      theme: widgetDiv.getAttribute('data-theme') || 'light'
    };
  } else if (window.UpVoteConfig) {
    config = window.UpVoteConfig;
  }

  if (!config.applicationId || !config.userId) {
    console.warn('UpVote: applicationId and userId are required');
    return;
  }

  // Get script domain
  const scripts = document.getElementsByTagName('script');
  let scriptUrl = window.location.origin;
  for (let i = 0; i < scripts.length; i++) {
    if (scripts[i].src.includes('widget.js')) {
      try {
        scriptUrl = new URL(scripts[i].src).origin;
      } catch (e) {
        scriptUrl = window.location.origin;
      }
      break;
    }
  }

  // Create floating button with logo image
  const button = document.createElement('button');
  button.id = 'upvote-widget-button';

  const isLeft = config.position === 'left';

  // Use icon.png as the logo
  button.innerHTML = `<img src="${scriptUrl}/icon.png" alt="UpVote" style="width:28px;height:28px;display:block;">`;

  button.style.cssText = `
    position: fixed;
    bottom: 20px;
    ${isLeft ? 'left: 20px;' : 'right: 20px;'}
    z-index: 999999;
    width: 48px;
    height: 48px;
    background: #fff;
    border: 1px solid rgba(0,0,0,0.1);
    border-radius: 14px;
    cursor: pointer;
    padding: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 4px 16px -2px rgba(0, 0, 0, 0.1);
    transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  `;

  button.onmouseover = () => {
    button.style.transform = 'scale(1.1)';
    button.style.boxShadow = '0 8px 24px -4px rgba(0, 0, 0, 0.15)';
  };
  button.onmouseout = () => {
    button.style.transform = 'scale(1)';
    button.style.boxShadow = '0 4px 16px -2px rgba(0, 0, 0, 0.1)';
  };

  // Create iframe container for widget
  const container = document.createElement('div');
  container.id = 'upvote-widget-container';
  container.style.cssText = `
    position: fixed;
    bottom: 80px;
    ${isLeft ? 'left: 20px;' : 'right: 20px;'}
    width: 400px;
    max-width: calc(100vw - 40px);
    height: 700px;
    max-height: calc(100vh - 110px);
    z-index: 1000000;
    background: #fff;
    border-radius: 24px;
    box-shadow: 0 20px 60px -10px rgba(0,0,0,0.2), 0 0 1px 0 rgba(0,0,0,0.1);
    transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
    overflow: hidden;
    opacity: 0;
    transform: translateY(20px) scale(0.95);
    pointer-events: none;
    border: 1px solid rgba(0,0,0,0.05);
  `;

  const iframe = document.createElement('iframe');
  const params = new URLSearchParams({
    applicationId: config.applicationId,
    userId: config.userId,
    theme: config.theme || 'light'
  });

  iframe.src = `${scriptUrl}/widget?${params.toString()}`;
  iframe.style.cssText = 'width:100%;height:100%;border:none;';

  container.appendChild(iframe);
  document.body.appendChild(button);
  document.body.appendChild(container);

  let isOpen = false;
  button.onclick = () => {
    isOpen = !isOpen;
    if (isOpen) {
      container.style.opacity = '1';
      container.style.transform = 'translateY(0) scale(1)';
      container.style.pointerEvents = 'auto';
      button.style.transform = 'scale(0.95) rotate(3deg)';
      button.style.opacity = '0.7';
    } else {
      container.style.opacity = '0';
      container.style.transform = 'translateY(20px) scale(0.95)';
      container.style.pointerEvents = 'none';
      button.style.transform = 'scale(1) rotate(0)';
      button.style.opacity = '1';
    }
  };

  // Close when receiving message
  window.addEventListener('message', (event) => {
    if (event.data.type === 'upvote:close') {
      isOpen = false;
      container.style.opacity = '0';
      container.style.transform = 'translateY(20px) scale(0.95)';
      container.style.pointerEvents = 'none';
      button.style.transform = 'scale(1) rotate(0)';
      button.style.opacity = '1';
    }
  });
})();
