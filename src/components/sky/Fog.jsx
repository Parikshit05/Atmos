import React, { useMemo } from 'react'
import { motion } from 'framer-motion'
import useReducedMotion from '../../hooks/useReducedMotion'

const FogBand = React.memo(({ band }) => {
  const reducedMotion = useReducedMotion()

  const direction = band.direction === 'left' ? -1 : 1

  return (
    <motion.div
      style={{
        position: 'absolute',
        left: 0,
        top: `${band.y}%`,
        width: '200%',
        height: band.height,
        background: `linear-gradient(${band.gradientAngle}, 
          transparent 0%, 
          rgba(${band.color}, ${band.opacity * 0.3}) 20%, 
          rgba(${band.color}, ${band.opacity * 0.6}) 50%, 
          rgba(${band.color}, ${band.opacity * 0.3}) 80%, 
          transparent 100%)`,
        filter: `blur(${band.blur}px)`,
        pointerEvents: 'none'
      }}
      animate={reducedMotion ? {} : {
        x: [0, direction * band.driftDistance]
      }}
      transition={{
        duration: band.driftSpeed,
        repeat: Infinity,
        repeatType: 'reverse',
        ease: 'easeInOut'
      }}
    />
  )
})

const Fog = React.memo(({ density = 0.5, opacity = 1 }) => {
  const reducedMotion = useReducedMotion()

  const bands = useMemo(() => {
    const count = Math.floor(3 + density * 5)
    return Array.from({ length: count }, (_, i) => {
      const fraction = i / count
      return {
        id: i,
        y: 40 + fraction * 55,
        height: 80 + fraction * 120 + Math.random() * 60,
        opacity: (0.15 + fraction * 0.35) * density,
        blur: 15 + Math.random() * 20,
        direction: Math.random() > 0.5 ? 'left' : 'right',
        driftDistance: 50 + Math.random() * 100,
        driftSpeed: 20 + Math.random() * 30,
        gradientAngle: `${Math.random() * 20 - 10}deg`,
        color: `${180 + Math.floor(Math.random() * 30)}, ${190 + Math.floor(Math.random() * 30)}, ${210 + Math.floor(Math.random() * 20)}`
      }
    })
  }, [density])

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
      {bands.map((band) => (
        <FogBand key={band.id} band={band} />
      ))}

      {/* Base fog layer */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: `${20 + density * 30}%`,
          background: `linear-gradient(to top, 
            rgba(180, 190, 210, ${density * 0.4}) 0%, 
            rgba(190, 200, 215, ${density * 0.2}) 50%, 
            transparent 100%)`,
          filter: 'blur(10px)',
          pointerEvents: 'none'
        }}
      />
    </div>
  )
})

Fog.displayName = 'Fog'
export { Fog }
