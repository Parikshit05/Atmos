import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MapPin } from 'lucide-react';
import AnimatedNumber from '../ui/AnimatedNumber';
import WeatherIcon from '../ui/WeatherIcon';
import GlassCard from '../ui/GlassCard';
import { useWeather } from '../../context/WeatherContext';
import { formatTime, formatDate } from '../../utils/timeUtils';
import { weatherCodeToDescription } from '../../utils/weatherCodes';
import { getUVIndexLevel } from '../../api/weatherService';

const Hero = () => {
  const { weatherData, city, unit } = useWeather();
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
  };

  if (!weatherData) return null;

  const { temperature, feelsLike, isDay, weatherCode } = weatherData;
  const daily = weatherData.daily?.[0];
  const weatherInfo = weatherCodeToDescription(weatherCode);
  const unitSuffix = unit === 'fahrenheit' ? '°F' : '°C';

  const displayTemp = (temp) => {
    if (temp == null) return 0;
    if (unit === 'fahrenheit') return Math.round((temp * 9) / 5 + 32);
    return Math.round(temp);
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="w-full"
    >
      <GlassCard className="p-8 md:p-12" hover>
        <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
          <div className="flex-1 text-center lg:text-left">
            <motion.div
              variants={itemVariants}
              className="flex items-center justify-center lg:justify-start gap-2 mb-4"
            >
              <MapPin size={18} className="text-red-400" />
              <span className="text-lg font-medium text-slate-700 dark:text-slate-200">
                {city?.name || 'Loading...'}
                {city?.country && (
                  <span className="text-sm opacity-60 ml-1">{city.country}</span>
                )}
              </span>
            </motion.div>

            <motion.div variants={itemVariants} className="mb-2">
              <div className="flex items-baseline justify-center lg:justify-start gap-1">
                <AnimatedNumber
                  value={displayTemp(temperature)}
                  decimals={0}
                  suffix="°"
                  className="text-7xl md:text-8xl lg:text-9xl font-bold text-gradient"
                />
              </div>
            </motion.div>

            <motion.div variants={itemVariants} className="mb-6">
              <p className="text-xl md:text-2xl text-slate-600 dark:text-slate-300 capitalize">
                {weatherInfo?.description || 'Loading...'}
              </p>
            </motion.div>

            <motion.div
              variants={itemVariants}
              className="flex flex-wrap items-center justify-center lg:justify-start gap-4 md:gap-6 text-sm text-slate-500 dark:text-slate-400"
            >
              <span className="flex items-center gap-1">
                Feels like{' '}
                <AnimatedNumber
                  value={displayTemp(feelsLike)}
                  decimals={0}
                  suffix="°"
                  className="font-medium"
                />
              </span>
              <span className="w-px h-4 bg-slate-300 dark:bg-slate-600" />
              <span className="flex items-center gap-1">
                H:{' '}
                <AnimatedNumber
                  value={displayTemp(daily?.tempMax ?? (temperature ? temperature + 5 : 0))}
                  decimals={0}
                  suffix="°"
                  className="font-medium"
                />{' '}
                L:{' '}
                <AnimatedNumber
                  value={displayTemp(daily?.tempMin ?? (temperature ? temperature - 5 : 0))}
                  decimals={0}
                  suffix="°"
                  className="font-medium"
                />
              </span>
            </motion.div>

            <motion.div variants={itemVariants} className="mt-6 text-sm text-slate-400 dark:text-slate-500">
              <p>{formatDate(currentTime)}</p>
              <p className="font-mono text-base">{formatTime(currentTime)}</p>
            </motion.div>
          </div>

          <motion.div variants={itemVariants} className="flex-shrink-0">
            <WeatherIcon
              code={weatherCode}
              isDay={isDay === 1}
              size="2xl"
            />
          </motion.div>
        </div>
      </GlassCard>
    </motion.div>
  );
};

export default Hero;
