# Block Studio — Service Copy (first draft)

Finalized headline, description, "what you get," and "who it's for" copy for each of Block Studio's four services. First draft, pending Brett's sign-off — not yet reflected in the live site. Written to the voice rules in `Block-Studio-Messaging-Services-Context.md` (first person plural, Canadian spelling, no em dashes, no "genuinely," no staccato or colon-lead sentences, keyword bank).

Lead pain point across the set: the handoff/speed gap. Each service is framed around a broken process costing time or money right now, not a fear-based "here's the risk" angle, matching the studios' most common hook type from the positioning audit.

Headlines address the reader directly ("your roadmap," "scale your design system") rather than describing a generic third party ("most teams"), per Brett's direction. A humanizer skill pass on this file flagged a repeated "X, not Y" negative-tail construction across multiple bullets and the word "quietly"; both are cleaned up below except where noted.

**Status:** the brand positioning statement and Services 01-03 are locked. Service 04 is a first draft from 2026-09-24, pending a smoothing pass. Still to write: the About section and the studio-level "who this is for / who it isn't."

**Service 01's scope note:** "Agentic" here means Block Studio uses AI-augmented workflows to design and build faster, not that the service designs UX for products containing AI agents. The copy below reflects that.

## Brand positioning statement

*Locked 2026-09-27. The lead statement for the homepage, written to sit above the services.*

> Block Studio is a Toronto-based AI-native creative consulting studio that takes brands from inference to evidence, pairing velocity with analytics so startup founders and agency players solve the right problems before investing in the wrong solutions.

**Brand pillars:** velocity, partnership, information over assumption.

**Audience:** startup founders and agency players who want to identify the right problems before designing the wrong solution.

**Positioning intent:** an active partner beside brands rather than a vendor at arm's length. Structure follows the pattern the audited studios use in their own lead statements: say who you are and where you operate, then who you help and how, without self-praise adjectives.

## Service 01 — Agentic End-to-End UX Design & Development

**Headline**
Your roadmap doesn't need a build queue. We design and ship the product ourselves.

**Description**
Design and build happen in the same hands here, from first sketch through to production-ready code, so nothing waits on a separate engineering handoff. AI-augmented workflows make that possible at a pace a traditional build process can't match: what used to take a sprint now takes days. Clients test the real product with real users, not a prototype standing in for one.

**What you get**
- Production-ready styles, components, and patterns, hosted in Figma, GitHub, and Storybook
- A custom CMS, so your team can continue to publish rapidly post-launch
- SEO-optimized, turnkey website, hosted on your custom domain

**Who it's for**
Founders and product teams who need a real, working website launched fast, not a static approximation of it, and can't afford the four-sprint wait between a design decision and something a user can actually touch.

## Service 02 — Creative Strategy (user & market research)

**Headline**
Validate your product and identify the right problems before investing a build cycle in the wrong solution.

**Description**
The velocity offered by AI-native tooling has reduced the cost of exploration for founders looking to compress time-to-launch cycles, at the critical expense of observed user behaviour as a result of shipping purely on internal assumption. We help founders of SMEs, marketing agencies, and B2B enterprises target the right problems before investing in the wrong solution.

**What you get**
- Qualitative insights from relevant users, scoped to the questions your business needs answered
- Competitive analysis of market-adjacent players, distilling the gaps and target opportunities that make each move strategic
- Buyer personas built from that research, reflecting how your actual target audience thinks and behaves, so every design decision is grounded in data instead of a guess
- Information architecture and end-to-end journey maps that account for every conversion flow, catching friction points before they become 5-alarm fires post-launch

**Who it's for**
Founders investing in build cycles based on internal assumption, and organizations relying on outdated personas as the source of truth for launching new products.

## Service 03 — Rapid Pattern Generation & System Scaling

**Headline**
Scale your design system at the pace your product ships, without losing the rules it was built on.

**Description**
Your design system has drifted as it scales, with commits outpacing the library, documentation quickly going stale, and teams left guessing instead of reusing, breeding redundancy, bloat, and disparity across your live product. We craft adaptive design systems, from Figma to codebase, built to move at the pace of the teams pulling from and contributing to them: a lever for scale instead of a ceiling that slows them down, complete with documentation built in the language of every team so nobody has to guess.

**What you get**
- A discovery audit, run through working sessions with your product and creative teams, surfacing the redundancies and inefficiencies already living in your system, so nothing gets rebuilt that's already working
- Component hygiene: hardcoded values folded back into your existing token hierarchy, so inconsistency doesn't compound as the system scales
- A curated collection of new components and patterns, delivered in Figma and as production-ready code, built to spec against the constraints and styles of your existing visual system
- Spec documentation for each new pattern, hosted in Storybook so your internal engineering team can pick it up directly

**Who it's for**
Teams whose design system has drifted as it scaled, adding new patterns weekly and stuck choosing between a costly rebuild and letting redundancy and disparity slide.

## Service 04 — Self-Serve System Enablement & Brand Continuity

*First draft, 2026-09-24. Sold standalone, not gated behind another service: a client with an existing system built by anyone can buy this. Distinct from Service 03, which is Block Studio doing ongoing pattern work for the client; this equips the client's own team to do it themselves.*

**Headline**
Your next section gets built without us. It should still look like we built it.

**Description**
Brand guidelines written as prose cannot tell an LLM which token is correct, so your team's AI hand-rolls something close enough to pass, and that near-miss becomes the precedent the next section copies. We hand over a machine-readable version of your system, hosted in your repo, with the lint gates and prompt templates your team needs to extend it correctly without us in the room.

**What you get**
- A GitHub repo carrying your system as machine-readable contracts, so an LLM reads real token values instead of guessing at them
- Lint gates that reject off-brand output before it reaches your live product, catching hardcoded values and invented tokens automatically
- Standardized prompt templates for the sections your team actually builds, so the result holds regardless of who writes the prompt
- An end-to-end operating guide covering creation, implementation, deployment, and documentation, written in plain language for whoever picks it up

**Who it's for**
Teams who will keep building long after an engagement ends, and the design or marketing leads accountable for brand consistency across work they no longer personally author.

## Research note

A quick fetch of Lazarev's live service pages (2026-09-15) confirmed a useful pattern for "what you get" sections: they pair a business-facing "Outcomes" line with a separate "Deliverables" line of concrete nouns, for example "end-to-end UX for AI workflows, trust/guardrails, design system updates, build-ready specs." The descriptions above carry the outcome; the bullets above carry the artifacts, matching that split rather than restating the outcome in list form.

**Service 04's research (2026-09-24)** ran two streams: a scan of the nine audited studios plus the wider market for anything resembling this offer, and a hunt for how practitioners actually describe the pain.

Competitor finding: only Ramotion genuinely occupies this territory, with named sub-services for "design system strategy & team setup" ("governance frameworks... guidance on avoiding system entropy") and "onboarding & training" ("These resources empower your teams to apply the design system confidently"). Phoenux is closest on AI framing ("AI-native design systems," "AI is wrong ten percent of the time. Design for that") but sells an embedded retainer, asking to "act as our design team rather than a vendor." The wider category behaves the same way: the dominant model is retainer or embedded team, and one competitor pitches explicitly against handoff, saying they don't "build and hand off a static file" but "become a dedicated Design System team." **Selling independence is therefore differentiated against the category itself, not just against these nine.** The copy above deliberately avoids "governance," "onboarding," and "training" in the headline and description to stay off Ramotion's ground. The LLM-guardrail angle appears unclaimed by design studios; it currently belongs to martech/brand SaaS (Frontify, Typeface, Monigle, Adobe), whose useful vocabulary includes "brand-safe by design" and "machine-readable parameters that generative design tools must follow." One caution: no comparable pricing anchor exists for a one-time, repo-delivered handoff product.

Pain-point finding: the sharpest framing is that AI multiplies drift at machine speed, and a stale system is specifically catastrophic for agents because they cannot judge which source is correct. Practitioner quotes that shaped the description: "the agent hand-rolled them, close enough to pass"; "at machine speed, the 5% that drifts doesn't stay a rounding error, it becomes the screen the next agent copies"; "your docs say one thing, your tokens do another and your components do a third... for AI agents it's catastrophic because they can't judge which source is correct"; "your design system isn't in the prompt... when it is in the prompt, it's stale." Credibility numbers held for use elsewhere on the site, from zeroheight's 2026 Design Systems Report (n=147): only 7% of teams report full adoption, 61% are worried about AI design generation, only 40% have any token automation, and only 40% of design systems remain active beyond 18 months. Separately, 81% of companies struggle with off-brand content creation (Adobe).

A second, deeper fetch of Lazarev's AI-UX-patterns service page (2026-09-15) shaped Service 03's "what you get" directly. Their process leads with a system audit before any design work, and their strongest line, "most teams discover they already have 40-60% of the raw material, it's just scattered and undocumented," is exactly the "clients don't start from zero" value Brett wanted to lead with. That became Service 03's first bullet (the discovery audit) and its second bullet (component hygiene), which didn't exist in the first draft. Two things Lazarev does that we deliberately left out, since they're weeks of process infrastructure that don't fit a team of one: rollout workshops/change-management playbooks, and formal analytics/adoption hooks.

## Related files

- `Block-Studio-Messaging-Services-Context.md` — voice rules, buyer segments, and the rough pain/what-clients-get notes this copy was drafted from
- `Block-Studio-Positioning-Audit-Handoff.md` — the full competitor research narrative
