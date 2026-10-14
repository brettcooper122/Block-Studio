import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'

gsap.registerPlugin(ScrollTrigger, useGSAP)

export { gsap, ScrollTrigger }

// Motion presets for the Bold Neo Modernism variant. Every individual
// transition stays at or under 300ms; richness comes from sequencing.
export const BOLD_EASE = {
  enter: 'expo.out',
  exit: 'power2.out',
  spring: 'back.out(1.6)',
  bounce: 'back.out(3)',
}

export const BOLD_DURATION = {
  press: 0.1,
  release: 0.25,
  hover: 0.16,
  reveal: 0.3,
  revealFast: 0.2,
  accordionOpen: 0.3,
  accordionClose: 0.22,
  switch: 0.3,
  wordStagger: 0.05,
  marqueeLoop: 48,
}
