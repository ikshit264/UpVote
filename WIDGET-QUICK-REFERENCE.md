# Widget Customization Quick Reference

## Ã°Å¸Å¡â‚¬ Quick Start (Copy & Paste)

### Basic Widget with Custom Logo
```html
<div class="monkfeed-widget"
  data-application-id="YOUR_APP_ID"
  data-logo-url="https://yourdomain.com/logo.png"
></div>
<script src="http://localhost:3000/widget.js"></script>
```

### Fully Configured Widget
```html
<div class="monkfeed-widget"
  data-application-id="YOUR_APP_ID"
  data-user-id="USER_ID"
  data-email="user@example.com"
  data-position="right"
  data-theme="light"
  data-logo-url="https://yourdomain.com/logo.png"
  data-product-overview="Your product description..."
  data-about-text="About your company..."
  data-faqs='[{"question":"Q1?","answer":"A1."},{"question":"Q2?","answer":"A2."}]'
></div>
<script src="http://localhost:3000/widget.js"></script>
```

## Ã°Å¸â€œâ€¹ All Configuration Attributes

| Attribute | Required | Description | Default |
|-----------|----------|-------------|---------|
| `data-application-id` | Ã¢Å“â€¦ YES | Your MonkFeed app ID | - |
| `data-user-id` | Optional | Current user ID | `""` |
| `data-email` | Optional | User email | `""` |
| `data-position` | Optional | `"left"` or `"right"` | `"right"` |
| `data-theme` | Optional | `"light"` or `"dark"` | `"light"` |
| `data-logo-url` | Optional | Logo image URL | `/favicon.png` |
| `data-product-overview` | Optional | Product description | Default text |
| `data-about-text` | Optional | About text | Default text |
| `data-faqs` | Optional | JSON FAQ array | Default FAQs |

## Ã°Å¸Å½Â¨ Logo Requirements

- **Format**: PNG, JPG, SVG, WebP
- **Size**: 128x128px minimum (auto-scaled to 32px)
- **URL**: Must use HTTPS (or HTTP for local dev)
- **Shape**: Square works best (circular crop applied)

## Ã°Å¸â€œÂ FAQ Format

```json
[
  {
    "question": "Your question here?",
    "answer": "Your answer here..."
  }
]
```

**HTML Example:**
```html
data-faqs='[
  {
    "question": "How does it work?",
    "answer": "It's easy! Just sign up and start."
  },
  {
    "question": "Is there a free trial?",
    "answer": "Yes! 14 days, no credit card needed."
  }
]'
```

**Ã¢Å¡Â Ã¯Â¸Â Important:** FAQs are now **completely customizable**. If you don't provide any FAQs, the FAQ section will be empty. There are no default fallback questions.

## Ã°Å¸â€™Â¡ Pro Tips

### Dynamic Updates (JavaScript)
```javascript
const widget = document.querySelector('.monkfeed-widget');

// Update logo
widget.setAttribute('data-logo-url', 'https://newlogo.com/logo.png');

// Update FAQs
widget.setAttribute('data-faqs', '[{"question":"New Q?","answer":"New A!"}]');

// Widget auto-refreshes within 500ms
```

### Conditional Rendering
- Custom content shows **only if provided**
- Default content shows **when custom is empty**
- Mix and match (e.g., custom FAQs + default about)

### Text Length Guidelines
- **Product Overview**: 1-3 sentences (max 300 chars)
- **About Text**: 2-4 sentences (max 400 chars)
- **FAQ Answer**: 2-3 sentences (max 200 chars)
- **Total FAQs**: Keep under 10 for best performance

## Ã°Å¸â€Â§ Troubleshooting

### Logo Not Showing
```bash
# Check URL accessibility
curl https://yourdomain.com/logo.png

# Verify format (should be image)
file logo.png
```

### FAQs Not Displaying
```javascript
// Validate JSON
try {
  JSON.parse(faqsString);
  console.log('Valid JSON!');
} catch (e) {
  console.error('Invalid JSON:', e);
}
```

### Widget Not Updating
```javascript
// Force refresh by toggling attribute
widget.removeAttribute('data-logo-url');
setTimeout(() => {
  widget.setAttribute('data-logo-url', 'https://newurl.com/logo.png');
}, 100);
```

## Ã°Å¸â€œÂ± Mobile Testing

Test on different screen sizes:
```html
<meta name="viewport" content="width=device-width, initial-scale=1.0">
```

Widget is responsive and adapts to:
- Desktop (420px width)
- Tablet (max-width: calc(100vw - 48px))
- Mobile (full width with padding)

## Ã°Å¸Å½Â¯ Common Use Cases

### SaaS Product
```html
data-product-overview="Our platform helps teams ship software faster with automated workflows and real-time collaboration."
data-about-text="Trusted by 10,000+ teams worldwide. Founded in 2024 by engineers who understand modern development challenges."
data-faqs='[
  {"question":"Start free trial?","answer":"14 days, full features, no credit card."},
  {"question":"Cancel anytime?","answer":"Yes! Cancel instantly from settings."}
]'
```

### E-commerce Store
```html
data-product-overview="We curate sustainable fashion from independent designers. Every purchase supports ethical manufacturing."
data-about-text="Family-owned business passionate about sustainable fashion. Based in Portland, shipping worldwide since 2020."
data-faqs='[
  {"question":"Shipping time?","answer":"3-5 business days US, 7-14 international."},
  {"question":"Return policy?","answer":"30-day returns, free exchange shipping."}
]'
```

### Educational Platform
```html
data-product-overview="Learn coding with interactive lessons and real-world projects. From beginner to job-ready in 6 months."
data-about-text="Built by industry experts from Google, Meta, and Amazon. We believe coding should be accessible to everyone."
data-faqs='[
  {"question":"Beginner friendly?","answer":"Absolutely! Start from zero, no experience needed."},
  {"question":"Job guarantee?","answer":"Yes! Full refund if not hired within 6 months of graduation."}
]'
```

## Ã°Å¸â€â€” Quick Links

- **Full Guide**: `WIDGET-CUSTOMIZATION-GUIDE.md`
- **Live Demo**: `/custom-widget-demo.html`
- **Implementation Details**: `WIDGET-CUSTOMIZATION-IMPLEMENTATION.md`

## Ã¢Å¡Â¡ Performance Tips

1. **Optimize Logo**: Compress to < 50KB
2. **Limit FAQs**: 5-10 questions ideal
3. **Shorten URLs**: Use CDN or URL shortener
4. **Lazy Load**: Widget loads after page content
5. **Cache Strategy**: Browser caches widget.js automatically

## Ã°Å¸Å½Â¨ Styling Best Practices

- Use high contrast logos for visibility
- Test logo on both light/dark backgrounds
- Keep text concise and scannable
- Use proper grammar in FAQs
- Maintain brand voice consistency

---

**Need Help?** Check the full documentation or contact support.
