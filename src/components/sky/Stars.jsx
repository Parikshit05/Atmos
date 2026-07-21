import React, { useMemo, useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import useReducedMotion from '../../hooks/useReducedMotion'

const Stars = React.memo(({ count = 100, opacity = 1 }) => {
  const reducedMotion = useReducedMotion()
  const [shootingStar, setShootingStar] = useState(null)

  const stars = useMemo(() => {
    return Array.from({ length: count }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: 1 + Math.random() * 2.5,
      twinkleDuration: 2 + Math.random() * 4,
      twinkleDelay: Math.random() * 5,
      brightness: 0.4 + Math.random() * 0.6
    }))
  }, [count])

  const triggerShootingStar = useCallback(() => {
    if (reducedMotion) return
    const newStar = {
      id: Date.now(),
      startX: 20 + Math.random() * 60,
      startY: 5 + Math.random() * 30,
      angle: 20 + Math.random() * 40,
      length: 80 + Math.random() * 120
    }
    setShootingStar(newStar)
    setTimeout(() => setShootingStar(null), 800)
  }, [reducedMotion])

  useEffect(() => {
    if (reducedMotion || opacity <= 0) return
    const scheduleNext = () => {
      const delay = 4000 + Math.random() * 8000
      return setTimeout(() => {
        triggerShootingStar()
        timerRef = scheduleNext()
      }, delay)
    }
    let timerRef = scheduleNext()
    return () => clearTimeout(timerRef)
  }, [reducedMotion, opacity, triggerShootingStar])

  if (opacity <= 0) return null

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        overflow: 'hidden',
        pointerEvents: 'none'
      }}
    >
      {stars.map((star) => (
        <motion.div
          key={star.id}
          style={{
            position: 'absolute',
            left: `${star.x}%`,
            top: `${star.y}%`,
            width: star.size,
            height: star.size,
            borderRadius: '50%',
            background: `radial-gradient(circle, rgba(255, 255, 255, ${star.brightness}) 0%, rgba(200, 220, 255, ${star.brightness * 0.5}) 100%)`,
            boxShadow: `0 0 ${star.size * 2}px rgba(200, 220, 255, ${star.brightness * 0.3})`
          }}
          animate={reducedMotion ? {} : {
            opacity: [star.brightness * 0.3, star.brightness, star.brightness * 0.3],
            scale: [0.8, 1.2, 0.8]
          }}
          transition={{
            duration: star.twinkleDuration,
            repeat: Infinity,
            delay: star.twinkleDelay,
            ease: 'easeInOut'
          }}
        />
      ))}

      <AnimatePresence>
        {shootingStar && (
          <motion.div
            key={shootingStar.id}
            style={{
              position: 'absolute',
              left: `${shootingStar.startX}%`,
              top: `${shootingStar.startY}%`,
              width: shootingStar.length,
              height: 2,
              background: 'linear-gradient(90deg, rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, 0.9) 50%, rgba(200, 220, 255, 0.8) 100%)',
              borderRadius: 1,
              transformOrigin: 'left center',
              transform: `rotate(${shootingStar.angle}deg)`,
              filter: 'blur(0.5px)'
            }}
            initial={{ opacity: 0, scaleX: 0 }}
            animate={{ opacity: [0, 1, 1, 0], scaleX: [0, 1, 1, 0.5] }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          />
        )}
      </AnimatePresence>
    </div>
  )
})

Stars.displayName = 'Stars'
export { Stars }
