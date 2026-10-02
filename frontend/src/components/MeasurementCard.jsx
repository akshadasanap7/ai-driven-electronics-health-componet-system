import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

export default function MeasurementCard({ label, value, unit, icon: Icon, color = 'blue', trend }) {
  const colors = {
    blue: 'from-blue-500/10 to-blue-600/5 border-blue-500/20 text-blue-400',
    green: 'from-green-500/10 to-green-600/5 border-green-500/20 text-green-400',
    purple: 'from-violet-500/10 to-violet-600/5 border-violet-500/20 text-violet-400',
    orange: 'from-orange-500/10 to-orange-600/5 border-orange-500/20 text-orange-400',
    red: 'from-red-500/10 to-red-600/5 border-red-500/20 text-red-400',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2, scale: 1.01 }}
      className={`glass rounded-xl p-4 border bg-gradient-to-br ${colors[color]}`}
    >
      <div className="flex items-start justify-between mb-3">
        <div className={`p-2 rounded-lg bg-current/10 ${colors[color].split(' ')[3]}`}>
          {Icon && <Icon size={16} />}
        </div>
        {trend !== undefined && (
          <span className="text-xs text-slate-500">
            {trend > 0 ? <TrendingUp size={14} className="text-green-400" /> :
             trend < 0 ? <TrendingDown size={14} className="text-red-400" /> :
             <Minus size={14} className="text-slate-500" />}
          </span>
        )}
      </div>
      <p className="text-xs text-slate-400 mb-1">{label}</p>
      <motion.p
        key={value}
        initial={{ opacity: 0.5, y: 4 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-2xl font-bold text-white font-mono"
      >
        {value ?? '—'}
      </motion.p>
      <p className="text-xs text-slate-500 mt-0.5">{unit}</p>
    </motion.div>
  );
}
