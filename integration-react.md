# React / Next.js Integration Guide

Integrating UpVote into a React or Next.js application using a reusable component.

## 1. Create the Widget Component
Create a new file `UpVoteWidget.jsx` (or `.tsx`):

```jsx
import { useEffect } from 'react';

export default function UpVoteWidget({ applicationId, userId, theme = 'light', position = 'right' }) {
  useEffect(() => {
    // Create widget div configuration if not using window.UpVoteConfig
    const div = document.createElement('div');
    div.className = 'upvote-widget';
    div.setAttribute('data-application-id', applicationId);
    div.setAttribute('data-user-id', userId);
    div.setAttribute('data-theme', theme);
    div.setAttribute('data-position', position);
    document.body.appendChild(div);

    // Load script
    const script = document.createElement('script');
    script.src = 'https://your-upvote-domain.com/widget.js';
    script.async = true;
    document.body.appendChild(script);

    return () => {
      // Cleanup on unmount
      div.remove();
      script.remove();
    };
  }, [applicationId, userId, theme, position]);

  return null;
}
```

## 2. Usage in your App
Import and use the component where your user authentication state is available.

```jsx
import UpVoteWidget from './components/UpVoteWidget';

function App() {
  const { user } = useAuth(); // Your auth hook

  return (
    <div>
      {/* Your application content */}
      <h1>My App</h1>
      
      {user && (
        <UpVoteWidget 
          applicationId="app_xxx" 
          userId={user.id} 
          theme="light"
        />
      )}
    </div>
  );
}
```
---
## Next.js (App Router) Tip
If using Next.js, make sure the `UpVoteWidget` is a `'use client';` component.
