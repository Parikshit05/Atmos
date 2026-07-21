import { motion } from 'framer-motion';

export function CompassRose({ direction, speed, color = '#22d3ee' }) {
  const deg = typeof direction === 'number' ? direction : 0;
  return (
    <div className="relative w-16 h-16">
      <svg viewBox="0 0 64 64" className="w-full h-full">
        <circle cx="32" cy="32" r="30" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="1" />
        <circle cx="32" cy="32" r="22" fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="0.5" />
        {/* Cardinal marks */}
        {[0, 90, 180, 270].map((d) => (
          <line
            key={d}
            x1="32" y1="4" x2="32" y2="8"
            stroke="rgba(255,255,255,0.15)"
            strokeWidth="1"
            transform={`rotate(${d} 32 32)`}
          />
        ))}
        <motion.g
          animate={{ rotate: deg }}
          transition={{ type: 'spring', stiffness: 80, damping: 12 }}
          style={{ transformOrigin: '32px 32px' }}
        >
          <polygon points="32,8 28,28 32,24 36,28" fill={color} opacity="0.9" />
          <polygon points="32,56 28,36 32,40 36,36" fill="rgba(255,255,255,0.2)" />
        </motion.g>
        <circle cx="32" cy="32" r="3" fill={color} opacity="0.6" />
      </svg>
    </div>
  );
}

export function UVGauge({ value = 0, maxValue = 11, color = '#4CAF50' }) {
  const radius = 28;
  const circumference = Math.PI * radius;
  const progress = Math.min(value / maxValue, 1);
  const offset = circumference * (1 - progress);

  const getColor = (val) => {
    if (val < 3) return '#4CAF50';
    if (val < 6) return '#FFC107';
    if (val < 8) return '#FF9800';
    if (val < 11) return '#F44336';
    return '#9C27B0';
  };

  const c = getColor(value);

  return (
    <div className="relative w-16 h-16">
      <svg viewBox="0 0 64 64" className="w-full h-full -rotate-90">
        <path
          d="M 8 48 A 28 28 0 1 1 56 48"
          fill="none"
          stroke="rgba(255,255,255,0.06)"
          strokeWidth="4"
          strokeLinecap="round"
        />
        <motion.path
          d="M 8 48 A 28 28 0 1 1 56 48"
          fill="none"
          stroke={c}
          strokeWidth="4"
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.2, ease: 'easeOut', delay: 0.5 }}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-xs font-bold text-white/80">{typeof value === 'number' ? value.toFixed(1) : '--'}</span>
      </div>
    </div>
  );
}

export function HumidityWave({ value = 0, color = '#60a5fa' }) {
  const height = 16;
  return (
    <div className="relative w-16 h-16 overflow-hidden rounded-xl" style={{ background: 'rgba(255,255,255,0.03)' }}>
      <motion.div
        className="absolute bottom-0 left-0 right-0 rounded-t-lg"
        style={{ background: `${color}22` }}
        initial={{ height: 0 }}
        animate={{ height: `${Math.min(value, 100)}%` }}
        transition={{ duration: 1, ease: 'easeOut', delay: 0.3 }}
      />
      <motion.svg
        viewBox="0 0 64 20"
        className="absolute w-full"
        style={{ bottom: 0 }}
        animate={{ y: [0, -1, 0, 1, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
      >
        <path
          d={`M0 ${20 - (value / 100) * height} Q16 ${18 - (value / 100) * height} 32 ${20 - (value / 100) * height} Q48 ${22 - (value / 100) * height} 64 ${20 - (value / 100) * height} V20 H0 Z`}
          fill={`${color}30`}
        />
      </motion.svg>
      <div className="absolute inset-0 flex items-center justify-center z-10">
        <span className="text-xs font-bold text-white/80">{value != null ? `${value}%` : '--'}</span>
      </div>
    </div>
  );
}

export function SunPathArc({ sunrise, sunset, color = '#fbbf24' }) {
  const now = new Date();
  const sunriseTime = sunrise ? new Date(sunrise) : null;
  const sunsetTime = sunset ? new Date(sunset) : null;

  if (!sunriseTime || !sunsetTime) return null;

  const totalDaylight = sunsetTime - sunriseTime;
  const elapsed = now - sunriseTime;
  const progress = Math.max(0, Math.min(1, elapsed / totalDaylight));

  const isDay = now >= sunriseTime && now <= sunsetTime;

  return (
    <div className="relative w-16 h-16">
      <svg viewBox="0 0 64 64" className="w-full h-full">
        <path
          d="M 8 52 A 28 28 0 0 1 56 52"
          fill="none"
          stroke="rgba(255,255,255,0.06)"
          strokeWidth="1.5"
          strokeDasharray="3,3"
        />
        {isDay && (
          <motion.circle
            r="4"
            fill={color}
            initial={{ opacity: 0 }}
            animate={{
              opacity: 1,
              cx: 8 + progress * 48,
              cy: 52 - Math.sin(progress * Math.PI) * 32,
            }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            <animate attributeName="r" values="4;5;4" dur="2s" repeatCount="indefinite" />
          </motion.circle>
        )}
        <line x1="4" y1="52" x2="60" y2="52" stroke="rgba(255,255,255,0.08)" strokeWidth="1" />
      </svg>
    </div>
  );
}

export function PressureGauge({ value = 1013, min = 970, max = 1050, color = '#a78bfa' }) {
  const radius = 28;
  const circumference = Math.PI * radius;
  const normalized = Math.max(0, Math.min(1, (value - min) / (max - min)));
  const offset = circumference * (1 - normalized * 0.75);

  return (
    <div className="relative w-16 h-16">
      <svg viewBox="0 0 64 64" className="w-full h-full -rotate-90">
        <path
          d="M 8 48 A 28 28 0 1 1 56 48"
          fill="none"
          stroke="rgba(255,255,255,0.06)"
          strokeWidth="4"
          strokeLinecap="round"
        />
        <motion.path
          d="M 8 48 A 28 28 0 1 1 56 48"
          fill="none"
          stroke={color}
          strokeWidth="4"
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.2, ease: 'easeOut', delay: 0.5 }}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-[10px] font-bold text-white/80">{value != null ? Math.round(value) : '--'}</span>
      </div>
    </div>
  );
}
