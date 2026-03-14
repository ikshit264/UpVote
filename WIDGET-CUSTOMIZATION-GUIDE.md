# Custom Widget Configuration Guide

The UpVote widget now supports full customization including custom logos, product information, and FAQs through data attributes.

## Basic Usage

```html
<div 
  class="upvote-widget"
  data-application-id="your-app-id"
  data-user-id="user-id"
  data-email="user@example.com"
  data-position="right"
  data-theme="light"
></div>
<script src="http://localhost:3000/widget.js"></script>
```

## Custom Logo

Add a custom logo to the widget button and header:

```html
<div 
  class="upvote-widget"
  data-application-id="your-app-id"
  data-user-id="user-id"
  data-logo-url="https://yourdomain.com/logo.png"
></div>
```

**Notes:**
- If no `data-logo-url` is provided, the default UpVote favicon will be used
- The logo should be a square image (recommended: 128x128px or larger)
- Supported formats: PNG, JPG, SVG, WebP
- The logo appears on both the widget button and in the FAQ section header

## Custom Product Overview

Display custom product information in the FAQ tab:

```html
<div 
  class="upvote-widget"
  data-application-id="your-app-id"
  data-product-overview="Your custom product description here. Explain what your product does and how feedback helps improve it."
></div>
```

## Custom About Text

Add custom "About" information:

```html
<div 
  class="upvote-widget"
  data-application-id="your-app-id"
  data-about-text="Tell users about your company, mission, or the team behind the product."
></div>
```

## Custom FAQs

Add frequently asked questions that appear in the FAQ tab:

```html
<div 
  class="upvote-widget"
  data-application-id="your-app-id"
  data-faqs='[
    {
      "question": "How do I get started?",
      "answer": "Simply sign up for an account and start exploring features!"
    },
    {
      "question": "Is there a free trial?",
      "answer": "Yes! We offer a 14-day free trial with full access to all features."
    },
    {
      "question": "Can I cancel anytime?",
      "answer": "Absolutely! You can cancel your subscription at any time from your account settings."
    }
  ]'
></div>
```

**Important:** The `data-faqs` value must be valid JSON string. Make sure to:
- Use single quotes for the outer attribute
- Escape any quotes inside the JSON if needed
- Each FAQ object must have `question` and `answer` properties

**⚠️ Note:** There are **no default FAQs**. If you don't provide any FAQs via the `data-faqs` attribute, the FAQ section will not display any questions. This gives you complete control over what your users see.

## Complete Example

Here's a fully configured widget with all customizations:

```html
<!DOCTYPE html>
<html>
<head>
  <title>My Product with Custom Widget</title>
</head>
<body>
  <!-- Your page content -->
  
  <!-- UpVote Widget Configuration -->
  <div 
    class="upvote-widget"
    data-application-id="69a41f203a9a405a41b02afc"
    data-user-id="user_123"
    data-email="john@example.com"
    data-position="right"
    data-theme="light"
    data-logo-url="https://mycompany.com/assets/logo.png"
    data-product-overview="Our platform helps you manage projects efficiently with real-time collaboration and powerful analytics."
    data-about-text="Founded in 2024, we're dedicated to building tools that make teams more productive and happy."
    data-faqs='[
      {
        "question": "How does the free trial work?",
        "answer": "You get full access to all features for 14 days. No credit card required!"
      },
      {
        "question": "Can I upgrade my plan later?",
        "answer": "Yes! You can upgrade or downgrade your plan at any time from the billing settings."
      },
      {
        "question": "Do you offer enterprise plans?",
        "answer": "Absolutely! Contact our sales team at enterprise@mycompany.com for custom pricing."
      }
    ]'
  ></div>
  
  <!-- Load the widget script -->
  <script src="http://localhost:3000/widget.js"></script>
</body>
</html>
```

## Configuration Reference

| Attribute | Required | Description | Example |
|-----------|----------|-------------|---------|
| `data-application-id` | ✅ Yes | Your UpVote application ID | `"69a41f203a9a405a41b02afc"` |
| `data-user-id` | Optional | Current user's ID (enables feedback feature) | `"user_123"` |
| `data-email` | Optional | User's email (pre-filled in support form) | `"user@example.com"` |
| `data-position` | Optional | Widget position: `"left"` or `"right"` | `"right"` |
| `data-theme` | Optional | Widget theme: `"light"` or `"dark"` | `"light"` |
| `data-logo-url` | Optional | URL to your product logo | `"https://example.com/logo.png"` |
| `data-product-overview` | Optional | Custom product description | `"Your product description here"` |
| `data-about-text` | Optional | Custom about text | `"About your company..."` |
| `data-faqs` | Optional | JSON array of FAQ objects | See FAQ format below |

## FAQ Format

```json
[
  {
    "question": "Your question here",
    "answer": "Your answer here"
  },
  {
    "question": "Another question",
    "answer": "Another answer"
  }
]
```

## Dynamic Updates

The widget automatically detects configuration changes and updates accordingly. If you need to update the widget configuration dynamically (e.g., when a user logs in), simply update the data attributes:

```javascript
const widgetDiv = document.querySelector('.upvote-widget');
widgetDiv.setAttribute('data-user-id', 'new-user-id');
widgetDiv.setAttribute('data-logo-url', 'https://newlogo.com/logo.png');
// Widget will automatically refresh with new configuration
```

## Styling Tips

- **Logo sizing**: The widget automatically scales logos to fit (32px in header, 32px in button)
- **Image optimization**: Use optimized images for faster load times
- **Fallback behavior**: If a custom logo fails to load, the default UpVote logo will be used
- **Dark mode**: Ensure your logo looks good on both light and dark backgrounds

## Best Practices

1. **Use HTTPS**: Always use HTTPS URLs for logos to avoid mixed content warnings
2. **Optimize images**: Compress logos for faster loading (recommended: < 50KB)
3. **Test FAQs**: Preview your FAQs to ensure they display correctly
4. **Keep it concise**: Write clear, concise FAQ answers (2-3 sentences ideal)
5. **Update regularly**: Keep your product info and FAQs up to date

## Troubleshooting

### Logo not showing
- Check that the URL is accessible
- Verify the image format is supported (PNG, JPG, SVG, WebP)
- Ensure the URL uses HTTPS (or HTTP if testing locally)

### FAQs not displaying
- Verify the JSON is valid (use a JSON validator)
- Make sure each FAQ has both `question` and `answer` properties
- Check that the JSON is properly escaped in the HTML attribute

### Widget not updating after config change
- Ensure you're updating the correct `.upvote-widget` element
- The widget polls every 500ms for changes, so wait a moment
- Check browser console for any JavaScript errors

## Support

For additional help or questions, please refer to the main UpVote documentation or contact support.
