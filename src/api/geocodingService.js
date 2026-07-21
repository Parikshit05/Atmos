import axios from 'axios';

const NOMINATIM_BASE_URL = 'https://nominatim.openstreetmap.org';

const geocodingApi = axios.create({
  baseURL: NOMINATIM_BASE_URL,
  timeout: 10000,
  headers: {
    'Accept': 'application/json',
    'User-Agent': 'AtmosWeatherApp/1.0',
  },
});

let currentSearchController = null;

const cityCache = new Map();
const CACHE_TTL = 5 * 60 * 1000;

function getCachedResult(key) {
  const cached = cityCache.get(key);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.data;
  }
  cityCache.delete(key);
  return null;
}

function setCacheResult(key, data) {
  if (cityCache.size > 100) {
    const oldestKey = cityCache.keys().next().value;
    cityCache.delete(oldestKey);
  }
  cityCache.set(key, { data, timestamp: Date.now() });
}

export async function searchCities(query) {
  if (!query || typeof query !== 'string' || query.trim().length < 2) {
    return [];
  }

  const trimmedQuery = query.trim();

  const cached = getCachedResult(trimmedQuery);
  if (cached) {
    return cached;
  }

  if (currentSearchController) {
    currentSearchController.abort();
  }

  currentSearchController = new AbortController();

  try {
    const response = await geocodingApi.get('/search', {
      params: {
        q: trimmedQuery,
        format: 'json',
        limit: 5,
        addressdetails: 1,
        type: 'city',
      },
      signal: currentSearchController.signal,
    });

    const cities = response.data.map((item) => ({
      name: item.address?.city || item.address?.town || item.address?.village || item.name || 'Unknown',
      lat: parseFloat(item.lat),
      lon: parseFloat(item.lon),
      country: item.address?.country || 'Unknown',
      state: item.address?.state || item.address?.region || '',
      displayName: item.display_name || '',
    }));

    setCacheResult(trimmedQuery, cities);
    return cities;
  } catch (error) {
    if (error.name === 'CanceledError' || error.name === 'AbortError') {
      return [];
    }
    if (error.response) {
      throw new Error(
        `Geocoding API error: ${error.response.status} - ${error.response.data?.error || 'Unknown error'}`
      );
    }
    if (error.code === 'ECONNABORTED') {
      throw new Error('Search request timed out. Please try again.');
    }
    throw new Error('Failed to search cities. Please check your connection.');
  } finally {
    if (currentSearchController && currentSearchController.signal.aborted) {
      currentSearchController = null;
    }
  }
}

export async function reverseGeocode(lat, lon) {
  try {
    const response = await geocodingApi.get('/reverse', {
      params: {
        lat: lat,
        lon: lon,
        format: 'json',
        addressdetails: 1,
      },
    });

    const data = response.data;
    return {
      name: data.address?.city || data.address?.town || data.address?.village || data.name || 'Unknown Location',
      country: data.address?.country || 'Unknown',
      state: data.address?.state || data.address?.region || '',
    };
  } catch (error) {
    if (error.response) {
      throw new Error(
        `Reverse geocoding error: ${error.response.status} - ${error.response.data?.error || 'Unknown error'}`
      );
    }
    if (error.code === 'ECONNABORTED') {
      throw new Error('Reverse geocoding request timed out.');
    }
    throw new Error('Failed to get location name. Please try again.');
  }
}

export function getCurrentLocation() {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation is not supported by your browser.'));
      return;
    }

    const timeoutId = setTimeout(() => {
      reject(new Error('Location request timed out. Please try again.'));
    }, 15000);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        clearTimeout(timeoutId);
        resolve({
          lat: position.coords.latitude,
          lon: position.coords.longitude,
        });
      },
      (error) => {
        clearTimeout(timeoutId);
        switch (error.code) {
          case error.PERMISSION_DENIED:
            reject(new Error('Location permission denied. Please enable location access in your browser settings.'));
            break;
          case error.POSITION_UNAVAILABLE:
            reject(new Error('Location information is unavailable. Please try again.'));
            break;
          case error.TIMEOUT:
            reject(new Error('Location request timed out. Please try again.'));
            break;
          default:
            reject(new Error('An unknown error occurred while getting your location.'));
            break;
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000,
      }
    );
  });
}
