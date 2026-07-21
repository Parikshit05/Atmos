import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

function useCountUp(end, duration = 1.5, decimals = 0) {
  const [display, setDisplay] = useState(0);
  const rafRef = useRef(null);
  const startTimeRef = useRef(null);
  const startValRef = useRef(0);

  useEffect(() => {
    startValRef.current = display;
    startTimeRef.current = null;

    function tick(now) {
      if (!startTimeRef.current) startTimeRef.current = now;
      const elapsed = now - startTimeRef.current;
      const progress = Math.min(elapsed / (duration * 1000), 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = startValRef.current + (end - startValRef.current) * eased;
      setDisplay(current);
      if (progress < 1) {
        rafRef.current = requestAnimationFrame(tick);
      }
    }

    rafRef.current = requestAnimationFrame(tick);
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, [end, duration]);

  return decimals > 0 ? display.toFixed(decimals) : Math.round(display);
}

const AnimatedNumber = ({
  value = 0,
  duration = 1.5,
  decimals = 0,
  suffix = '',
  prefix = '',
  className = '',
}) => {
  const display = useCountUp(value, duration, decimals);

  return (
    <motion.span
      className={`inline-block tabular-nums ${className}`}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {prefix}{display}{suffix}
    </motion.span>
  );
};

export default AnimatedNumber;
