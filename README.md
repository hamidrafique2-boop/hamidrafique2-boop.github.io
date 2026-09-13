# Hamid Rafique — Portfolio

Personal portfolio site for Hamid Rafique (CTF alias **Cindrix**), BS Cybersecurity
student at Air University's National Cyber Security Academy (NCSA), Islamabad.

Live: https://hamidrafique2-boop.github.io/hamidrafique.github.io/

## Stack

Static site, no build step: `index.html`, `style.css`, `script.js`. Deployed via
GitHub Pages. Fonts (Fraunces, Inter, IBM Plex Mono) and Font Awesome icons load
from CDN; everything else is self-contained.

## Design system — "Signal Discipline"

The visual language is built around *finding signal in noise* — the shared
instinct behind CTF exploitation and SOC detection work — rather than generic
hacker-terminal or neon-matrix tropes.

- **Color**: warm charcoal/paper neutrals with a single burnt-orange accent
  (`--signal`) and a muted verified-state green (`--verify`), defined as CSS
  custom properties in `:root` and `:root.theme-light`.
- **Type**: Fraunces (display/headlines), Inter (body/UI), IBM Plex Mono
  (functional data only — timestamps, filter chips, tags).
- **Signature motif**: a persistent SVG "signal trace" line that redraws on
  scroll and settles as the reader moves through the page.

## Sections

`Hero -> About -> Capabilities -> Fractured Signal (flagship) -> Field Record
-> Credentials -> Contact`

## Theme system

Dark/light toggle, persisted to `localStorage`, respects
`prefers-color-scheme` on first visit, and applies before first paint via a
small inline script in `<head>` to avoid a flash of the wrong theme.

## Accessibility

Semantic landmarks, skip-to-content link, keyboard-operable mobile menu
(Escape to close, scroll lock while open), visible focus states, and full
`prefers-reduced-motion` support (disables the signal trace, custom cursor,
and hero entrance animation; everything remains fully usable and legible with
motion off).

## Content

All facts (dates, placements, certifications, project details) are sourced
directly from `Hamid_Rafique_Resume.pdf` and the `certificates/` folder — no
invented claims, metrics, or credentials.

## Local development

```bash
python3 -m http.server 8000
```

Then open `http://localhost:8000`.
