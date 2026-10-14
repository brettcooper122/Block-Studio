import type { RefObject } from 'react'
import { useGSAP } from '@gsap/react'
import { gsap, ScrollTrigger } from '../utils/boldMotion'
import { prefersReducedMotion } from '../utils/navMotion'

const MAX_SKEW = 4

// Tilts elements with scroll speed (clamped to ±4°) and springs them back
// to flat once scrolling stops.
export function useVelocitySkew(
  scope: RefObject<HTMLElement>,
  selector = '[data-skew]',
) {
  useGSAP(
    () => {
      if (prefersReducedMotion() || !scope.current) return
      const elements = gsap.utils.toArray<HTMLElement>(selector, scope.current)
      if (!elements.length) return

      gsap.set(elements, { transformOrigin: '50% 50%', force3D: true })
      const setters = elements.map((el) =>
        gsap.quickTo(el, 'skewY', { duration: 0.3, ease: 'power3.out' }),
      )
      let settleTimer: number | undefined

      ScrollTrigger.create({
        start: 0,
        end: 'max',
        onUpdate: (self) => {
          const skew = gsap.utils.clamp(-MAX_SKEW, MAX_SKEW, self.getVelocity() / -350)
          setters.forEach((set) => set(skew))
          window.clearTimeout(settleTimer)
          settleTimer = window.setTimeout(() => setters.forEach((set) => set(0)), 120)
        },
      })

      return () => window.clearTimeout(settleTimer)
    },
    { scope },
  )
}
