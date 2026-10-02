import { NavLink } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, FlaskConical, Activity, Brain,
  History, FileText, Cpu, Settings, ChevronLeft, Zap
} from 'lucide-react';

const links = [
  { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/new-test', icon: FlaskConical, label: 'New Test' },
  { to: '/live-test', icon: Activity, label: 'Live Test' },
  { to: '/diagnosis', icon: Brain, label: 'AI Diagnosis' },
  { to: '/history', icon: History, label: 'Test History' },
  { to: '/report', icon: FileText, label: 'Reports' },
  { to: '/system', icon: Cpu, label: 'System Status' },
  { to: '/settings', icon: Settings, label: 'Settings' },
];

export default function Sidebar({ open, onToggle }) {
  return (
    <motion.aside
      animate={{ width: open ? 240 : 64 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      className="h-screen flex flex-col glass border-r border-white/5 overflow-hidden shrink-0 z-20"
    >
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 py-5 border-b border-white/5">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center shrink-0">
          <Zap size={16} className="text-white" />
        </div>
        <AnimatePresence>
          {open && (
            <motion.span
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              className="text-sm font-semibold text-white whitespace-nowrap"
            >
              CompIntel
            </motion.span>
          )}
        </AnimatePresence>
        <motion.button
          onClick={onToggle}
          className="ml-auto text-slate-400 hover:text-white transition-colors"
          animate={{ rotate: open ? 0 : 180 }}
        >
          <ChevronLeft size={16} />
        </motion.button>
      </div>

      {/* Nav */}
      <nav className="flex-1 py-4 space-y-1 px-2 overflow-y-auto">
        {links.map(({ to, icon: Icon, label }) => (
          <NavLink key={to} to={to} end={to === '/'}>
            {({ isActive }) => (
              <motion.div
                whileHover={{ x: 2 }}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer transition-all relative ${
                  isActive
                    ? 'bg-blue-600/20 text-blue-400'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeIndicator"
                    className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-blue-400 rounded-full"
                  />
                )}
                <Icon size={18} className="shrink-0" />
                <AnimatePresence>
                  {open && (
                    <motion.span
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="text-sm font-medium whitespace-nowrap"
                    >
                      {label}
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.div>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Mode badge */}
      <div className="px-3 py-4 border-t border-white/5">
        <AnimatePresence>
          {open ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center gap-2 px-3 py-2 rounded-lg bg-blue-500/10 border border-blue-500/20"
            >
              <span className="status-dot online" />
              <span className="text-xs text-blue-400 font-mono">SIMULATION MODE</span>
            </motion.div>
          ) : (
            <motion.div className="flex justify-center">
              <span className="status-dot online" />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.aside>
  );
}
