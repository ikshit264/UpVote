# Section Transition Components

Smooth visual transitions between page sections using gradient overlays.

## Components

### 1. `Section` (Recommended Wrapper)

A reusable wrapper that automatically adds a smooth gradient transition at the bottom of any section.

**Location:** `components/ui/section.tsx`

**Props:**
- `children`: React.ReactNode - Your section content
- `className?: string` - Additional Tailwind classes
- `bg?: string` - Background color (default: "bg-white")
- `toColor?: string` - Gradient target color (e.g., "to-zinc-50")
- `transitionHeight?: string` - Height of gradient (default: "h-40")

### 2. `SectionTransition` (Direct Usage)

Standalone gradient component for manual placement.

**Location:** `components/ui/section-transition.tsx`

**Props:**
- `toColor`: string - Tailwind color class (required)
- `height?: string` - Height (default: "h-40")

---

## Usage Examples

### Basic Pattern (Alternating Backgrounds)

```tsx
import { Section } from '@/components/ui/section';

export default function LandingPage() {
  return (
    <div>
      {/* White section → fades to zinc-50 */}
      <Section bg="bg-white" toColor="to-zinc-50">
        <Hero />
      </Section>
      
      {/* Zinc-50 section → fades to white */}
      <Section bg="bg-zinc-50" toColor="to-white">
        <Features />
      </Section>
      
      {/* White section → fades to dark */}
      <Section bg="bg-white" toColor="to-zinc-950">
        <Pricing />
      </Section>
      
      {/* Dark section (no transition after) */}
      <section className="bg-zinc-950 py-24">
        <CTA />
      </section>
    </div>
  );
}
```

### Custom Heights

```tsx
// Smaller transition
<Section bg="bg-white" toColor="to-zinc-50" transitionHeight="h-24">
  <CompactSection />
</Section>

// Larger transition
<Section bg="bg-zinc-50" toColor="to-white" transitionHeight="h-56">
  <LargeSection />
</Section>
```

### Direct Usage (Manual Control)

```tsx
import { SectionTransition } from '@/components/ui/section-transition';

<section className="bg-white">
  <Hero />
  <SectionTransition toColor="to-zinc-50" height="h-40" />
</section>

<section className="bg-zinc-50">
  <Features />
</section>
```

---

## Color Combinations

### Light Themes
- `to-white` → Next section: `bg-white`
- `to-zinc-50` → Next section: `bg-zinc-50`
- `to-gray-50` → Next section: `bg-gray-50`
- `to-blue-50` → Next section: `bg-blue-50`

### Dark Themes
- `to-zinc-900` → Next section: `bg-zinc-900`
- `to-zinc-950` → Next section: `bg-zinc-950`
- `to-black` → Next section: `bg-black`

### Colored Themes
- `to-blue-100` → Next section: `bg-blue-100`
- `to-purple-100` → Next section: `bg-purple-100`

---

## Key Features

✅ **Visible Gradient Overlay**: Positioned absolutely at section bottom  
✅ **Works with overflow-hidden**: Doesn't get clipped by parent sections  
✅ **Lightweight**: Pure TailwindCSS, no animations or libraries  
✅ **Responsive**: Works on mobile and desktop  
✅ **Pointer-events-none**: Doesn't interfere with clicks  
✅ **Accessible**: Includes aria-hidden attribute  

---

## How It Works

The `Section` component wraps your content and adds an absolutely positioned gradient overlay at the bottom. This creates a smooth blend into the next section's background color.

```
┌─────────────────┐
│   Section       │
│   Content       │
│                 │
│ ┌─────────────┐ │ ← Gradient overlay (bottom)
│ │ Fade Area   │ │
│ └─────────────┘ │
└─────────────────┘
     ↓ blends into ↓
┌─────────────────┐
│ Next Section    │
└─────────────────┘
```

---

## Best Practices

1. **Match Colors**: Always match `toColor` with the next section's background
   ```tsx
   <Section toColor="to-zinc-50"> → Next should be `bg-zinc-50`
   ```

2. **Skip Last Transition**: No need for transition before footer

3. **Consistent Heights**: Use same height throughout page for consistency

4. **Contrast Carefully**: Ensure good contrast between sections

---

## Current Implementation

See [`app/page.tsx`](../../app/page.tsx) for a complete working example with:
- Hero Section (white → zinc-50)
- Dashboard Preview (zinc-50 → white)
- Features Grid (white → zinc-50)
- Interactive Demo (zinc-50 → white)
- Pricing Section (white → zinc-950)
- CTA Section (dark, no transition)
