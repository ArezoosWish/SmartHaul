# SmartHaul Design System

## Purpose
A shared, replaceable foundation for UI across SmartHaul: colors, typography, spacing, elevation, motion, components, and patterns. Structured to let you substitute tokens or implementations without breaking consumers.

## What’s Included
- Tokens in three formats for easy substitution:
  - CSS variables: `design-system/tokens.css`
  - JSON source of truth (light/dark): `design-system/tokens.json`
  - JS export for apps/scripts: `design-system/tokens.js`
- Guidelines and specs:
  - Components: `design-system/components.md`
  - Patterns: `design-system/patterns.md`
  - Layout & spacing: `design-system/layout.md`
  - Accessibility: `design-system/accessibility.md`
  - Motion: `design-system/motion.md`

## Core Principles
- Replaceable: swap tokens or components without API churn
- Accessible: WCAG AA contrast, keyboard-first, screen-reader friendly
- Responsive: mobile-first breakpoints, fluid spacing
- Performance: minimal runtime, CSS variable-driven theming

## Quick Start
1) Add CSS variables globally (light mode default):
```html
<link rel="stylesheet" href="/design-system/tokens.css" />
```
2) Toggle dark mode by adding `.dark` to the `html` or `body` element.
```html
<html class="dark">
```
3) Use tokens in CSS:
```css
.button {
  background: var(--color-primary);
  color: var(--color-on-primary);
  padding: var(--space-2) var(--space-3);
  border-radius: var(--radius-md);
  transition: background var(--motion-duration-fast) var(--motion-ease-standard);
}
.button:hover { background: var(--color-primary-hover); }
.button:active { background: var(--color-primary-active); }
```

## Overriding Tokens (Substitution)
- Global override: redefine variables after the import
```css
:root {
  --color-primary: #0ea5e9; /* swap brand */
}
```
- Scoped override: wrap an app area with a theme class
```css
.theme-alt { --color-primary: #7c3aed; }
```
- Replace JSON source: modify `design-system/tokens.json`, rebuild derived formats if needed

## Component Integration
- Prefer composition + class hooks over hard-coded styles
- Components reference tokens only (no literal colors/sizes)
- Domain components (e.g., `DocumentUploader`, `LiveMap`) draw from the same base tokens

## Theming
- Light and dark modes provided via `.dark` class
- High-contrast guidance in `accessibility.md`

## File Map
- `design-system/tokens.css`  → CSS variables for runtime
- `design-system/tokens.json` → Source of truth with modes
- `design-system/tokens.js`   → JS export for apps
- `design-system/components.md` → Component specs
- `design-system/patterns.md` → UI patterns
- `design-system/layout.md` → Grid, spacing, breakpoints
- `design-system/motion.md` → Motion principles
- `design-system/accessibility.md` → A11y

## Notes
- Left navigation, right content pattern is the default layout preference.
- Colors and typographic choices align with the PRD branding; feel free to substitute token values.