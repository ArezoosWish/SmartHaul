# Contributing to SmartHaul Design System

## Philosophy
- Token-first: components consume tokens; they do not define hard values
- Backwards-compatible changes to tokens preferred; when breaking, use deprecation notes

## Substituting Parts
- To change brand colors or typography:
  - Update `tokens.json` (both light/dark), then mirror changes in `tokens.css`/`tokens.js`
  - Or override CSS variables downstream (global or scoped theme class)
- To replace a component implementation:
  - Preserve public API (props/events) documented in `components.md`
  - Use tokens for visuals; keep behavior accessible

## Process
1. Propose changes via PR with screenshots and accessibility notes
2. Update docs in `components.md`/`patterns.md` as needed
3. Increment version in release notes (if applicable)
4. Add migration notes for breaking changes