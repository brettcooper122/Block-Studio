# Block Studio

A creative consulting studio based in Toronto, Canada — a team of one, positioned like a senior studio, not a hobbyist.

## Goals & objectives

Distilled from the studio's competitive positioning audit and messaging work (full docs in [`docs/`](./docs)):

1. **Reposition from "design" to business outcome.** Stop selling design as a craft and start selling what it moves — adoption, conversion, retention, trust. Design is the method, never the pitch.
2. **Make solo-and-senior the pitch, not the caveat.** Name it directly: fewer projects, more attention; sharpest, not biggest. A one-person studio competes on focus, not on hiding headcount.
3. **Finalize per-service messaging.** ✅ First draft done — headline, description, "who it's for," and "what you get" for each service, see [`docs/Block-Studio-Service-Copy.md`](./docs/Block-Studio-Service-Copy.md).
4. **Ship a focused site, not a big one.** One sharp hero, the three services by outcome, 2–3 case studies with a real number, a "who this is for / isn't" section, one call to action, an honest About. Nothing a team of one can't credibly maintain.
5. **Lead with proof, not breadth.** Claim enterprise/B2B, AI-native products, and design systems first — the strongest evidenced ground — rather than naming every vertical at once.

## Positioning

The core finding from a competitive audit of nine studios and two solo practitioners:

> None of these studios sell "design." Each one swaps the word for a business outcome — adoption, conversion, retention, trust, funding, or speed. Design is the method, never the pitch.
>
> "If design isn't moving revenue, adoption, or retention, it's decoration." — Lazarev

Positioning formula:

> For **[specific buyer]** who **[specific pain]**, we **[outcome in their words]**, by **[unfair advantage]**, not **[the old, slow way]**.

**Being a team of one is a position, not a limitation.** Named directly, on purpose: "fewer projects, more attention" (Ramotion), "sharpest, not biggest" (Spaceberry). The polish on comparable studio sites comes from copywriting and a good template, not headcount.

## Voice rules

Apply to any Block Studio-facing copy without being asked again:

- First person plural — "we" / "Block Studio," never "I."
- Canadian/British spelling — *-our* endings (colour, behaviour, favour), *-ize* verb endings (organize, recognize, realize).
- Confident, plain, specific. Short declarative sentences. Minimal self-praise adjectives ("beautiful," "stunning," "innovative"). Confidence comes from naming the buyer's world precisely, not describing the work as impressive.
- Never: em dashes, the word "genuinely," manufactured staccato (rapid-fire short sentences stacked for artificial punch), colon-lead sentences ("Here's the thing:"), or "that's not X, that's Y" contrastive constructions.
- Draw from the keyword bank below rather than generic design-agency language ("streamline," "innovative," "cutting-edge").

**Keyword bank:** adoption, conversion, retention, trust, activation, ship / shipped, end-to-end, production-ready, design system, rapid prototyping, validate, zero-to-one, explainability, agentic, investor-grade, sprint pace, complex-to-clear, business outcome.

## Who Block Studio serves

**Founders, pre-seed to Series A** — shipping fast but hiding weak signal behind velocity; can't afford a full design hire and can't risk a bad one; building for investors who want to see something real, not a Figma export; sitting on features that shipped but nobody adopts.

**Small businesses and agencies** — a design system that keeps drifting from what the product actually ships; chasing overflow work with no bench to catch it; guessing at what users want without the resources to run proper research; repositioning around AI without a designer who understands the shift.

## Services

Three lines, designed to connect end to end — Creative Strategy answers *what* to build, Agentic End-to-End brings it to life in real code, and Rapid Pattern Generation keeps the system holding as the product outgrows its original brief.

**Finalized headline, description, "what you get," and "who it's for" copy for each service:** [`docs/Block-Studio-Service-Copy.md`](./docs/Block-Studio-Service-Copy.md) (first draft, pending sign-off — this is the canonical, most current version).

**01 — Agentic End-to-End UX Design & Development.** Design and build in the same hands, from first sketch to production-ready code — states, confidence displays, and agent-to-human handoff patterns included. Closes the handoff loop that breaks down once an AI agent's behaviour can no longer be captured in a static mock.

**02 — Creative Strategy** (user & market research). Scoped interviews, competitive analysis that filters out the fluff, and positioning grounded in the language the market already uses — so a founder confirms the problem is real before building the solution.

**03 — Rapid Pattern Generation & System Scaling.** New components generated to slot into an existing design system, respecting the primitive → semantic → component token hierarchy, so a system keeps its integrity as the product scales instead of forcing a full rebuild.

**Internal only, not a public service line:** automations (built through Claude Cowork) is a fourth capability Brett named, but it's delivery language, not a client-facing offer — never a service page, nav item, or named as "Claude Cowork"/"automations" in client-facing copy. Where relevant it can appear as an implementation detail inside Service 01 or 03.

## Who this is for

**Lead with:** enterprise & B2B product (Mitsubishi, Hyundai, Kraft Heinz), AI-native products (the working method itself is the credential), design systems (OpenText/Blueprint work).
**Credible with the right case study:** fintech, loyalty & rewards (Scene+), marketplaces (Kijiji), automotive, SaaS/B2B tools, accessibility-critical products.
Lead with one or two verticals rather than naming all of them at once.

## Site direction

**Build:** one sharp hero line (pain + outcome), the three services above described by outcome, 2–3 case studies with a before/after and one real number, a short "who this is for / isn't" section (not yet drafted), one clear call to action, a simple About.

**Skip, for a team of one:** programmatic SEO service pages, subscription pricing tiers, a weekly blog cadence, awards walls, multi-office listings, heavy motion work that eats weeks to build.

**Not yet decided:** final hero line (three directions drafted, ten variants total, none locked — see `docs/`), a written studio-level "who this is for / not for" section, whether this site structure is live yet.

**Full detail:** [`docs/Block-Studio-Service-Copy.md`](./docs/Block-Studio-Service-Copy.md) (finalized per-service copy, first draft), [`docs/Block-Studio-Messaging-Services-Context.md`](./docs/Block-Studio-Messaging-Services-Context.md) (voice rules, buyer segments, rough notes the copy was drafted from — canonical reference for any agent writing Block Studio copy), [`docs/Block-Studio-Positioning-Audit-Handoff.md`](./docs/Block-Studio-Positioning-Audit-Handoff.md) (full competitor research narrative), and the interactive [`docs/Block-Studio-Positioning-Audit.html`](./docs/Block-Studio-Positioning-Audit.html).

---

## This repo, right now

A working prototype of the site's interactive hero effect, plus the Tailwind design token setup for the brand.

### Grid effect

A full-viewport, interactive grid: an organic, homogenous mass of colored squares that morphs and drifts across the grid like a living organism — no flickering or hard randomness. See [`PRD.md`](./PRD.md) for the full spec.

- Vite + React + TypeScript
- HTML5 Canvas + `requestAnimationFrame`
- `simplex-noise` (domain-warped 2D noise field drives the mass shape and motion)

### Design tokens

Tailwind v4, with a two-layer token system in [`src/styles/tokens.css`](./src/styles/tokens.css):

- **Primitives** — raw brand palette (`charcoal-*`, `orange-*`) and a non-negotiable spacing scale (4/8/16/24/32/40/48/56/64px), plus the radius scale.
- **Semantic** — meaning-based aliases (`surface`, `border`, `ink`, `accent`, `spacing-stack`, `radius-panel`, …) that components actually consume.

### Run it

```bash
npm install
npm run dev
```

Opens a full-viewport canvas with a right-hand test panel (density, motion intensity, speed, and colors for background/grid/squares) for live tuning.
