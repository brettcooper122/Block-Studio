import React, { useEffect, useLayoutEffect, useRef } from 'react'
import { gsap, BOLD_DURATION } from '../../utils/boldMotion'
import { prefersReducedMotion } from '../../utils/navMotion'

type Period = 'monthly' | 'yearly'

interface BoldBillingSwitchProps {
  selected: Period
  onChange: (value: Period) => void
  yearlyDiscountLabel: string
}

// Pill switch with a rounded orange thumb that slides with a slight overshoot.
export function BoldBillingSwitch({
  selected,
  onChange,
  yearlyDiscountLabel,
}: BoldBillingSwitchProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const thumbRef = useRef<HTMLSpanElement>(null)
  const itemRefs = useRef<Record<Period, HTMLButtonElement | null>>({
    monthly: null,
    yearly: null,
  })
  const selectedRef = useRef(selected)
  const hasPlaced = useRef(false)
  selectedRef.current = selected

  const place = (animate: boolean) => {
    const el = itemRefs.current[selectedRef.current]
    const thumb = thumbRef.current
    if (!el || !thumb) return
    const vars = { x: el.offsetLeft, width: el.offsetWidth, autoAlpha: 1 }
    if (!animate || prefersReducedMotion()) {
      gsap.set(thumb, vars)
      return
    }
    gsap.to(thumb, {
      ...vars,
      duration: BOLD_DURATION.switch,
      ease: 'back.out(1.4)',
      overwrite: 'auto',
    })
  }

  useLayoutEffect(() => {
    place(hasPlaced.current)
    hasPlaced.current = true
  }, [selected])

  useEffect(() => {
    const observer = new ResizeObserver(() => place(false))
    if (containerRef.current) observer.observe(containerRef.current)
    return () => observer.disconnect()
  }, [])

  const buttonClass = (active: boolean) =>
    `relative z-10 flex h-11 items-center gap-spacing-xsm rounded-radius-xxl px-padding-m text-sm font-medium transition-colors duration-200 ease-out focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-primitives-colours-brand-orange300 focus-visible:ring-offset-2 ${
      active
        ? 'text-primitives-colours-brand-white'
        : 'text-primitives-colours-brand-orange100 hover:text-primitives-colours-brand-orange200'
    }`

  return (
    <div
      ref={containerRef}
      role="radiogroup"
      aria-label="Billing period"
      className="relative inline-flex items-center rounded-radius-xxl bg-primitives-colours-brand-white p-padding-xsm shadow-sm"
    >
      <span
        ref={thumbRef}
        aria-hidden="true"
        className="invisible absolute left-0 top-spacing-xsm bottom-spacing-xsm rounded-radius-xxl bg-primitives-colours-brand-orange200 opacity-0"
      />
      <button
        ref={(node) => {
          itemRefs.current.monthly = node
        }}
        type="button"
        role="radio"
        aria-checked={selected === 'monthly'}
        onClick={() => onChange('monthly')}
        className={buttonClass(selected === 'monthly')}
      >
        Monthly
      </button>
      <button
        ref={(node) => {
          itemRefs.current.yearly = node
        }}
        type="button"
        role="radio"
        aria-checked={selected === 'yearly'}
        onClick={() => onChange('yearly')}
        className={buttonClass(selected === 'yearly')}
      >
        Yearly
        <span
          className={`flex h-6 items-center rounded-radius-xxl px-padding-xsm font-caption text-xs font-semibold transition-colors duration-200 ease-out ${
            selected === 'yearly'
              ? 'bg-primitives-colours-brand-white text-primitives-colours-brand-orange100'
              : 'bg-primitives-colours-brand-orange900 text-primitives-colours-brand-orange100'
          }`}
        >
          {yearlyDiscountLabel}
        </span>
      </button>
    </div>
  )
}
