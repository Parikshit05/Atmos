import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from 'framer-motion';
import { Cloud, Search, X, MapPin, ChevronUp } from 'lucide-react';
import { useWeather } from '../../context/WeatherContext';

function Header() {
  const { unit, toggleUnit, city, fetchWeather } = useWeather();
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [showBackTop, setShowBackTop] = useState(false);
  const lastScrollY = useRef(0);
  const [hidden, setHidden] = useState(false);
  const inputRef = useRef(null);
  const searchTimeout = useRef(null);

  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (latest) => {
    const prev = lastScrollY.current;
    if (latest > prev && latest > 80) {
      setHidden(true);
    } else {
      setHidden(false);
    }
    setShowBackTop(latest > 400);
    lastScrollY.current = latest;
  });

  useEffect(() => {
    if (searchOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [searchOpen]);

  const handleSearchChange = useCallback((value) => {
    setSearchQuery(value);
    if (searchTimeout.current) clearTimeout(searchTimeout.current);
    if (!value.trim() || value.trim().length < 2) {
      setSearchResults([]);
      return;
    }
    setSearchLoading(true);
    searchTimeout.current = setTimeout(async () => {
      try {
        const res = await fetch(
          `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(value)}&count=5&language=en`
        );
        const data = await res.json();
        setSearchResults(data.results || []);
      } catch {
        setSearchResults([]);
      } finally {
        setSearchLoading(false);
      }
    }, 300);
  }, []);

  const handleSelectCity = useCallback((result) => {
    fetchWeather({
      name: result.name,
      lat: result.latitude,
      lon: result.longitude,
      country: result.country_code || result.country || '',
    });
    setSearchOpen(false);
    setSearchQuery('');
    setSearchResults([]);
  }, [fetchWeather]);

  const handleSearchSubmit = useCallback((e) => {
    e.preventDefault();
    if (searchResults.length > 0) {
      handleSelectCity(searchResults[0]);
    }
  }, [searchResults, handleSelectCity]);

  return (
    <>
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: hidden ? -100 : 0 }}
        transition={{ type: 'spring', stiffness: 260, damping: 30 }}
        className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[calc(100%-2rem)] max-w-3xl"
      >
        <div className="glass-strong rounded-2xl px-4 py-3 flex items-center justify-between shadow-2xl shadow-black/30">
          <motion.div
            className="flex items-center gap-2.5 cursor-default select-none"
            whileHover={{ scale: 1.02 }}
            transition={{ type: 'spring', stiffness: 400, damping: 17 }}
          >
            <Cloud size={24} className="text-gradient" strokeWidth={2.5} />
            <span className="text-gradient text-lg font-bold tracking-tight">
              Atmos
            </span>
          </motion.div>

          <div className="flex items-center gap-2">
            <motion.button
              onClick={toggleUnit}
              className="h-9 px-3 rounded-xl glass text-xs font-semibold tracking-wide cursor-pointer transition-colors"
              whileHover={{ scale: 1.06 }}
              whileTap={{ scale: 0.92 }}
              aria-label={`Switch to ${unit === 'celsius' ? 'Fahrenheit' : 'Celsius'}`}
            >
              <AnimatePresence mode="wait">
                <motion.span
                  key={unit}
                  initial={{ y: -8, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: 8, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className={unit === 'celsius' ? 'text-accent-cyan' : 'text-accent-amber'}
                >
                  {unit === 'celsius' ? '°C' : '°F'}
                </motion.span>
              </AnimatePresence>
            </motion.button>

            <motion.button
              onClick={() => { setSearchOpen((p) => !p); setSearchResults([]); setSearchQuery(''); }}
              className="w-10 h-10 rounded-xl glass flex items-center justify-center text-text-secondary hover:text-text-primary transition-colors cursor-pointer"
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.92 }}
              aria-label={searchOpen ? 'Close search' : 'Open search'}
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={searchOpen ? 'close' : 'search'}
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  {searchOpen ? <X size={18} /> : <Search size={18} />}
                </motion.div>
              </AnimatePresence>
            </motion.button>
          </div>
        </div>
      </motion.header>

      <AnimatePresence>
        {searchOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
              onClick={() => { setSearchOpen(false); setSearchResults([]); setSearchQuery(''); }}
            />
            <motion.div
              initial={{ opacity: 0, y: -20, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.96 }}
              transition={{ type: 'spring', stiffness: 300, damping: 25 }}
              className="fixed top-24 left-1/2 -translate-x-1/2 w-[calc(100%-2rem)] max-w-lg z-50 glass-strong rounded-2xl overflow-hidden shadow-2xl shadow-black/40"
            >
              <form onSubmit={handleSearchSubmit} className="flex items-center gap-3 p-4">
                {searchLoading ? (
                  <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}>
                    <div className="w-5 h-5 border-2 border-accent-cyan/30 border-t-accent-cyan rounded-full" />
                  </motion.div>
                ) : (
                  <Search size={20} className="text-text-muted shrink-0" />
                )}
                <input
                  ref={inputRef}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  placeholder="Search for a city..."
                  className="flex-1 bg-transparent outline-none text-text-primary placeholder:text-text-muted text-base"
                  aria-label="Search for a city"
                />
                {searchQuery && (
                  <motion.button
                    type="button"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    onClick={() => { setSearchQuery(''); setSearchResults([]); }}
                    className="p-1 rounded-lg hover:bg-white/10 text-text-muted cursor-pointer"
                  >
                    <X size={16} />
                  </motion.button>
                )}
              </form>

              {searchResults.length > 0 && (
                <div className="border-t border-white/5 py-2 max-h-72 overflow-y-auto">
                  {searchResults.map((r, i) => (
                    <motion.button
                      key={`${r.latitude}-${r.longitude}-${i}`}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.04 }}
                      onClick={() => handleSelectCity(r)}
                      className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-white/5 transition-colors cursor-pointer"
                    >
                      <MapPin size={16} className="text-accent-cyan/70 shrink-0" />
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-text-primary truncate">{r.name}</p>
                        <p className="text-xs text-text-muted truncate">{r.admin1 ? `${r.admin1}, ` : ''}{r.country}</p>
                      </div>
                    </motion.button>
                  ))}
                </div>
              )}

              {searchQuery.length >= 2 && !searchLoading && searchResults.length === 0 && (
                <div className="px-4 py-6 text-center border-t border-white/5">
                  <p className="text-sm text-text-muted">No cities found for "{searchQuery}"</p>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showBackTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="fixed bottom-6 right-6 z-50 w-11 h-11 rounded-full glass-strong flex items-center justify-center text-text-secondary hover:text-accent-cyan transition-colors cursor-pointer shadow-lg shadow-black/20"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            aria-label="Scroll to top"
          >
            <ChevronUp size={20} />
          </motion.button>
        )}
      </AnimatePresence>
    </>
  );
}

export { Header };
