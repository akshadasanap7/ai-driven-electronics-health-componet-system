export const fmt = {
  voltage: (v) => v != null ? `${Number(v).toFixed(3)} V` : '—',
  current: (v) => v != null ? `${(Number(v) * 1000).toFixed(2)} mA` : '—',
  resistance: (v) => v != null ? `${Number(v).toFixed(2)} Ω` : '—',
  capacitance: (v) => v != null ? `${Number(v).toFixed(2)} µF` : '—',
  temperature: (v) => v != null ? `${Number(v).toFixed(1)} °C` : '—',
  score: (v) => v != null ? `${Number(v).toFixed(1)}` : '—',
  percent: (v) => v != null ? `${Number(v).toFixed(2)}%` : '—',
  date: (d) => d ? new Date(d).toLocaleString() : '—',
};

export const statusColor = (s) => ({
  healthy: 'text-green-400',
  warning: 'text-yellow-400',
  fault: 'text-red-400',
  completed: 'text-green-400',
  running: 'text-blue-400',
  created: 'text-slate-400',
  failed: 'text-red-400',
}[s?.toLowerCase()] || 'text-slate-400');

export const statusBg = (s) => ({
  healthy: 'bg-green-500/10 text-green-400 border-green-500/20',
  warning: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
  fault: 'bg-red-500/10 text-red-400 border-red-500/20',
  completed: 'bg-green-500/10 text-green-400 border-green-500/20',
  running: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  created: 'bg-slate-500/10 text-slate-400 border-slate-500/20',
  failed: 'bg-red-500/10 text-red-400 border-red-500/20',
}[s?.toLowerCase()] || 'bg-slate-500/10 text-slate-400 border-slate-500/20');

export const scoreColor = (score) => {
  if (score >= 90) return '#22c55e';
  if (score >= 70) return '#eab308';
  return '#ef4444';
};
