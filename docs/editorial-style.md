# Editorial style for Block Studio

The editorial design rules for Block (and our other sites) live in one shared place so every project follows the same source:

- **Rules:** `~/.claude/skills/editorial-style/references/style.md`
- **Evidence and research:** `~/.claude/skills/editorial-style/references/research-notes.md`
- **Skill entry point:** `~/.claude/skills/editorial-style/SKILL.md` (Claude loads this for any editorial UI work)

The reference screenshots sit in `Editorial inspo snapshots/` at the repo root. That folder is git-ignored so the images stay local.

This file maps the guide's default tokens onto Block's existing tokens in `tokens/` and lists the gaps we need to close in Figma first. Figma is the source of truth, so new tokens are added there and re-exported, never hand-added to `primitives.css`.

---

## Register

Block uses **register A (Swiss grotesk)**: PP Neue Montreal for display, text and UI. PP Editorial New is available for a serif accent line or pull quote, used once per page at most.

---

## Colour roles

Decided 2026-11-15: Block is light-mode first, with dark charcoal carrying text and structure and orange demoted to a tertiary colour.

| Role | What it covers | Block tokens |
| --- | --- | --- |
| **Primary: light grounds** | Page background, section fields, image placeholders | `--bs-color-white`, `--bs-color-brand-charcoal-900` |
| **Secondary: dark charcoal** | All text, all dividers and rules, outlined controls, focus rings | `--bs-color-brand-charcoal-100` to `-400` |
| **Tertiary: orange** | Occasional small moments only | `--bs-color-brand-orange-300`, `-900` |

## Colour mapping

| Guide token | Block token | Value | Contrast on white | Notes |
| --- | --- | --- | --- | --- |
| `--color-paper` | `--bs-color-white` | `#FFFFFF` | — | Default ground |
| `--color-panel` | `--bs-color-brand-charcoal-900` | `#E9E9E9` | — | Alternate light section field, image placeholders |
| `--color-ink` | `--bs-color-brand-charcoal-100` | `#141414` | 18.4:1 | All primary text |
| `--color-ink-secondary` | `--bs-color-brand-charcoal-400` | `#4E4E4E` | 8.3:1 (6.9:1 on charcoal-900) | Secondary text at any size |
| (large secondary only) | `--bs-color-brand-charcoal-500` | `#7A7A7A` | 4.29:1 | **Fails 4.5:1.** Use only at 24px and above |
| `--color-ink-dim` | `--bs-color-brand-charcoal-700` | `#BDBDBD` | — | Inactive and decorative states only |
| `--color-rule-strong` | `--bs-color-brand-charcoal-300` | `#222222` | — | **Default divider.** 1px dark charcoal for section rules, index rows, tables |
| `--color-rule` | `--bs-color-brand-charcoal-800` | `#D3D3D3` | — | Optional lighter hairline inside dense lists only |
| `--color-accent` | `--bs-color-brand-orange-300` | `#DA4A11` | 4.23:1 | Tertiary. **Fails 4.5:1 for small text.** |
| Accent tint | `--bs-color-brand-orange-900` | `#FBEDE7` | — | Tertiary. Ink text on it 16.1:1 |

**Tertiary orange usage:**

- Small and rare: an active-state dot, a hover or focus moment, a chapter index tile in a case study, one highlighted figure in a results table. Keep it under about 5% of any screen.
- No orange body text, links, dividers or section backgrounds by default. A single orange-900 field per page is the most it should take, and only when a page needs a deliberate break.
- Text on an orange-300 fill must be charcoal-100 at 24px regular / 18.66px bold or larger (4.36:1).

---

## Type mapping

| Guide tier | Block style | Size | Status |
| --- | --- | --- | --- |
| `--text-mega` | none | — | **Gap** |
| `--text-display` | none | — | **Gap.** H1 is 61px; the guide needs about 144px at desktop |
| `--text-statement` | H1 / H2 | 61 / 49px | Usable as statement |
| `--text-lead` | H5 / Body Large | 25 / 20px | OK |
| `--text-body` | Body Small | 16px / 24 | OK |
| `--text-small` | Subtext | 12.8px | Below the guide's 14px small tier; fine for micro |
| `--text-micro` | Label / Subtext | 12.8–16px | OK |

**The display ratio fails today.** H1 ÷ Body Small is 61 ÷ 16 ≈ 3.8. The guide asks for at least 6. Block needs two new Figma text styles before the site can meet the guide:

1. **Display:** about 144px at desktop, line height about 0.95, tracking −0.03em, PP Neue Montreal Medium.
2. **Mega:** about 256px at desktop for the wordmark band and footer, line height 0.86, tracking −0.04em.

The Figma file also has a Desktop mode only. The guide's fluid `clamp()` sizes would replace the current manual H2 → H3 → H4 step-downs at 991px and 767px.

Existing tracking (H1 −0.02em, H3 −0.015em) already matches the guide's direction.

---

## Spacing mapping

| Guide token | Block token | Value |
| --- | --- | --- |
| `--space-1` (4px) | none | **Gap** |
| `--space-2` (8px) | `--bs-spacing-xsm` | 8px |
| `--space-3` (12px) | `--bs-spacing-sm` | 12px |
| `--space-4` (16px) | `--bs-spacing-m` | 16px |
| `--space-5` (24px) | `--bs-spacing-l` | 24px |
| `--space-6` (32px) | none | **Gap** |
| `--space-7` (48px) | `--bs-spacing-xl` | 48px |
| `--space-8` (64px) | none | `--bs-spacing-xxl` is 82px, the nearest step |
| `--space-9` to `--space-11` (96–360px, fluid) | none | **Gap.** Section-scale spacing is missing |

---

## Radius

Decided 2026-11-15: Block moves to sharp, small radii. Working value **4px** (`--bs-radius-xsm`), applied identically to images, panels, buttons and tiles. The exact value is confirmed during build. The 8–32px steps (`--bs-radius-sm` to `--bs-radius-xxl`) fall outside the editorial guide (0–4px) and should not be used on new work. The services hover tile currently uses a larger radius and should move to the site radius when it is next touched.

---

## Case studies

Block case studies follow the guide's long-form pattern (`style.md` section 8.11): title, summary and metadata table in the opening viewport; an intro statement; chapters (Context, Challenge, Approach, Outcome) opened by label rows; a 65ch body column at about 18px placed off-centre with a side lane for captions; varied image breaks; a results table with real figures only; credits and a large next-project link. Copy follows the Block voice rules.

---

## Gaps to close in Figma (in order)

1. Add Display and Mega text styles (fixes the scale-contrast rule).
2. Add section spacing variables (96 / 160 / 240 / 360px) and a 4px and 32px step.
3. Add a secondary grey between charcoal-400 and charcoal-500 that clears 4.5:1 on white (for example `#6B6B6B`), or standardise on charcoal-400.
4. Add Tablet and Mobile modes to the typography collection, or adopt fluid sizes.
5. Confirm the site radius (working value 4px) and retire 8–32px radius steps from new components.
