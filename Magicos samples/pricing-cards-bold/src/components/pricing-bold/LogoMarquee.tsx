import React, { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import { clientLogos } from '../../data/clientLogos'
import { gsap, BOLD_DURATION } from '../../utils/boldMotion'
import { prefersReducedMotion } from '../../utils/navMotion'

// Full-bleed brand-orange band with knockout client logos drifting slowly
// left to right. Hovering eases the loop to a stop.
export function LogoMarquee() {
  const bandRef = useRef<HTMLElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const loopRef = useRef<gsap.core.Tween | null>(null)

  const { contextSafe } = useGSAP(
    () => {
      if (prefersReducedMotion() || !trackRef.current) return
      loopRef.current = gsap.fromTo(
        trackRef.current,
        { xPercent: -50 },
        { xPercent: 0, duration: BOLD_DURATION.marqueeLoop, ease: 'none', repeat: -1 },
      )
    },
    { scope: bandRef },
  )

  const slowTo = contextSafe((timeScale: number) => {
    if (!loopRef.current) return
    gsap.to(loopRef.current, { timeScale, duration: 0.3, ease: 'power2.out' })
  })

  const logos = [...clientLogos, ...clientLogos]

  return (
    <section
      ref={bandRef}
      aria-label="Trusted by security-first teams"
      className="bg-primitives-colours-brand-orange300"
    >
      <div data-skew className="flex h-28 items-center">
        <p className="shrink-0 pl-padding-l pr-padding-l text-xl font-semibold leading-tight text-primitives-colours-brand-white">
          Trusted by
          <br />
          security-first teams
        </p>
        <div
          className="relative h-full flex-1 overflow-hidden"
          onPointerEnter={() => slowTo(0)}
          onPointerLeave={() => slowTo(1)}
        >
          <div ref={trackRef} className="flex h-full w-max items-center">
            {logos.map((logo, index) => (
              <div
                key={`${logo.name}-${index}`}
                aria-hidden={index >= clientLogos.length}
                className="flex items-center gap-spacing-xsm px-padding-l text-primitives-colours-brand-white"
              >
                <svg viewBox="0 0 24 24" className="h-7 w-7" aria-hidden="true">
                  <path d={logo.glyph} fill="currentColor" fillRule="evenodd" />
                </svg>
                <span className="text-2xl font-bold tracking-tight">{logo.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
