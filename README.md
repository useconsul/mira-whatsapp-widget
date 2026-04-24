# Mira.AI WhatsApp Widget

A **drop‑in, zero‑dependency widget** that lets your visitors open a WhatsApp chat or scan a QR‑code straight from any page. It works everywhere you can add a `<script>` tag—static HTML, WordPress, Shopify, React, Vue, Angular… you name it.

---

## 1 Quick Start (CDN)

```html
<!-- 1️⃣  Add global config BEFORE the widget script -->
<script>
  window.MiraWidgetConfig = {
    accessKey: "your-access-key", // 🔑 Required - Get this from your dashboard
    language: "en", // optional - 'en', 'fr', 'de'
    whatsappMessage: "Hi Mira! I'm interested in your services", // optional
    companyReferralCode: "ABC123", // optional
  };
</script>

<!-- 2️⃣  Load the widget (Production) -->
<script src="https://cdn.jsdelivr.net/gh/useconsul/mira-whatsapp-widget@latest/dist/mira-widget.min.js"></script>
```

> **That's it.** A floating button appears in the bottom‑right corner by default. Clicking it reveals the QR code + deep‑link to WhatsApp.

---

## 2 Configuration Reference

| Property              | Type   | Default          | Description                                                                                                       |
| --------------------- | ------ | ---------------- | ----------------------------------------------------------------------------------------------------------------- |
| `accessKey`           | string | _(required)_     | **Required**: The unique key for your company to fetch agent details (phone, image, name).                        |
| `language`            | string | `"en"`           | Language for the widget. Supported: `en`, `fr`, `de`.                                                             |
| `whatsappMessage`     | string | _(localized)_    | Prefilled text in the WhatsApp chat. Can use `{{agent}}` placeholder to fill with agent name.                     |
| `companyReferralCode` | string | _(none)_         | Optional referral code that gets appended to the WhatsApp message to identify the source.                         |
| `position`            | string | `"bottom-right"` | One of `bottom-right`, `bottom-left`, `top-right`, `top-left` (only used in **floating** mode).                   |
| `containerId`         | string | _(none)_         | **Embed** mode: ID of the element where the widget should be rendered. If omitted the widget floats.              |
| `agentName`           | string | _(fetched)_      | **[DEPRECATED]** Fetched from backend via `accessKey`. Used in headers and replaced in `{{agent}}` template keys. |
| `agentPhone`          | string | _(fetched)_      | **[DEPRECATED]** Fetched from backend via `accessKey`.                                                            |
| `agentImage`          | string | _(fetched)_      | **[DEPRECATED]** Fetched from backend via `accessKey`.                                                            |

---

## 3 Company Referral Codes

The `companyReferralCode` parameter allows Mira to track which website visitors( Candidates ) came from their widget. When provided, it automatically appends a referral line to the WhatsApp message.

### Example with Referral Code

```html
<script>
  window.MiraWidgetConfig = {
    accessKey: "your-access-key",
    companyReferralCode: "PARTNER123",
    whatsappMessage: "Hi {{agent}}! I'm interested in your services",
  };
</script>
```

**Resulting WhatsApp Message:**

```
Hi Recruitment Bot! I'm interested in your services
Ref: PARTNER123
```

> **Note:** The referral line is only added when `companyReferralCode` is provided. If omitted, the message remains unchanged.

---

## 4 Embed vs Floating Mode

### Floating (default)

No `containerId` ⇒ the widget is `position:fixed` to the viewport.

### Embedded inside any element

```html
<div id="promo‑spot" style="height: 400px; width: 300px;"></div>
<script>
  window.MiraWidgetConfig = {
    accessKey: "your-access-key",
    companyReferralCode: "PROMO2024",
    containerId: "promo-spot", // 🔗 render RIGHT HERE
  };
</script>
<script src="https://cdn.jsdelivr.net/gh/useconsul/mira-whatsapp-widget@latest/dist/mira-widget.min.js"></script>
```

> **Note:** Embedded widgets have a default width of **300px** and will take the full height of their container.

---

## 5 CMS Recipes

### WordPress (theme or plugin)

```php
<!-- footer.php -->
<script>
  window.MiraWidgetConfig = {
    accessKey: "your-access-key",
    companyReferralCode: "WP001",
    language: "en"
  };
</script>
<script src="https://cdn.jsdelivr.net/gh/useconsul/mira-whatsapp-widget@latest/dist/mira-widget.min.js"></script>
```

### Shopify

```liquid
<!-- theme.liquid, before </body> -->
{% raw %}
<script>
  window.MiraWidgetConfig = {
    accessKey: "your-access-key",
    companyReferralCode: "SHOP001",
    language: "de"
  };
</script>
{% endraw %}
<script src="https://cdn.jsdelivr.net/gh/useconsul/mira-whatsapp-widget@latest/dist/mira-widget.min.js"></script>
```

### Wix / Squarespace / Webflow

Just paste the same two `<script>` tags into your **Custom Code / Footer HTML** section.

---

## 6 Frontend Frameworks

> The widget is plain IIFE JavaScript: no React, Vue or Angular bindings needed. Load it **once** per page, preferably in the HTML template so every route has access.

### React (Vite / CRA)

```html
<!-- public/index.html -->
<body>
  <div id="root"></div>
  <script>
    window.MiraWidgetConfig = {
      accessKey: "your-access-key",
      language: "en",
    };
  </script>
  <script src="https://cdn.jsdelivr.net/gh/useconsul/mira-whatsapp-widget@latest/dist/mira-widget.min.js"></script>
</body>
```

### Next.js

```typescript
// app/layout.tsx or pages/_app.tsx
import Script from 'next/script'

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <Script id="mira-widget-config" strategy="beforeInteractive">
          {`
            window.MiraWidgetConfig = {
              accessKey: "your-access-key",
              whatsappMessage: "Hi {{agent}}! I'm interested in your services ✨",
            };
          `}
        </Script>
        <Script
          src="https://cdn.jsdelivr.net/gh/useconsul/mira-whatsapp-widget@latest/dist/mira-widget.min.js"
          strategy="afterInteractive"
        />
      </body>
    </html>
  )
}
```

### Vue + Vite / Nuxt (client‑side)

Add the two tags to `index.html` (Vue) or `app.vue` (`<template>` → `<head>` via Nuxt's `<Head>` component).

### Angular

Insert the tags in `src/index.html` right before `</body>`.

The widget is global—no need to import anything in your TS code.

---

## 8 Internationalization

The widget supports automatic translation for **English (en)**, **French (fr)**, and **German (de)**.

### Setting the Language

To change the language, set the `language` parameter in your configuration:

```javascript
window.MiraWidgetConfig = {
  language: "de", // Switch to German
};
```

### Translation Components

When a language is selected, the following elements are automatically localized:

- Button title and subtitle
- WhatsApp prefilled message
- "How it works" steps in the dropdown
- Status indicators and footer text

### Overriding Translations

You can still override any specific text field while using a localized version. The widget uses your provided strings as first priority, then falls back to the translation object, and finally to the English defaults. However, with the new `agentName` system, most text is automatically formatted (e.g., "Apply with {{agent}}").

```javascript
window.MiraWidgetConfig = {
  language: "fr",
  accessKey: "your-access-key",
  whatsappMessage: "Besoin d'aide ?",
};
```

---

## 9 Advanced API (runtime control)

Once loaded, a global object becomes available:

```js
window.MiraCustomWidget.open(); // programmatically open
window.MiraCustomWidget.close(); // close
window.MiraCustomWidget.toggle(); // toggle state
window.MiraCustomWidget.remove(); // completely remove from the DOM
```

---

## 10 Troubleshooting

| Symptom             | Cause / Fix                                                                                               |
| ------------------- | --------------------------------------------------------------------------------------------------------- |
| Widget doesn't show | Make sure **both** `<script>` tags are present.                                                           |
| Unsupported Lang    | If an unsupported language is provided, the widget defaults to English and logs a warning in the console. |
| Wrong container ID  | The widget logs `Container with id "…" not found` in the console and falls back to floating mode.         |
| Multiple widgets    | The script guards against duplicates: only the **first** instance on the page will render.                |

---

## 11 License

[MIT](LICENSE)
