import { motion } from 'framer-motion';
import { fmt } from '../utils/formatters';
import { Zap, Gauge, Thermometer, Cpu, Activity } from 'lucide-react';

const PARAMS = [
  { key: 'voltage', label: 'Voltage', icon: Zap, color: 'blue', fmt: fmt.voltage },
  { key: 'current', label: 'Current', icon: Activity, color: 'green', fmt: fmt.current },
  { key: 'resistance', label: 'Resistance', icon: Gauge, color: 'purple', fmt: fmt.resistance },
  { key: 'capacitance', label: 'Capacitance', icon: Cpu, color: 'orange', fmt: fmt.capacitance },
  { key: 'temperature', label: 'Temperature', icon: Thermometer, color: 'red', fmt: fmt.temperature },
];

const colorMap = {
  blue: 'text-blue-400 bg-blue-500/10',
  green: 'text-green-400 bg-green-500/10',
  purple: 'text-violet-400 bg-violet-500/10',
  orange: 'text-orange-400 bg-orange-500/10',
  red: 'text-red-400 bg-red-500/10',
};

export default function LiveMeasurement({ measurement }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
      {PARAMS.map(({ key, label, icon: Icon, color, fmt: f }) => (
        <motion.div
          key={key}
          className="glass rounded-xl p-3 border border-white/8 flex flex-col gap-2"
          whileHover={{ scale: 1.02 }}
        >
          <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${colorMap[color]}`}>
            <Icon size={15} />
          </div>
          <p className="text-xs text-slate-400">{label}</p>
          <motion.p
            key={measurement?.[key]}
            initial={{ opacity: 0.4 }}
            animate={{ opacity: 1 }}
            className="text-lg font-bold font-mono text-white"
          >
            {f(measurement?.[key])}
          </motion.p>
        </motion.div>
      ))}
    </div>
  );
}
