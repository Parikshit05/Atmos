import React, { useMemo, useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import useReducedMotion from '../../hooks/useReducedMotion'

const RainDrop = React.memo(({ drop, intensity }) => {
  const reducedMotion = useReducedMotion()
  const speed = 0.3 + (1 - intensity) * 0.5
  const angle = -5 - intensity * 10

  if (reducedMotion) {
    return (
      <div
        style={{
          position: 'absolute',
          left: `${drop.x}%`,
          top: `${drop.y}%`,
          width: drop.width,
          height: drop.height,
          background: `linear-gradient(to bottom, rgba(180, 200, 230, 0), rgba(180, 200, 230, ${drop.opacity}))`,
          borderRadius: 1,
          transform: `rotate(${angle}deg)`,
          pointerEvents: 'none'
        }}
      />
    )
  }

  return (
    <motion.div
      style={{
        position: 'absolute',
        left: `${drop.x}%`,
        width: drop.width,
        height: drop.height,
        background: `linear-gradient(to bottom, rgba(180, 200, 230, 0), rgba(180, 200, 230, ${drop.opacity}))`,
        borderRadius: 1,
        transform: `rotate(${angle}deg)`,
        pointerEvents: 'none'
      }}
      animate={{
        y: [-20, window.innerHeight + 20]
      }}
      transition={{
        duration: speed + drop.speedVariation,
        repeat: Infinity,
        delay: drop.delay,
        ease: 'linear'
      }}
    />
  )
})

const Ripple = React.memo(({ ripple }) => {
  return (
    <motion.div
      style={{
        position: 'absolute',
        left: `${ripple.x}%`,
        bottom: ripple.y,
        width: 0,
        height: 0,
        borderRadius: '50%',
        border: '1px solid rgba(180, 200, 230, 0.4)',
        pointerEvents: 'none'
      }}
      animate={{
        width: [0, 30],
        height: [0, 12],
        opacity: [0.6, 0]
      }}
      transition={{
        duration: 1.2,
        delay: ripple.delay,
        ease: 'easeOut'
      }}
    />
  )
})

const Rain = React.memo(({ intensity = 0.5, opacity = 1 }) => {
  const reducedMotion = useReducedMotion()
  const [ripples, setRipples] = useState([])

  const drops = useMemo(() => {
    const count = Math.floor(20 + intensity * 180)
    return Array.from({ length: count }, (_, i) => ({
      id: i,
      x: Math.random() * 110 - 5,
      y: Math.random() * -20,
      width: 1.5 + intensity * 1.5,
      height: 20 + intensity * 20 + Math.random() * 10,
      opacity: 0.3 + intensity * 0.4,
      delay: Math.random() * 2,
      speedVariation: Math.random() * 0.4
    }))
  }, [intensity])

  useEffect(() => {
    if (reducedMotion || opacity <= 0) return
    const interval = setInterval(() => {
      setRipples((prev) => {
        const newRipples = [...prev, {
          id: Date.now(),
          x: Math.random() * 100,
          y: Math.random() * 20,
          delay: 0
        }]
        return newRipples.slice(-8)
      })
    }, 300)
    return () => clearInterval(interval)
  }, [reducedMotion, opacity])

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
      {drops.map((drop) => (
        <RainDrop key={drop.id} drop={drop} intensity={intensity} />
      ))}

      <AnimatePresence>
        {ripples.map((ripple) => (
          <Ripple key={ripple.id} ripple={ripple} />
        ))}
      </AnimatePresence>

      {/* Bottom mist */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: '15%',
          background: 'linear-gradient(to top, rgba(180, 200, 230, 0.15), transparent)',
          filter: 'blur(8px)',
          pointerEvents: 'none'
        }}
      />
    </div>
  )
})

Rain.displayName = 'Rain'
export { Rain }
