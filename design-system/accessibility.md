# Accessibility

## Standards
- WCAG 2.1 AA contrast
- Keyboard navigable: all interactive elements reachable and operable
- Screen reader support with ARIA where appropriate

## Checklist
- Focus visible on all interactive controls
- Labels associated with inputs via `for`/`id` or `aria-label`
- Error messages tied to fields with `aria-describedby`
- Appropriate roles for modals, dialogs, tabs, and tooltips
- Color is not the only means of conveying information
- Test with `Tab`, `Shift+Tab`, `Enter`, `Space`, arrow keys
- Test with VoiceOver/NVDA/JAWS as applicable

## Contrast Targets
- Text vs background: ≥ 4.5:1 (normal), 3:1 (large text)
- Icons and graphical objects: ≥ 3:1 against background

## High Contrast Guidance
- Allow token overrides for `--color-surface`, `--color-text`, and borders to achieve higher contrast themes