import { motion } from 'framer-motion';

const STAGES = [
  'Initializing',
  'Configuring hardware',
  'Applying test signal',
  'Reading ADC',
  'Processing measurements',
  'Running diagnosis',
  'Generating report',
];

export default function TestProgress({ stage = 0, progress = 0 }) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between text-sm">
        <span className="text-slate-300 font-medium">{STAGES[Math.min(stage, STAGES.length - 1)]}</span>
        <span className="text-blue-400 font-mono">{Math.round(progress)}%</span>
      </div>
      <div className="h-2 bg-white/5 rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-gradient-to-r from-blue-500 to-violet-500 rounded-full"
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.5 }}
        />
      </div>
      <div className="flex gap-1">
        {STAGES.map((s, i) => (
          <div
            key={s}
            className={`flex-1 h-1 rounded-full transition-all duration-500 ${
              i <= stage ? 'bg-blue-500' : 'bg-white/10'
            }`}
          />
        ))}
      </div>
    </div>
  );
}
