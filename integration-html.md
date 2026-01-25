# HTML/JS Integration Guide

The simplest way to integrate UpVote into any website using plain HTML and JavaScript.

## 1. Add the Widget Container
Place this `div` where you want the widget configuration to be read from. Usually, just before the closing `</body>` tag is fine.

```html
<div class="upvote-widget" 
     data-application-id="YOUR_APPLICATION_ID" 
     data-user-id="USER_ID_FROM_YOUR_AUTH_SYSTEM"
     data-position="right"
     data-theme="light">
</div>
```

| Attribute | Description | Required |
|-----------|-------------|----------|
| `data-application-id` | Your unique UpVote application ID | Yes |
| `data-user-id` | The unique ID of the currently logged-in user | Yes |
| `data-position` | `right` or `left` | No (default: `right`) |
| `data-theme` | `light` or `dark` | No (default: `light`) |

## 2. Load the Script
Add this script tag to your page. It will automatically find the container and inject the feedback button.

```html
<script src="https://your-upvote-domain.com/widget.js" async></script>
```

---

## Alternative: JavaScript Configuration
If you prefer to configure the widget via JavaScript instead of data attributes:

```html
<script>
  window.UpVoteConfig = {
    applicationId: "YOUR_APPLICATION_ID",
    userId: "USER_ID_FROM_YOUR_AUTH_SYSTEM",
    position: "right",
    theme: "light"
  };
</script>
<script src="https://your-upvote-domain.com/widget.js" async></script>
```
