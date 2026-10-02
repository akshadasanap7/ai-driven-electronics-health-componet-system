import { useEffect, useState, useRef } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { getReport } from '../services/api';
import { MeasurementChart } from '../components/Charts';
import HealthScore from '../components/HealthScore';
import StatusBadge from '../components/StatusBadge';
import LoadingAnimation from '../components/LoadingAnimation';
import { fmt } from '../utils/formatters';
import { Printer, Download, AlertTriangle, CheckCircle } from 'lucide-react';

export default function Report() {
  const [params] = useSearchParams();
  const testId = params.get('id') ? Number(params.get('id')) : null;
  const nav = useNavigate();
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const printRef = useRef();

  useEffect(() => {
    if (!testId) { setLoading(false); return; }
    getReport(testId)
      .then(setReport)
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }, [testId]);

  const handlePrint = () => window.print();

  if (loading) return <LoadingAnimation text="Generating report..." />;
  if (!testId) return (
    <div className="p-6 text-center text-slate-400">
      No test selected. <button onClick={() => nav('/history')} className="text-blue-400 underline">View history</button>
    </div>
  );

  const d = report?.diagnosis;
  const m = report?.latest_measurement;

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6" ref={printRef}>
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-white">Test Report</h1>
          <p className="text-slate-400 text-sm mt-0.5">#{testId} · Generated {new Date().toLocaleString()}</p>
        </div>
        <div className="flex gap-2">
          <button onClick={handlePrint} className="flex items-center gap-1.5 px-3 py-2 glass rounded-lg border border-white/8 text-sm text-slate-300 hover:text-white transition-colors">
            <Printer size={14} /> Print
          </button>
        </div>
      </motion.div>

      {error && <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-300 text-sm">{error}</div>}

      {report && (
        <>
          {/* Header info */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { label: 'Test ID', value: `#${report.test_id}` },
              { label: 'Component', value: report.component_type, cap: true },
              { label: 'Test Type', value: report.test_type?.replace('_', ' '), cap: true },
              { label: 'Status', value: <StatusBadge status={report.status} /> },
            ].map(({ label, value, cap }) => (
              <div key={label} className="glass rounded-xl p-4 border border-white/8">
                <p className="text-xs text-slate-400 mb-1">{label}</p>
                <p className={`text-sm font-semibold text-white ${cap ? 'capitalize' : ''}`}>{value}</p>
              </div>
            ))}
          </div>

          {/* Measurement summary */}
          <div className="glass rounded-xl p-5 border border-white/8">
            <h2 className="text-sm font-semibold text-white mb-4">Measurement Summary</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {[
                { label: 'Voltage', measured: fmt.voltage(m?.voltage), ref: `${report.expected_value ?? '—'} V` },
                { label: 'Current', measured: fmt.current(m?.current), ref: '—' },
                { label: 'Resistance', measured: fmt.resistance(m?.resistance), ref: report.component_type === 'resistor' ? `${report.expected_value} Ω` : '—' },
                { label: 'Capacitance', measured: fmt.capacitance(m?.capacitance), ref: report.component_type === 'capacitor' ? `${report.expected_value} µF` : '—' },
                { label: 'Temperature', measured: fmt.temperature(m?.temperature), ref: '25.0 °C' },
                { label: 'Tolerance', measured: `±${report.tolerance}%`, ref: '—' },
              ].map(({ label, measured, ref }) => (
                <div key={label} className="space-y-1">
                  <p className="text-xs text-slate-400">{label}</p>
                  <p className="text-sm font-mono text-white">{measured}</p>
                  <p className="text-xs text-slate-500">Ref: {ref}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Diagnosis */}
          {d && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="glass rounded-xl p-5 border border-white/8 flex flex-col items-center justify-center">
                <HealthScore score={d.health_score} size={150} />
              </div>
              <div className="lg:col-span-2 glass rounded-xl p-5 border border-white/8 space-y-3">
                <h2 className="text-sm font-semibold text-white">AI Diagnosis</h2>
                <div className="flex items-center gap-2">
                  {d.fault_detected
                    ? <AlertTriangle size={16} className="text-yellow-400" />
                    : <CheckCircle size={16} className="text-green-400" />}
                  <StatusBadge status={d.status} />
                </div>
                {d.fault_type && (
                  <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20">
                    <p className="text-xs text-red-300 font-medium">Fault</p>
                    <p className="text-sm text-red-200 mt-0.5">{d.fault_type}</p>
                  </div>
                )}
                {d.deviation_percentage != null && (
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400">Deviation</span>
                    <span className="font-mono text-white">{d.deviation_percentage.toFixed(2)}%</span>
                  </div>
                )}
                <div className="p-3 rounded-lg bg-blue-500/10 border border-blue-500/20">
                  <p className="text-xs text-blue-300 font-medium mb-1">Recommendation</p>
                  <p className="text-sm text-blue-200">{d.recommendation}</p>
                </div>
              </div>
            </div>
          )}

          {/* Charts */}
          {report.measurements?.length > 1 && (
            <div>
              <h2 className="text-sm font-semibold text-white mb-3">Measurement Charts</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <MeasurementChart data={report.measurements} dataKey="voltage" color="#60a5fa" label="Voltage" unit="V" />
                <MeasurementChart data={report.measurements} dataKey="resistance" color="#a78bfa" label="Resistance" unit="Ω" />
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
