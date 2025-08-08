# Components

This list defines base and domain components. Each component uses design tokens exclusively; do not hard-code values.

## Base Components
- Button
  - Variants: primary, secondary, ghost, danger, warning
  - Sizes: sm, md, lg
  - States: hover, active, focus-visible, disabled, loading
  - Tokens: colors (primary/secondary/danger/warning), radius, space, shadow, motion, focus
- Input (TextField)
  - Types: text, email, password, number
  - States: default, focus, error, disabled
  - Tokens: border, text, space, radius, focus, shadow-sm
- Select (Native/Custom)
  - States: default, focus, error, disabled
  - Tokens: surface, border, text, radius, space
- Checkbox / Radio / Switch
  - States: checked, indeterminate, disabled
  - Tokens: primary, border, radius, motion
- TextArea
  - Auto-resize optional
  - Tokens: border, text, space, radius
- Tooltip
  - Tokens: surface, text-inverse, shadow, radius, motion
- Modal / Drawer
  - Tokens: overlay, surface, shadow-lg, radius-lg, space
- Tabs
  - Variants: underline, contained
  - Tokens: border, primary, text
- Table / DataGrid
  - Features: sorting, sticky header, zebra rows
  - Tokens: surface, border, text, space
- Card
  - Tokens: surface, shadow, radius, space
- Toast / AlertBanner
  - Variants: success, info, warning, danger
  - Tokens: semantic colors, on-* text, shadow, radius
- Badge / Chip
  - Variants: neutral, primary, success, warning, danger
- Skeleton / Spinner
  - Tokens: surface-alt, motion
- Pagination
  - Tokens: primary, border, radius, space
- Breadcrumbs
  - Tokens: text-muted, space
- DateRangePicker (basic)
  - Tokens: surface, border, shadow, space

## Domain Components
- DocumentUploader
  - Drag & drop, multiple files, progress
  - Tokens: surface, border, primary, space
- CameraCapture
  - Mobile-first camera UI
  - Tokens: surface, text, primary
- DocumentPreview
  - Image/PDF viewer
  - Tokens: surface, text, space
- ExtractionResults
  - Editable OCR fields with validation
  - Tokens: surface, border, danger/warning, space
- DocumentVerification
  - Confirm/save extracted data
  - Tokens: primary, success, space
- SignaturePad
  - Canvas with undo/clear
  - Tokens: surface, border, space
- SignatureVerification
  - Visual compare two signatures
  - Tokens: surface, border
- DeliveryConfirmation
  - Handoff form with signature & GPS
  - Tokens: surface, border, primary
- LiveMap
  - Real-time truck positions (Leaflet)
  - Tokens: surface, info, warning/danger overlays
- RouteVisualizer
  - Planned vs actual route
  - Tokens: primary, warning
- TruckStatusCard
  - Speed, temperature, driver info
  - Tokens: surface, text, semantic
- DeliveryTimeline
  - Stop-by-stop progress
  - Tokens: surface, border, primary
- MetricCard
  - KPI display
  - Tokens: surface, text, success/warning/danger
- TrendChart / HeatMap
  - Recharts integration
  - Tokens: primary, secondary, warning, danger
- PerformanceTable
  - Sortable data grid
  - Tokens: surface, border

## Accessibility
- All interactive components must support keyboard navigation (Tab, Shift+Tab, Enter, Space, Arrow keys as applicable)
- Focus visible state must meet contrast and use `--focus-ring-*` tokens
- ARIA attributes documented per component when needed

## States & Density
- Default density uses 4px grid; compact density may reduce vertical spaces by 2–4px increments
- Disabled components should use `opacity: 0.5` and suppress pointer events