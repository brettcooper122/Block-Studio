# Block Studio tokens

Extracted from the Figma file [Block Studio](https://www.figma.com/design/qGd6RUrsyBMqIDE2322C4R/Block-Studio) on 2026-10-09 through the Figma Console MCP Desktop Bridge plugin.

## Layering

Four layers, imported in this order from `src/index.css`:

| # | File | What it holds | Who writes it |
| --- | --- | --- | --- |
| 1 | `primitives.css` | `--bs-color-*`, `--bs-radius-*`, `--bs-spacing-*`, `--bs-padding-*`, type scale. Raw Figma variable values, one `--bs-*` per Figma variable. | Regenerated from `figma-export.json` |
| 2 | `typography.css` | `@font-face` rules and one `.text-*` class per Figma text style, each built from the primitives. | Regenerated from `figma-export.json` |
| 3 | `components.css` | Component-scoped aliases (`--navitem-*`, `--hero-*`, `--services-*`, `--motion-*`) plus the few `--derived-*` values Figma has no variable for. | Hand-maintained |
| 4 | `tailwind.css` | Tailwind v4 `@theme` block that maps Tailwind utility classes (`bg-charcoal-900`, `rounded-xl`, `p-m`, …) to the `--bs-*` primitives. | Hand-maintained |

There is no semantic alias layer yet — component CSS binds straight to `--bs-*` primitives or to component aliases in `components.css`. One will be added when the site is large enough to need it.

### Binding rules

- Component CSS **never carries a raw hex, px or rem**. Every value is a `var(--bs-*)` or a component alias in `components.css`.
- Add a component alias in `components.css` before a component CSS file carries a Figma primitive repeatedly.

## Variables

**Primitives** (one mode)

- Colour: `Brand-orange100` to `900`, `Brand-charcoal100` to `900`, `Brand-white`. Both scales run dark to light.
- Radius: XSM 4, SM 8, M 12, L 16, XL 24, XXL 32
- Spacing: XSM 8, SM 12, M 16, L 24, XL 48, XXL 82
- Padding: XSM 8, SM 16, M 24, L 48, XL 82

**Typography** (Desktop mode): a 1.25 major-third scale, each step with a size and a line height.

| Step | Size | Line height | Weight (sans) |
| --- | --- | --- | --- |
| H1 | 61.04 | 64 | Bold |
| H2 | 48.83 | 54 | Medium |
| H3 | 39.06 | 46 | Medium |
| H4 | 31.25 | 38 | Medium |
| H5 | 25 | 32 | Medium |
| Body Large | 20 | 30 | Book |
| Body Small | 16 | 24 | Book |
| Subtext | 12.8 | 18 | Regular |
| CTA Text | 16 | 20 | Medium (uppercase) |
| Label | 16 | 100% | Medium |

Serif variants (`H1-serif`, `H2-serif`, `H3-serif`) use **PP Editorial New**; the rest use **PP Neue Montreal TT**.

## Tailwind utilities

The `@theme` block in `tailwind.css` exposes:

- Colour utilities: `bg-charcoal-{100..900}`, `bg-orange-{100..900}`, `bg-white`, and the matching `text-*` / `border-*`.
- Spacing utilities: `p-xsm | p-sm | p-m | p-l | p-xl | p-xxl` (and matching `gap-*`, `m-*`, …).
- Radius utilities: `rounded-xsm | rounded-sm | rounded-m | rounded-l | rounded-xl | rounded-xxl`.
- Font utilities: `font-sans`, `font-serif`.

Prefer the typography classes in `typography.css` (`text-h1`, `text-label`, …) over cobbled-together utilities, so weight, size, line height and letter spacing stay bound as one Figma style.

## Components

The file holds four component sets.

| Component | Variants | Notes |
| --- | --- | --- |
| NAVITEM | DEFAULT, HOVER | Hover prototype: smart animate, Gentle, 383ms. Fill charcoal900 to charcoal300, radius SM to XL, label stack rolls from the first copy to the second. |
| Button | Primary, Secondary, Ghost, Inline Link | Properties: Show Icon, Show Label, Label. |
| #Navigation | NavBar-Closed, NavBar-Open | Open state fills orange300 and stacks four H1 links. |
| Icons / Tabler / 20 | 40 icons | Stroke bound to charcoal400. |

## Services section

`src/components/ServicesSection.tsx` opens with a © SERVICES label in the same Label style as the hero's © BLOCK STUDIO emblem, then lists the four services from `docs/Block-Studio-Service-Copy.md`, with short homepage summaries in `src/content/services.ts`. Each row links to `#/services/<slug>`. Its colours, spacing and timing are the `--services-*` and `--motion-services-*` tokens in `components.css`.

- Hovering the list dims the other rows to 32% white and lights the hovered one. The hovered row shows a rounded-square diagram tile (`--services-disc-size`, `--services-disc-radius`, `--services-diagram-bg`) that holds its Hairline diagram, and the whole screen becomes a blurred, enlarged version of it (`--services-diagram-blur`, `--services-scrim`). The pinned wordmark band shows the same backdrop, drawn as a second copy fixed to the viewport so the two line up. The backdrop is for screens 992px and wider that can hover. Keyboard focus triggers the same state.
- Rows rise into view the first time they reach the screen, staggered. With reduced motion they fade in.
- The pinned wordmark acts as a header band (`--derived-band-height`), so the section starts below it and rows scroll beneath it.
- The rows are capped at 1152px (`--derived-services-width`) and centred. The summary column sits flush to the right edge of the row. The hover disc sits just left of the summary, behind the row's text.
- Tablet and below: one column, no disc, no hover dimming.

The earlier circular orange badges that fell back to the brand asterisk when a service had no diagram were retired on 2026-10-09, together with their `--services-badge-N-*` tokens, the `--services-blur`, `--services-glyph-drop` and `--motion-glyph-drop-*` tokens, and the `.services__disc--glyph` render path. Every service now ships with a diagram.

## Gaps to close in Figma

1. NavItem padding (8 and 12) and its two 10px gaps are raw numbers. They match PADDING XSM and SPACING SM, and the nearest gap token is SPACING XSM.
2. Text styles bind only font size and line height. Family, weight, letter spacing and case sit inside each style, so they cannot be themed or switched by mode. The CSS carries them as `--bs-font-weight-*`, `--bs-letter-spacing-*` and `--bs-font-family-*`.
3. The Label style has no bound size or line height. The hero's © glyph is 22.32px with no style at all.
4. The Button Primary gradient and its shadows are not variables, and its label fill is a raw `#222222` where `Brand-charcoal300` exists.
5. `RAIDUS M` is misspelt in Figma. The CSS names it `--bs-radius-m`.
6. Spacing and padding repeat values (8, 16, 24, 82 each appear in both).
7. Typography has a Desktop mode only, so smaller screens have no tokens. The hero and services section step down the existing scale (H2 to H3 to H4) at 900px/991px and 600px/767px.
