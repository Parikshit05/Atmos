import React, { useMemo } from 'react'
import { motion } from 'framer-motion'
import useReducedMotion from '../../hooks/useReducedMotion'

const SnowFlake = React.memo(({ flake }) => {
  const reducedMotion = useReducedMotion()

  if (reducedMotion) {
    return (
      <div
        style={{
          position: 'absolute',
          left: `${flake.x}%`,
          top: `${flake.y}%`,
          width: flake.size,
          height: flake.size,
          borderRadius: '50%',
          background: `radial-gradient(circle, rgba(255, 255, 255, ${flake.opacity}) 0%, rgba(220, 235, 255, ${flake.opacity * 0.5}) 100%)`,
          boxShadow: `0 0 ${flake.size}px rgba(255, 255, 255, 0.3)`,
          pointerEvents: 'none'
        }}
      />
    )
  }

  const driftAmount = 30 + Math.random() * 40

  return (
    <motion.div
      style={{
        position: 'absolute',
        left: `${flake.x}%`,
        width: flake.size,
        height: flake.size,
        borderRadius: '50%',
        background: `radial-gradient(circle, rgba(255, 255, 255, ${flake.opacity}) 0%, rgba(220, 235, 255, ${flake.opacity * 0.5}) 100%)`,
        boxShadow: `0 0 ${flake.size}px rgba(255, 255, 255, 0.3)`,
        pointerEvents: 'none'
      }}
      animate={{
        y: [-20, window.innerHeight + 20],
        x: [0, driftAmount, -driftAmount * 0.5, driftAmount * 0.3, 0],
        rotate: [0, flake.rotation]
      }}
      transition={{
        y: { duration: flake.speed, repeat: Infinity, ease: 'linear' },
        x: { duration: flake.speed * 1.5, repeat: Infinity, ease: 'easeInOut' },
        rotate: { duration: flake.speed * 2, repeat: Infinity, ease: 'linear' }
      }}
    />
  )
})

const Snow = React.memo(({ intensity = 0.5, opacity = 1 }) => {
  const reducedMotion = useReducedMotion()

  const flakes = useMemo(() => {
    const count = Math.floor(30 + intensity * 170)
    return Array.from({ length: count }, (_, i) => {
      const size = 2 + Math.random() * 4
      const isLarge = size > 4
      return {
        id: i,
        x: Math.random() * 100,
        y: -5 - Math.random() * 10,
        size,
        opacity: isLarge ? 0.8 + Math.random() * 0.2 : 0.4 + Math.random() * 0.4,
        speed: 4 + (isLarge ? 2 : 6) + Math.random() * 4,
        rotation: Math.random() * 360
      }
    })
  }, [intensity])

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
      {flakes.map((flake) => (
        <SnowFlake key={flake.id} flake={flake} />
      ))}

      {/* Snow accumulation at bottom */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: `${5 + intensity * 10}%`,
          background: `linear-gradient(to top, 
            rgba(255, 255, 255, ${0.4 + intensity * 0.3}) 0%, 
            rgba(240, 245, 255, ${0.2 + intensity * 0.2}) 50%, 
            transparent 100%)`,
          filter: 'blur(2px)',
          pointerEvents: 'none'
        }}
      />

      {/* Subtle snow mist at bottom */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: '8%',
          background: 'linear-gradient(to top, rgba(220, 235, 255, 0.2), transparent)',
          filter: 'blur(6px)',
          pointerEvents: 'none'
        }}
      />
    </div>
  )
})

Snow.displayName = 'Snow'
export { Snow }
