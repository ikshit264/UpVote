# Angular Integration Guide

Integrating UpVote into an Angular application.

## 1. Create the Component
Run `ng generate component UpVoteWidget`. Update `up-vote-widget.component.ts`:

```typescript
import { Component, Input, OnInit, OnDestroy, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-upvote-widget',
  template: '',
})
export class UpVoteWidgetComponent implements OnInit, OnDestroy {
  @Input() applicationId!: string;
  @Input() userId!: string;
  @Input() theme: string = 'light';
  @Input() position: string = 'right';

  private widgetDiv?: HTMLDivElement;
  private scriptTag?: HTMLScriptElement;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      // Create widget div
      this.widgetDiv = document.createElement('div');
      this.widgetDiv.className = 'upvote-widget';
      this.widgetDiv.setAttribute('data-application-id', this.applicationId);
      this.widgetDiv.setAttribute('data-user-id', this.userId);
      this.widgetDiv.setAttribute('data-theme', this.theme);
      this.widgetDiv.setAttribute('data-position', this.position);
      document.body.appendChild(this.widgetDiv);

      // Load script
      this.scriptTag = document.createElement('script');
      this.scriptTag.src = 'https://your-upvote-domain.com/widget.js';
      this.scriptTag.async = true;
      document.body.appendChild(this.scriptTag);
    }
  }

  ngOnDestroy() {
    if (this.widgetDiv) this.widgetDiv.remove();
    if (this.scriptTag) this.scriptTag.remove();
  }
}
```

## 2. Usage
Add the component to your main app component or any page component where the user ID is available.

```html
<app-upvote-widget 
  *ngIf="userId"
  [applicationId]="'app_xxx'" 
  [userId]="userId">
</app-upvote-widget>
```
