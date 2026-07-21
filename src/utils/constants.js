export const API_BASE_URL = 'https://api.open-meteo.com/v1';
export const GEOCODING_URL = 'https://nominatim.openstreetmap.org';

export const DEFAULT_CITY = {
  name: 'London',
  lat: 51.5074,
  lon: -0.1278,
  country: 'UK',
};

export const FAVORITES_KEY = 'atmos-favorites';
export const THEME_KEY = 'atmos-theme';
export const RECENT_SEARCHES_KEY = 'atmos-recent';
export const CACHE_DURATION = 30 * 60 * 1000;

export const ANIMATION_VARIANTS = {
  fadeUp: {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } },
  },
  fadeIn: {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.3 } },
  },
  staggerContainer: {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.08, delayChildren: 0.1 },
    },
  },
  scaleIn: {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.3, ease: 'easeOut' } },
  },
  slideIn: {
    hidden: { opacity: 0, x: -30 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.4, ease: 'easeOut' } },
  },
};
