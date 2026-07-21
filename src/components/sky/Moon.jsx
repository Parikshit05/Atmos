import React, { useMemo } from 'react'
import { motion } from 'framer-motion'
import useReducedMotion from '../../hooks/useReducedMotion'

const Moon = React.memo(({ x = 70, y = 15, opacity = 1, phase = 0.5 }) => {
  const reducedMotion = useReducedMotion()

  const craters = useMemo(() => [
    { id: 1, x: 30, y: 25, size: 12, opacity: 0.15 },
    { id: 2, x: 55, y: 40, size: 8, opacity: 0.12 },
    { id: 3, x: 40, y: 60, size: 10, opacity: 0.1 },
    { id: 4, x: 65, y: 20, size: 6, opacity: 0.08 },
    { id: 5, x: 25, y: 50, size: 7, opacity: 0.1 }
  ], [])

  const sparkles = useMemo(() =>
    Array.from({ length: 12 }, (_, i) => ({
      id: i,
      angle: (i / 12) * 360,
      distance: 70 + Math.random() * 30,
      size: 2 + Math.random() * 3,
      delay: Math.random() * 3
    }))
  , [])

  const moonSize = 80
  const crescentOffset = phase * 30

  return (
    <motion.div
      style={{
        position: 'absolute',
        left: `${x}%`,
        top: `${y}%`,
        transform: 'translate(-50%, -50%)',
        width: moonSize,
        height: moonSize,
        pointerEvents: 'none'
      }}
      animate={{ opacity }}
      transition={{ duration: 1.5, ease: 'easeInOut' }}
    >
      {/* Outer glow */}
      <motion.div
        style={{
          position: 'absolute',
          inset: -25,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(200, 220, 255, 0.3) 0%, rgba(180, 200, 240, 0.15) 50%, transparent 70%)',
          filter: 'blur(6px)'
        }}
        animate={reducedMotion ? {} : {
          opacity: [0.4, 0.7, 0.4],
          scale: [0.95, 1.05, 0.95]
        }}
        transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* Moon base */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          borderRadius: '50%',
          background: 'radial-gradient(circle at 35% 35%, #F5F5DC 0%, #E8E4D4 40%, #D4CFC0 80%, #C0B8A8 100%)',
          boxShadow: '0 0 30px rgba(200, 210, 240, 0.5), inset -3px -3px 8px rgba(0, 0, 0, 0.1)'
        }}
      >
        {/* Craters */}
        {craters.map((crater) => (
          <div
            key={crater.id}
            style={{
              position: 'absolute',
              left: `${crater.x}%`,
              top: `${crater.y}%`,
              width: crater.size,
              height: crater.size,
              borderRadius: '50%',
              background: `radial-gradient(circle, rgba(180, 175, 160, ${crater.opacity}) 0%, rgba(200, 195, 180, ${crater.opacity * 0.5}) 100%)`,
              transform: 'translate(-50%, -50%)',
              boxShadow: `inset 1px 1px 2px rgba(0, 0, 0, 0.1)`
            }}
          />
        ))}

        {/* Highlight */}
        <div
          style={{
            position: 'absolute',
            top: '15%',
            left: '20%',
            width: '30%',
            height: '25%',
            borderRadius: '50%',
            background: 'rgba(255, 255, 255, 0.3)',
            filter: 'blur(3px)'
          }}
        />
      </div>

      {/* Crescent shadow overlay */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          borderRadius: '50%',
          background: `radial-gradient(circle at ${60 + crescentOffset}% 50%, transparent 30%, rgba(15, 20, 40, 0.85) 65%)`,
          transform: `translateX(${crescentOffset * 0.3}px)`
        }}
      />

      {/* Sparkles */}
      {sparkles.map((sparkle) => {
        const rad = (sparkle.angle * Math.PI) / 180
        const sx = Math.cos(rad) * sparkle.distance + moonSize / 2
        const sy = Math.sin(rad) * sparkle.distance + moonSize / 2
        return (
          <motion.div
            key={sparkle.id}
            style={{
              position: 'absolute',
              left: sx,
              top: sy,
              width: sparkle.size,
              height: sparkle.size,
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(255, 255, 255, 0.9) 0%, rgba(200, 220, 255, 0.4) 100%)'
            }}
            animate={reducedMotion ? {} : {
              opacity: [0.2, 1, 0.2],
              scale: [0.5, 1.2, 0.5]
            }}
            transition={{
              duration: 2 + Math.random() * 2,
              repeat: Infinity,
              delay: sparkle.delay,
              ease: 'easeInOut'
            }}
          />
        )
      })}
    </motion.div>
  )
})

Moon.displayName = 'Moon'
export { Moon }
