import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const LoadingScreen = ({ isLoading }) => {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    if (!isLoading) {
      setPhase(4);
      return;
    }
    const timers = [
      setTimeout(() => setPhase(1), 400),
      setTimeout(() => setPhase(2), 900),
      setTimeout(() => setPhase(3), 1500),
    ];
    return () => timers.forEach(clearTimeout);
  }, [isLoading]);

  return (
    <AnimatePresence>
      {(isLoading || phase < 4) && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
          className="fixed inset-0 z-[100] flex items-center justify-center"
          style={{ background: 'linear-gradient(135deg, #050810 0%, #0a1628 40%, #0f1d35 70%, #0a0e1a 100%)' }}
        >
          {/* Ambient particles */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {Array.from({ length: 40 }, (_, i) => (
              <motion.div
                key={i}
                className="absolute rounded-full"
                style={{
                  width: Math.random() * 3 + 1,
                  height: Math.random() * 3 + 1,
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  background: `rgba(${34 + Math.random() * 100}, ${211 + Math.random() * 40}, ${238}, ${0.1 + Math.random() * 0.3})`,
                }}
                animate={{
                  y: [0, -30 - Math.random() * 40, 0],
                  opacity: [0, 0.8, 0],
                }}
                transition={{
                  duration: 3 + Math.random() * 4,
                  repeat: Infinity,
                  delay: Math.random() * 3,
                  ease: 'easeInOut',
                }}
              />
            ))}
          </div>

          <div className="relative flex flex-col items-center gap-6">
            {/* Cloud icon */}
            <motion.div
              initial={{ opacity: 0, scale: 0.5, y: 20 }}
              animate={phase >= 1 ? { opacity: 1, scale: 1, y: 0 } : {}}
              transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0 }}
            >
              <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="url(#logoGrad)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <defs>
                  <linearGradient id="logoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#22d3ee" />
                    <stop offset="50%" stopColor="#60a5fa" />
                    <stop offset="100%" stopColor="#a78bfa" />
                  </linearGradient>
                </defs>
                <path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z" />
              </svg>
            </motion.div>

            {/* Atmos text */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={phase >= 1 ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1], delay: 0.1 }}
              className="text-5xl md:text-6xl font-extrabold tracking-tight"
              style={{
                background: 'linear-gradient(135deg, #22d3ee 0%, #60a5fa 40%, #a78bfa 80%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              Atmos
            </motion.h1>

            {/* Tagline */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={phase >= 2 ? { opacity: 1 } : {}}
              transition={{ duration: 0.6 }}
              className="text-sm tracking-[0.3em] uppercase"
              style={{ color: 'rgba(148, 163, 184, 0.7)' }}
            >
              Feel the sky
            </motion.p>

            {/* Loading bar */}
            <motion.div
              className="w-48 h-0.5 rounded-full overflow-hidden mt-4"
              style={{ background: 'rgba(255,255,255,0.06)' }}
            >
              <motion.div
                className="h-full rounded-full"
                style={{ background: 'linear-gradient(90deg, #22d3ee, #60a5fa, #a78bfa)' }}
                initial={{ width: '0%' }}
                animate={{ width: isLoading ? '85%' : '100%' }}
                transition={{ duration: isLoading ? 2 : 0.3, ease: 'easeInOut' }}
              />
            </motion.div>

            {/* Loading text */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={phase >= 2 ? { opacity: [0.4, 0.8, 0.4] } : {}}
              transition={{ duration: 2, repeat: Infinity }}
              className="text-xs tracking-widest uppercase"
              style={{ color: 'rgba(100, 116, 139, 0.6)' }}
            >
              {phase < 3 ? 'Initializing sky engine' : 'Preparing your view'}
            </motion.p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default LoadingScreen;
