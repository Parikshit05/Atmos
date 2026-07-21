import { motion } from 'framer-motion';

const GlassCard = ({
  children,
  className = '',
  hover = false,
  glow = false,
  onClick,
  delay = 0,
  ...props
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.6,
        delay,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
      whileHover={hover ? {
        y: -4,
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.35), 0 0 0 1px rgba(255,255,255,0.08)',
      } : undefined}
      className={`backdrop-blur-xl rounded-2xl border border-white/[0.08] ${className}`}
      style={{
        background: 'rgba(255, 255, 255, 0.04)',
        boxShadow: glow
          ? '0 0 40px rgba(34, 211, 238, 0.08), 0 8px 32px rgba(0,0,0,0.2)'
          : '0 8px 32px rgba(0,0,0,0.15)',
      }}
      onClick={onClick}
      {...props}
    >
      {children}
    </motion.div>
  );
};

export default GlassCard;
