import React, { useMemo } from 'react'
import { motion } from 'framer-motion'
import useReducedMotion from '../../hooks/useReducedMotion'

const Cloud = React.memo(({ cloud, windSpeed, isDark }) => {
  const reducedMotion = useReducedMotion()
  const baseColor = isDark ? 'rgba(80, 85, 95, 0.85)' : 'rgba(255, 255, 255, 0.9)'
  const shadowColor = isDark ? 'rgba(50, 55, 65, 0.6)' : 'rgba(200, 210, 220, 0.5)'
  const highlightColor = isDark ? 'rgba(100, 105, 115, 0.4)' : 'rgba(255, 255, 255, 0.7)'

  const speed = (cloud.layerSpeed * (windSpeed || 1)) * 60

  return (
    <motion.div
      style={{
        position: 'absolute',
        left: 0,
        top: `${cloud.y}%`,
        width: cloud.width,
        height: cloud.height,
        opacity: cloud.opacity,
        pointerEvents: 'none'
      }}
      animate={reducedMotion ? {} : {
        x: [cloud.startX, cloud.startX + 1920]
      }}
      transition={{
        duration: speed,
        repeat: Infinity,
        ease: 'linear'
      }}
    >
      {/* Main cloud body */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          borderRadius: '50%',
          background: `radial-gradient(ellipse at 50% 60%, ${baseColor} 0%, ${shadowColor} 100%)`,
          filter: `blur(${cloud.blur}px)`
        }}
      />
      {/* Top bump */}
      <div
        style={{
          position: 'absolute',
          left: '20%',
          top: -cloud.height * 0.2,
          width: cloud.width * 0.5,
          height: cloud.height * 0.7,
          borderRadius: '50%',
          background: `radial-gradient(ellipse at 50% 70%, ${baseColor} 0%, ${shadowColor} 100%)`,
          filter: `blur(${cloud.blur}px)`
        }}
      />
      {/* Right bump */}
      <div
        style={{
          position: 'absolute',
          right: '10%',
          top: -cloud.height * 0.1,
          width: cloud.width * 0.4,
          height: cloud.height * 0.6,
          borderRadius: '50%',
          background: `radial-gradient(ellipse at 50% 60%, ${baseColor} 0%, ${shadowColor} 100%)`,
          filter: `blur(${cloud.blur * 0.8}px)`
        }}
      />
      {/* Left bump */}
      <div
        style={{
          position: 'absolute',
          left: '5%',
          top: -cloud.height * 0.05,
          width: cloud.width * 0.35,
          height: cloud.height * 0.55,
          borderRadius: '50%',
          background: `radial-gradient(ellipse at 50% 60%, ${baseColor} 0%, ${shadowColor} 100%)`,
          filter: `blur(${cloud.blur * 0.9}px)`
        }}
      />
      {/* Highlight */}
      <div
        style={{
          position: 'absolute',
          left: '25%',
          top: '10%',
          width: cloud.width * 0.3,
          height: cloud.height * 0.3,
          borderRadius: '50%',
          background: highlightColor,
          filter: `blur(${cloud.blur * 2}px)`
        }}
      />
    </motion.div>
  )
})

const Clouds = React.memo(({ density = 0.5, windSpeed = 1, opacity = 1 }) => {
  const reducedMotion = useReducedMotion()
  const isDark = density > 0.7

  const cloudLayers = useMemo(() => {
    const count = Math.max(3, Math.floor(density * 8))
    return Array.from({ length: count }, (_, i) => {
      const layerFraction = i / count
      return {
        id: i,
        y: 10 + layerFraction * 50 + Math.random() * 15,
        width: 180 + Math.random() * 200,
        height: 50 + Math.random() * 40,
        opacity: 0.4 + layerFraction * 0.4,
        blur: 2 + Math.random() * 4,
        layerSpeed: 0.3 + layerFraction * 0.7,
        startX: -400 + Math.random() * -200
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
        pointerEvents: 'none'
      }}
    >
      {cloudLayers.map((cloud) => (
        <Cloud
          key={cloud.id}
          cloud={cloud}
          windSpeed={windSpeed}
          isDark={isDark}
        />
      ))}
    </div>
  )
})

Cloud.displayName = 'Clouds'
export { Clouds }
