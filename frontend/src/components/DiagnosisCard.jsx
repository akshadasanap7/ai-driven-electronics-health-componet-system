import { motion } from 'framer-motion';
import { AlertTriangle, CheckCircle, XCircle, Lightbulb } from 'lucide-react';
import StatusBadge from './StatusBadge';

const icons = {
  healthy: <CheckCircle size={20} className="text-green-400" />,
  warning: <AlertTriangle size={20} className="text-yellow-400" />,
  fault: <XCircle size={20} className="text-red-400" />,
};

export default function DiagnosisCard({ diagnosis }) {
  if (!diagnosis) return null;
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass rounded-xl p-5 border border-white/8 space-y-4"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {icons[diagnosis.status]}
          <span className="font-semibold text-white">Diagnosis Result</span>
        </div>
        <StatusBadge status={diagnosis.status} />
      </div>

      {diagnosis.fault_type && (
        <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20">
          <p className="text-xs text-red-300 font-medium mb-0.5">Detected Fault</p>
          <p className="text-sm text-red-200">{diagnosis.fault_type}</p>
        </div>
      )}

      {diagnosis.deviation_percentage != null && (
        <div className="flex items-center justify-between text-sm">
          <span className="text-slate-400">Deviation</span>
          <span className="font-mono text-white">{diagnosis.deviation_percentage.toFixed(2)}%</span>
        </div>
      )}

      {diagnosis.recommendation && (
        <div className="p-3 rounded-lg bg-blue-500/10 border border-blue-500/20 flex gap-2">
          <Lightbulb size={16} className="text-blue-400 shrink-0 mt-0.5" />
          <p className="text-sm text-blue-200">{diagnosis.recommendation}</p>
        </div>
      )}
    </motion.div>
  );
}
