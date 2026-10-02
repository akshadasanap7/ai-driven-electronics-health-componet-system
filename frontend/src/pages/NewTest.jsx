import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { createTest, startTest } from '../services/api';
import ComponentSelector from '../components/ComponentSelector';
import { ChevronRight, Play } from 'lucide-react';

const TESTS_BY_COMPONENT = {
  resistor: [
    { type: 'resistance', label: 'Resistance Test', expected: 100, unit: 'Ω' },
    { type: 'voltage', label: 'Voltage Test', expected: 3.3, unit: 'V' },
    { type: 'current', label: 'Current Test', expected: 0.033, unit: 'A' },
  ],
  capacitor: [
    { type: 'capacitance', label: 'Capacitance Test', expected: 100, unit: 'µF' },
    { type: 'voltage', label: 'Voltage Test', expected: 5.0, unit: 'V' },
    { type: 'esr', label: 'ESR Test', expected: 0.5, unit: 'Ω' },
  ],
  diode: [
    { type: 'forward_voltage', label: 'Forward Voltage', expected: 0.7, unit: 'V' },
    { type: 'reverse_leakage', label: 'Reverse Leakage', expected: 0.001, unit: 'mA' },
    { type: 'iv_curve', label: 'I-V Curve', expected: 0.7, unit: 'V' },
  ],
  transistor: [
    { type: 'vbe', label: 'Vbe Test', expected: 0.65, unit: 'V' },
    { type: 'gain', label: 'Current Gain (hFE)', expected: 100, unit: '' },
    { type: 'saturation', label: 'Saturation Test', expected: 0.2, unit: 'V' },
  ],
  ic: [
    { type: 'supply_voltage', label: 'Supply Voltage', expected: 5.0, unit: 'V' },
    { type: 'current_consumption', label: 'Current Consumption', expected: 0.025, unit: 'A' },
    { type: 'logic_levels', label: 'Logic Levels', expected: 5.0, unit: 'V' },
  ],
};

export default function NewTest() {
  const [step, setStep] = useState(0);
  const [component, setComponent] = useState('');
  const [testDef, setTestDef] = useState(null);
  const [config, setConfig] = useState({ expected_value: '', tolerance: 5 });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const nav = useNavigate();

  const handleSelectTest = (t) => {
    setTestDef(t);
    setConfig({ expected_value: t.expected, tolerance: 5 });
    setStep(2);
  };

  const handleStart = async () => {
    setLoading(true);
    setError('');
    try {
      const test = await createTest({
        component_type: component,
        test_type: testDef.type,
        expected_value: Number(config.expected_value),
        tolerance: Number(config.tolerance),
      });
      await startTest(test.id);
      nav(`/live-test?id=${test.id}`);
    } catch (e) {
      setError(e.message);
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-8">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-xl font-bold text-white">New Test</h1>
        <p className="text-slate-400 text-sm mt-1">Configure and start a component test</p>
      </motion.div>

      {/* Step indicator */}
      <div className="flex items-center gap-2">
        {['Select Component', 'Select Test', 'Configure', 'Start'].map((s, i) => (
          <div key={s} className="flex items-center gap-2">
            <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
              i <= step ? 'bg-blue-500 text-white' : 'bg-white/10 text-slate-400'
            }`}>{i + 1}</div>
            <span className={`text-xs hidden sm:block ${i <= step ? 'text-white' : 'text-slate-500'}`}>{s}</span>
            {i < 3 && <ChevronRight size={14} className="text-slate-600" />}
          </div>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {step === 0 && (
          <motion.div key="step0" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
            <h2 className="text-sm font-semibold text-slate-300 mb-4">Step 1 — Select Component</h2>
            <ComponentSelector selected={component} onSelect={(c) => { setComponent(c); setStep(1); }} />
          </motion.div>
        )}

        {step === 1 && (
          <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-semibold text-slate-300">Step 2 — Select Test for <span className="text-blue-400 capitalize">{component}</span></h2>
              <button onClick={() => setStep(0)} className="text-xs text-slate-400 hover:text-white">← Back</button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {(TESTS_BY_COMPONENT[component] || []).map(t => (
                <motion.button
                  key={t.type}
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => handleSelectTest(t)}
                  className="glass rounded-xl p-4 border border-white/8 hover:border-blue-500/40 text-left transition-all"
                >
                  <p className="font-semibold text-white text-sm">{t.label}</p>
                  <p className="text-xs text-slate-400 mt-1">Expected: {t.expected} {t.unit}</p>
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-semibold text-slate-300">Step 3 — Test Configuration</h2>
              <button onClick={() => setStep(1)} className="text-xs text-slate-400 hover:text-white">← Back</button>
            </div>
            <div className="glass rounded-xl p-6 border border-white/8 space-y-5 max-w-md">
              <div>
                <label className="text-xs text-slate-400 block mb-1.5">Expected Value ({testDef?.unit})</label>
                <input
                  type="number"
                  value={config.expected_value}
                  onChange={e => setConfig(c => ({ ...c, expected_value: e.target.value }))}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-500/60"
                />
              </div>
              <div>
                <label className="text-xs text-slate-400 block mb-1.5">Tolerance (%)</label>
                <input
                  type="number"
                  value={config.tolerance}
                  onChange={e => setConfig(c => ({ ...c, tolerance: e.target.value }))}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-500/60"
                />
              </div>
              <div className="pt-2 border-t border-white/5 text-xs text-slate-400 space-y-1">
                <div className="flex justify-between"><span>Component</span><span className="text-white capitalize">{component}</span></div>
                <div className="flex justify-between"><span>Test</span><span className="text-white">{testDef?.label}</span></div>
              </div>
              {error && <p className="text-xs text-red-400 bg-red-500/10 rounded-lg px-3 py-2">{error}</p>}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                onClick={handleStart}
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-violet-600 text-white font-semibold text-sm hover:opacity-90 transition-opacity disabled:opacity-50"
              >
                <Play size={16} />
                {loading ? 'Starting...' : 'START TEST'}
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
