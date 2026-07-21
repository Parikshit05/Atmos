import React, { useMemo } from 'react'
import { motion } from 'framer-motion'
import useReducedMotion from '../../hooks/useReducedMotion'

const Sun = React.memo(({ x = 50, y = 20, opacity = 1, size = 120, isDay = true }) => {
  const reducedMotion = useReducedMotion()

  const rays = useMemo(() => {
    return Array.from({ length: 8 }, (_, i) => ({
      id: i,
      rotation: i * 45,
      delay: i * 0.1
    }))
  }, [])

  const lensFlares = useMemo(() => [
    { id: 1, offsetX: 40, offsetY: 30, size: 24, opacity: 0.3 },
    { id: 2, offsetX: -35, offsetY: 25, size: 16, opacity: 0.2 },
    { id: 3, offsetX: 50, offsetY: -20, size: 12, opacity: 0.25 }
  ], [])

  if (!isDay && opacity <= 0) return null

  return (
    <motion.div
      style={{
        position: 'absolute',
        left: `${x}%`,
        top: `${y}%`,
        transform: 'translate(-50%, -50%)',
        width: size,
        height: size,
        pointerEvents: 'none'
      }}
      animate={{ opacity: isDay ? opacity : 0 }}
      transition={{ duration: 1.5, ease: 'easeInOut' }}
    >
      {/* Outer glow ring */}
      <motion.div
        style={{
          position: 'absolute',
          inset: -size * 0.4,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(255, 200, 50, 0.4) 0%, rgba(255, 180, 50, 0.2) 40%, transparent 70%)',
          filter: 'blur(8px)'
        }}
        animate={reducedMotion ? {} : {
          scale: [1, 1.15, 1],
          opacity: [0.6, 0.9, 0.6]
        }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* Secondary glow */}
      <div
        style={{
          position: 'absolute',
          inset: -size * 0.25,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(255, 220, 100, 0.5) 0%, rgba(255, 180, 50, 0.3) 50%, transparent 70%)',
          filter: 'blur(4px)'
        }}
      />

      {/* Rotating rays */}
      {rays.map((ray) => (
        <motion.div
          key={ray.id}
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            width: 4,
            height: size * 0.8,
            background: 'linear-gradient(to bottom, rgba(255, 220, 100, 0.8), transparent)',
            transformOrigin: 'center top',
            borderRadius: 2
          }}
          animate={reducedMotion ? {} : {
            rotate: [ray.rotation, ray.rotation + 360],
            opacity: [0.4, 0.7, 0.4]
          }}
          transition={{
            rotate: { duration: 60, repeat: Infinity, ease: 'linear' },
            opacity: { duration: 3, repeat: Infinity, delay: ray.delay, ease: 'easeInOut' }
          }}
        />
      ))}

      {/* Inner gradient circle */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          borderRadius: '50%',
          background: 'radial-gradient(circle at 35% 35%, #FFE066 0%, #FFC107 40%, #FF9800 80%, #F57C00 100%)',
          boxShadow: '0 0 40px rgba(255, 193, 7, 0.8), 0 0 80px rgba(255, 152, 0, 0.5), inset 0 0 20px rgba(255, 255, 255, 0.3)'
        }}
      />

      {/* Highlight spot */}
      <div
        style={{
          position: 'absolute',
          top: '20%',
          left: '25%',
          width: size * 0.25,
          height: size * 0.2,
          borderRadius: '50%',
          background: 'rgba(255, 255, 255, 0.6)',
          filter: 'blur(4px)'
        }}
      />

      {/* Lens flares */}
      {lensFlares.map((flare) => (
        <motion.div
          key={flare.id}
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            width: flare.size,
            height: flare.size,
            borderRadius: '50%',
            background: `radial-gradient(circle, rgba(255, 240, 180, ${flare.opacity}) 0%, transparent 70%)`,
            transform: `translate(calc(-50% + ${flare.offsetX}px), calc(-50% + ${flare.offsetY}px))`
          }}
          animate={reducedMotion ? {} : {
            opacity: [flare.opacity * 0.5, flare.opacity, flare.opacity * 0.5],
            scale: [0.9, 1.1, 0.9]
          }}
          transition={{ duration: 3 + flare.id, repeat: Infinity, ease: 'easeInOut' }}
        />
      ))}
    </motion.div>
  )
})

Sun.displayName = 'Sun'
export { Sun }
