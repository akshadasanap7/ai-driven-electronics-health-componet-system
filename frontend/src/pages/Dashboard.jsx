import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { getSystemStatus, getHistory } from '../services/api';
import { fmt, statusBg } from '../utils/formatters';
import MeasurementCard from '../components/MeasurementCard';
import TestTable from '../components/TestTable';
import StatusBadge from '../components/StatusBadge';
import { Zap, Activity, Gauge, Cpu, Thermometer, FlaskConical, CheckCircle, AlertTriangle, XCircle } from 'lucide-react';

const StatCard = ({ label, value, icon: Icon, color }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    whileHover={{ y: -2 }}
    className="glass rounded-xl p-5 border border-white/8"
  >
    <div className="flex items-center justify-between mb-3">
      <span className="text-xs text-slate-400">{label}</span>
      <Icon size={16} className={color} />
    </div>
    <motion.p
      key={value}
      initial={{ scale: 0.8 }}
      animate={{ scale: 1 }}
      className="text-3xl font-bold text-white font-mono"
    >
      {value}
    </motion.p>
  </motion.div>
);

export default function Dashboard() {
  const [status, setStatus] = useState(null);
  const [history, setHistory] = useState([]);
  const nav = useNavigate();

  useEffect(() => {
    getSystemStatus().then(setStatus).catch(() => {});
    getHistory().then(setHistory).catch(() => {});
    const t = setInterval(() => getSystemStatus().then(setStatus).catch(() => {}), 5000);
    return () => clearInterval(t);
  }, []);

  const total = history.length;
  const healthy = history.filter(h => h.diagnosis_status === 'healthy').length;
  const faults = history.filter(h => h.diagnosis_status === 'fault').length;
  const components = [...new Set(history.map(h => h.component_type))].length;

  const StatusNode = ({ label, ok, mode }) => (
    <div className="flex items-center justify-between p-3 glass rounded-lg border border-white/8">
      <span className="text-sm text-slate-300">{label}</span>
      <span className={`text-xs font-mono font-semibold ${ok ? 'text-green-400' : 'text-red-400'}`}>
        {mode || (ok ? 'ONLINE' : 'OFFLINE')}
      </span>
    </div>
  );

  return (
    <div className="p-6 space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold gradient-text">AI-Driven Electronic Component Intelligence</h1>
        <p className="text-slate-400 text-sm mt-1">Intelligent testing, measurement and AI-powered component diagnosis</p>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total Tests" value={total} icon={FlaskConical} color="text-blue-400" />
        <StatCard label="Components Tested" value={components} icon={Cpu} color="text-violet-400" />
        <StatCard label="Healthy Components" value={healthy} icon={CheckCircle} color="text-green-400" />
        <StatCard label="Faults Detected" value={faults} icon={XCircle} color="text-red-400" />
      </div>

      {/* System Status */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="glass rounded-xl p-5 border border-white/8 space-y-3">
          <h2 className="text-sm font-semibold text-white mb-4">Live System Status</h2>
          <StatusNode label="STM32" ok={status?.stm32?.connected} mode={status?.stm32?.mode?.toUpperCase()} />
          <StatusNode label="Backend" ok={status?.backend?.online} />
          <StatusNode label="Database" ok={status?.database?.connected} />
          <StatusNode label="AI Engine" ok={status?.ai_engine?.ready} mode="READY" />
        </div>

        {/* Quick measurements */}
        <div className="lg:col-span-2 grid grid-cols-2 sm:grid-cols-3 gap-3">
          {[
            { label: 'Voltage', value: '3.300', unit: 'V', icon: Zap, color: 'blue' },
            { label: 'Current', value: '33.00', unit: 'mA', icon: Activity, color: 'green' },
            { label: 'Resistance', value: '100.0', unit: 'Ω', icon: Gauge, color: 'purple' },
            { label: 'Capacitance', value: '100.0', unit: 'µF', icon: Cpu, color: 'orange' },
            { label: 'Temperature', value: '25.0', unit: '°C', icon: Thermometer, color: 'red' },
          ].map(c => (
            <MeasurementCard key={c.label} {...c} />
          ))}
        </div>
      </div>

      {/* Recent Tests */}
      <div className="glass rounded-xl border border-white/8 overflow-hidden">
        <div className="flex items-center justify-between p-5 border-b border-white/5">
          <h2 className="text-sm font-semibold text-white">Recent Tests</h2>
          <button onClick={() => nav('/history')} className="text-xs text-blue-400 hover:text-blue-300 transition-colors">
            View all →
          </button>
        </div>
        <TestTable tests={history.slice(0, 6)} />
      </div>
    </div>
  );
}
