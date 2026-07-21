import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CloudRain, ChevronDown } from 'lucide-react';
import { useWeather } from '../../context/WeatherContext';
import WeatherIcon from '../ui/WeatherIcon';
import { formatDay, formatFullDay } from '../../utils/timeUtils';

const DailyForecast = () => {
  const { weatherData, unit } = useWeather();
  const [expandedDay, setExpandedDay] = useState(null);

  if (!weatherData?.daily || weatherData.daily.length === 0) return null;

  const daily = weatherData.daily;

  const globalMin = Math.min(...daily.map((d) => d.tempMin ?? Infinity));
  const globalMax = Math.max(...daily.map((d) => d.tempMax ?? -Infinity));
  const range = globalMax - globalMin || 1;

  const formatTemp = (temp) => {
    if (temp == null) return '--';
    if (unit === 'fahrenheit') return `${Math.round((temp * 9) / 5 + 32)}°`;
    return `${Math.round(temp)}°`;
  };

  const getBarGradient = (tempMin, tempMax) => {
    const lowRatio = ((tempMin - globalMin) / range) * 100;
    const highRatio = ((tempMax - globalMin) / range) * 100;
    return { left: `${lowRatio}%`, width: `${highRatio - lowRatio}%` };
  };

  const todayStr = new Date().toISOString().split('T')[0];

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
        7-Day Forecast
      </h3>

      <div className="flex flex-col gap-1">
        {daily.map((day, index) => {
          const isToday = day.date === todayStr;
          const isExpanded = expandedDay === index;
          const bar = getBarGradient(day.tempMin, day.tempMax);

          return (
            <motion.div
              key={day.date}
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05, duration: 0.3 }}
            >
              <motion.button
                onClick={() => setExpandedDay(isExpanded ? null : index)}
                whileHover={{ x: 2 }}
                className={`w-full flex items-center gap-3 md:gap-4 py-3 px-3 md:px-4 rounded-xl transition-colors ${
                  isToday
                    ? 'bg-cyan-500/8'
                    : 'hover:bg-white/3'
                }`}
              >
                <span
                  className={`text-sm font-semibold w-16 md:w-20 text-left flex-shrink-0 ${
                    isToday ? 'text-cyan-300' : 'text-white/80'
                  }`}
                >
                  {isToday ? 'Today' : formatDay(day.date)}
                </span>

                <WeatherIcon
                  code={day.weatherCode}
                  isDay={true}
                  size="sm"
                />

                <span className="text-sm font-medium w-10 text-right tabular-nums flex-shrink-0 text-white/50">
                  {formatTemp(day.tempMin)}
                </span>

                <div className="flex-1 h-1.5 rounded-full bg-white/5 mx-1 relative overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: bar.width, left: bar.left }}
                    transition={{ delay: 0.3 + index * 0.05, duration: 0.6, ease: 'easeOut' }}
                    className="absolute h-full rounded-full"
                    style={{
                      background: `linear-gradient(90deg, #60a5fa, #f97316)`,
                    }}
                  />
                </div>

                <span className="text-sm font-bold w-10 text-right tabular-nums flex-shrink-0 text-white">
                  {formatTemp(day.tempMax)}
                </span>

                {day.precipProbMax != null && day.precipProbMax > 0 && (
                  <div className="hidden sm:flex items-center gap-1 w-12 justify-end flex-shrink-0">
                    <CloudRain size={12} className="text-blue-400" />
                    <span className="text-xs text-blue-400 font-medium">
                      {day.precipProbMax}%
                    </span>
                  </div>
                )}

                <motion.div
                  animate={{ rotate: isExpanded ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <ChevronDown size={14} className="text-white/25" />
                </motion.div>
              </motion.button>

              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
                    className="overflow-hidden"
                  >
                    <div className="px-4 pb-3 pt-1 grid grid-cols-2 sm:grid-cols-4 gap-3">
                      {day.precipProbMax != null && (
                        <div className="flex flex-col">
                          <span className="text-[10px] uppercase tracking-wider font-medium text-white/30">
                            Precip
                          </span>
                          <span className="text-sm font-semibold text-white/70">
                            {day.precipProbMax}%
                          </span>
                        </div>
                      )}
                      {day.precipSum != null && (
                        <div className="flex flex-col">
                          <span className="text-[10px] uppercase tracking-wider font-medium text-white/30">
                            Rain Sum
                          </span>
                          <span className="text-sm font-semibold text-white/70">
                            {day.precipSum.toFixed(1)} mm
                          </span>
                        </div>
                      )}
                      {day.windMax != null && (
                        <div className="flex flex-col">
                          <span className="text-[10px] uppercase tracking-wider font-medium text-white/30">
                            Wind Max
                          </span>
                          <span className="text-sm font-semibold text-white/70">
                            {Math.round(day.windMax)} km/h
                          </span>
                        </div>
                      )}
                      {day.uvMax != null && (
                        <div className="flex flex-col">
                          <span className="text-[10px] uppercase tracking-wider font-medium text-white/30">
                            UV Max
                          </span>
                          <span className="text-sm font-semibold text-white/70">
                            {(Math.round(day.uvMax * 10) / 10).toFixed(1)}
                          </span>
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
};

export { DailyForecast };
