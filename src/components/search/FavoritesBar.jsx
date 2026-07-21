import { useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, X, Thermometer } from 'lucide-react';
import { useWeather } from '../../context/WeatherContext';

const FavoritesBar = () => {
  const {
    favorites,
    city,
    weatherData,
    fetchWeather,
    addFavorite,
    removeFavorite,
    unit,
  } = useWeather();
  const scrollRef = useRef(null);

  const isCurrentFavorite =
    favorites.length > 0 &&
    favorites.some((f) => f.lat === city.lat && f.lon === city.lon);

  const handleAddCurrent = () => {
    if (city && !isCurrentFavorite) {
      addFavorite(city);
    }
  };

  const formatTemp = (temp) => {
    if (temp == null) return '--';
    if (unit === 'fahrenheit') return `${Math.round((temp * 9) / 5 + 32)}°`;
    return `${Math.round(temp)}°`;
  };

  return (
    <div className="relative w-full">
      <div
        ref={scrollRef}
        className="flex items-center gap-3 overflow-x-auto no-scrollbar py-2 px-1 scroll-smooth"
        style={{ scrollSnapType: 'x mandatory' }}
      >
        <AnimatePresence mode="popLayout">
          {favorites.map((fav) => {
            const isActive = fav.lat === city.lat && fav.lon === city.lon;
            return (
              <motion.div
                key={`${fav.lat}-${fav.lon}`}
                layout
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8, transition: { duration: 0.2 } }}
                transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
                style={{ scrollSnapAlign: 'start', flexShrink: 0 }}
                className="relative group"
              >
                <motion.button
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => fetchWeather(fav)}
                  className={`flex items-center gap-2.5 pl-4 pr-8 py-2.5 rounded-xl backdrop-blur-xl border transition-all ${
                    isActive
                      ? 'border-cyan-400/30'
                      : 'border-white/10 hover:border-white/20'
                  }`}
                  style={{
                    background: isActive
                      ? 'rgba(34, 211, 238, 0.12)'
                      : 'rgba(255, 255, 255, 0.06)',
                    boxShadow: isActive
                      ? '0 0 20px rgba(34, 211, 238, 0.1)'
                      : undefined,
                  }}
                >
                  <div className="text-left">
                    <p
                      className={`text-xs font-semibold leading-tight ${
                        isActive ? 'text-cyan-300' : 'text-white/90'
                      }`}
                    >
                      {fav.name}
                    </p>
                    {fav.country && (
                      <p className="text-[10px] leading-tight mt-0.5 text-white/40">
                        {fav.country}
                      </p>
                    )}
                  </div>
                </motion.button>

                <motion.button
                  initial={{ opacity: 0 }}
                  whileHover={{ scale: 1.15 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={(e) => {
                    e.stopPropagation();
                    removeFavorite(fav);
                  }}
                  className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  style={{
                    background: 'rgba(239, 68, 68, 0.9)',
                  }}
                >
                  <X size={10} className="text-white" />
                </motion.button>
              </motion.div>
            );
          })}
        </AnimatePresence>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleAddCurrent}
          disabled={isCurrentFavorite}
          className={`flex items-center gap-2 pl-3.5 pr-4 py-2.5 rounded-xl backdrop-blur-xl border border-dashed transition-all flex-shrink-0 ${
            isCurrentFavorite
              ? 'opacity-40 cursor-not-allowed border-white/5'
              : 'border-white/10 hover:border-rose-400/30'
          }`}
          style={{
            background: 'rgba(255,255,255,0.03)',
          }}
        >
          <Heart
            size={14}
            className={
              isCurrentFavorite
                ? 'text-rose-400 fill-rose-400'
                : 'text-white/40'
            }
          />
          <span className="text-xs font-medium whitespace-nowrap text-white/50">
            {isCurrentFavorite ? 'Saved' : 'Add'}
          </span>
        </motion.button>
      </div>
    </div>
  );
};

export { FavoritesBar };
