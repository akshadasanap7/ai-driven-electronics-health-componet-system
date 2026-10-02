import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { getSystemStatus } from '../services/api';
import { Cpu, Database, Brain, Server, RefreshCw } from 'lucide-react';

const Node = ({ label, icon: Icon, ok, detail, mode }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    whileHover={{ y: -2 }}
    className={`glass rounded-xl p-5 border ${ok ? 'border-green-500/20 glow-green' : 'border-red-500/20 glow-red'}`}
  >
    <div className="flex items-center justify-between mb-3">
      <Icon size={20} className={ok ? 'text-green-400' : 'text-red-400'} />
      <span className={`text-xs font-mono font-bold ${ok ? 'text-green-400' : 'text-red-400'}`}>
        {ok ? 'ONLINE' : 'OFFLINE'}
      </span>
    </div>
    <p className="font-semibold text-white">{label}</p>
    {detail && <p className="text-xs text-slate-400 mt-1">{detail}</p>}
    {mode && <p className="text-xs text-blue-400 mt-1 font-mono">{mode}</p>}
  </motion.div>
);

export default function SystemStatus() {
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(true);

  const refresh = () => {
    setLoading(true);
    getSystemStatus().then(setStatus).catch(() => {}).finally(() => setLoading(false));
  };

  useEffect(() => { refresh(); }, []);

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-white">System Status</h1>
          <p className="text-slate-400 text-sm mt-0.5">Hardware and software component health</p>
        </div>
        <button onClick={refresh} className="flex items-center gap-1.5 px-3 py-2 glass rounded-lg border border-white/8 text-sm text-slate-300 hover:text-white transition-colors">
          <RefreshCw size={14} className={loading ? 'animate-spin' : ''} /> Refresh
        </button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Node label="STM32" icon={Cpu} ok={status?.stm32?.connected ?? false}
          detail="Microcontroller" mode={status?.stm32?.mode?.toUpperCase()} />
        <Node label="Backend" icon={Server} ok={status?.backend?.online ?? false} detail="FastAPI server" />
        <Node label="Database" icon={Database} ok={status?.database?.connected ?? false} detail="SQLite / PostgreSQL" />
        <Node label="AI Engine" icon={Brain} ok={status?.ai_engine?.ready ?? false} detail="Diagnosis engine" mode="RULE-BASED" />
      </div>

      <div className="glass rounded-xl p-5 border border-white/8">
        <h2 className="text-sm font-semibold text-white mb-3">Configuration</h2>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-slate-400">Hardware Mode</span>
            <span className="font-mono text-blue-400">{status?.hardware_mode?.toUpperCase() ?? '—'}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">API Version</span>
            <span className="font-mono text-white">1.0.0</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Diagnosis Engine</span>
            <span className="font-mono text-white">Rule-Based + ML-Ready</span>
          </div>
        </div>
      </div>
    </div>
  );
}
