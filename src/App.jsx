import { useState, useEffect, useCallback, lazy, Suspense } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Toaster } from 'react-hot-toast';
import { WeatherProvider, useWeather } from './context/WeatherContext';
import { Header } from './components/layout/Header';
import { SkyEngine } from './components/sky/SkyEngine';
import LoadingScreen from './components/ui/LoadingScreen';
import OfflineBanner from './components/ui/OfflineBanner';
import CustomCursor from './components/ui/CustomCursor';

const Hero = lazy(() => import('./components/hero/Hero'));
const FavoritesBar = lazy(() => import('./components/search/FavoritesBar').then(m => ({ default: m.FavoritesBar })));
const WeatherDetails = lazy(() => import('./components/cards/WeatherDetails').then(m => ({ default: m.WeatherDetails })));
const HourlyForecast = lazy(() => import('./components/forecast/HourlyForecast').then(m => ({ default: m.HourlyForecast })));
const DailyForecast = lazy(() => import('./components/forecast/DailyForecast').then(m => ({ default: m.DailyForecast })));
const ForecastChart = lazy(() => import('./components/forecast/ForecastChart').then(m => ({ default: m.ForecastChart })));
const WeatherQuote = lazy(() => import('./components/ui/WeatherQuote'));
const ErrorState = lazy(() => import('./components/ui/ErrorState'));

function WeatherApp() {
  const { weatherData, loading, error, skyConfig, fetchWeather, clearError } = useWeather();
  const [appReady, setAppReady] = useState(false);

  useEffect(() => {
    if (weatherData && !appReady) {
      const timer = setTimeout(() => setAppReady(true), 1800);
      return () => clearTimeout(timer);
    }
  }, [weatherData, appReady]);

  useEffect(() => {
    if (weatherData) {
      const { temperature, isDay } = weatherData;
      const desc = isDay ? '☀' : '🌙';
      document.title = `${desc} ${Math.round(temperature || 0)}° — Atmos`;
      const favicon = document.querySelector('link[rel="icon"]');
      if (favicon) {
        const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="${isDay ? '#fbbf24' : '#818cf8'}"/><stop offset="100%" stop-color="${isDay ? '#f97316' : '#6366f1'}"/></linearGradient></defs><circle cx="50" cy="50" r="45" fill="url(#g)"/><text x="50" y="65" text-anchor="middle" font-family="sans-serif" font-weight="800" font-size="32" fill="white">${Math.round(temperature || 0)}°</text></svg>`;
        favicon.href = `data:image/svg+xml,${encodeURIComponent(svg)}`;
      }
    }
  }, [weatherData]);

  const handleRetry = useCallback(() => {
    clearError();
    fetchWeather({ name: 'London', lat: 51.5074, lon: -0.1278, country: 'GB' });
  }, [clearError, fetchWeather]);

  return (
    <div className="relative min-h-screen overflow-x-hidden">
      <CustomCursor />
      <OfflineBanner />
      <LoadingScreen isLoading={!appReady} />

      <div className="fixed inset-0 -z-10">
        <SkyEngine skyConfig={skyConfig || {}} />
      </div>

      <Header />

      <main className="relative z-10 pt-28 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <AnimatePresence mode="wait">
          {error && !loading && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mb-8"
            >
              <Suspense fallback={null}>
                <ErrorState message={error} onRetry={handleRetry} />
              </Suspense>
            </motion.div>
          )}
        </AnimatePresence>

        {weatherData && (
          <motion.div
            className="flex flex-col gap-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: appReady ? 1 : 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <Suspense fallback={<SkeletonBlock height="h-72" />}>
              <Hero />
            </Suspense>

            <Suspense fallback={null}>
              <FavoritesBar />
            </Suspense>

            <Suspense fallback={<SkeletonBlock height="h-48" />}>
              <ForecastChart hourlyData={weatherData.hourly} />
            </Suspense>

            <Suspense fallback={<SkeletonBlock height="h-40" />}>
              <HourlyForecast />
            </Suspense>

            <Suspense fallback={<SkeletonBlock height="h-96" />}>
              <DailyForecast />
            </Suspense>

            <Suspense fallback={<SkeletonBlock height="h-64" />}>
              <WeatherDetails />
            </Suspense>

            <Suspense fallback={null}>
              <WeatherQuote />
            </Suspense>
          </motion.div>
        )}
      </main>

      <Toaster
        position="bottom-center"
        toastOptions={{
          style: {
            background: 'rgba(13, 17, 23, 0.9)',
            color: '#f1f5f9',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '16px',
            fontSize: '14px',
          },
        }}
      />
    </div>
  );
}

function SkeletonBlock({ height = 'h-48' }) {
  return (
    <div className={`${height} rounded-2xl shimmer-skeleton`} />
  );
}

function App() {
  return (
    <WeatherProvider>
      <WeatherApp />
    </WeatherProvider>
  );
}

export default App;
