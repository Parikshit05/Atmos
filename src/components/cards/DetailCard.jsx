import { motion } from 'framer-motion';

const DetailCard = ({ icon: Icon, label, value, unit, subValue, color = '#22d3ee', delay = 0, visualization: Visualization, visualizationProps = {} }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.5,
        delay,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
      whileHover={{
        y: -4,
        boxShadow: `0 20px 40px -12px ${color}22, 0 0 0 1px ${color}18`,
      }}
      className="backdrop-blur-xl rounded-2xl border border-white/10 p-5 flex flex-col items-center text-center gap-3 transition-colors"
      style={{
        background: 'rgba(255,255,255,0.04)',
      }}
    >
      {Visualization ? (
        <Visualization {...visualizationProps} />
      ) : (
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center"
          style={{ background: `${color}18` }}
        >
          <Icon size={20} style={{ color }} />
        </div>
      )}

      <div className="flex flex-col items-center gap-0.5">
        <div className="flex items-baseline gap-1">
          <span className="text-2xl font-bold tabular-nums tracking-tight text-white">
            {value != null ? value : '--'}
          </span>
          {unit && (
            <span className="text-sm font-medium text-white/40">
              {unit}
            </span>
          )}
        </div>
        {subValue != null && (
          <p className="text-xs text-white/45">
            {subValue}
          </p>
        )}
      </div>

      <p className="text-xs font-medium tracking-wide uppercase mt-auto text-white/35">
        {label}
      </p>
    </motion.div>
  );
};

export { DetailCard };
