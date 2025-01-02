'use client'
import confetti from 'canvas-confetti'
import React, { useEffect } from 'react'

import { useBreakpoint } from '@/lib/hooks/use-breakpoint'

export const Confetti = () => {
  const breakpoint = useBreakpoint()
  const isDesktop = ['lg', 'xl'].includes(breakpoint)

  useEffect(() => {
    const confettiSettings = {
      particleCount: 100,
      spread: 90,
      scalar: isDesktop ? 1.5 : 1.1,
      startVelocity: 20,
      gravity: 1.1,
      decay: isDesktop ? 0.98 : 0.95,
      ticks: 400,
    }

    const confettiAnimation = () => {
      confetti({
        ...confettiSettings,
        angle: 60,
        origin: { x: isDesktop ? -0.1 : -0.3, y: 0.4 },
      })
      confetti({
        ...confettiSettings,
        angle: 120,
        origin: { x: isDesktop ? 1.1 : 1.3, y: 0.4 },
      })
    }

    confettiAnimation()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return <></>
}
