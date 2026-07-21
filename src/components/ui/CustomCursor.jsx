import { useState, useEffect, useCallback } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import { useWeather } from '../../context/WeatherContext';

const CustomCursor = () => {
  const [visible, setVisible] = useState(false);
  const [hovering, setHovering] = useState(false);
  const { skyConfig } = useWeather();
  const cursorX = useMotionValue(0);
  const cursorY = useMotionValue(0);
  const springX = useSpring(cursorX, { stiffness: 500, damping: 28 });
  const springY = useSpring(cursorY, { stiffness: 500, damping: 28 });

  const getCursorColor = useCallback(() => {
    if (!skyConfig) return 'rgba(34, 211, 238, 0.6)';
    const state = skyConfig.weatherState;
    switch (state) {
      case 'sunny': return 'rgba(251, 191, 36, 0.5)';
      case 'rain': return 'rgba(96, 165, 250, 0.5)';
      case 'thunderstorm': return 'rgba(167, 139, 250, 0.5)';
      case 'snow': return 'rgba(186, 230, 253, 0.5)';
      case 'fog': return 'rgba(148, 163, 184, 0.5)';
      case 'cloudy': return 'rgba(148, 163, 184, 0.4)';
      default: return skyConfig.timeOfDay === 'night' || skyConfig.timeOfDay === 'late-night'
        ? 'rgba(99, 102, 241, 0.5)'
        : 'rgba(34, 211, 238, 0.5)';
    }
  }, [skyConfig]);

  useEffect(() => {
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    if (isTouchDevice) return;

    const move = (e) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
      if (!visible) setVisible(true);
    };

    const enter = () => setVisible(true);
    const leave = () => setVisible(false);

    const overInteractive = (e) => {
      const target = e.target;
      if (target.closest('button, a, [role="button"], input, textarea, select, [data-cursor-hover]')) {
        setHovering(true);
      }
    };
    const outInteractive = (e) => {
      const target = e.target;
      if (target.closest('button, a, [role="button"], input, textarea, select, [data-cursor-hover]')) {
        setHovering(false);
      }
    };

    window.addEventListener('mousemove', move, { passive: true });
    document.addEventListener('mouseenter', enter);
    document.addEventListener('mouseleave', leave);
    document.addEventListener('mouseover', overInteractive, { passive: true });
    document.addEventListener('mouseout', outInteractive, { passive: true });

    return () => {
      window.removeEventListener('mousemove', move);
      document.removeEventListener('mouseenter', enter);
      document.removeEventListener('mouseleave', leave);
      document.removeEventListener('mouseover', overInteractive);
      document.removeEventListener('mouseout', outInteractive);
    };
  }, [cursorX, cursorY, visible]);

  const color = getCursorColor();

  const isTouchDevice = typeof window !== 'undefined' && ('ontouchstart' in window || navigator.maxTouchPoints > 0);
  if (isTouchDevice) return null;

  return (
    <>
      {/* Main cursor dot */}
      <motion.div
        className="fixed top-0 left-0 z-[9999] pointer-events-none mix-blend-screen hidden md:block"
        style={{
          x: springX,
          y: springY,
          translateX: '-50%',
          translateY: '-50%',
          opacity: visible ? 1 : 0,
        }}
      >
        <motion.div
          animate={{
            width: hovering ? 40 : 8,
            height: hovering ? 40 : 8,
            backgroundColor: hovering ? 'transparent' : color,
            borderColor: color,
            borderWidth: hovering ? 2 : 0,
          }}
          transition={{ type: 'spring', stiffness: 400, damping: 25 }}
          className="rounded-full"
          style={{
            boxShadow: `0 0 ${hovering ? 30 : 15}px ${color}, 0 0 ${hovering ? 60 : 30}px ${color}`,
          }}
        />
      </motion.div>

      {/* Trailing glow */}
      <motion.div
        className="fixed top-0 left-0 z-[9998] pointer-events-none rounded-full mix-blend-screen hidden md:block"
        style={{
          x: useSpring(cursorX, { stiffness: 150, damping: 20 }),
          y: useSpring(cursorY, { stiffness: 150, damping: 20 }),
          translateX: '-50%',
          translateY: '-50%',
          opacity: visible ? 0.3 : 0,
        }}
      >
        <div
          className="w-20 h-20 rounded-full"
          style={{
            background: `radial-gradient(circle, ${color} 0%, transparent 70%)`,
          }}
        />
      </motion.div>
    </>
  );
};

export default CustomCursor;
