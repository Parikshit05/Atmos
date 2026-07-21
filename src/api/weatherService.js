import axios from 'axios';

const API_BASE_URL = 'https://api.open-meteo.com/v1';

const weatherApi = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

const CURRENT_PARAMS = [
  'temperature_2m',
  'relative_humidity_2m',
  'apparent_temperature',
  'is_day',
  'precipitation',
  'rain',
  'showers',
  'snowfall',
  'weather_code',
  'cloud_cover',
  'pressure_msl',
  'surface_pressure',
  'wind_speed_10m',
  'wind_direction_10m',
  'wind_gusts_10m',
].join(',');

const HOURLY_PARAMS = [
  'temperature_2m',
  'relative_humidity_2m',
  'dew_point_2m',
  'apparent_temperature',
  'precipitation_probability',
  'precipitation',
  'weather_code',
  'cloud_cover',
  'visibility',
  'wind_speed_10m',
  'uv_index',
  'is_day',
].join(',');

const DAILY_PARAMS = [
  'weather_code',
  'temperature_2m_max',
  'temperature_2m_min',
  'apparent_temperature_max',
  'apparent_temperature_min',
  'sunrise',
  'sunset',
  'uv_index_max',
  'precipitation_sum',
  'precipitation_probability_max',
  'wind_speed_10m_max',
].join(',');

export async function fetchCurrentWeather(lat, lon) {
  try {
    const response = await weatherApi.get('/forecast', {
      params: {
        latitude: lat,
        longitude: lon,
        current: CURRENT_PARAMS,
        hourly: HOURLY_PARAMS,
        daily: DAILY_PARAMS,
        timezone: 'auto',
        forecast_days: 7,
      },
    });
    return transformCurrentData(response.data);
  } catch (error) {
    if (error.name === 'CanceledError' || error.name === 'AbortError') {
      throw new Error('Request was cancelled');
    }
    if (error.response) {
      throw new Error(
        `Weather API error: ${error.response.status} - ${error.response.data?.reason || 'Unknown error'}`
      );
    }
    if (error.code === 'ECONNABORTED') {
      throw new Error('Request timed out. Please check your connection.');
    }
    throw new Error('Failed to fetch weather data. Please try again.');
  }
}

export async function fetchForecast(lat, lon, days = 7) {
  try {
    const response = await weatherApi.get('/forecast', {
      params: {
        latitude: lat,
        longitude: lon,
        hourly: HOURLY_PARAMS,
        daily: DAILY_PARAMS,
        timezone: 'auto',
        forecast_days: days,
      },
    });
    return transformCurrentData(response.data);
  } catch (error) {
    if (error.name === 'CanceledError' || error.name === 'AbortError') {
      throw new Error('Request was cancelled');
    }
    if (error.response) {
      throw new Error(
        `Weather API error: ${error.response.status} - ${error.response.data?.reason || 'Unknown error'}`
      );
    }
    if (error.code === 'ECONNABORTED') {
      throw new Error('Request timed out. Please check your connection.');
    }
    throw new Error('Failed to fetch forecast data. Please try again.');
  }
}

export function transformCurrentData(data) {
  const current = data.current || {};
  const hourly = data.hourly || {};
  const daily = data.daily || {};

  const hourlyData = [];
  if (hourly.time) {
    const now = new Date();
    const startIndex = hourly.time.findIndex((t) => new Date(t) >= now);
    const start = Math.max(0, startIndex);
    const end = Math.min(start + 24, hourly.time.length);

    for (let i = start; i < end; i++) {
      hourlyData.push({
        time: hourly.time[i],
        temp: hourly.temperature_2m?.[i] ?? null,
        humidity: hourly.relative_humidity_2m?.[i] ?? null,
        feelsLike: hourly.apparent_temperature?.[i] ?? null,
        precipProb: hourly.precipitation_probability?.[i] ?? null,
        precip: hourly.precipitation?.[i] ?? null,
        weatherCode: hourly.weather_code?.[i] ?? null,
        cloudCover: hourly.cloud_cover?.[i] ?? null,
        visibility: hourly.visibility?.[i] ?? null,
        windSpeed: hourly.wind_speed_10m?.[i] ?? null,
        uvIndex: hourly.uv_index?.[i] ?? null,
        isDay: hourly.is_day?.[i] ?? 1,
      });
    }
  }

  const dailyData = [];
  if (daily.time) {
    for (let i = 0; i < daily.time.length; i++) {
      dailyData.push({
        date: daily.time[i],
        weatherCode: daily.weather_code?.[i] ?? null,
        tempMax: daily.temperature_2m_max?.[i] ?? null,
        tempMin: daily.temperature_2m_min?.[i] ?? null,
        feelsLikeMax: daily.apparent_temperature_max?.[i] ?? null,
        feelsLikeMin: daily.apparent_temperature_min?.[i] ?? null,
        sunrise: daily.sunrise?.[i] ?? null,
        sunset: daily.sunset?.[i] ?? null,
        uvMax: daily.uv_index_max?.[i] ?? null,
        precipSum: daily.precipitation_sum?.[i] ?? null,
        precipProbMax: daily.precipitation_probability_max?.[i] ?? null,
        windMax: daily.wind_speed_10m_max?.[i] ?? null,
      });
    }
  }

  return {
    temperature: current.temperature_2m ?? null,
    feelsLike: current.apparent_temperature ?? null,
    humidity: current.relative_humidity_2m ?? null,
    pressure: current.pressure_msl ?? null,
    windSpeed: current.wind_speed_10m ?? null,
    windDirection: current.wind_direction_10m ?? null,
    windGusts: current.wind_gusts_10m ?? null,
    cloudCover: current.cloud_cover ?? null,
    visibility: hourlyData.length > 0 ? hourlyData[0].visibility : null,
    uvIndex: hourlyData.length > 0 ? hourlyData[0].uvIndex : null,
    precipitation: current.precipitation ?? null,
    isDay: current.is_day ?? 1,
    weatherCode: current.weather_code ?? null,
    hourly: hourlyData,
    daily: dailyData,
  };
}

export function getUVIndexLevel(uv) {
  if (uv === null || uv === undefined) {
    return { level: 'low', color: '#4CAF50', advice: 'UV data unavailable' };
  }

  if (uv < 3) {
    return {
      level: 'low',
      color: '#4CAF50',
      advice: 'No protection required. Enjoy the outdoors!',
    };
  }
  if (uv < 6) {
    return {
      level: 'moderate',
      color: '#FFC107',
      advice: 'Wear sunscreen, a hat, and seek shade during midday.',
    };
  }
  if (uv < 8) {
    return {
      level: 'high',
      color: '#FF9800',
      advice: 'Reduce sun exposure between 10am-4pm. Use SPF 30+ sunscreen.',
    };
  }
  if (uv < 11) {
    return {
      level: 'very_high',
      color: '#F44336',
      advice: 'Minimize sun exposure. Unprotected skin can burn in minutes.',
    };
  }
  return {
    level: 'extreme',
    color: '#9C27B0',
    advice: 'Avoid sun exposure. Take all precautions - skin damage occurs quickly.',
  };
}

export function getWindDirection(degrees) {
  if (degrees === null || degrees === undefined) return 'N/A';

  const directions = [
    'N', 'NNE', 'NE', 'ENE',
    'E', 'ESE', 'SE', 'SSE',
    'S', 'SSW', 'SW', 'WSW',
    'W', 'WNW', 'NW', 'NNW',
  ];
  const index = Math.round(((degrees % 360) + 360) % 360 / 22.5) % 16;
  return directions[index];
}
