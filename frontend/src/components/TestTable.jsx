import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import StatusBadge from './StatusBadge';
import { fmt } from '../utils/formatters';
import { Eye, Brain, FileText } from 'lucide-react';

export default function TestTable({ tests }) {
  const nav = useNavigate();
  if (!tests?.length) return (
    <div className="text-center py-12 text-slate-500 text-sm">No tests found.</div>
  );

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-white/5 text-slate-400 text-xs">
            <th className="text-left py-3 px-4">ID</th>
            <th className="text-left py-3 px-4">Component</th>
            <th className="text-left py-3 px-4">Test Type</th>
            <th className="text-left py-3 px-4">Health</th>
            <th className="text-left py-3 px-4">Status</th>
            <th className="text-left py-3 px-4">Date</th>
            <th className="text-left py-3 px-4">Actions</th>
          </tr>
        </thead>
        <tbody>
          {tests.map((t, i) => (
            <motion.tr
              key={t.test_id || t.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.03 }}
              className="border-b border-white/5 hover:bg-white/3 transition-colors"
            >
              <td className="py-3 px-4 font-mono text-slate-400">#{t.test_id || t.id}</td>
              <td className="py-3 px-4 capitalize text-white">{t.component_type}</td>
              <td className="py-3 px-4 text-slate-300 capitalize">{(t.test_type || '').replace('_', ' ')}</td>
              <td className="py-3 px-4 font-mono">
                {t.health_score != null ? (
                  <span className={
                    t.health_score >= 90 ? 'text-green-400' :
                    t.health_score >= 70 ? 'text-yellow-400' : 'text-red-400'
                  }>{fmt.score(t.health_score)}</span>
                ) : '—'}
              </td>
              <td className="py-3 px-4">
                <StatusBadge status={t.diagnosis_status || t.status} />
              </td>
              <td className="py-3 px-4 text-slate-400 text-xs">{fmt.date(t.created_at)}</td>
              <td className="py-3 px-4">
                <div className="flex gap-2">
                  <button onClick={() => nav(`/live-test?id=${t.test_id || t.id}`)}
                    className="p-1.5 rounded-lg hover:bg-blue-500/20 text-slate-400 hover:text-blue-400 transition-colors">
                    <Eye size={14} />
                  </button>
                  <button onClick={() => nav(`/diagnosis?id=${t.test_id || t.id}`)}
                    className="p-1.5 rounded-lg hover:bg-violet-500/20 text-slate-400 hover:text-violet-400 transition-colors">
                    <Brain size={14} />
                  </button>
                  <button onClick={() => nav(`/report?id=${t.test_id || t.id}`)}
                    className="p-1.5 rounded-lg hover:bg-green-500/20 text-slate-400 hover:text-green-400 transition-colors">
                    <FileText size={14} />
                  </button>
                </div>
              </td>
            </motion.tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
