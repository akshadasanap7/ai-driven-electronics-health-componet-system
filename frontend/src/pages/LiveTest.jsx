import { useEffect, useState, useRef } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTestData } from '../hooks/useTestData';
import LiveMeasurement from '../components/LiveMeasurement';
import TestProgress from '../components/TestProgress';
import { MeasurementChart } from '../components/Charts';
import ComponentSelector from '../components/ComponentSelector';
import { Brain, StopCircle } from 'lucide-react';

const STAGE_DURATION = 3000; // ms per stage

export default function LiveTest() {
  const [params] = useSearchParams();
  const testId = params.get('id') ? Number(params.get('id')) : null;
  const nav = useNavigate();

  const [stage, setStage] = useState(0);
  const [progress, setProgress] = useState(0);
  const [active, setActive] = useState(true);
  const [done, setDone] = useState(false);
  const stageRef = useRef(0);

  const { measurements, latest, finalize, error } = useTestData(testId, active && !done);

  // Advance stages automatically
  useEffect(() => {
    if (!testId) return;
    const interval = setInterval(() => {
      setProgress(p => {
        const next = p + 2;
        if (next >= 100) {
          clearInterval(interval);
          setDone(true);
          setActive(false);
          return 100;
        }
        const newStage = Math.floor((next / 100) * 7);
        if (newStage !== stageRef.current) {
          stageRef.current = newStage;
          setStage(newStage);
        }
        return next;
      });
    }, 300);
    return () => clearInterval(interval);
  }, [testId]);

  const handleDiagnose = async () => {
    const d = await finalize();
    if (d) nav(`/diagnosis?id=${testId}`);
  };

  if (!testId) return (
    <div className="p-6 text-center text-slate-400">
      No test selected. <button onClick={() => nav('/new-test')} className="text-blue-400 underline">Start a new test</button>
    </div>
  );

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-white">Live Test</h1>
            {!done && (
              <span className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-400 text-xs font-mono">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
                RUNNING
              </span>
            )}
            {done && (
              <span className="px-2 py-0.5 rounded-full bg-green-500/20 text-green-400 text-xs font-mono">COMPLETE</span>
            )}
          </div>
          <p className="text-slate-400 text-sm mt-0.5">Test ID: #{testId}</p>
        </div>
        {done && (
          <motion.button
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{ scale: 1.03 }}
            onClick={handleDiagnose}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-violet-600 to-blue-600 text-white text-sm font-semibold"
          >
            <Brain size={16} />
            Run AI Diagnosis
          </motion.button>
        )}
      </motion.div>

      {/* Progress */}
      <div className="glass rounded-xl p-5 border border-white/8">
        <TestProgress stage={stage} progress={progress} />
      </div>

      {/* Hardware nodes */}
      <div className="glass rounded-xl p-4 border border-white/8">
        <p className="text-xs text-slate-400 mb-3 font-medium">Hardware State</p>
        <ComponentSelector />
      </div>

      {/* Live measurements */}
      <LiveMeasurement measurement={latest} />

      {/* Charts */}
      {measurements.length > 1 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <MeasurementChart data={measurements} dataKey="voltage" color="#60a5fa" label="Voltage" unit="V" />
          <MeasurementChart data={measurements} dataKey="current" color="#34d399" label="Current" unit="A" />
          <MeasurementChart data={measurements} dataKey="resistance" color="#a78bfa" label="Resistance" unit="Ω" />
          <MeasurementChart data={measurements} dataKey="temperature" color="#f87171" label="Temperature" unit="°C" />
        </div>
      )}

      {error && (
        <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-300 text-sm">{error}</div>
      )}
    </div>
  );
}
