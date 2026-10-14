import React, { useRef } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { NavItem } from '../../data/navigation'
import { NavLinkRow } from './NavLinkRow'
import {
  EASE_ENTER,
  EASE_EXIT,
  NAV_DURATION,
  prefersReducedMotion,
} from '../../utils/navMotion'

interface NavDropdownProps {
  item: NavItem | null
  anchorX: number
  containerWidth: number
  onMouseEnter: () => void
  onMouseLeave: () => void
  onNavigate: () => void
  rounded?: 'default' | 'large'
}

// One shared panel for every nav item. Opening animates it in; moving to
// another item morphs size and position; closing mirrors the entrance.
export function NavDropdown({
  item,
  anchorX,
  containerWidth,
  onMouseEnter,
  onMouseLeave,
  onNavigate,
  rounded = 'default',
}: NavDropdownProps) {
  const panelRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const isVisible = useRef(false)
  const lastItem = useRef<NavItem | null>(item)
  if (item) lastItem.current = item
  const shown = lastItem.current
  const open = Boolean(item)

  useGSAP(
    () => {
      const panel = panelRef.current
      const content = contentRef.current
      if (!panel || !content) return
      const reduce = prefersReducedMotion()

      if (open) {
        const width = content.offsetWidth
        const height = content.offsetHeight
        const x = Math.max(0, Math.min(anchorX - width / 2, containerWidth - width))
        const rows = content.querySelectorAll('[data-nav-row]')

        if (reduce) {
          gsap.set(panel, { x, width, height, autoAlpha: 1, scale: 1, y: 0 })
          gsap.set(rows, { autoAlpha: 1, y: 0 })
          isVisible.current = true
          return
        }

        if (!isVisible.current) {
          gsap.set(panel, { x, width })
          gsap.fromTo(
            panel,
            { autoAlpha: 0, height: height * 0.92, scale: 0.97, y: -6 },
            {
              autoAlpha: 1,
              height,
              scale: 1,
              y: 0,
              duration: NAV_DURATION.open,
              ease: EASE_ENTER,
              overwrite: 'auto',
            },
          )
        } else {
          gsap.to(panel, {
            x,
            width,
            height,
            autoAlpha: 1,
            scale: 1,
            y: 0,
            duration: NAV_DURATION.switch,
            ease: EASE_ENTER,
            overwrite: 'auto',
          })
        }

        gsap.fromTo(
          rows,
          { autoAlpha: 0, y: 6 },
          {
            autoAlpha: 1,
            y: 0,
            duration: NAV_DURATION.row,
            ease: EASE_EXIT,
            stagger: NAV_DURATION.rowStagger,
            delay: 0.04,
            overwrite: 'auto',
          },
        )
        isVisible.current = true
      } else if (isVisible.current) {
        if (reduce) {
          gsap.set(panel, { autoAlpha: 0 })
          isVisible.current = false
          return
        }
        gsap.to(panel, {
          autoAlpha: 0,
          scale: 0.97,
          y: -6,
          duration: NAV_DURATION.close,
          ease: EASE_EXIT,
          overwrite: 'auto',
          onComplete: () => {
            isVisible.current = false
          },
        })
      }
    },
    { dependencies: [item?.id, anchorX, containerWidth] },
  )

  const groups = shown?.groups ?? []
  const multiColumn = groups.length > 1

  return (
    <div
      ref={panelRef}
      id="nav-dropdown"
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      aria-hidden={!open}
      className={`invisible absolute left-0 top-full z-20 mt-spacing-xsm overflow-hidden ${
        rounded === 'large' ? 'rounded-radius-xl' : 'rounded-radius-m'
      } border border-primitives-colours-brand-charcoal900 bg-primitives-colours-brand-white opacity-0 shadow-md`}
      style={{ transformOrigin: '50% 0%' }}
    >
      {shown && (
        <div ref={contentRef} className="absolute left-0 top-0 w-max p-padding-xsm">
          <div
            className={
              multiColumn
                ? 'grid w-[600px] grid-cols-2 gap-spacing-xsm'
                : 'w-[360px]'
            }
          >
            {groups.map((group, index) => (
              <div key={group.heading ?? index}>
                {group.heading && (
                  <p
                    data-nav-row
                    className="px-padding-xsm pt-padding-xsm font-caption text-xs font-medium text-primitives-colours-brand-charcoal500"
                  >
                    {group.heading}
                  </p>
                )}
                <ul>
                  {group.links.map((link) => (
                    <li key={link.label}>
                      <NavLinkRow link={link} onNavigate={onNavigate} />
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
