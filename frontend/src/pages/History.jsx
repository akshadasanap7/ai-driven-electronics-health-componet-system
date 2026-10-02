import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { getHistory } from '../services/api';
import TestTable from '../components/TestTable';
import LoadingAnimation from '../components/LoadingAnimation';
import { Search, Filter } from 'lucide-react';

export default function History() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterComponent, setFilterComponent] = useState('all');

  useEffect(() => {
    getHistory()
      .then(setHistory)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const filtered = history.filter(t => {
    const matchSearch = !search ||
      t.component_type.includes(search.toLowerCase()) ||
      String(t.test_id).includes(search);
    const matchStatus = filterStatus === 'all' || t.diagnosis_status === filterStatus;
    const matchComp = filterComponent === 'all' || t.component_type === filterComponent;
    return matchSearch && matchStatus && matchComp;
  });

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-xl font-bold text-white">Test History</h1>
        <p className="text-slate-400 text-sm mt-0.5">{history.length} total tests</p>
      </motion.div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <div className="flex items-center gap-2 glass rounded-lg px-3 py-2 border border-white/8 flex-1 min-w-48">
          <Search size={14} className="text-slate-400" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search tests..."
            className="bg-transparent text-sm text-white placeholder-slate-500 outline-none flex-1"
          />
        </div>
        <select
          value={filterStatus}
          onChange={e => setFilterStatus(e.target.value)}
          className="glass rounded-lg px-3 py-2 border border-white/8 text-sm text-white bg-transparent outline-none"
        >
          <option value="all" className="bg-slate-800">All Status</option>
          <option value="healthy" className="bg-slate-800">Healthy</option>
          <option value="warning" className="bg-slate-800">Warning</option>
          <option value="fault" className="bg-slate-800">Fault</option>
        </select>
        <select
          value={filterComponent}
          onChange={e => setFilterComponent(e.target.value)}
          className="glass rounded-lg px-3 py-2 border border-white/8 text-sm text-white bg-transparent outline-none"
        >
          <option value="all" className="bg-slate-800">All Components</option>
          {['resistor', 'capacitor', 'diode', 'transistor', 'ic'].map(c => (
            <option key={c} value={c} className="bg-slate-800 capitalize">{c}</option>
          ))}
        </select>
      </div>

      <div className="glass rounded-xl border border-white/8 overflow-hidden">
        {loading ? <LoadingAnimation text="Loading history..." /> : <TestTable tests={filtered} />}
      </div>
    </div>
  );
}
