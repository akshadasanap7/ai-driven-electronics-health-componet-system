import { motion } from 'framer-motion';
import { Settings as SettingsIcon } from 'lucide-react';

export default function Settings() {
  return (
    <div className="p-6 max-w-2xl mx-auto space-y-6">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-xl font-bold text-white">Settings</h1>
        <p className="text-slate-400 text-sm mt-0.5">Platform configuration</p>
      </motion.div>

      <div className="glass rounded-xl p-5 border border-white/8 space-y-4">
        <h2 className="text-sm font-semibold text-white">Hardware</h2>
        {[
          { label: 'Hardware Mode', value: 'Simulation', note: 'Set HARDWARE_MODE=hardware in backend .env for real STM32' },
          { label: 'Serial Port', value: 'Not configured', note: 'Set SERIAL_PORT in backend .env' },
          { label: 'Baud Rate', value: '115200' },
        ].map(({ label, value, note }) => (
          <div key={label} className="flex items-start justify-between py-2 border-b border-white/5 last:border-0">
            <div>
              <p className="text-sm text-white">{label}</p>
              {note && <p className="text-xs text-slate-500 mt-0.5">{note}</p>}
            </div>
            <span className="text-sm font-mono text-blue-400">{value}</span>
          </div>
        ))}
      </div>

      <div className="glass rounded-xl p-5 border border-white/8 space-y-4">
        <h2 className="text-sm font-semibold text-white">Diagnosis Thresholds</h2>
        {[
          { label: 'Healthy threshold', value: '≥ 90' },
          { label: 'Warning threshold', value: '70 – 89' },
          { label: 'Fault threshold', value: '< 70' },
          { label: 'Max temperature', value: '85 °C' },
          { label: 'Max voltage', value: '30 V' },
          { label: 'Max current', value: '2 A' },
        ].map(({ label, value }) => (
          <div key={label} className="flex justify-between py-1.5 border-b border-white/5 last:border-0 text-sm">
            <span className="text-slate-400">{label}</span>
            <span className="font-mono text-white">{value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
