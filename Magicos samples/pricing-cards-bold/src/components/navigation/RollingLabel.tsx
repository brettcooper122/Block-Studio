import React from 'react'

interface RollingLabelProps {
  text: string
}

// Two stacked copies of the label inside a one-line mask. When the parent
// `group` is hovered, the stack rolls up to reveal the second copy.
export function RollingLabel({ text }: RollingLabelProps) {
  return (
    <span className="relative block h-[1.25em] overflow-hidden leading-[1.25em]">
      <span className="block transition-transform duration-200 ease-[cubic-bezier(0.23,1,0.32,1)] group-hover:-translate-y-1/2 motion-reduce:transition-none">
        <span className="block whitespace-nowrap">{text}</span>
        <span className="block whitespace-nowrap" aria-hidden="true">
          {text}
        </span>
      </span>
    </span>
  )
}
