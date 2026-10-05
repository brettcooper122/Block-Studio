import type { ReactNode } from "react";
import "./NavItem.css";

type NavItemProps = {
  href: string;
  children: ReactNode;
};

/**
 * Figma component NAVITEM (64:348), DEFAULT and HOVER built as one element.
 * The label sits twice in a clipped window. On hover the stack rolls up so
 * the second copy shows, while the fill darkens and the corners round out.
 */
export function NavItem({ href, children }: NavItemProps) {
  return (
    <a className="navitem" href={href}>
      <span className="navitem__window">
        <span className="navitem__stack">
          <span className="navitem__label navitem__label--rest text-cta-text">{children}</span>
          <span className="navitem__label navitem__label--hover text-cta-text" aria-hidden="true">
            {children}
          </span>
        </span>
      </span>
    </a>
  );
}
