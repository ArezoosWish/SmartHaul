# Patterns

## Navigation
- Left sidebar navigation (collapsible)
- Persistent header with search and notifications
- Right-side details panel (slideout) for contextual actions
- Mobile: bottom navigation with 3–5 primary actions

## Layout
- Three-panel shell: Sidebar / Content / Details
- Content uses max-width containers for readability
- Breakpoints: `--bp-sm`, `--bp-md`, `--bp-lg`, `--bp-xl`

## Forms
- Use vertical forms with clear labels, helper text, and error text
- Validate on blur and on submit; show inline errors
- Group related fields; use logical section headings
- Provide skeletons for initial loading, spinners only for short operations (<400ms)

## Data Display
- Prefer tables with sticky headers for large datasets
- Use chips/badges for status
- Use tooltips for abbreviations and codes
- Provide empty states with a primary action

## Feedback
- Toasts for transient success/info
- Alert banners for blocking errors or warnings
- Inline validation messages for form fields

## Real-time Updates
- Subtle animations (fade/slide) on insert/update
- Optimistic UI for quick perceived performance
- SSE/WS indicators with a non-blocking badge

## Document Processing
- Drag & drop upload zone with progress per file
- Preview image/PDF with zoom and rotate
- OCR result editor with side-by-side original vs extracted
- Verification step with summary and confirm

## Tracking & Intelligence
- Live map centered on active truck with fit-to-bounds
- Route comparison (planned vs actual) with color cues
- Alerts with severity levels and acknowledgment flow

## Accessibility & Internationalization
- Support screen readers and keyboard navigation
- All icons have accessible labels
- Date/time and numbers use locale-aware formatting