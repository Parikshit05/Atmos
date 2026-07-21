import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, Loader2, MapPin } from 'lucide-react';
import { searchCities } from '../../api/geocodingService';
import { useWeather } from '../../context/WeatherContext';
import { useDebounce } from '../../hooks/useDebounce';
import { useClickOutside } from '../../hooks/useClickOutside';

const SearchBar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const inputRef = useRef(null);
  const containerRef = useRef(null);
  const listRef = useRef(null);
  const { fetchWeather, addRecentSearch } = useWeather();
  const debouncedQuery = useDebounce(query, 300);

  useClickOutside(containerRef, () => {
    setIsOpen(false);
    setQuery('');
    setSuggestions([]);
    setActiveIndex(-1);
  });

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    if (!debouncedQuery || debouncedQuery.length < 2) {
      setSuggestions([]);
      setIsLoading(false);
      return;
    }

    let cancelled = false;
    setIsLoading(true);

    searchCities(debouncedQuery)
      .then((results) => {
        if (!cancelled) {
          setSuggestions(results);
          setIsLoading(false);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setSuggestions([]);
          setIsLoading(false);
        }
      });

    return () => { cancelled = true; };
  }, [debouncedQuery]);

  const handleSelect = useCallback((city) => {
    fetchWeather(city);
    addRecentSearch(city);
    setIsOpen(false);
    setQuery('');
    setSuggestions([]);
    setActiveIndex(-1);
  }, [fetchWeather, addRecentSearch]);

  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Escape') {
      setIsOpen(false);
      setQuery('');
      setSuggestions([]);
      setActiveIndex(-1);
      return;
    }

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIndex((prev) => Math.min(prev + 1, suggestions.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex((prev) => Math.max(prev - 1, -1));
    } else if (e.key === 'Enter' && activeIndex >= 0 && suggestions[activeIndex]) {
      e.preventDefault();
      handleSelect(suggestions[activeIndex]);
    }
  }, [suggestions, activeIndex, handleSelect]);

  useEffect(() => {
    if (activeIndex >= 0 && listRef.current) {
      const activeEl = listRef.current.children[activeIndex];
      if (activeEl) {
        activeEl.scrollIntoView({ block: 'nearest' });
      }
    }
  }, [activeIndex]);

  return (
    <div ref={containerRef} className="relative z-50">
      <AnimatePresence mode="wait">
        {!isOpen ? (
          <motion.button
            key="search-button"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsOpen(true)}
            className="p-3 rounded-xl backdrop-blur-xl border border-white/10 transition-colors"
            style={{
              background: 'rgba(255,255,255,0.08)',
            }}
          >
            <Search size={20} className="text-white/70" />
          </motion.button>
        ) : (
          <motion.div
            key="search-input"
            initial={{ opacity: 0, width: 48 }}
            animate={{ opacity: 1, width: '100%', maxWidth: 420 }}
            exit={{ opacity: 0, width: 48 }}
            transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
            className="relative"
          >
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center gap-3 px-4 py-3 rounded-xl backdrop-blur-xl border border-white/10"
              style={{
                background: 'rgba(13, 17, 23, 0.9)',
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255,255,255,0.05)',
              }}
            >
              {isLoading ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                >
                  <Loader2 size={18} className="text-cyan-400" />
                </motion.div>
              ) : (
                <Search size={18} className="text-white/50" />
              )}
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setActiveIndex(-1);
                }}
                onKeyDown={handleKeyDown}
                placeholder="Search city..."
                className="flex-1 bg-transparent outline-none text-sm font-medium text-white placeholder:text-white/40 placeholder:opacity-50"
              />
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => {
                  setIsOpen(false);
                  setQuery('');
                  setSuggestions([]);
                  setActiveIndex(-1);
                }}
                className="p-1 rounded-lg transition-colors hover:bg-white/10 text-white/50"
              >
                <X size={16} />
              </motion.button>
            </motion.div>

            <AnimatePresence>
              {(suggestions.length > 0 || (query.length >= 2 && !isLoading)) && (
                <motion.div
                  initial={{ opacity: 0, y: -8, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -8, scale: 0.96 }}
                  transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
                  className="absolute top-full left-0 right-0 mt-2 rounded-xl backdrop-blur-xl border border-white/10 overflow-hidden"
                  style={{
                    background: 'rgba(13, 17, 23, 0.95)',
                    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.6)',
                  }}
                >
                  {suggestions.length > 0 ? (
                    <div ref={listRef} className="py-2 max-h-72 overflow-y-auto">
                      {suggestions.map((city, index) => (
                        <motion.button
                          key={`${city.lat}-${city.lon}-${index}`}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.05 }}
                          onClick={() => handleSelect(city)}
                          onMouseEnter={() => setActiveIndex(index)}
                          className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors ${
                            activeIndex === index
                              ? 'bg-cyan-500/10'
                              : 'hover:bg-white/5'
                          }`}
                        >
                          <MapPin size={16} className="text-cyan-400/70" />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate text-white">
                              {city.name}
                            </p>
                            <p className="text-xs truncate text-white/40">
                              {city.state ? `${city.state}, ` : ''}{city.country}
                            </p>
                          </div>
                        </motion.button>
                      ))}
                    </div>
                  ) : (
                    <div className="px-4 py-6 text-center">
                      <p className="text-sm text-white/40">
                        No cities found for "{query}"
                      </p>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export { SearchBar };
