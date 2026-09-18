# Block Studio — Service Copy (first draft)

Finalized headline, description, "what you get," and "who it's for" copy for each of Block Studio's three services. First draft, pending Brett's sign-off — not yet reflected in the live site. Written to the voice rules in `Block-Studio-Messaging-Services-Context.md` (first person plural, Canadian spelling, no em dashes, no "genuinely," no staccato or colon-lead sentences, keyword bank).

Lead pain point for all three: the handoff/speed gap. Each service is framed around a broken process costing time or money right now, not a fear-based "here's the risk" angle, matching the studios' most common hook type from the positioning audit.

Headlines address the reader directly ("your roadmap," "scale your design system") rather than describing a generic third party ("most teams"), per Brett's direction. A humanizer skill pass on this file flagged a repeated "X, not Y" negative-tail construction across multiple bullets and the word "quietly"; both are cleaned up below except where noted.

**Still open:** Service 03's "who it's for" hasn't been revisited yet (Brett chose to leave it for a later pass rather than block on it). Everything else in this file is locked.

**Service 01's scope note:** "Agentic" here means Block Studio uses AI-augmented workflows to design and build faster, not that the service designs UX for products containing AI agents. The copy below reflects that.

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
Teams with a design system already in production that has outgrown its original scope, adding new patterns weekly, and stuck choosing between a full rebuild and letting inconsistency slide.

## Research note

A quick fetch of Lazarev's live service pages (2026-09-15) confirmed a useful pattern for "what you get" sections: they pair a business-facing "Outcomes" line with a separate "Deliverables" line of concrete nouns, for example "end-to-end UX for AI workflows, trust/guardrails, design system updates, build-ready specs." The descriptions above carry the outcome; the bullets above carry the artifacts, matching that split rather than restating the outcome in list form.

A second, deeper fetch of Lazarev's AI-UX-patterns service page (2026-09-15) shaped Service 03's "what you get" directly. Their process leads with a system audit before any design work, and their strongest line, "most teams discover they already have 40-60% of the raw material, it's just scattered and undocumented," is exactly the "clients don't start from zero" value Brett wanted to lead with. That became Service 03's first bullet (the discovery audit) and its second bullet (component hygiene), which didn't exist in the first draft. Two things Lazarev does that we deliberately left out, since they're weeks of process infrastructure that don't fit a team of one: rollout workshops/change-management playbooks, and formal analytics/adoption hooks.

## Related files

- `Block-Studio-Messaging-Services-Context.md` — voice rules, buyer segments, and the rough pain/what-clients-get notes this copy was drafted from
- `Block-Studio-Positioning-Audit-Handoff.md` — the full competitor research narrative
