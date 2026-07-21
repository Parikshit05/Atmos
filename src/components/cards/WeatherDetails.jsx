import {
  Droplets,
  Gauge,
  Wind,
  Eye,
  Sun,
  Cloud,
  CloudRain,
  Sunrise,
} from 'lucide-react';
import { useWeather } from '../../context/WeatherContext';
import { getUVIndexLevel, getWindDirection } from '../../api/weatherService';
import { DetailCard } from './DetailCard';
import { formatTime } from '../../utils/timeUtils';
import { CompassRose, UVGauge, HumidityWave, SunPathArc, PressureGauge } from '../ui/WeatherVisualizations';

const WeatherDetails = () => {
  const { weatherData, unit } = useWeather();

  if (!weatherData) return null;

  const {
    humidity,
    pressure,
    windSpeed,
    windDirection,
    windGusts,
    visibility,
    uvIndex,
    cloudCover,
    precipitation,
    daily,
  } = weatherData;

  const uvLevel = getUVIndexLevel(uvIndex);
  const windDir = getWindDirection(windDirection);
  const dewPoint =
    humidity != null && weatherData.temperature != null
      ? Math.round(
          weatherData.temperature - (100 - humidity) / 5
        )
      : null;

  const sunriseTime = daily?.[0]?.sunrise;
  const sunsetTime = daily?.[0]?.sunset;

  const formatVis = (v) => {
    if (v == null) return '--';
    const km = v / 1000;
    return `${km.toFixed(1)}`;
  };

  const formatWindSpeed = (speed) => {
    if (speed == null) return '--';
    if (unit === 'fahrenheit') return `${Math.round(speed * 0.621371)}`;
    return `${Math.round(speed)}`;
  };

  const windUnit = unit === 'fahrenheit' ? 'mph' : 'km/h';

  const cards = [
    {
      icon: Droplets,
      label: 'Humidity',
      value: humidity != null ? `${humidity}` : null,
      unit: '%',
      subValue: dewPoint != null ? `Dew point ${dewPoint}°` : null,
      color: '#60a5fa',
      delay: 0,
      visualization: HumidityWave,
      visualizationProps: { value: humidity, color: '#60a5fa' },
    },
    {
      icon: Gauge,
      label: 'Pressure',
      value: pressure != null ? Math.round(pressure) : null,
      unit: 'hPa',
      subValue: null,
      color: '#a78bfa',
      delay: 0.05,
      visualization: PressureGauge,
      visualizationProps: { value: pressure, color: '#a78bfa' },
    },
    {
      icon: Wind,
      label: 'Wind',
      value: formatWindSpeed(windSpeed),
      unit: windUnit,
      subValue: `${windDir}${windGusts != null ? ` · Gusts ${Math.round(windGusts)}` : ''}`,
      color: '#22d3ee',
      delay: 0.1,
      visualization: CompassRose,
      visualizationProps: { direction: windDirection, speed: windSpeed, color: '#22d3ee' },
    },
    {
      icon: Eye,
      label: 'Visibility',
      value: formatVis(visibility),
      unit: 'km',
      subValue: null,
      color: '#34d399',
      delay: 0.15,
    },
    {
      icon: Sun,
      label: 'UV Index',
      value: uvIndex != null ? Math.round(uvIndex * 10) / 10 : null,
      unit: '',
      subValue: uvLevel.level.charAt(0).toUpperCase() + uvLevel.level.slice(1).replace('_', ' '),
      color: uvLevel.color,
      delay: 0.2,
      visualization: UVGauge,
      visualizationProps: { value: uvIndex, color: uvLevel.color },
    },
    {
      icon: Cloud,
      label: 'Cloud Cover',
      value: cloudCover != null ? `${cloudCover}` : null,
      unit: '%',
      subValue: null,
      color: '#94a3b8',
      delay: 0.25,
    },
    {
      icon: CloudRain,
      label: 'Rain Chance',
      value: precipitation != null ? `${Math.round(precipitation * 10) / 10}` : null,
      unit: 'mm',
      subValue: null,
      color: '#6366f1',
      delay: 0.3,
    },
    {
      icon: Sunrise,
      label: 'Sunrise',
      value: sunriseTime ? formatTime(sunriseTime) : null,
      unit: '',
      subValue: sunsetTime ? `Sunset ${formatTime(sunsetTime)}` : null,
      color: '#fbbf24',
      delay: 0.35,
      visualization: SunPathArc,
      visualizationProps: { sunrise: sunriseTime, sunset: sunsetTime, color: '#fbbf24' },
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
      {cards.map((card) => (
        <DetailCard
          key={card.label}
          icon={card.icon}
          label={card.label}
          value={card.value}
          unit={card.unit}
          subValue={card.subValue}
          color={card.color}
          delay={card.delay}
          visualization={card.visualization}
          visualizationProps={card.visualizationProps}
        />
      ))}
    </div>
  );
};

export { WeatherDetails };
