import type { RefObject } from 'react'
import { useGSAP } from '@gsap/react'
import { gsap, ScrollTrigger, BOLD_DURATION, BOLD_EASE } from '../utils/boldMotion'
import { prefersReducedMotion } from '../utils/navMotion'

// Two-way scroll reveals. Elements rise in from below when scrolling down,
// drop in from above when scrolling up, and reverse as they leave. Faster
// scrolling travels further and resolves quicker.
export function useDirectionalReveal(
  scope: RefObject<HTMLElement>,
  selector = '[data-reveal]',
) {
  useGSAP(
    () => {
      if (prefersReducedMotion() || !scope.current) return
      const elements = gsap.utils.toArray<HTMLElement>(selector, scope.current)

      const travel = (velocity: number) =>
        gsap.utils.clamp(32, 96, 32 + Math.abs(velocity) / 40)
      const duration = (velocity: number) =>
        Math.abs(velocity) > 1500 ? BOLD_DURATION.revealFast : BOLD_DURATION.reveal

      elements.forEach((el) => {
        gsap.set(el, { autoAlpha: 0, y: 48 })
        ScrollTrigger.create({
          trigger: el,
          start: 'top 92%',
          end: 'bottom 8%',
          onEnter: (self) =>
            gsap.fromTo(
              el,
              { autoAlpha: 0, y: travel(self.getVelocity()) },
              {
                autoAlpha: 1,
                y: 0,
                duration: duration(self.getVelocity()),
                ease: BOLD_EASE.enter,
                overwrite: 'auto',
              },
            ),
          onLeave: (self) =>
            gsap.to(el, {
              autoAlpha: 0,
              y: -travel(self.getVelocity()),
              duration: BOLD_DURATION.revealFast,
              ease: BOLD_EASE.exit,
              overwrite: 'auto',
            }),
          onEnterBack: (self) =>
            gsap.fromTo(
              el,
              { autoAlpha: 0, y: -travel(self.getVelocity()) },
              {
                autoAlpha: 1,
                y: 0,
                duration: duration(self.getVelocity()),
                ease: BOLD_EASE.enter,
                overwrite: 'auto',
              },
            ),
          onLeaveBack: (self) =>
            gsap.to(el, {
              autoAlpha: 0,
              y: travel(self.getVelocity()),
              duration: BOLD_DURATION.revealFast,
              ease: BOLD_EASE.exit,
              overwrite: 'auto',
            }),
        })
      })
    },
    { scope },
  )
}
