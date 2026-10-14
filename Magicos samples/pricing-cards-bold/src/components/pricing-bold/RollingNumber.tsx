import React, { useEffect, useRef, useState } from 'react'
import { RollingDigit } from './RollingDigit'

interface RollingNumberProps {
  value: number
  staggerMs?: number
}

export const RollingNumber: React.FC<RollingNumberProps> = ({
  value,
  staggerMs = 50,
}) => {
  const reduceMotion = usePrefersReducedMotion()
  const previousValue = useRef(value)
  const direction = useRef<'up' | 'down'>('up')

  if (previousValue.current !== value) {
    direction.current = value > previousValue.current ? 'up' : 'down'
    previousValue.current = value
  }

  const characters = value.toLocaleString().split('')

  return (
    <span className="inline-flex leading-none tabular-nums">
      <span className="sr-only">{value.toLocaleString()}</span>
      <span aria-hidden="true" className="inline-flex">
        {characters.map((char, index) => {
          const key = characters.length - index
          return /\d/.test(char) ? (
            <RollingDigit
              key={key}
              digit={Number(char)}
              direction={direction.current}
              delayMs={index * staggerMs}
              reduceMotion={reduceMotion}
            />
          ) : (
            <span key={key} className="inline-block h-[1em]">
              {char}
            </span>
          )
        })}
      </span>
    </span>
  )
}

function usePrefersReducedMotion() {
  const [reduce, setReduce] = useState(false)
  useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)')
    setReduce(query.matches)
    const onChange = (event: MediaQueryListEvent) => setReduce(event.matches)
    query.addEventListener('change', onChange)
    return () => query.removeEventListener('change', onChange)
  }, [])
  return reduce
}
