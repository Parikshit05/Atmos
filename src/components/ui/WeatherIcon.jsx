import { motion } from 'framer-motion';
import {
  Sun,
  Moon,
  Cloud,
  CloudRain,
  CloudSnow,
  CloudLightning,
  CloudFog,
  CloudDrizzle,
  CloudHail,
  Wind,
  Snowflake,
  CloudSun,
  CloudMoon,
  Thermometer,
} from 'lucide-react';

const sizeMap = {
  sm: 24,
  md: 40,
  lg: 64,
  xl: 96,
  '2xl': 128,
};

const WeatherIcon = ({ code = '113', isDay = true, size = 'lg', className = '' }) => {
  const iconSize = sizeMap[size] || sizeMap.lg;
  const isDaytime = isDay;

  const getIcon = () => {
    const codeStr = String(code);

    if (['113', '116', '119', '122'].includes(codeStr)) {
      if (isDaytime) {
        return <Sun size={iconSize} className="text-amber-400 drop-shadow-lg" />;
      }
      return <Moon size={iconSize} className="text-indigo-300 drop-shadow-lg" />;
    }

    if (['176', '263', '266', '293', '296'].includes(codeStr)) {
      return <CloudDrizzle size={iconSize} className="text-blue-400 drop-shadow-lg" />;
    }

    if (['299', '302', '305', '308', '311', '314'].includes(codeStr)) {
      return <CloudRain size={iconSize} className="text-blue-500 drop-shadow-lg" />;
    }

    if (['317', '320', '323', '326', '329', '332', '335', '338'].includes(codeStr)) {
      return <CloudHail size={iconSize} className="text-cyan-400 drop-shadow-lg" />;
    }

    if (['350', '353', '356', '359'].includes(codeStr)) {
      return <CloudRain size={iconSize} className="text-blue-600 drop-shadow-lg" />;
    }

    if (['362', '365', '368', '371', '374', '377'].includes(codeStr)) {
      return <Snowflake size={iconSize} className="text-cyan-300 drop-shadow-lg" />;
    }

    if (['386', '389', '392', '395'].includes(codeStr)) {
      return <CloudLightning size={iconSize} className="text-yellow-400 drop-shadow-lg" />;
    }

    if (['143', '248', '260'].includes(codeStr)) {
      return <CloudFog size={iconSize} className="text-gray-400 drop-shadow-lg" />;
    }

    if (['200', '386', '389', '392', '395'].includes(codeStr)) {
      return <CloudLightning size={iconSize} className="text-purple-400 drop-shadow-lg" />;
    }

    if (['227', '230', '323', '326', '329', '332', '335', '338', '368', '371', '374', '377'].includes(codeStr)) {
      return <CloudSnow size={iconSize} className="text-white drop-shadow-lg" />;
    }

    if (['179', '182', '185', '227', '230'].includes(codeStr)) {
      return <CloudSnow size={iconSize} className="text-slate-200 drop-shadow-lg" />;
    }

    if (['248', '260'].includes(codeStr)) {
      return <CloudFog size={iconSize} className="text-gray-300 drop-shadow-lg" />;
    }

    if (['119', '122'].includes(codeStr)) {
      return <Cloud size={iconSize} className="text-gray-300 drop-shadow-lg" />;
    }

    if (isDaytime) {
      return <CloudSun size={iconSize} className="text-amber-300 drop-shadow-lg" />;
    }
    return <CloudMoon size={iconSize} className="text-indigo-300 drop-shadow-lg" />;
  };

  return (
    <motion.div
      className={`inline-flex items-center justify-center ${className}`}
      animate={{
        y: [0, -5, 0],
      }}
      transition={{
        duration: 4,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
    >
      {getIcon()}
    </motion.div>
  );
};

export default WeatherIcon;
