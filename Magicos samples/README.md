# Magicos samples

Designs ported from Magic Patterns OS into standalone browser pages. Each sample sits in its own folder with its own packages, so none of it touches the Block Studio site build.

## pricing-cards-bold

Source: Magic Patterns OS "Pricing Cards Section with Visual Hierarchy - Bold OS Version", design "Pricing Cards Section with Visual Hierarchy - Bold Version".

**View it:** open `pricing-cards-bold.html` in a browser. It is a single self-contained file, so double-clicking works. Add `?billing=yearly` to the address to open on yearly prices.

**Edit it:**

```bash
cd "Magicos samples/pricing-cards-bold"
npm install
npm run dev     # live preview at http://localhost:5173
npm run build   # rebuilds ../pricing-cards-bold.html
```

Plan prices, FAQs, nav links and client logos live in `src/data/`.

What it includes: masked word reveal and scroll parallax on the hero, a hover-to-pause logo marquee, a billing switch with a sliding thumb, rolling price digits, magnetic CTA buttons, a morphing nav dropdown, a pill header that hides on fast scroll, two-way scroll reveals, scroll-speed skew on the cards, and a filterable FAQ accordion. Everything respects reduced-motion settings.

The layout is desktop only (minimum width 1440px), matching the original design. Fonts load from Google Fonts and the Magic Patterns CDN, so the page needs an internet connection to show the right typefaces.
