import gsap from 'gsap'
import { useGSAP } from '@gsap/react'

gsap.registerPlugin(useGSAP)

// Shared motion presets so every header animation feels consistent.
export const EASE_ENTER = 'expo.out'
export const EASE_EXIT = 'power2.out'

export const NAV_DURATION = {
  intro: 0.45,
  introItem: 0.3,
  introStagger: 0.04,
  open: 0.22,
  switch: 0.26,
  close: 0.15,
  row: 0.2,
  rowStagger: 0.03,
  mobileOpen: 0.28,
  mobileClose: 0.2,
  accordionOpen: 0.26,
  accordionClose: 0.2,
}

export function prefersReducedMotion() {
  if (typeof window === 'undefined') return false
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}
