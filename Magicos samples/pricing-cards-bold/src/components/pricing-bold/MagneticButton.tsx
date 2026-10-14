import React, { useRef } from 'react'
import type { ReactNode } from 'react'
import { ArrowRightIcon } from 'lucide-react'
import { useGSAP } from '@gsap/react'
import { gsap, BOLD_DURATION, BOLD_EASE } from '../../utils/boldMotion'
import { prefersReducedMotion } from '../../utils/navMotion'

type Variant = 'primary' | 'inverse' | 'outline'

interface MagneticButtonProps {
  children: ReactNode
  variant?: Variant
  size?: 'md' | 'sm'
  href?: string
  fullWidth?: boolean
  showArrow?: boolean
  onClick?: () => void
}

const variantClasses: Record<Variant, { base: string; badge: string }> = {
  primary: {
    base: 'bg-primitives-colours-brand-charcoal100 text-primitives-colours-brand-white hover:bg-primitives-colours-brand-charcoal300',
    badge: 'bg-primitives-colours-brand-orange300 text-primitives-colours-brand-white',
  },
  inverse: {
    base: 'bg-primitives-colours-brand-white text-primitives-colours-brand-orange100 hover:bg-primitives-colours-brand-orange900',
    badge: 'bg-primitives-colours-brand-orange200 text-primitives-colours-brand-white',
  },
  outline: {
    base: 'border border-primitives-colours-brand-charcoal800 text-primitives-colours-brand-charcoal100 hover:bg-primitives-colours-brand-orange900',
    badge: 'bg-primitives-colours-brand-orange900 text-primitives-colours-brand-orange100',
  },
}

const MAGNET_X = 12
const MAGNET_Y = 8

// Pill button that leans toward the cursor, cycles its arrow on hover and
// squashes on press.
export function MagneticButton({
  children,
  variant = 'primary',
  size = 'md',
  href,
  fullWidth = false,
  showArrow = true,
  onClick,
}: MagneticButtonProps) {
  const ref = useRef<HTMLElement | null>(null)
  const arrowRef = useRef<HTMLSpanElement>(null)
  const { contextSafe } = useGSAP({ scope: ref })

  const onMove = contextSafe((event: React.PointerEvent<HTMLElement>) => {
    const el = ref.current
    if (!el || prefersReducedMotion()) return
    const rect = el.getBoundingClientRect()
    const dx = (event.clientX - (rect.left + rect.width / 2)) / rect.width
    const dy = (event.clientY - (rect.top + rect.height / 2)) / rect.height
    gsap.to(el, {
      x: dx * MAGNET_X,
      y: dy * MAGNET_Y,
      duration: 0.3,
      ease: 'power3.out',
      overwrite: 'auto',
    })
  })

  const onEnter = contextSafe(() => {
    if (!arrowRef.current || prefersReducedMotion()) return
    gsap
      .timeline({ overwrite: 'auto' })
      .to(arrowRef.current, { xPercent: 150, duration: 0.12, ease: BOLD_EASE.exit })
      .set(arrowRef.current, { xPercent: -150 })
      .to(arrowRef.current, { xPercent: 0, duration: BOLD_DURATION.hover, ease: BOLD_EASE.enter })
  })

  const onLeave = contextSafe(() => {
    if (!ref.current || prefersReducedMotion()) return
    gsap.to(ref.current, { x: 0, y: 0, scale: 1, duration: 0.3, ease: 'back.out(2)' })
  })

  const onDown = contextSafe(() => {
    if (!ref.current || prefersReducedMotion()) return
    gsap.to(ref.current, { scale: 0.96, duration: BOLD_DURATION.press, ease: BOLD_EASE.exit })
  })

  const onUp = contextSafe(() => {
    if (!ref.current || prefersReducedMotion()) return
    gsap.to(ref.current, { scale: 1, duration: BOLD_DURATION.release, ease: BOLD_EASE.bounce })
  })

  const sizing =
    size === 'md'
      ? `h-12 text-sm ${showArrow ? 'pl-padding-m pr-padding-xsm' : 'px-padding-m'}`
      : `h-10 text-sm ${showArrow ? 'pl-padding-sm pr-padding-xsm' : 'px-padding-sm'}`
  const badgeSize = size === 'md' ? 'h-8 w-8' : 'h-6 w-6'
  const iconSize = size === 'md' ? 'h-4 w-4' : 'h-3.5 w-3.5'

  const className = `inline-flex items-center gap-spacing-sm whitespace-nowrap rounded-radius-xxl font-medium transition-colors duration-150 ease-out will-change-transform focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-primitives-colours-brand-orange300 focus-visible:ring-offset-2 ${
    showArrow ? 'justify-between' : 'justify-center'
  } ${fullWidth ? 'w-full' : ''} ${sizing} ${variantClasses[variant].base}`

  const content = (
    <>
      <span>{children}</span>
      {showArrow && (
        <span
          aria-hidden="true"
          className={`flex shrink-0 items-center justify-center overflow-hidden rounded-full ${badgeSize} ${variantClasses[variant].badge}`}
        >
          <span ref={arrowRef} className="flex">
            <ArrowRightIcon className={iconSize} />
          </span>
        </span>
      )}
    </>
  )

  const handlers = {
    onPointerMove: onMove,
    onPointerEnter: onEnter,
    onPointerLeave: onLeave,
    onPointerDown: onDown,
    onPointerUp: onUp,
  }

  if (href) {
    return (
      <a
        ref={(node) => {
          ref.current = node
        }}
        href={href}
        className={className}
        {...handlers}
      >
        {content}
      </a>
    )
  }

  return (
    <button
      ref={(node) => {
        ref.current = node
      }}
      type="button"
      onClick={onClick}
      className={className}
      {...handlers}
    >
      {content}
    </button>
  )
}
