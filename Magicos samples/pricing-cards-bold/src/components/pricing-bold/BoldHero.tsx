import React, { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import { gsap, BOLD_DURATION, BOLD_EASE } from '../../utils/boldMotion'
import { prefersReducedMotion } from '../../utils/navMotion'

const HEADLINE = ['Secure', 'Data', 'Plans']

// Tonal hero: dark-orange headline on light orange. Words rise from behind
// a mask on load; the headline drifts slower than the page on scroll.
export function BoldHero() {
  const heroRef = useRef<HTMLElement>(null)
  const headlineRef = useRef<HTMLHeadingElement>(null)

  useGSAP(
    () => {
      if (prefersReducedMotion()) return
      gsap
        .timeline({ delay: 0.15 })
        .from('[data-word]', {
          yPercent: 110,
          duration: BOLD_DURATION.reveal,
          ease: BOLD_EASE.enter,
          stagger: BOLD_DURATION.wordStagger,
        })
        .from(
          '[data-hero-sub]',
          { autoAlpha: 0, y: 16, duration: BOLD_DURATION.reveal, ease: BOLD_EASE.enter },
          '-=0.1',
        )

      gsap.to(headlineRef.current, {
        yPercent: 35,
        ease: 'none',
        scrollTrigger: {
          trigger: heroRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: true,
        },
      })
    },
    { scope: heroRef },
  )

  return (
    <section
      ref={heroRef}
      aria-labelledby="bold-pricing-heading"
      className="overflow-hidden bg-primitives-colours-brand-orange900 px-padding-l pt-padding-xl pb-padding-xl"
    >
      <div className="mx-auto mt-spacing-xxl max-w-6xl text-center">
        <h1
          ref={headlineRef}
          id="bold-pricing-heading"
          className="text-9xl font-medium leading-[0.92] tracking-tighter text-primitives-colours-brand-orange100"
        >
          {HEADLINE.map((word, index) => (
            <span key={word} className="inline-block overflow-hidden pb-spacing-xsm align-top">
              <span data-word className="inline-block">
                {word}
                {index < HEADLINE.length - 1 ? ' ' : ''}
              </span>
            </span>
          ))}
        </h1>
        <p
          data-hero-sub
          className="mx-auto mt-spacing-l max-w-[560px] text-xl leading-snug text-primitives-colours-brand-orange200"
        >
          Choose the right security package for your business with our
          comprehensive data protection solutions.
        </p>
      </div>
    </section>
  )
}
