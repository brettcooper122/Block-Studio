import React, { useCallback, useEffect, useRef, useState } from 'react'
import { ChevronDown } from '@untitledui/icons'
import { useGSAP } from '@gsap/react'
import { navigationItems } from '../../data/navigation'
import { BrandLogo } from '../BrandLogo'
import { RollingLabel } from '../navigation/RollingLabel'
import { NavDropdown } from '../navigation/NavDropdown'
import { MagneticButton } from './MagneticButton'
import { gsap, ScrollTrigger, BOLD_EASE } from '../../utils/boldMotion'
import { prefersReducedMotion } from '../../utils/navMotion'

const CLOSE_DELAY_MS = 150
const ACTIVE_ITEM_ID = 'pricing'
const items = navigationItems.filter((item) => item.id !== 'contact')

// Floating pill nav. Gains a shadow once scrolled, tucks away on fast
// downward scrolls and returns as soon as you scroll up.
export function PillHeader() {
  const [activeId, setActiveId] = useState<string | null>(null)
  const [anchor, setAnchor] = useState({ x: 0, width: 0 })
  const [scrolled, setScrolled] = useState(false)
  const headerRef = useRef<HTMLElement>(null)
  const barRef = useRef<HTMLElement>(null)
  const triggerRefs = useRef<Record<string, HTMLButtonElement | null>>({})
  const closeTimer = useRef<number | null>(null)
  const hidden = useRef(false)

  const activeItem = items.find((item) => item.id === activeId && item.groups) ?? null

  const cancelClose = useCallback(() => {
    if (closeTimer.current) window.clearTimeout(closeTimer.current)
    closeTimer.current = null
  }, [])

  const scheduleClose = useCallback(() => {
    cancelClose()
    closeTimer.current = window.setTimeout(() => setActiveId(null), CLOSE_DELAY_MS)
  }, [cancelClose])

  const openItem = useCallback(
    (id: string) => {
      cancelClose()
      const trigger = triggerRefs.current[id]
      const bar = barRef.current
      if (trigger && bar) {
        const t = trigger.getBoundingClientRect()
        const b = bar.getBoundingClientRect()
        setAnchor({ x: t.left - b.left + t.width / 2, width: b.width })
      }
      setActiveId(id)
    },
    [cancelClose],
  )

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Escape' || !activeId) return
      triggerRefs.current[activeId]?.focus()
      setActiveId(null)
    }
    const onPointerDown = (event: MouseEvent) => {
      if (barRef.current && !barRef.current.contains(event.target as Node)) setActiveId(null)
    }
    document.addEventListener('keydown', onKeyDown)
    document.addEventListener('mousedown', onPointerDown)
    return () => {
      document.removeEventListener('keydown', onKeyDown)
      document.removeEventListener('mousedown', onPointerDown)
    }
  }, [activeId])

  useEffect(() => cancelClose, [cancelClose])

  useGSAP(
    () => {
      const bar = barRef.current
      if (!bar) return
      const reduce = prefersReducedMotion()

      if (!reduce) {
        gsap.from(bar, { autoAlpha: 0, y: -24, duration: 0.3, ease: BOLD_EASE.enter })
      }

      ScrollTrigger.create({
        start: 0,
        end: 'max',
        onUpdate: (self) => {
          const y = self.scroll()
          setScrolled((prev) => (prev === y > 8 ? prev : y > 8))
          if (reduce) return
          const fastDown = self.direction === 1 && y > 160 && Math.abs(self.getVelocity()) > 600
          if (fastDown && !hidden.current) {
            hidden.current = true
            setActiveId(null)
            gsap.to(bar, { yPercent: -160, duration: 0.3, ease: BOLD_EASE.exit, overwrite: 'auto' })
          } else if (self.direction === -1 && hidden.current) {
            hidden.current = false
            gsap.to(bar, { yPercent: 0, duration: 0.3, ease: BOLD_EASE.enter, overwrite: 'auto' })
          }
        },
      })
    },
    { scope: headerRef },
  )

  const pillClass = (highlighted: boolean, current = false) =>
    `group flex h-10 items-center gap-spacing-xsm rounded-radius-xxl px-padding-sm text-sm font-medium transition-colors duration-200 ease-out hover:bg-primitives-colours-brand-orange900 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-primitives-colours-brand-orange300 ${
      current ? 'text-primitives-colours-brand-orange200' : 'text-primitives-colours-brand-charcoal100'
    } ${highlighted ? 'bg-primitives-colours-brand-orange900' : ''}`

  return (
    <header
      ref={headerRef}
      className="pointer-events-none fixed inset-x-0 top-0 z-50 px-padding-l pt-padding-sm"
    >
      <nav
        ref={barRef}
        aria-label="Main"
        className={`pointer-events-auto relative mx-auto max-w-7xl rounded-radius-xxl bg-primitives-colours-brand-white transition-shadow duration-200 ease-out ${
          scrolled ? 'shadow-md' : 'shadow-sm'
        }`}
      >
        <div className="grid h-16 grid-cols-[1fr_auto_1fr] items-center pl-padding-m pr-padding-xsm">
          <a
            href="#"
            aria-label="Home"
            className="justify-self-start rounded-radius-xsm focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-primitives-colours-brand-orange300"
          >
            <BrandLogo className="h-7 w-auto" />
          </a>

          <ul className="flex items-center">
            {items.map((item) => (
              <li key={item.id}>
                {item.groups ? (
                  <button
                    ref={(node) => {
                      triggerRefs.current[item.id] = node
                    }}
                    type="button"
                    aria-expanded={activeId === item.id}
                    aria-controls="nav-dropdown"
                    onMouseEnter={() => openItem(item.id)}
                    onMouseLeave={scheduleClose}
                    onClick={() => (activeId === item.id ? setActiveId(null) : openItem(item.id))}
                    className={pillClass(activeId === item.id)}
                  >
                    <RollingLabel text={item.label} />
                    <ChevronDown
                      aria-hidden="true"
                      className={`h-4 w-4 text-primitives-colours-brand-orange200 transition-transform duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                        activeId === item.id ? 'rotate-180' : ''
                      }`}
                    />
                  </button>
                ) : (
                  <a
                    href={item.href}
                    aria-current={item.id === ACTIVE_ITEM_ID ? 'page' : undefined}
                    onMouseEnter={() => {
                      cancelClose()
                      setActiveId(null)
                    }}
                    className={pillClass(false, item.id === ACTIVE_ITEM_ID)}
                  >
                    <RollingLabel text={item.label} />
                  </a>
                )}
              </li>
            ))}
          </ul>

          <div className="flex items-center justify-self-end gap-spacing-xsm">
            <a href="#" className={pillClass(false)}>
              <RollingLabel text="Sign in" />
            </a>
            <MagneticButton href="#" size="sm">
              Contact Sales
            </MagneticButton>
          </div>
        </div>

        <NavDropdown
          item={activeItem}
          anchorX={anchor.x}
          containerWidth={anchor.width}
          onMouseEnter={cancelClose}
          onMouseLeave={scheduleClose}
          onNavigate={() => setActiveId(null)}
          rounded="large"
        />
      </nav>
    </header>
  )
}
