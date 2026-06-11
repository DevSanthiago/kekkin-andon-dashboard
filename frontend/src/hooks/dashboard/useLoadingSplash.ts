import { useEffect, useState } from 'react'

export function useLoadingSplash(waiting: boolean, durationMs: number): boolean {
  const [minElapsed, setMinElapsed] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setMinElapsed(true), durationMs)
    return () => clearTimeout(timer)
  }, [durationMs])

  return waiting || !minElapsed
}
