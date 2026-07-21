import React, { useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import useReducedMotion from '../../hooks/useReducedMotion'
import { Sun } from './Sun'
import { Moon } from './Moon'
import { Stars } from './Stars'
import { Clouds } from './Clouds'
import { Rain } from './Rain'
import { Snow } from './Snow'
import { Lightning } from './Lightning'
import { Fog } from './Fog'
import { Particles } from './Particles'

const defaultSkyConfig = {
  timeOfDay: 0.5,
  weatherState: 'clear',
  skyColors: {
    top: '#1a1a2e',
    middle: '#16213e',
    bottom: '#0f3460'
  },
  sunPosition: { x: 50, y: 20 },
  moonPosition: { x: 70, y: 15 },
  cloudDensity: 0,
  rainIntensity: 0,
  snowIntensity: 0,
  windSpeed: 1,
  lightningFrequency: 0,
  fogDensity: 0,
  starCount: 100,
  ambientLight: 0.5,
  particleType: null,
  particleCount: 0
}

const SkyEngine = React.memo(({ skyConfig = {} }) => {
  const reducedMotion = useReducedMotion()
  const config = useMemo(() => ({
    ...defaultSkyConfig,
    ...skyConfig,
    skyColors: { ...defaultSkyConfig.skyColors, ...skyConfig.skyColors },
    sunPosition: { ...defaultSkyConfig.sunPosition, ...skyConfig.sunPosition },
    moonPosition: { ...defaultSkyConfig.moonPosition, ...skyConfig.moonPosition }
  }), [skyConfig])

  const isDay = config.timeOfDay > 0.25 && config.timeOfDay < 0.75
  const isNight = config.timeOfDay < 0.2 || config.timeOfDay > 0.8
  const showStars = isNight || (config.timeOfDay > 0.15 && config.timeOfDay < 0.3) || (config.timeOfDay > 0.7 && config.timeOfDay < 0.85)
  const isThunderstorm = config.weatherState === 'thunderstorm'
  const isRain = config.weatherState === 'rain' || isThunderstorm
  const isSnow = config.weatherState === 'snow'

  const skyGradient = useMemo(() => {
    const { top, middle, bottom } = config.skyColors
    return `linear-gradient(to bottom, ${top} 0%, ${middle} 50%, ${bottom} 100%)`
  }, [config.skyColors])

  const sunOpacity = useMemo(() => {
    if (isDay) return 1
    if (config.timeOfDay > 0.2 && config.timeOfDay <= 0.25) return (config.timeOfDay - 0.2) * 20
    if (config.timeOfDay >= 0.75 && config.timeOfDay < 0.8) return 1 - (config.timeOfDay - 0.75) * 20
    return 0
  }, [isDay, config.timeOfDay])

  const moonOpacity = useMemo(() => {
    if (isNight) return 1
    if (config.timeOfDay > 0.15 && config.timeOfDay <= 0.25) return 1 - (config.timeOfDay - 0.15) * 10
    if (config.timeOfDay >= 0.75 && config.timeOfDay < 0.85) return (config.timeOfDay - 0.75) * 10
    return 0
  }, [isNight, config.timeOfDay])

  const starOpacity = useMemo(() => {
    if (isNight) return 1
    if (config.timeOfDay > 0.2 && config.timeOfDay <= 0.3) return 1 - (config.timeOfDay - 0.2) * 10
    if (config.timeOfDay >= 0.7 && config.timeOfDay < 0.8) return (config.timeOfDay - 0.7) * 10
    return 0
  }, [isNight, config.timeOfDay])

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        overflow: 'hidden'
      }}
    >
      {/* Layer 1: Sky gradient background */}
      <motion.div
        style={{
          position: 'absolute',
          inset: 0,
          background: skyGradient
        }}
        animate={reducedMotion ? {} : { background: skyGradient }}
        transition={{ duration: 2, ease: 'easeInOut' }}
      />

      {/* Layer 2: Stars */}
      <AnimatePresence>
        {showStars && (
          <motion.div
            key="stars"
            initial={{ opacity: 0 }}
            animate={{ opacity: starOpacity }}
            exit={{ opacity: 0 }}
            transition={{ duration: 2 }}
            style={{ position: 'absolute', inset: 0 }}
          >
            <Stars count={config.starCount} opacity={1} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Layer 3: Sun or Moon */}
      <AnimatePresence mode="wait">
        {isDay && sunOpacity > 0 && (
          <motion.div
            key="sun"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5 }}
            style={{ position: 'absolute', inset: 0 }}
          >
            <Sun
              x={config.sunPosition.x}
              y={config.sunPosition.y}
              opacity={sunOpacity}
              size={120}
              isDay={isDay}
            />
          </motion.div>
        )}
        {!isDay && moonOpacity > 0 && (
          <motion.div
            key="moon"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5 }}
            style={{ position: 'absolute', inset: 0 }}
          >
            <Moon
              x={config.moonPosition.x}
              y={config.moonPosition.y}
              opacity={moonOpacity}
              phase={0.5}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Layer 4: Clouds */}
      <AnimatePresence>
        {config.cloudDensity > 0 && (
          <motion.div
            key="clouds"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5 }}
            style={{ position: 'absolute', inset: 0 }}
          >
            <Clouds
              density={config.cloudDensity}
              windSpeed={config.windSpeed}
              opacity={1}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Layer 5: Rain */}
      <AnimatePresence>
        {isRain && config.rainIntensity > 0 && (
          <motion.div
            key="rain"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
            style={{ position: 'absolute', inset: 0 }}
          >
            <Rain intensity={config.rainIntensity} opacity={1} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Layer 5b: Snow */}
      <AnimatePresence>
        {isSnow && config.snowIntensity > 0 && (
          <motion.div
            key="snow"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
            style={{ position: 'absolute', inset: 0 }}
          >
            <Snow intensity={config.snowIntensity} opacity={1} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Layer 6: Lightning */}
      <Lightning
        frequency={config.lightningFrequency}
        isActive={isThunderstorm}
      />

      {/* Layer 7: Fog */}
      <AnimatePresence>
        {config.fogDensity > 0 && (
          <motion.div
            key="fog"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 2 }}
            style={{ position: 'absolute', inset: 0 }}
          >
            <Fog density={config.fogDensity} opacity={1} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Layer 8: Particles */}
      <AnimatePresence>
        {config.particleType && config.particleCount > 0 && (
          <motion.div
            key="particles"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
            style={{ position: 'absolute', inset: 0 }}
          >
            <Particles
              type={config.particleType}
              count={config.particleCount}
              opacity={1}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Layer 9: Overlay gradient for depth */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: `linear-gradient(to bottom, 
            rgba(0, 0, 0, ${0.1 * (1 - config.ambientLight)}) 0%, 
            transparent 30%, 
            transparent 70%, 
            rgba(0, 0, 0, ${0.2 * (1 - config.ambientLight)}) 100%)`,
          pointerEvents: 'none'
        }}
      />
    </div>
  )
})

SkyEngine.displayName = 'SkyEngine'
export { SkyEngine }
