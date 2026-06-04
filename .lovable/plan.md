## Fix: Presentation Mode Control Bar Polish

Scope: only the footer control bar in `src/components/presentation/PresentationMode.tsx`. No screen redesign, no content/route/background/typography changes.

### 1. Soft champagne glass colors
Replace harsh white/blue surfaces with warm beige/champagne glass:

- Footer container (light): `bg-[#f6ecd4]/35 border-[#e6d2a6]/50 shadow-[0_18px_50px_-22px_rgba(120,80,30,0.30)]` + `backdrop-blur-2xl`.
- Footer container (dark): `bg-[#2a2014]/40 border-[#c9a96b]/20 shadow-[0_18px_50px_-22px_rgba(0,0,0,0.55)]`.
- Inactive speed pills & font buttons (light): `bg-[#fff7e3]/55 border-[#e6d2a6]/45 text-[#5b3a18]`.
- Inactive (dark): `bg-white/[0.06] border-[#c9a96b]/15 text-[#f0e3bd]`.
- Active speed pill: soft gold gradient `bg-gradient-to-br from-[#d9b878] to-[#b8893a] text-white border-[#e6d2a6]/60 shadow-[0_0_14px_-6px_rgba(184,137,58,0.55)]` (no purple). Keep an inset highlight `shadow-[inset_0_1px_0_rgba(255,255,255,0.25)]`.
- Play button: tone down to soft gold glow — `bg-gradient-to-br from-[#caa15f] to-[#8a6322] shadow-[0_0_18px_-6px_rgba(184,137,58,0.55)] border-white/25`.
- Header buttons (theme/close): match new champagne glass tokens so the top chrome doesn't clash.

### 2. Auto-hide behavior (already partially present, refine)
Keep the existing listeners (`mousemove`, `touchstart`, `click`, `keydown`, `wheel`, scroller `scroll`) that call `bump()` to set `chromeVisible = true` and restart a 5s timer. Verify the 5s timeout is preserved; no functional rewiring needed.

### 3. Dim further during playback
Add a derived opacity class:

- When `chromeVisible` is true → `opacity-100`.
- When hidden AND `playing` → `opacity-[0.12]` (≈12%).
- When hidden AND not playing → `opacity-25` (subtle but easier to find).

Apply to both `<header>` and `<footer>` so chrome dims uniformly.

### 4. Tap-to-reveal
The window-level `click`/`touchstart` listeners already trigger `bump()`, which restores full opacity and restarts the 5s timer. No new code needed beyond the opacity logic above.

### 5. Smooth animation
Change footer/header transition from `duration-500` to `duration-300 ease-out` to land in the requested 250–350ms window, applied to `transition-opacity`.

### Technical notes

- Single file touched: `src/components/presentation/PresentationMode.tsx`.
- No state-shape changes; reuse `chromeVisible` + `playing`.
- Pure className/style edits — no logic, route, or content changes.
- Keyboard shortcuts, rAF auto-scroll loop, body scroll lock, and the Coptic ornaments remain untouched.

### Acceptance check (after build mode)

1. Open Presentation Mode → control bar visible in champagne glass.
2. Press Play → after 5s the bar fades to ~12% opacity.
3. Tap anywhere → bar returns to full opacity, timer restarts.
4. Fade is smooth (~300ms), no harsh blue/white/gray remains.
