# Motion

## Principles
- Purposeful: motion clarifies, never distracts
- Subtle: default durations 150–250ms for UI chrome
- Informative: use motion to indicate state changes (insert, update, remove)

## Tokens
- Durations: `--motion-duration-fast` (150ms), `--motion-duration` (250ms), `--motion-duration-slow` (400ms)
- Easing: `--motion-ease-*` tokens

## Usage
- Hover: color/background change over 150ms
- Collapse/expand: 200–250ms height/opacity
- Modal/drawer: 200–250ms fade + slide
- Toasts: 200ms in, 150ms out

## Reduced Motion
- Respect `prefers-reduced-motion: reduce`; disable non-essential animations