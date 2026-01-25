# Vue.js Integration Guide

Integrating UpVote into a Vue 3 application.

## 1. Create the Component
Create `UpVoteWidget.vue`:

```vue
<template>
  <!-- No template needed, we inject the div manually to document.body -->
  <div></div>
</template>

<script setup>
import { onMounted, onUnmounted } from 'vue';

const props = defineProps({
  applicationId: { type: String, required: true },
  userId: { type: String, required: true },
  theme: { type: String, default: 'light' },
  position: { type: String, default: 'right' }
});

let widgetDiv;
let scriptTag;

onMounted(() => {
  // Create widget div
  widgetDiv = document.createElement('div');
  widgetDiv.className = 'upvote-widget';
  widgetDiv.setAttribute('data-application-id', props.applicationId);
  widgetDiv.setAttribute('data-user-id', props.userId);
  widgetDiv.setAttribute('data-theme', props.theme);
  widgetDiv.setAttribute('data-position', props.position);
  document.body.appendChild(widgetDiv);

  // Load script
  scriptTag = document.createElement('script');
  scriptTag.src = 'https://your-upvote-domain.com/widget.js';
  scriptTag.async = true;
  document.body.appendChild(scriptTag);
});

onUnmounted(() => {
  if (widgetDiv) widgetDiv.remove();
  if (scriptTag) scriptTag.remove();
});
</script>
```

## 2. Usage
```vue
<template>
  <div id="app">
    <router-view />
    <UpVoteWidget 
      v-if="user"
      application-id="app_xxx" 
      :user-id="user.id" 
    />
  </div>
</template>

<script setup>
import UpVoteWidget from './components/UpVoteWidget.vue';
const user = inject('user'); // Or from your store
</script>
```
---
## Nuxt 3 Tip
If using Nuxt, you can wrap this in a `<ClientOnly>` component to ensure it only runs on the client side.
