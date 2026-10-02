import { motion } from 'framer-motion';
import { scoreColor } from '../utils/formatters';

const RADIUS = 54;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

export default function HealthScore({ score, size = 160 }) {
  const color = scoreColor(score ?? 0);
  const pct = (score ?? 0) / 100;
  const offset = CIRCUMFERENCE * (1 - pct);

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} viewBox="0 0 128 128">
          {/* Track */}
          <circle cx="64" cy="64" r={RADIUS} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="10" />
          {/* Progress */}
          <motion.circle
            cx="64" cy="64" r={RADIUS}
            fill="none"
            stroke={color}
            strokeWidth="10"
            strokeLinecap="round"
            strokeDasharray={CIRCUMFERENCE}
            initial={{ strokeDashoffset: CIRCUMFERENCE }}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 1.2, ease: 'easeOut' }}
            transform="rotate(-90 64 64)"
            style={{ filter: `drop-shadow(0 0 8px ${color})` }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <motion.span
            key={score}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-3xl font-bold font-mono"
            style={{ color }}
          >
            {score != null ? Math.round(score) : '—'}
          </motion.span>
          <span className="text-xs text-slate-400">/100</span>
        </div>
      </div>
      <p className="text-xs text-slate-400 font-medium">Health Score</p>
    </div>
  );
}
