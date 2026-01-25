# General Integration Guide (jQuery, Svelte, etc.)

Instructions for other popular frameworks and libraries.

## 1. jQuery
Wait until the DOM is ready, then add the configuration and load the script.

```javascript
$(document).ready(function() {
  $('body').append('<div class="upvote-widget" data-application-id="app_xxx" data-user-id="user_123"></div>');
  
  $.getScript('https://your-upvote-domain.com/widget.js');
});
```

## 2. Svelte
Use the `onMount` lifecycle hook.

```svelte
<script>
  import { onMount, onDestroy } from 'svelte';
  
  export let applicationId;
  export let userId;

  let widgetDiv;
  let scriptTag;

  onMount(() => {
    widgetDiv = document.createElement('div');
    widgetDiv.className = 'upvote-widget';
    widgetDiv.setAttribute('data-application-id', applicationId);
    widgetDiv.setAttribute('data-user-id', userId);
    document.body.appendChild(widgetDiv);

    scriptTag = document.createElement('script');
    scriptTag.src = 'https://your-upvote-domain.com/widget.js';
    scriptTag.async = true;
    document.body.appendChild(scriptTag);
  });

  onDestroy(() => {
    if (widgetDiv) widgetDiv.remove();
    if (scriptTag) scriptTag.remove();
  });
</script>
```

## 3. Web Components (Custom Element)
If you want to use it as a custom element:

```javascript
class UpVoteWidget extends HTMLElement {
  connectedCallback() {
    const appId = this.getAttribute('app-id');
    const userId = this.getAttribute('user-id');
    
    this.innerHTML = `<div class="upvote-widget" data-application-id="${appId}" data-user-id="${userId}"></div>`;
    
    const script = document.createElement('script');
    script.src = 'https://your-upvote-domain.com/widget.js';
    script.async = true;
    document.body.appendChild(script);
  }
}
customElements.define('upvote-widget', UpVoteWidget);
```
Usage: `<upvote-widget app-id="app_xxx" user-id="user_123"></upvote-widget>`
---
## Security Best Practice
Always ensure that the `userId` passed to the widget is coming from a trusted source (e.g., your server-side session) and not easily manipulatable by the end-user via the console.
