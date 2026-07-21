import React, { useMemo } from 'react'
import { motion } from 'framer-motion'
import useReducedMotion from '../../hooks/useReducedMotion'

const particleConfigs = {
  warm: {
    color: '255, 210, 100',
    glowColor: '255, 180, 50',
    sizeRange: [2, 5],
    opacityRange: [0.3, 0.7]
  },
  cold: {
    color: '200, 220, 255',
    glowColor: '180, 200, 240',
    sizeRange: [1.5, 4],
    opacityRange: [0.2, 0.6]
  },
  'rain-mist': {
    color: '180, 200, 230',
    glowColor: '160, 180, 220',
    sizeRange: [1, 3],
    opacityRange: [0.2, 0.5]
  },
  dust: {
    color: '160, 140, 110',
    glowColor: '140, 120, 90',
    sizeRange: [1, 2.5],
    opacityRange: [0.15, 0.4]
  }
}

const Particle = React.memo(({ particle, config }) => {
  const reducedMotion = useReducedMotion()

  const driftX = (Math.random() - 0.5) * 100
  const driftY = -20 - Math.random() * 60

  return (
    <motion.div
      style={{
        position: 'absolute',
        left: `${particle.x}%`,
        top: `${particle.y}%`,
        width: particle.size,
        height: particle.size,
        borderRadius: '50%',
        background: `radial-gradient(circle, rgba(${config.color}, ${particle.opacity}) 0%, rgba(${config.glowColor}, ${particle.opacity * 0.3}) 100%)`,
        boxShadow: `0 0 ${particle.size * 2}px rgba(${config.glowColor}, ${particle.opacity * 0.2})`,
        pointerEvents: 'none'
      }}
      animate={reducedMotion ? {} : {
        x: [0, driftX * 0.5, driftX, driftX * 0.3, 0],
        y: [0, driftY * 0.3, driftY * 0.6, driftY, driftY * 1.2],
        opacity: [particle.opacity, particle.opacity * 0.5, particle.opacity, particle.opacity * 0.7, particle.opacity],
        scale: [1, 0.8, 1.1, 0.9, 1]
      }}
      transition={{
        duration: particle.duration,
        repeat: Infinity,
        delay: particle.delay,
        ease: 'easeInOut'
      }}
    />
  )
})

const Particles = React.memo(({ type = 'warm', count = 30, opacity = 1 }) => {
  const reducedMotion = useReducedMotion()
  const config = particleConfigs[type] || particleConfigs.warm

  const particles = useMemo(() => {
    return Array.from({ length: count }, (_, i) => {
      const size = config.sizeRange[0] + Math.random() * (config.sizeRange[1] - config.sizeRange[0])
      const particleOpacity = config.opacityRange[0] + Math.random() * (config.opacityRange[1] - config.opacityRange[0])

      return {
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size,
        opacity: particleOpacity,
        duration: 6 + Math.random() * 8,
        delay: Math.random() * 5
      }
    })
  }, [count, config])

  if (opacity <= 0) return null

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        overflow: 'hidden',
        pointerEvents: 'none',
        opacity
      }}
    >
      {particles.map((particle) => (
        <Particle key={particle.id} particle={particle} config={config} />
      ))}
    </div>
  )
})

Particles.displayName = 'Particles'
export { Particles }
