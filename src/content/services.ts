import lastPieceGlyph from "../assets/glyphs/glyph-01-last-piece.svg?raw";

/**
 * The four services, from docs/Block-Studio-Service-Copy.md.
 * `summary` is the short homepage version. The full description lives on each service page.
 * `glyph` is the service's block glyph, shown in its blurred backdrop (and in its hover badge when
 * it has no diagram). Services without one yet fall back to the studio asterisk.
 * `diagram` is the service's Hairline line drawing, shown in its hover badge: `src` is its frame
 * page in public/diagrams (built from "service diagrams/"), and `at` is the viewBox point the
 * row's hover holds the drawing's pointer at.
 */
export type Service = {
  number: string;
  title: string;
  summary: string;
  href: string;
  glyph?: string;
  diagram?: { src: string; at: [number, number] };
};

export const services: Service[] = [
  {
    number: "(01)",
    title: "Agentic End-to-End UX Design & Development",
    summary:
      "We design and ship your product in the same hands, from first sketch to production-ready code, so nothing waits on an engineering handoff.",
    href: "#/services/ux-design-and-development",
    glyph: lastPieceGlyph,
    diagram: { src: "/diagrams/frame-dominoes.html", at: [64, 124] },
  },
  {
    number: "(02)",
    title: "Creative Strategy",
    summary:
      "We validate your product with user and market research, so you identify the right problems before investing a build cycle in the wrong solution.",
    href: "#/services/creative-strategy",
    diagram: { src: "/diagrams/frame-lens.html", at: [209, 113] },
  },
  {
    number: "(03)",
    title: "Rapid Pattern Generation & System Scaling",
    summary:
      "We scale your design system at the pace your product ships, with new patterns delivered in Figma and as production-ready code.",
    href: "#/services/pattern-generation-and-system-scaling",
    diagram: { src: "/diagrams/frame-pyramid.html", at: [211, 213] },
  },
  {
    number: "(04)",
    title: "Self-Serve System Enablement & Brand Continuity",
    summary:
      "We hand your team a machine-readable version of your system, with lint agents and prompt templates, so every new surface stays on brand without us.",
    href: "#/services/system-enablement",
    diagram: { src: "/diagrams/frame-guide-rails.html", at: [221, 173] },
  },
];
