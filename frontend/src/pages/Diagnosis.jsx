import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { getDiagnosis, getTest, getMeasurements } from '../services/api';
import HealthScore from '../components/HealthScore';
import DiagnosisCard from '../components/DiagnosisCard';
import StatusBadge from '../components/StatusBadge';
import LoadingAnimation from '../components/LoadingAnimation';
import { fmt } from '../utils/formatters';
import { FileText } from 'lucide-react';

export default function Diagnosis() {
  const [params] = useSearchParams();
  const testId = params.get('id') ? Number(params.get('id')) : null;
  const nav = useNavigate();
  const [diag, setDiag] = useState(null);
  const [test, setTest] = useState(null);
  const [latest, setLatest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!testId) { setLoading(false); return; }
    Promise.all([getDiagnosis(testId), getTest(testId), getMeasurements(testId)])
      .then(([d, t, ms]) => {
        setDiag(d);
        setTest(t);
        if (ms.length) setLatest(ms[ms.length - 1]);
      })
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }, [testId]);

  if (loading) return <LoadingAnimation text="Loading diagnosis..." />;
  if (!testId) return (
    <div className="p-6 text-center text-slate-400">
      No test selected. <button onClick={() => nav('/history')} className="text-blue-400 underline">View history</button>
    </div>
  );

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-xl font-bold text-white">AI Diagnosis</h1>
        <p className="text-slate-400 text-sm mt-0.5">Test #{testId} · <span className="capitalize">{test?.component_type}</span></p>
      </motion.div>

      {error && <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-300 text-sm">{error}</div>}

      {diag && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Health score */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass rounded-xl p-6 border border-white/8 flex flex-col items-center justify-center gap-4"
          >
            <HealthScore score={diag.health_score} size={180} />
            <StatusBadge status={diag.status} />
          </motion.div>

          {/* Measurements summary */}
          <div className="space-y-4">
            <div className="glass rounded-xl p-5 border border-white/8 space-y-3">
              <h3 className="text-sm font-semibold text-white">Measurement Summary</h3>
              {[
                { label: 'Component', value: test?.component_type, capitalize: true },
                { label: 'Test Type', value: test?.test_type?.replace('_', ' '), capitalize: true },
                { label: 'Expected', value: test?.expected_value != null ? `${test.expected_value}` : '—' },
                { label: 'Tolerance', value: `±${test?.tolerance}%` },
                { label: 'Voltage', value: fmt.voltage(latest?.voltage) },
                { label: 'Current', value: fmt.current(latest?.current) },
                { label: 'Resistance', value: fmt.resistance(latest?.resistance) },
                { label: 'Temperature', value: fmt.temperature(latest?.temperature) },
              ].map(({ label, value, capitalize }) => (
                <div key={label} className="flex justify-between text-sm">
                  <span className="text-slate-400">{label}</span>
                  <span className={`text-white font-mono ${capitalize ? 'capitalize' : ''}`}>{value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Diagnosis card */}
          <div>
            <DiagnosisCard diagnosis={diag} />
            <motion.button
              whileHover={{ scale: 1.02 }}
              onClick={() => nav(`/report?id=${testId}`)}
              className="mt-4 w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border border-blue-500/30 text-blue-400 text-sm hover:bg-blue-500/10 transition-all"
            >
              <FileText size={15} />
              View Full Report
            </motion.button>
          </div>
        </div>
      )}
    </div>
  );
}
