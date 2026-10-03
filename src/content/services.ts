/**
 * The four services, from docs/Block-Studio-Service-Copy.md.
 * `summary` is the short homepage version. The full description lives on each service page.
 */
export type Service = {
  number: string;
  title: string;
  summary: string;
  href: string;
};

export const services: Service[] = [
  {
    number: "(01)",
    title: "Agentic End-to-End UX Design & Development",
    summary:
      "We design and ship your product in the same hands, from first sketch to production-ready code, so nothing waits on an engineering handoff.",
    href: "#/services/ux-design-and-development",
  },
  {
    number: "(02)",
    title: "Creative Strategy",
    summary:
      "We validate your product with user and market research, so you identify the right problems before investing a build cycle in the wrong solution.",
    href: "#/services/creative-strategy",
  },
  {
    number: "(03)",
    title: "Rapid Pattern Generation & System Scaling",
    summary:
      "We scale your design system at the pace your product ships, with new patterns delivered in Figma and as production-ready code.",
    href: "#/services/pattern-generation-and-system-scaling",
  },
  {
    number: "(04)",
    title: "Self-Serve System Enablement & Brand Continuity",
    summary:
      "We hand your team a machine-readable version of your system, with lint agents and prompt templates, so every new surface stays on brand without us.",
    href: "#/services/system-enablement",
  },
];
