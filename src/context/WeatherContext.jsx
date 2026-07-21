import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
} from 'react';
import {
  fetchCurrentWeather,
  transformCurrentData,
} from '../api/weatherService';
import { reverseGeocode } from '../api/geocodingService';
import { getSkyConfig } from '../utils/skyConfig';
import { useLocalStorage } from '../hooks/useLocalStorage';

const WeatherContext = createContext(null);

const DEFAULT_CITY = {
  name: 'London',
  lat: 51.5074,
  lon: -0.1278,
  country: 'GB',
};

const MAX_RECENT = 10;

function citiesEqual(a, b) {
  return a.lat === b.lat && a.lon === b.lon;
}

export function WeatherProvider({ children }) {
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [city, setCity] = useState(DEFAULT_CITY);
  const [favorites, setFavorites] = useLocalStorage('atmos-favorites', []);
  const [recentSearches, setRecentSearches] = useLocalStorage(
    'atmos-recent',
    []
  );
  const [unit, setUnit] = useLocalStorage('atmos-unit', 'celsius');
  const [skyConfig, setSkyConfig] = useState(null);

  const fetchWeather = useCallback(async (targetCity) => {
    if (!targetCity) return;
    setLoading(true);
    setError(null);
    try {
      setCity(targetCity);
      const data = await fetchCurrentWeather(targetCity.lat, targetCity.lon);
      setWeatherData(data);
    } catch (err) {
      setError(err.message || 'Failed to fetch weather data');
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchWeatherByCoords = useCallback(async (lat, lon) => {
    if (lat == null || lon == null) return;
    setLoading(true);
    setError(null);
    try {
      const data = await fetchCurrentWeather(lat, lon);
      setWeatherData(data);
      setCity((prev) => ({ ...prev, lat, lon }));
    } catch (err) {
      setError(err.message || 'Failed to fetch weather data');
    } finally {
      setLoading(false);
    }
  }, []);

  const addFavorite = useCallback(
    (favCity) => {
      setFavorites((prev) => {
        if (prev.some((c) => citiesEqual(c, favCity))) return prev;
        return [...prev, favCity];
      });
    },
    [setFavorites]
  );

  const removeFavorite = useCallback(
    (favCity) => {
      setFavorites((prev) => prev.filter((c) => !citiesEqual(c, favCity)));
    },
    [setFavorites]
  );

  const addRecentSearch = useCallback(
    (recentCity) => {
      setRecentSearches((prev) => {
        const filtered = prev.filter((c) => !citiesEqual(c, recentCity));
        const updated = [recentCity, ...filtered];
        return updated.slice(0, MAX_RECENT);
      });
    },
    [setRecentSearches]
  );

  const toggleUnit = useCallback(() => {
    setUnit((prev) => (prev === 'celsius' ? 'fahrenheit' : 'celsius'));
  }, [setUnit]);

  const clearError = useCallback(() => setError(null), []);

  useEffect(() => {
    if (!weatherData) {
      setSkyConfig(null);
      return;
    }

    const sunriseTime = weatherData.daily?.[0]?.sunrise;
    const sunsetTime = weatherData.daily?.[0]?.sunset;

    if (!sunriseTime || !sunsetTime) {
      setSkyConfig(null);
      return;
    }

    const now = new Date();
    const sunrise = new Date(sunriseTime);
    const sunset = new Date(sunsetTime);
    const hour = now.getHours();

    setSkyConfig(getSkyConfig(weatherData.weatherCode, hour, sunrise, sunset));
  }, [weatherData]);

  useEffect(() => {
    let cancelled = false;

    // Load default city immediately so the user always sees data
    fetchWeather(DEFAULT_CITY).then(() => {
      if (cancelled) return;

      // Then try to upgrade to geolocation in the background
      if (!navigator.geolocation) return;

      navigator.geolocation.getCurrentPosition(
        async (position) => {
          if (cancelled) return;
          try {
            const lat = position.coords.latitude;
            const lon = position.coords.longitude;
            const [data, geo] = await Promise.all([
              fetchCurrentWeather(lat, lon),
              reverseGeocode(lat, lon).catch(() => null),
            ]);
            if (cancelled) return;
            setCity({
              name: geo?.name || 'Your Location',
              lat,
              lon,
              country: geo?.country || '',
            });
            setWeatherData(data);
          } catch {
            // Keep showing default city data
          }
        },
        () => {
          // Permission denied or error — keep showing default city
        },
        { timeout: 8000, maximumAge: 600000 }
      );
    });

    return () => { cancelled = true; };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const value = useMemo(
    () => ({
      weatherData,
      loading,
      error,
      city,
      favorites,
      recentSearches,
      skyConfig,
      unit,
      fetchWeather,
      fetchWeatherByCoords,
      addFavorite,
      removeFavorite,
      addRecentSearch,
      toggleUnit,
      clearError,
    }),
    [
      weatherData,
      loading,
      error,
      city,
      favorites,
      recentSearches,
      skyConfig,
      unit,
      fetchWeather,
      fetchWeatherByCoords,
      addFavorite,
      removeFavorite,
      addRecentSearch,
      toggleUnit,
      clearError,
    ]
  );

  return (
    <WeatherContext.Provider value={value}>{children}</WeatherContext.Provider>
  );
}

export function useWeather() {
  const ctx = useContext(WeatherContext);
  if (!ctx) throw new Error('useWeather must be used within a WeatherProvider');
  return ctx;
}
