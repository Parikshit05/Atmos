function getTimeOfDay(hour, sunrise, sunset) {
  const sh = sunrise.getHours();
  const ss = sunset.getHours();
  const dawnStart = Math.max(sh - 1, 0);
  const morningEnd = sh + 2;
  const noonEnd = 12;
  const afternoonEnd = ss - 2;
  const goldenEnd = ss;
  const sunsetEnd = ss + 1;
  const blueHourEnd = ss + 1.5;

  if (hour >= dawnStart && hour < sh) return 'dawn';
  if (hour >= sh && hour < morningEnd) return 'morning';
  if (hour >= morningEnd && hour < noonEnd) return 'noon';
  if (hour >= noonEnd && hour < afternoonEnd) return 'afternoon';
  if (hour >= afternoonEnd && hour < goldenEnd) return 'golden';
  if (hour >= goldenEnd && hour < sunsetEnd) return 'sunset';
  if (hour >= sunsetEnd && hour < blueHourEnd) return 'blue-hour';
  if (hour >= blueHourEnd || hour < 5) return 'night';
  return 'late-night';
}

function getWeatherState(code) {
  if (code === 0 || code === 1) return 'sunny';
  if (code === 2 || code === 3) return 'cloudy';
  if (code >= 45 && code <= 48) return 'fog';
  if ((code >= 51 && code <= 55) || (code >= 61 && code <= 65) || (code >= 80 && code <= 82)) return 'rain';
  if ((code >= 71 && code <= 77) || (code >= 85 && code <= 86)) return 'snow';
  if (code >= 95 && code <= 99) return 'thunderstorm';
  return 'clear-night';
}

const skyGradients = {
  dawn: { top: '#2D1B4E', middle: '#6B3FA0', bottom: '#F4A261' },
  morning: { top: '#87CEEB', middle: '#B0E0E6', bottom: '#FFFFFF' },
  noon: { top: '#1E90FF', middle: '#4AA8D8', bottom: '#87CEEB' },
  afternoon: { top: '#5B9BD5', middle: '#7EC8E3', bottom: '#B0D4E8' },
  golden: { top: '#D4A574', middle: '#E8913A', bottom: '#FF6B35' },
  sunset: { top: '#4A1942', middle: '#C84B31', bottom: '#FF6B35' },
  'blue-hour': { top: '#0B1354', middle: '#1C2E6B', bottom: '#3A5BA0' },
  night: { top: '#0A0E27', middle: '#141B3D', bottom: '#1A2044' },
  'late-night': { top: '#050812', middle: '#0A0F1F', bottom: '#0E1329' },
};

export function getSkyConfig(code, hour, sunrise, sunset) {
  const timeOfDay = getTimeOfDay(hour, sunrise, sunset);
  const weatherState = getWeatherState(code);
  const skyColors = skyGradients[timeOfDay] || skyGradients.night;

  const isDaytime = hour >= sunrise.getHours() && hour < sunset.getHours();
  const dayLength = sunset.getHours() - sunrise.getHours() || 12;
  const sunProgress = isDaytime
    ? Math.min(1, Math.max(0, (hour - sunrise.getHours()) / dayLength))
    : 0;
  const nightLength = 24 - dayLength;
  const moonProgress = !isDaytime
    ? Math.min(1, Math.max(0, (hour - sunset.getHours()) / nightLength))
    : 0;

  const cloudDensityMap = { sunny: 0.15, cloudy: 0.7, rain: 0.9, thunderstorm: 1, snow: 0.8, fog: 0.6, 'clear-night': 0.05 };
  const rainIntensityMap = { sunny: 0, cloudy: 0.1, rain: 0.7, thunderstorm: 1, snow: 0, fog: 0, 'clear-night': 0 };
  const snowIntensityMap = { sunny: 0, cloudy: 0, rain: 0, thunderstorm: 0, snow: 0.8, fog: 0, 'clear-night': 0 };
  const lightningMap = { sunny: 0, cloudy: 0, rain: 0.15, thunderstorm: 1, snow: 0, fog: 0, 'clear-night': 0 };
  const fogMap = { sunny: 0, cloudy: 0.1, rain: 0.15, thunderstorm: 0, snow: 0.2, fog: 0.9, 'clear-night': 0.3 };

  const particleType = weatherState === 'sunny' && isDaytime ? 'warm' :
    weatherState === 'snow' ? 'cold' :
    weatherState === 'rain' ? 'rain-mist' :
    weatherState === 'fog' ? 'dust' : null;

  const particleCount = particleType === 'warm' ? 30 : particleType === 'cold' ? 0 : particleType === 'rain-mist' ? 20 : 15;

  return {
    timeOfDay,
    weatherState,
    skyColors,
    sunPosition: {
      x: 10 + sunProgress * 80,
      y: isDaytime ? 20 + 60 * Math.sin(sunProgress * Math.PI) : 0,
      opacity: isDaytime && weatherState !== 'thunderstorm' ? 1 : 0,
    },
    moonPosition: {
      x: 20 + moonProgress * 60,
      y: 15 + 30 * Math.sin(moonProgress * Math.PI),
      opacity: !isDaytime && weatherState !== 'thunderstorm' ? 0.9 : 0,
    },
    cloudDensity: cloudDensityMap[weatherState] ?? 0.3,
    rainIntensity: rainIntensityMap[weatherState] ?? 0,
    snowIntensity: snowIntensityMap[weatherState] ?? 0,
    windSpeed: weatherState === 'thunderstorm' ? 0.9 : weatherState === 'rain' ? 0.5 : 0.2,
    lightningFrequency: lightningMap[weatherState] ?? 0,
    fogDensity: fogMap[weatherState] ?? 0,
    starCount: !isDaytime ? (timeOfDay === 'late-night' ? 100 : 60) : 0,
    ambientLight: isDaytime
      ? (timeOfDay === 'noon' ? 1 : timeOfDay === 'dawn' ? 0.4 : 0.7)
      : (timeOfDay === 'blue-hour' ? 0.3 : 0.1),
    temperature: (timeOfDay === 'noon' || timeOfDay === 'afternoon') ? 'warm'
      : (timeOfDay === 'night' || timeOfDay === 'late-night') ? 'cold' : 'cool',
    particleType,
    particleCount,
  };
}
