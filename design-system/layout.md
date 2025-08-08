# Layout & Spacing

## Spacing
- Base grid: 4px
- Use `--space-*` tokens; avoid hard-coded pixel values
- Vertical rhythm: multiples of 4px; common stack gaps: 8, 12, 16, 24

## Grid & Containers
- Content container max-widths:
  - sm: 640px
  - md: 768px
  - lg: 1024px
  - xl: 1280px
- Sidebars: 240–280px default, collapsible to 72px
- Details panel: 320–420px slideout on the right

## Breakpoints
- `--bp-sm`: 640px (mobile → tablet)
- `--bp-md`: 768px (tablet → small laptop)
- `--bp-lg`: 1024px (desktop)
- `--bp-xl`: 1280px (wide desktop)

## Elevation
- Use `--shadow-sm|md|lg` for elevation
- Never rely on color alone to imply elevation

## Focus & Hit Areas
- Minimum touch target: 44x44px
- Focus ring tokens: `--focus-ring-*`