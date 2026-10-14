import React from 'react'
import { NavLink } from '../../data/navigation'

interface NavLinkRowProps {
  link: NavLink
  onNavigate?: () => void
}

export function NavLinkRow({ link, onNavigate }: NavLinkRowProps) {
  const Icon = link.icon
  return (
    <a
      href={link.href}
      data-nav-row
      onClick={onNavigate}
      className="group/row flex items-start gap-spacing-sm rounded-radius-sm p-padding-xsm transition-colors duration-150 ease-out hover:bg-primitives-colours-brand-charcoal900 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-primitives-colours-brand-orange300"
    >
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-radius-sm border border-primitives-colours-brand-charcoal900 bg-primitives-colours-brand-white text-primitives-colours-brand-charcoal100 transition-colors duration-150 ease-out group-hover/row:text-primitives-colours-brand-orange300">
        <Icon className="h-5 w-5" />
      </span>
      <span className="min-w-0">
        <span className="block text-sm font-medium text-primitives-colours-brand-charcoal100">
          {link.label}
        </span>
        <span className="block font-caption text-xs leading-snug text-primitives-colours-brand-charcoal400">
          {link.description}
        </span>
      </span>
    </a>
  )
}
