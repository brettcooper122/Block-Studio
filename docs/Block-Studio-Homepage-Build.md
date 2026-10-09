# Block Studio homepage build: handoff

Read this before touching the site code. It covers what is built, the stack, where everything lives, which branches hold what, and what is still open. For the studio itself (positioning, copy, voice) read `docs/Block-Studio-Session-Context.md` first; this doc is the build half.

Last updated: 2026-10-05.

## Status at a glance

The homepage has two finished sections, the **hero** and the **services section**, and the services section's hover badges now show one interactive line drawing per service. Nothing below the services section is built yet (no case studies, About, contact or footer), and the nav links (`#works`, `#about`, `#contact`) point nowhere yet.

All of it is on GitHub across three branches (see "Branches and pull requests"). Nothing is on `main` yet except the docs, fonts and the Impeccable skill.

## Tech stack

| Part | What | Notes |
| --- | --- | --- |
| Build | Vite 8, TypeScript 6, React 19 | `npm run dev` serves on http://localhost:5173. `npm run build` runs `tsc -b` then `vite build` into `dist/` |
| Styling | Plain CSS per component, Tailwind v4 via `@tailwindcss/vite` | Components use their own `.css` files and CSS custom properties from `tokens/`. Tailwind utilities are available via `tokens/tailwind.css` but barely used yet |
| Motion | GSAP 3 with `@gsap/react` (`useGSAP`), ScrollTrigger, SplitText, CustomEase | All motion values (durations, eases, distances) are read from CSS tokens through `src/lib/tokens.ts` |
| Lint | `oxlint` (`npm run lint`) | Clean on the site code; warnings in `.claude/skills/` and `service diagrams/` are third-party |
| Fonts | PP Neue Montreal and PP Editorial New, self-hosted in `public/fonts/pp/` | `@font-face` rules in `tokens/typography.css` |
| Diagrams | Hairline (`@lucasmarkes/hairline` engine, MIT) via the `hairline-create` agent skill | Plain JS figures, built into standalone HTML frames. See "Service diagrams" |

No Lenis, no Framer Motion, no router: the page is one React tree.

## Running it

```
npm install
npm run dev        # http://localhost:5173
npm run build      # type-check and production build
npm run lint
```

The services badges and backdrop only show on a wide screen with a mouse (`min-width: 992px`, `hover: hover`, `pointer: fine`). Below 992px the badge is hidden and the rows stack.

## Repo map

| Path | What it is |
| --- | --- |
| `index.html`, `src/main.tsx`, `src/App.tsx` | Entry. `App` renders `<Hero />` then `<ServicesSection />` |
| `src/index.css` | Imports every token layer, then base page styles |
| `src/components/Hero.tsx`, `Hero.css`, `useHeroMotion.ts` | The hero: nav, eyebrow, statement, giant wordmark, and all of its scroll motion |
| `src/components/NavItem.tsx`, `NavItem.css` | The pill nav item, built from the Figma NAVITEM component (rolling label on hover) |
| `src/components/ServicesSection.tsx`, `ServicesSection.css`, `useServicesMotion.ts` | The services list, its hover badges and the rows' scroll-in |
| `src/components/ServicesBackdrop.tsx`, `ServicesBackdrop.css` | The full-screen blurred backdrop behind a hovered service. Rendered twice: in the services section and in the hero's pinned wordmark band, both fixed to the viewport so they line up |
| `src/content/services.ts` | The four services: number, title, summary, link, block glyph, and the `diagram` entry for each badge |
| `src/lib/tokens.ts` | Reads CSS tokens (numbers, seconds, beziers) for the GSAP code |
| `src/assets/brand/` | Wordmark, asterisk and sticker SVGs |
| `src/assets/glyphs/` | Per-service block glyphs. Only `glyph-01-last-piece.svg` exists. Made by `scripts/build-glyphs.py` |
| `tokens/` | The design tokens, exported from Figma. **Read `tokens/README.md`** |
| `src/styles/tokens.css` | An older Tailwind palette. Its charcoal scale runs the opposite way to `tokens/`. Prefer `tokens/` |
| `public/diagrams/` | The built diagram frames the site embeds (`frame-<name>.html`) and the backdrop stills (`backdrop-<name>.png`) |
| `service diagrams/` | The Hairline source for every diagram, plans, build scripts. **Read its `README.md` and `PLANS.md`** |
| `scripts/build-glyphs.py` | Generates the 6x6 block glyphs |
| `docs/` | Studio docs: positioning audit, service copy, session context, the dossier, and this file |

## Design tokens

Three layers, all CSS custom properties, all in `tokens/`:

1. `primitives.css`: `--bs-color-*`, `--bs-radius-*`, `--bs-spacing-*`, `--bs-padding-*`, type scale. From Figma variables.
2. `typography.css`: `@font-face` and one `.text-*` class per Figma text style (`text-h2`, `text-h2-serif`, `text-label`, `text-body-small`, and so on).
3. `components.css`: aliases per component (`--navitem-*`, `--hero-*`, `--services-*`, `--motion-*`) plus a few `--derived-*` values Figma has no variable for.

Rules that matter:

- **Bind to tokens, never raw values.** Every colour, radius, space and duration in component CSS goes through a `--services-*`/`--hero-*` alias in `components.css`, which points at a primitive.
- **The charcoal scale is light at the top.** `--bs-color-brand-charcoal-900` is `#e9e9e9` (light grey, the nav pills and the diagram tiles); `charcoal-100` is the darkest. Brett calls these "brand-charcoal900" and so on.
- Radius steps: `--bs-radius-xsm` 4, `sm` 8, `m` 12, `l` 16, `xl` 24, `xxl` 32.

## The hero (`Hero.tsx`, `useHeroMotion.ts`)

- Fixed nav: sticker logo left, three `NavItem` pills right.
- Eyebrow `© BLOCK STUDIO` (with a mirrored K) and the locked positioning statement in `text-h2`, with a serif accent phrase.
- A giant `BLOCK*STUDIO` wordmark with a spinning asterisk, brought in letter by letter.
- On scroll: the statement fades, the page fades to charcoal, the wordmark pins to the top as a band (which also carries a copy of the services backdrop), and the asterisk turns white. The colour change completes after 80% of a screen.

## The services section (`ServicesSection.tsx`)

- Four rows, each a link: number, title, summary. Rows scroll in with `ScrollTrigger.batch`.
- Hovering a row dims the others and shows its **badge**: a 262px rounded square (`--services-disc-size`, `--services-disc-radius` = `--bs-radius-xl`) on `--services-diagram-bg` (= `--bs-color-brand-charcoal-900`), holding that service's diagram.
- A shown badge sits **above** every row's text (`z-index: 2`); hidden, it sits behind.
- The badge is a sibling of the row's link, not inside it (a link cannot hold an iframe), so CSS shows it with `.services__item:hover + .services__disc` and `:focus-visible + .services__disc`.
- Each diagram is an `<iframe>` of `public/diagrams/frame-<name>.html?bg=none&pad=0.84&intensity=…`. The iframe has `pointer-events: none`; the row passes its hover in with `postMessage({ hairline: "enter", at })` and `{ hairline: "leave" }` (see `hover()` in `ServicesSection.tsx`). So hovering anywhere on the row brings the diagram to life.
- The **backdrop**: hovering a row sets `data-service` on `<html>`, and `ServicesBackdrop` shows that service's still (`public/diagrams/backdrop-<name>.png`) blown up to 90vmin on the tile colour, under a 10px blur (`--services-diagram-blur`) and the section scrim (`--services-scrim`). Services without a diagram fall back to their glyph on the old badge colours (`--services-badge-N-*`), which none currently use.

Which diagram each service shows is set in `src/content/services.ts`:

| Service | Badge diagram | `at` (viewBox point the hover holds) | intensity |
| --- | --- | --- | --- |
| (01) Agentic End-to-End UX Design & Development | marble run | 212, 160 | 0 |
| (02) Creative Strategy | lens | 209, 113 | 0.5 |
| (03) Rapid Pattern Generation & System Scaling | pyramid | 211, 213 | 0.5 |
| (04) Self-Serve System Enablement & Brand Continuity | guide rails | 221, 173 | 0 |

The two always-moving diagrams take intensity 0, so the row's hover slows them only to 60% of full speed.

## Service diagrams (`service diagrams/`)

Made with the **`hairline-create`** agent skill (installed with `npx skills add lucasmarkes/hairline`; it lives in `~/.agents/skills/hairline-create`, symlinked into `~/.claude/skills`). Its docs (`SKILL.md`, `rules.md`, `concepts.md`, `look.md`) define the style: isometric line drawings of real objects, one stroke palette, one bright highlight, no words, a composed rest pose, and ten rules a figure must pass.

Each diagram is one file, `<name>.js`, the only thing to edit. Built from it:

- `hairline-<name>.html`: the review page (read-out, intensity slider, theme switch), from the skill's `build.mjs`/`look.mjs`.
- `frame-<name>.html`: the drawing alone, scaled to fit any box, from `build-frame.mjs` and `frame.html`. Takes `?theme=dark`, `?pad=`, `?bg=none`, `?intensity=`, and the `postMessage` hover above.

| Diagram | File | Service | Status |
| --- | --- | --- | --- |
| Marble run | `marble-run.js` | 01 | On the site |
| Dominoes | `dominoes.js` | 01 | Alternate (repo only) |
| Lens | `lens.js` | 02 | On the site |
| Sieve | `sieve.js` | 02 | Alternate (repo only) |
| Pyramid | `pyramid.js` | 03 | On the site |
| Guide rails | `guide-rails.js` | 04 | On the site |

`PLANS.md` has the prompt, metaphor, object, pointer behaviour, rest pose, read-out and slider for each, including why concepts changed. A seventh concept, the snap tray (an organiser tray for 03, replaced by the pyramid), was never committed.

To change a diagram:

```
cd "service diagrams"
# edit <name>.js, then check it against the skill's rules and look at the sheet it writes
node ~/.agents/skills/hairline-create/look.mjs <name>.js --answer x,y,z
# rebuild its frame for the site
node build-frame.mjs <name>.js ../public/diagrams
cd ..
# with npm run dev running, retake the backdrop stills
node "service diagrams/build-stills.mjs"
```

`look.mjs` validates the figure (no colours, no words, no timers, at most 200 lines, and more), renders eight shots onto one sheet, and checks the frame, read-out and console. Do not ship a figure it rejects. The validator forbids fills, filters and opacity, so "shading" in this style means dim crease lines (`lo` class), and blur means drawn offset copies (see `lens.js`).

## Branches and pull requests

Brett's rule: **all work goes on a branch with a pull request; never commit to `main`; leave PRs for Brett to merge.**

| Branch | PR | Holds |
| --- | --- | --- |
| `feat/hero-and-tokens` | #5 | Figma tokens, the hero, the services section (before the diagrams) |
| `feat/service-diagrams` | #6 | The `service diagrams/` folder only |
| `feat/service-badge-diagrams` | see GitHub | Everything: #5 plus #6 merged in, plus the badges, backdrop, stills and these docs. Merging this one into `main` brings in all homepage work to date |

The badge branch was cut from `feat/hero-and-tokens` and has `feat/service-diagrams` merged into it, so either merge it alone, or merge #5 and #6 first and then it.

GitHub CLI gotcha: two accounts are logged in (`brettcooper122` and `BcooperOT`). This repo needs `brettcooper122`; run `gh auth switch --user brettcooper122` if a push says "Repository not found".

## Working with Brett

- Product designer, limited technical background: lead with plain-English outcomes.
- Builds diagrams one at a time and approves each before the next; shows work in the browser (`open <file>`) and on localhost.
- Cares that objects read as specific real things, about paint-order mistakes (things showing through or in front when they should not), and about everything binding to tokens.
- Studio voice rules apply to any site copy (see `README.md` and the session context): first person plural, Canadian spelling, no em dashes, no "genuinely", no staccato, no colon-lead sentences, no "not X but Y".

## Open threads and next steps

1. **Backdrop scrim.** The backdrop's tile grey reads as mid grey because the section scrim darkens it to keep the white text legible. Options put to Brett: keep it, lighten it, or remove it and switch the services text to dark ink on hover. Undecided.
2. **Long, thin diagrams look small in the square badge** (the dominoes did; the marble run and guide rails less so). If it matters, crop in or reshape the drawing.
3. **Unused glyph plumbing.** All four services now have diagrams, so the glyph-in-badge path and `--services-badge-N-*` colours are unused on the site. Keep or remove once the direction is settled.
4. **Sections still to build:** case studies (2 or 3, with a real number each), About (copy is locked in the session context), contact and footer, and the `#works`/`#about`/`#contact` targets.
5. **Service pages:** each row links to `#/services/<slug>`, which do not exist yet.
6. **Mobile:** the badge and backdrop are desktop-only by design. Whether diagrams should appear on mobile is open.
7. **Copy docx compile** (from the session context roadmap) is still listed there as the gate before design; design work has since started on Brett's call.
8. The sanity cleanup on 2026-10-09 retired the earlier `#grid` demo (`GlitchGrid.tsx`, `ControlsPanel.tsx`, `src/lib/noise.ts`, `PRD.md`, the `simplex-noise` dep) and the unused Vite-template assets (`hero.png`, `react.svg`, `vite.svg`). The repo now holds only what the live site renders.
