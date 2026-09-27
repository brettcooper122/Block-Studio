# Block Studio — Session Handoff

Read this first in any new session picking up Block Studio work. It orients you on where things are, what's locked, and what's next — the actual content lives in the other docs this file points to.

## Repo

- **Location:** `/Users/brettcooper/Desktop/Block Studio`
- **GitHub:** `brettcooper122/Block-Studio` (private)
- **Gotcha:** Brett has multiple GitHub CLI accounts logged in (`brettcooper122` and `BcooperOT`). If a push fails with "Repository not found," the active `gh` account has switched — run `gh auth switch --user brettcooper122` before retrying.
- **Branch and PR, always.** As of 2026-09-27, all work goes on a branch and opens a pull request. Do not commit directly to `main`. Leave the PR open for Brett to review and merge rather than self-merging. Everything before that date was committed straight to `main`, which is why the history shows no PRs.

## What Block Studio is

A creative consulting studio based in Toronto, Canada — Brett's solo practice, positioned like a senior studio rather than a hobbyist. Full positioning, voice rules, and services live in the docs below; don't re-derive any of it from scratch.

## Documentation map

| Doc | What it's for |
|---|---|
| `README.md` (repo root) | Studio-level overview: goals/objectives, positioning, voice rules, buyer segments, services (one-liners), lead industries, site direction |
| `docs/Block-Studio-Positioning-Audit-Handoff.md` + `docs/Block-Studio-Positioning-Audit.html` | The original competitor research: 9 studios + 2 solo practitioners, core finding ("design is the method, never the pitch"), positioning formula, keyword bank, hero line drafts (unfinalized), the "reframing the imposter feeling" section |
| `docs/Block-Studio-Messaging-Services-Context.md` | Voice rules (canonical), buyer segments, rough per-service pain notes — the source material the finalized Service Copy doc was drafted from. Some of it is now superseded (see below) |
| `docs/Block-Studio-Service-Copy.md` | **The finalized, locked first-draft copy**: the brand positioning statement plus all four services (headline, description, "what you get," "who it's for"). This is the most current and authoritative copy — if it conflicts with the Messaging Context doc, trust this one |
| `docs/Block-Studio-Dossier.html` | Shareable dossier covering the research, the eleven practices analyzed, the lead statement, and all four services' copy. Published at **https://claude.ai/artifact/7YzSksuYCmt3Hi2roz53Ln** (private by default; share from the page's Share menu). Republish by passing that URL as `url`, or by republishing this file path from the session that owns it |
| `PRD.md` | Spec for the interactive grid hero effect (technical, unrelated to messaging) |
| `src/styles/tokens.css` | Tailwind v4 design tokens: primitive palette (charcoal/orange) + semantic aliases, non-negotiable spacing scale (4/8/16/24/32/40/48/56/64px) |

**Known supersessions** (Messaging Context doc is now out of date in these spots, Service Copy doc is correct):
- The "friendly respondents create bias" framing for Service 02 was explicitly dropped as baseless — don't resurrect it.
- Service 02's audience is now named as SMEs, marketing agencies, and B2B enterprises (not just "founders").
- Service 01's "agentic" was corrected: it means Brett uses AI-augmented workflows to design and build faster, NOT that the service designs UX for products containing AI agents. This reframed Service 01 into a general fast website build-and-launch offer (CMS, SEO, custom domain), not an AI-product-specific service.
- "Who it's for" sections are a single flowing statement across all three services (not bullets) — Brett's explicit preference after trying bullets on Service 02.

## Status: what's locked

**Brand positioning statement**, locked 2026-09-27, the homepage lead statement:

> We're a Toronto-based AI-native creative consulting studio, enabling B2B/B2C startup founders and growth-stage agencies to identify the right problems before investing build cycles in the wrong solutions, pairing velocity with analytics to move at market speed.

Brand pillars behind it: velocity, partnership, information over assumption. Positioning intent: an active partner beside the brand rather than a vendor at arm's length. Audience: B2B/B2C startup founders and growth-stage agencies.

Note the statement opens with "We're" and never says the studio name, so the logo and nav have to carry it. It also does not stand alone if lifted into a deck or pitch email without that context.

**About section**, locked 2026-09-27:

> Consumers have become conditioned to expect products faster than they can be understood, placing immense pressure on brands to sacrifice insight in favour of compressed speed-to-market cycles. We teach B2B/B2C founders and growth-stage agencies to expect both observed behaviour and velocity as benchmarks, not a tradeoff. Every engagement opens with discovery research that provides a rigorous read on your brand and who it speaks to, so roadmap strategy is rooted in real gaps rather than assumption. As active participants, we work alongside your product, design, and engineering teams to rapidly ship production-ready design and code, complete with agent-ready documentation and guardrails that enable your system to continue scaling across surfaces long after we leave the room.

Three things about it are deliberate, not oversights. The person shifts from third to second halfway through, because the first half describes the market and the second half addresses the prospect. Two X-not-Y constructions sit in the paragraph ("benchmarks, not a tradeoff" and "real gaps rather than assumption"), which the voice rules otherwise ban, kept across several revisions. And "agent-ready documentation" echoes Service 04's machine-readable framing on purpose, so the About foreshadows that offer.

**Services 01-03** in `docs/Block-Studio-Service-Copy.md` are fully locked — headline, description, "what you get," and "who it's for" for each of:
1. Agentic End-to-End UX Design & Development
2. Creative Strategy (user & market research)
3. Rapid Pattern Generation & System Scaling

**Service 04 — Self-Serve System Enablement & Brand Continuity** is locked as of 2026-09-27, smoothed through the same humanizer and riff cycle as the others. Sold standalone, to any client with an existing system regardless of who built it.

This was all done live, piece by piece, as an interview/riff process (draft → show current copy → Brett redirects or tightens → lock → move on), not a one-shot draft. If continuing in this style, keep that pattern rather than rewriting everything at once.

## Roadmap — what we're trying to achieve, and what's next

**The sequence Brett wants:** finish all site copy first, compile it into one complete docx as the finalized first draft, and only then move into visual design. Design work should not start before the copy is done.

**All site copy is locked as of 2026-09-27.** One item remains:

1. **Full docx compile** — compile the positioning statement, the About section, and all four services into one finalized docx as the complete first draft, per Brett's explicit request. This is the deliverable that gates the start of visual design.

**Dropped deliberately:** the studio-level "who this is for / who it isn't" section. Brett's call, on the grounds that the per-service audience lines and the positioning statement already cover it.

**Already exists but is separate from the messaging work above:** an interactive dither/glitch grid effect prototype for the homepage hero (canvas-based, domain-warped noise field, see `PRD.md`), and a full Tailwind design token system (primitives + semantic, `src/styles/tokens.css`). These are real, working, and pushed — but they're a visual/technical prototype done early in the project, before the "finish copy first" sequencing was established. Don't treat their existence as permission to jump back into visual work before the copy above is finished.

## Voice rules (apply without being asked)

First person plural, Canadian/British spelling, no em dashes, no "genuinely," no manufactured staccato, no colon-lead sentences, no "not X, it's Y" contrastive constructions. Draw from the keyword bank in the Messaging Context doc. Full detail there — this is just the reminder.
