import { motion } from 'framer-motion';
import { Bell, Wifi } from 'lucide-react';

export default function Navbar({ title }) {
  return (
    <header className="h-14 glass border-b border-white/5 flex items-center justify-between px-6 shrink-0">
      <h1 className="text-sm font-semibold text-slate-200">{title}</h1>
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-1.5 text-xs text-green-400">
          <Wifi size={14} />
          <span className="font-mono">LIVE</span>
        </div>
        <button className="text-slate-400 hover:text-white transition-colors relative">
          <Bell size={18} />
        </button>
        <div className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center text-xs font-bold text-white">
          A
        </div>
      </div>
    </header>
  );
}
