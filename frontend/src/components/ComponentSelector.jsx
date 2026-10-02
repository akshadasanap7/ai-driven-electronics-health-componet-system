import { motion } from 'framer-motion';
import { Cpu, Zap, ToggleLeft, Thermometer, CircuitBoard } from 'lucide-react';

const HW_NODES = [
  { label: 'STM32', icon: Cpu, status: 'active' },
  { label: 'ADC', icon: Zap, status: 'active' },
  { label: 'Relay', icon: ToggleLeft, status: 'active' },
  { label: 'Sensor', icon: Thermometer, status: 'active' },
  { label: 'Component', icon: CircuitBoard, status: 'active' },
];

export default function ComponentSelector({ selected, onSelect }) {
  // Reuse as HW status display when no onSelect provided
  if (!onSelect) {
    return (
      <div className="flex flex-wrap gap-3">
        {HW_NODES.map(({ label, icon: Icon, status }) => (
          <div key={label} className="flex items-center gap-2 px-3 py-2 glass rounded-lg border border-white/8">
            <Icon size={14} className="text-blue-400" />
            <span className="text-xs text-slate-300">{label}</span>
            <span className="status-dot online" />
          </div>
        ))}
      </div>
    );
  }

  const COMPONENTS = [
    { type: 'resistor', label: 'Resistor', symbol: 'Ω', desc: 'Fixed / variable resistor' },
    { type: 'capacitor', label: 'Capacitor', symbol: 'C', desc: 'Electrolytic / ceramic' },
    { type: 'diode', label: 'Diode', symbol: '⊳|', desc: 'Signal / rectifier diode' },
    { type: 'transistor', label: 'Transistor', symbol: 'Q', desc: 'BJT / MOSFET' },
    { type: 'ic', label: 'Digital IC', symbol: 'IC', desc: 'Logic gate / digital IC' },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
      {COMPONENTS.map(c => (
        <motion.button
          key={c.type}
          whileHover={{ y: -3, scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => onSelect(c.type)}
          className={`glass rounded-xl p-4 border text-left transition-all ${
            selected === c.type
              ? 'border-blue-500/60 bg-blue-500/10 glow-blue'
              : 'border-white/8 hover:border-white/20'
          }`}
        >
          <div className="text-2xl font-mono font-bold text-blue-400 mb-2">{c.symbol}</div>
          <p className="text-sm font-semibold text-white">{c.label}</p>
          <p className="text-xs text-slate-400 mt-0.5">{c.desc}</p>
          {selected === c.type && (
            <motion.div
              layoutId="selectedComp"
              className="mt-2 h-0.5 bg-blue-400 rounded-full"
            />
          )}
        </motion.button>
      ))}
    </div>
  );
}
