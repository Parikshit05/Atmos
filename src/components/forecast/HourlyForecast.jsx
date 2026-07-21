import { useRef } from 'react';
import { motion } from 'framer-motion';
import { CloudRain } from 'lucide-react';
import { useWeather } from '../../context/WeatherContext';
import WeatherIcon from '../ui/WeatherIcon';
import { formatHourlyTime } from '../../utils/timeUtils';

const HourlyForecast = () => {
  const { weatherData, unit } = useWeather();
  const scrollRef = useRef(null);

  if (!weatherData?.hourly || weatherData.hourly.length === 0) return null;

  const hourly = weatherData.hourly.slice(0, 24);
  const now = new Date();

  const formatTemp = (temp) => {
    if (temp == null) return '--';
    if (unit === 'fahrenheit') return `${Math.round((temp * 9) / 5 + 32)}°`;
    return `${Math.round(temp)}°`;
  };

  const isCurrentHour = (timeStr) => {
    const d = new Date(timeStr);
    return d.getHours() === now.getHours();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="backdrop-blur-xl rounded-2xl border border-white/10 p-4 md:p-5"
      style={{
        background: 'rgba(255,255,255,0.04)',
      }}
    >
      <h3 className="text-sm font-semibold tracking-wide uppercase mb-4 text-white/50">
        Hourly Forecast
      </h3>

      <div
        ref={scrollRef}
        className="flex gap-2 overflow-x-auto no-scrollbar -mx-1 px-1 pb-2"
        style={{ scrollSnapType: 'x mandatory' }}
      >
        {hourly.map((hour, index) => {
          const isNow = isCurrentHour(hour.time);
          return (
            <motion.div
              key={hour.time}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.03, duration: 0.3 }}
              whileHover={{ y: -2 }}
              className={`flex-shrink-0 flex flex-col items-center gap-2 py-3 px-3 rounded-xl border transition-all ${
                isNow
                  ? 'border-cyan-400/25'
                  : 'border-transparent'
              }`}
              style={{
                scrollSnapAlign: 'start',
                minWidth: 72,
                background: isNow
                  ? 'rgba(34, 211, 238, 0.1)'
                  : 'rgba(255,255,255,0.02)',
                boxShadow: isNow
                  ? '0 0 24px rgba(34, 211, 238, 0.08)'
                  : undefined,
              }}
            >
              <span
                className={`text-xs font-medium ${
                  isNow ? 'text-cyan-300' : 'text-white/60'
                }`}
              >
                {isNow ? 'Now' : formatHourlyTime(hour.time)}
              </span>

              <WeatherIcon
                code={hour.weatherCode}
                isDay={hour.isDay === 1}
                size="sm"
              />

              <span className="text-sm font-bold tabular-nums text-white">
                {formatTemp(hour.temp)}
              </span>

              {hour.precipProb != null && hour.precipProb > 0 && (
                <div className="flex items-center gap-0.5">
                  <CloudRain size={10} className="text-blue-400" />
                  <span className="text-[10px] font-medium text-blue-400">
                    {hour.precipProb}%
                  </span>
                </div>
              )}
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
};

export { HourlyForecast };
