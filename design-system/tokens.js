/* SmartHaul Design Tokens (JS) */
export const tokens = {
  color: {
    primary: '#1e40af',
    onPrimary: '#ffffff',
    secondary: '#10b981',
    onSecondary: '#052e22',
    warning: '#f59e0b',
    danger: '#ef4444',
    info: '#3b82f6',
    success: '#10b981',
    bg: '#f8fafc',
    surface: '#ffffff',
    surfaceAlt: '#f1f5f9',
    border: '#e2e8f0',
    text: '#0f172a',
    textSecondary: '#475569',
    textMuted: '#64748b',
  },
  font: {
    family: {
      sans: "Inter, ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, 'Apple Color Emoji', 'Segoe UI Emoji'",
      mono: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
    },
    size: { xs: '12px', sm: '14px', md: '16px', lg: '18px', xl: '20px', x2: '24px', x3: '30px', x4: '36px' },
    line: { tight: 1.25, normal: 1.5, relaxed: 1.7 },
    weight: { regular: 400, medium: 500, semibold: 600, bold: 700 },
  },
  space: { 0: '0px', 1: '4px', 2: '8px', 3: '12px', 4: '16px', 5: '20px', 6: '24px', 8: '32px', 10: '40px', 12: '48px', 16: '64px', 20: '80px' },
  radius: { xs: '2px', sm: '4px', md: '8px', lg: '12px', xl: '16px', pill: '9999px' },
  shadow: { sm: '0 1px 2px rgba(0,0,0,0.06)', md: '0 2px 8px rgba(0,0,0,0.08)', lg: '0 8px 24px rgba(0,0,0,0.12)' },
  motion: {
    duration: { fast: '150ms', standard: '250ms', slow: '400ms' },
    easing: { standard: 'cubic-bezier(0.2, 0, 0, 1)', decelerate: 'cubic-bezier(0, 0, 0.2, 1)', accelerate: 'cubic-bezier(0.4, 0, 1, 1)' },
  },
  focus: { ringColor: '#1e40af', ringWidth: '2px', ringOffset: '2px' },
  breakpoint: { sm: '640px', md: '768px', lg: '1024px', xl: '1280px' },
  zIndex: { dropdown: 1000, sticky: 1100, modal: 1200, popover: 1300, toast: 1400 },
};

export default tokens;