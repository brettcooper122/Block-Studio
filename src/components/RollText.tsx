import type { ReactNode } from "react";
import "./RollText.css";

type RollTextProps = {
  children: ReactNode;
  /** A .text-* style class. The window is one line of that style tall. */
  className?: string;
};

/**
 * The label sits twice in a one-line window. When the nearest .roll-trigger is
 * hovered or focused, the stack rolls up and the second copy shows.
 */
export function RollText({ children, className = "" }: RollTextProps) {
  return (
    <span className={`roll ${className}`}>
      <span className="roll__stack">
        <span className="roll__label">{children}</span>
        <span className="roll__label roll__label--hover" aria-hidden="true">
          {children}
        </span>
      </span>
    </span>
  );
}
