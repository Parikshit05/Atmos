import React, { useState, useEffect, useCallback, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import useReducedMotion from '../../hooks/useReducedMotion'

const LightningBolt = React.memo(({ bolt }) => {
  const pathData = useMemo(() => {
    const segments = []
    let x = bolt.startX
    let y = bolt.startY

    for (let i = 0; i < bolt.segments; i++) {
      const nextX = x + (Math.random() - 0.5) * bolt.spread
      const nextY = y + bolt.segmentLength
      segments.push({ x1: x, y1: y, x2: nextX, y2: nextY })

      if (Math.random() > 0.6 && i < bolt.segments - 1) {
        const branchX = nextX + (Math.random() - 0.5) * bolt.spread * 0.8
        const branchY = nextY + bolt.segmentLength * 0.6
        segments.push({ x1: nextX, y1: nextY, x2: branchX, y2: branchY, isBranch: true })
      }

      x = nextX
      y = nextY
    }
    return segments
  }, [bolt])

  return (
    <svg
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none'
      }}
    >
      <defs>
        <filter id={`glow-${bolt.id}`}>
          <feGaussianBlur stdDeviation="3" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      {pathData.map((seg, i) => (
        <motion.line
          key={i}
          x1={`${seg.x1}%`}
          y1={`${seg.y1}%`}
          x2={`${seg.x2}%`}
          y2={`${seg.y2}%`}
          stroke={seg.isBranch ? 'rgba(200, 220, 255, 0.8)' : 'rgba(255, 255, 255, 0.95)'}
          strokeWidth={seg.isBranch ? 1.5 : 2.5}
          filter={`url(#glow-${bolt.id})`}
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: [0, 1, 0.8, 0] }}
          transition={{
            duration: 0.3,
            delay: i * 0.02,
            ease: 'easeOut'
          }}
        />
      ))}
    </svg>
  )
})

const Lightning = React.memo(({ frequency = 0, isActive = false }) => {
  const reducedMotion = useReducedMotion()
  const [bolts, setBolts] = useState([])
  const [flashIntensity, setFlashIntensity] = useState(0)

  const createBolt = useCallback(() => {
    return {
      id: Date.now() + Math.random(),
      startX: 20 + Math.random() * 60,
      startY: 0,
      segments: 5 + Math.floor(Math.random() * 4),
      spread: 8 + Math.random() * 6,
      segmentLength: 8 + Math.random() * 5
    }
  }, [])

  const triggerFlash = useCallback((intensity) => {
    if (reducedMotion) return
    setFlashIntensity(intensity)
    setTimeout(() => setFlashIntensity(0), 100)
    if (Math.random() > 0.5) {
      setTimeout(() => {
        setFlashIntensity(intensity * 0.6)
        setTimeout(() => setFlashIntensity(0), 80)
      }, 200)
    }
  }, [reducedMotion])

  useEffect(() => {
    if (!isActive || reducedMotion || frequency <= 0) return

    const scheduleNext = () => {
      const baseInterval = 3000 / frequency
      const variance = baseInterval * 0.5
      const delay = baseInterval + (Math.random() - 0.5) * variance

      return setTimeout(() => {
        const newBolt = createBolt()
        setBolts((prev) => [...prev.slice(-3), newBolt])
        triggerFlash(0.7 + Math.random() * 0.3)

        setTimeout(() => {
          setBolts((prev) => prev.filter((b) => b.id !== newBolt.id))
        }, 500)

        timerRef = scheduleNext()
      }, delay)
    }

    let timerRef = scheduleNext()
    return () => clearTimeout(timerRef)
  }, [isActive, frequency, reducedMotion, createBolt, triggerFlash])

  if (!isActive) return null

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        overflow: 'hidden',
        pointerEvents: 'none'
      }}
    >
      {/* Screen flash overlay */}
      <AnimatePresence>
        {flashIntensity > 0 && !reducedMotion && (
          <motion.div
            style={{
              position: 'absolute',
              inset: 0,
              background: `rgba(255, 255, 255, ${flashIntensity * 0.4})`,
              pointerEvents: 'none'
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: flashIntensity * 0.4 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.1 }}
          />
        )}
      </AnimatePresence>

      {/* Lightning bolts */}
      <AnimatePresence>
        {bolts.map((bolt) => (
          <LightningBolt key={bolt.id} bolt={bolt} />
        ))}
      </AnimatePresence>
    </div>
  )
})

Lightning.displayName = 'Lightning'
export { Lightning }
