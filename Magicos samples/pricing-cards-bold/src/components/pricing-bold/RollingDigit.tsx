import React, { useEffect, useRef, useState } from 'react'

interface RollingDigitProps {
  digit: number
  direction: 'up' | 'down'
  delayMs: number
  reduceMotion: boolean
}

// Three stacked 0–9 cycles. Resting position is the middle cycle, so the
// strip can roll forward (up) or backward (down) through a full set of
// numbers before landing, then silently snap back to the middle cycle.
const STRIP = Array.from({ length: 30 }, (_, i) => i % 10)
const DURATION_MS = 450
const EASE = 'cubic-bezier(0.23, 1, 0.32, 1)'

export const RollingDigit: React.FC<RollingDigitProps> = ({
  digit,
  direction,
  delayMs,
  reduceMotion,
}) => {
  const [position, setPosition] = useState(10 + digit)
  const [isRolling, setIsRolling] = useState(false)
  const previousDigit = useRef(digit)

  useEffect(() => {
    if (previousDigit.current === digit) return
    previousDigit.current = digit
    if (reduceMotion) {
      setIsRolling(false)
      setPosition(10 + digit)
      return
    }
    setIsRolling(true)
    setPosition((direction === 'up' ? 20 : 0) + digit)
  }, [digit, direction, reduceMotion])

  const handleTransitionEnd = () => {
    setIsRolling(false)
    setPosition(10 + digit)
  }

  return (
    <span className="relative inline-block h-[1em] overflow-hidden align-top">
      <span
        className="flex flex-col"
        style={{
          transform: `translateY(-${position}em)`,
          transition: isRolling
            ? `transform ${DURATION_MS}ms ${EASE} ${delayMs}ms`
            : 'none',
        }}
        onTransitionEnd={handleTransitionEnd}
      >
        {STRIP.map((value, index) => (
          <span key={index} className="block h-[1em] leading-none">
            {value}
          </span>
        ))}
      </span>
    </span>
  )
}
