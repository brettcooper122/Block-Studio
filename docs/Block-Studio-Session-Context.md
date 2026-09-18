# Block Studio — Session Handoff

Read this first in any new session picking up Block Studio work. It orients you on where things are, what's locked, and what's next — the actual content lives in the other docs this file points to.

## Repo

- **Location:** `/Users/brettcooper/Desktop/Block Studio`
- **GitHub:** `brettcooper122/Block-Studio` (private)
- **Gotcha:** Brett has multiple GitHub CLI accounts logged in (`brettcooper122` and `BcooperOT`). If a push fails with "Repository not found," the active `gh` account has switched — run `gh auth switch --user brettcooper122` before retrying.

## What Block Studio is

A creative consulting studio based in Toronto, Canada — Brett's solo practice, positioned like a senior studio rather than a hobbyist. Full positioning, voice rules, and services live in the docs below; don't re-derive any of it from scratch.

## Documentation map

| Doc | What it's for |
|---|---|
| `README.md` (repo root) | Studio-level overview: goals/objectives, positioning, voice rules, buyer segments, services (one-liners), lead industries, site direction |
| `docs/Block-Studio-Positioning-Audit-Handoff.md` + `docs/Block-Studio-Positioning-Audit.html` | The original competitor research: 9 studios + 2 solo practitioners, core finding ("design is the method, never the pitch"), positioning formula, keyword bank, hero line drafts (unfinalized), the "reframing the imposter feeling" section |
| `docs/Block-Studio-Messaging-Services-Context.md` | Voice rules (canonical), buyer segments, rough per-service pain notes — the source material the finalized Service Copy doc was drafted from. Some of it is now superseded (see below) |
| `docs/Block-Studio-Service-Copy.md` | **The finalized, locked first-draft copy** for all three services: headline, description, "what you get," "who it's for." This is the most current and authoritative service copy — if it conflicts with the Messaging Context doc, trust this one |
| `PRD.md` | Spec for the interactive grid hero effect (technical, unrelated to messaging) |
| `src/styles/tokens.css` | Tailwind v4 design tokens: primitive palette (charcoal/orange) + semantic aliases, non-negotiable spacing scale (4/8/16/24/32/40/48/56/64px) |

**Known supersessions** (Messaging Context doc is now out of date in these spots, Service Copy doc is correct):
- The "friendly respondents create bias" framing for Service 02 was explicitly dropped as baseless — don't resurrect it.
- Service 02's audience is now named as SMEs, marketing agencies, and B2B enterprises (not just "founders").
- Service 01's "agentic" was corrected: it means Brett uses AI-augmented workflows to design and build faster, NOT that the service designs UX for products containing AI agents. This reframed Service 01 into a general fast website build-and-launch offer (CMS, SEO, custom domain), not an AI-product-specific service.
- "Who it's for" sections are a single flowing statement across all three services (not bullets) — Brett's explicit preference after trying bullets on Service 02.

## Status: what's locked

All three services in `docs/Block-Studio-Service-Copy.md` are **fully locked** — headline, description, "what you get," and "who it's for" for each of:
1. Agentic End-to-End UX Design & Development
2. Creative Strategy (user & market research)
3. Rapid Pattern Generation & System Scaling

This was done live, service by service, as an interview/riff process (draft → show current copy → Brett redirects or tightens → lock → move on), not a one-shot draft. If continuing in this style, keep that pattern rather than rewriting everything at once.

## Roadmap — what we're trying to achieve, and what's next

**The sequence Brett wants:** finish all site copy first, compile it into one complete docx as the finalized first draft, and only then move into visual design. Design work should not start before the copy is done.

**Still open, in likely order:**
1. **Hero landing statement** — the lead statement on the homepage, called out as the most important copy on the site. Not yet drafted as a locked piece. Three rough directions exist in `Block-Studio-Messaging-Services-Context.md` ("We turn ideas into working products...", "Most designers hand off a Figma file...", "One senior team that ships...") out of ten variants originally drafted, none chosen. Given how service copy evolved through this session (action-first openers, direct second-person address, AI-native-tooling-cost framing), the hero will likely need the same live-interview treatment rather than just picking one of the three old drafts as-is.
2. **About section** — confirmed needed (it's part of the originally recommended minimal site structure: hero, 3-4 services, 2-3 case studies, who-this-is-for, one CTA, About). Scope: short, 2-3 sentences, not a full bio page. Not yet started.
3. **Studio-level "who this is for / not for" section** — mentioned throughout the research as recommended, separate from the per-service "who it's for" already locked. Not yet drafted.
4. **Full docx compile** — once the above are done, compile everything (positioning, services, hero, About, who-this-is-for) into one finalized docx as the complete first draft, per Brett's explicit request. This is the deliverable that gates the start of visual design.

**Already exists but is separate from the messaging work above:** an interactive dither/glitch grid effect prototype for the homepage hero (canvas-based, domain-warped noise field, see `PRD.md`), and a full Tailwind design token system (primitives + semantic, `src/styles/tokens.css`). These are real, working, and pushed — but they're a visual/technical prototype done early in the project, before the "finish copy first" sequencing was established. Don't treat their existence as permission to jump back into visual work before the copy above is finished.

## Voice rules (apply without being asked)

First person plural, Canadian/British spelling, no em dashes, no "genuinely," no manufactured staccato, no colon-lead sentences, no "not X, it's Y" contrastive constructions. Draw from the keyword bank in the Messaging Context doc. Full detail there — this is just the reminder.
