export function weatherCodeToDescription(code) {
  const codes = {
    0: { description: 'Clear sky', icon: 'sun', severity: 'clear' },
    1: { description: 'Mainly clear', icon: 'sun', severity: 'clear' },
    2: { description: 'Partly cloudy', icon: 'cloud', severity: 'mild' },
    3: { description: 'Overcast', icon: 'cloud', severity: 'mild' },
    45: { description: 'Fog', icon: 'cloud-fog', severity: 'moderate' },
    48: { description: 'Depositing rime fog', icon: 'cloud-fog', severity: 'moderate' },
    51: { description: 'Light drizzle', icon: 'cloud-drizzle', severity: 'mild' },
    53: { description: 'Moderate drizzle', icon: 'cloud-drizzle', severity: 'moderate' },
    55: { description: 'Dense drizzle', icon: 'cloud-drizzle', severity: 'moderate' },
    61: { description: 'Slight rain', icon: 'cloud-rain', severity: 'mild' },
    63: { description: 'Moderate rain', icon: 'cloud-rain', severity: 'moderate' },
    65: { description: 'Heavy rain', icon: 'cloud-rain', severity: 'severe' },
    71: { description: 'Slight snow', icon: 'cloud-snow', severity: 'mild' },
    73: { description: 'Moderate snow', icon: 'cloud-snow', severity: 'moderate' },
    75: { description: 'Heavy snow', icon: 'cloud-snow', severity: 'severe' },
    77: { description: 'Snow grains', icon: 'snowflake', severity: 'mild' },
    80: { description: 'Slight rain showers', icon: 'cloud-rain', severity: 'mild' },
    81: { description: 'Moderate rain showers', icon: 'cloud-rain', severity: 'moderate' },
    82: { description: 'Violent rain showers', icon: 'cloud-rain', severity: 'severe' },
    85: { description: 'Slight snow showers', icon: 'cloud-snow', severity: 'mild' },
    86: { description: 'Heavy snow showers', icon: 'cloud-snow', severity: 'severe' },
    95: { description: 'Thunderstorm', icon: 'cloud-lightning', severity: 'severe' },
    96: { description: 'Thunderstorm with slight hail', icon: 'cloud-hail', severity: 'severe' },
    99: { description: 'Thunderstorm with heavy hail', icon: 'cloud-hail', severity: 'severe' },
  };

  return codes[code] || { description: 'Unknown', icon: 'cloud', severity: 'mild' };
}
