import React, { useRef } from 'react'
import { PlusIcon } from 'lucide-react'
import { useGSAP } from '@gsap/react'
import { gsap, BOLD_DURATION, BOLD_EASE } from '../../utils/boldMotion'
import { prefersReducedMotion } from '../../utils/navMotion'

interface BoldFaqItemProps {
  id: string
  question: string
  answer: string
  isOpen: boolean
  onToggle: () => void
}

// Rounded accordion row. Opens to its real height, the answer fades up and
// the circular toggle fills orange while its plus turns into a cross.
export function BoldFaqItem({ id, question, answer, isOpen, onToggle }: BoldFaqItemProps) {
  const rowRef = useRef<HTMLLIElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)
  const innerRef = useRef<HTMLDivElement>(null)
  const iconRef = useRef<HTMLSpanElement>(null)
  const toggleRef = useRef<HTMLSpanElement>(null)
  const isFirstRun = useRef(true)

  useGSAP(
    () => {
      const panel = panelRef.current
      const inner = innerRef.current
      if (!panel || !inner) return
      const instant = isFirstRun.current || prefersReducedMotion()
      isFirstRun.current = false

      if (instant) {
        gsap.set(panel, { height: isOpen ? 'auto' : 0 })
        gsap.set(inner, { autoAlpha: isOpen ? 1 : 0, y: 0 })
        gsap.set(iconRef.current, { rotate: isOpen ? 45 : 0 })
        return
      }

      if (isOpen) {
        gsap.to(panel, { height: 'auto', duration: BOLD_DURATION.accordionOpen, ease: BOLD_EASE.enter, overwrite: 'auto' })
        gsap.fromTo(
          inner,
          { autoAlpha: 0, y: 10 },
          { autoAlpha: 1, y: 0, duration: 0.25, delay: 0.05, ease: BOLD_EASE.enter, overwrite: 'auto' },
        )
      } else {
        gsap.to(panel, { height: 0, duration: BOLD_DURATION.accordionClose, ease: BOLD_EASE.exit, overwrite: 'auto' })
        gsap.to(inner, { autoAlpha: 0, y: 6, duration: 0.15, ease: BOLD_EASE.exit, overwrite: 'auto' })
      }
      gsap.to(iconRef.current, { rotate: isOpen ? 45 : 0, duration: 0.3, ease: 'back.out(2)', overwrite: 'auto' })
    },
    { dependencies: [isOpen], scope: rowRef },
  )

  const handleClick = () => {
    if (!prefersReducedMotion() && toggleRef.current) {
      gsap.fromTo(
        toggleRef.current,
        { scale: 0.86 },
        { scale: 1, duration: BOLD_DURATION.release, ease: BOLD_EASE.bounce, overwrite: 'auto' },
      )
    }
    onToggle()
  }

  return (
    <li
      ref={rowRef}
      className={`rounded-radius-xl border transition-colors duration-200 ease-out ${
        isOpen
          ? 'border-primitives-colours-brand-orange900 bg-primitives-colours-brand-orange900'
          : 'border-primitives-colours-brand-charcoal900 bg-primitives-colours-brand-white hover:border-primitives-colours-brand-orange700'
      }`}
    >
      <h3>
        <button
          id={`${id}-button`}
          type="button"
          aria-expanded={isOpen}
          aria-controls={`${id}-panel`}
          onClick={handleClick}
          className="group flex w-full items-center justify-between gap-spacing-l rounded-radius-xl py-padding-sm pl-padding-m pr-padding-sm text-left text-lg font-medium text-primitives-colours-brand-charcoal100 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-primitives-colours-brand-orange300"
        >
          {question}
          <span
            ref={toggleRef}
            aria-hidden="true"
            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full transition-colors duration-200 ease-out ${
              isOpen
                ? 'bg-primitives-colours-brand-orange200 text-primitives-colours-brand-white'
                : 'bg-primitives-colours-brand-orange900 text-primitives-colours-brand-orange100 group-hover:bg-primitives-colours-brand-orange800'
            }`}
          >
            <span ref={iconRef} className="flex">
              <PlusIcon className="h-5 w-5" />
            </span>
          </span>
        </button>
      </h3>
      <div
        ref={panelRef}
        id={`${id}-panel`}
        role="region"
        aria-labelledby={`${id}-button`}
        className="h-0 overflow-hidden"
      >
        <div ref={innerRef} className="invisible opacity-0">
          <p className="pb-padding-m pl-padding-m pr-padding-xl text-base leading-relaxed text-primitives-colours-brand-charcoal400">
            {answer}
          </p>
        </div>
      </div>
    </li>
  )
}
