# Block Studio tokens

Extracted from the Figma file [Block Studio](https://www.figma.com/design/qGd6RUrsyBMqIDE2322C4R/Block-Studio) on 2026-10-03 through the Figma console MCP.

| File | What it holds |
| --- | --- |
| `figma-export.json` | Raw extract: variables, text styles and the component assessment |
| `primitives.css` | Colour, radius, spacing, padding and type-scale variables as CSS custom properties (`--bs-*`) |
| `typography.css` | `@font-face` rules and one `.text-*` class per Figma text style, built only from the variables above |
| `components.css` | Aliases for NavItem and the hero, plus the few Figma values that have no variable behind them |

The `--bs-` prefix keeps these clear of the Tailwind theme in `src/styles/tokens.css`, which still holds an older palette with the charcoal scale running the other way.

## Variables

**Primitives** (one mode)

- Colour: `Brand-orange100` to `900`, `Brand-charcoal100` to `900`, `Brand-white`. Both scales run dark to light.
- Radius: XSM 4, SM 8, M 12, L 16, XL 24, XXL 32
- Spacing: XSM 8, SM 12, M 16, L 24, XL 48, XXL 82
- Padding: XSM 8, SM 16, M 24, L 48, XL 82

**Typography** (Desktop mode only): a 1.25 major-third scale, each step with a size and a line height.

| Step | Size | Line height |
| --- | --- | --- |
| H1 | 61.04 | 64 |
| H2 | 48.83 | 54 |
| H3 | 39.06 | 46 |
| H4 | 31.25 | 38 |
| H5 | 25 | 32 |
| Body Large | 20 | 30 |
| Body Small | 16 | 24 |
| Subtext | 12.8 | 18 |
| CTA Text | 16 | 20 |

## Text styles

13 styles. Ten use PP Neue Montreal (H1 Bold, H2 to H5 and CTA Text and Label Medium, Body Large and Body Small Book, Subtext Regular). Three use PP Editorial New (H1-serif Bold, H2-serif and H3-serif Regular). CTA Text is uppercase.

## Components

The file holds four component sets, not one.

| Component | Variants | Notes |
| --- | --- | --- |
| NAVITEM | DEFAULT, HOVER | Hover prototype: smart animate, Gentle, 383ms. Fill charcoal900 to charcoal300, radius SM to XL, label stack rolls from the first copy to the second |
| Button | Primary, Secondary, Ghost, Inline Link | Properties: Show Icon, Show Label, Label |
| #Navigation | NavBar-Closed, NavBar-Open | Open state fills orange300 and stacks four H1 links |
| Icons / Tabler / 20 | 40 icons | Stroke bound to charcoal400 |

## Gaps to close in Figma

1. NavItem padding (8 and 12) and its two 10px gaps are raw numbers. They match PADDING XSM and SPACING SM, and the nearest gap token is SPACING XSM.
2. Text styles bind only font size and line height. Family, weight, letter spacing and case sit inside each style, so they cannot be themed or switched by mode. The CSS carries them as `--bs-font-weight-*`, `--bs-letter-spacing-*` and `--bs-font-family-*`.
3. The Label style has no bound size or line height. The hero's © glyph is 22.32px with no style at all.
4. The Button Primary gradient and its shadows are not variables, and its label fill is a raw `#222222` where `Brand-charcoal300` exists.
5. `RAIDUS M` is misspelt in Figma. The CSS names it `--bs-radius-m`.
6. Primitives only. No semantic layer (surface, ink, accent), so components bind straight to `Brand-charcoal900` and similar. `components.css` is a first draft of that layer.
7. Spacing and padding repeat values (8, 16, 24, 82 each appear in both).
8. Typography has a Desktop mode only, so smaller screens have no tokens. The hero steps down the existing scale (H2 to H3 to H4) at 900px and 600px.

## Where the hero departs from Figma

- NavItem rest label uses charcoal400. Figma binds charcoal500, which reads 3.5:1 on the light pill and fails AA. One token, `--navitem-label-rest`.
- The eyebrow and the whole statement, serif phrase included, use Brand-white as specified. White on orange400 reads 3.2:1, which passes for the large headline and falls short for the 16px eyebrow.
- The statement block sits 150px from the top of the 982px frame, kept as `15.27svh`, and is 1042px wide, then 80vw once the viewport is narrower.
- Headline indent uses SPACING XXL (82px). Figma uses a 100px spacer that has no token.
- NavItem has a focus-visible state that matches hover, a pressed colour (charcoal200), and hover limited to pointer devices. Figma defines only DEFAULT and HOVER.

## Motion

Timing for the hero lives in `components.css` under the `--motion-*` tokens and is read by `src/components/useHeroMotion.ts` at runtime, so the GSAP code holds no numbers of its own. The easing is `--derived-motion-ease`, converted to a GSAP curve.

- Entrance: the © BLOCK STUDIO emblem rises first, then the headline lines follow one after another (`--motion-headline-*`). With reduced motion they fade in.
- Wordmark: travels left across the hero's scroll, smoothed by `--motion-wordmark-smoothing`, and returns as the page scrolls up. With reduced motion it stays put.
- Background: fades from orange400 to charcoal200 (`--hero-bg-scrolled`) in step with the scroll and lands once 80% of a screen's height has been scrolled (`--motion-background-complete`). It stays on with reduced motion, since colour carries no movement.
- Statement: scrolls at `--motion-statement-speed` (120%), so it climbs out of view faster than the page and settles back as you scroll to the top. It also fades (`--motion-statement-fade-to`), reaching that opacity as it leaves the top of the screen. The fade stays on with reduced motion.
- Wordmark pin: rides the foot of the hero, then stays fixed to the top of the viewport once it reaches it, for the sections that follow.
- Asterisk colour: turns from charcoal300 to white (`--hero-wordmark-asterisk-scrolled`) on the same range as the background.
- Asterisk: turns clockwise on a loop (`--motion-glyph-period`) and spins faster with scroll speed in either direction (`--motion-glyph-sensitivity`, `--motion-glyph-max-boost`, `--motion-glyph-response`). It stops with reduced motion and pauses when the hero is off screen.

## Services section

`src/components/ServicesSection.tsx` lists the four services from `docs/Block-Studio-Service-Copy.md`, with short homepage summaries in `src/content/services.ts`. Each row links to `#/services/<slug>`. Its colours, spacing and timing are the `--services-*` and `--motion-services-*` tokens in `components.css`.

- Hovering the list dims the other rows to 32% white and lights the hovered one. A brand wash rises behind the list, and a disc holding the turning asterisk appears in the free space to the right of the summary. Keyboard focus triggers the same state.
- Rows rise into view the first time they reach the screen, staggered. With reduced motion they fade in.
- The pinned wordmark acts as a header band (`--derived-band-height`), so the section starts below it and rows scroll beneath it.
- Tablet and below: one column, no disc, no hover dimming.
