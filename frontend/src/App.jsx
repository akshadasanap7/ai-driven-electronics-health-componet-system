import { useState } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import NewTest from './pages/NewTest';
import LiveTest from './pages/LiveTest';
import Diagnosis from './pages/Diagnosis';
import History from './pages/History';
import Report from './pages/Report';
import SystemStatus from './pages/SystemStatus';
import Settings from './pages/Settings';

const PAGE_TITLES = {
  '/': 'Dashboard',
  '/new-test': 'New Test',
  '/live-test': 'Live Test',
  '/diagnosis': 'AI Diagnosis',
  '/history': 'Test History',
  '/report': 'Reports',
  '/system': 'System Status',
  '/settings': 'Settings',
};

function AppLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const location = useLocation();
  const title = PAGE_TITLES[location.pathname] || 'AI Component Intelligence';

  return (
    <div className="flex h-screen overflow-hidden bg-surface-900">
      <Sidebar open={sidebarOpen} onToggle={() => setSidebarOpen(o => !o)} />
      <div className="flex flex-col flex-1 overflow-hidden">
        <Navbar title={title} />
        <main className="flex-1 overflow-y-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
              className="h-full"
            >
              <Routes location={location}>
                <Route path="/" element={<Dashboard />} />
                <Route path="/new-test" element={<NewTest />} />
                <Route path="/live-test" element={<LiveTest />} />
                <Route path="/diagnosis" element={<Diagnosis />} />
                <Route path="/history" element={<History />} />
                <Route path="/report" element={<Report />} />
                <Route path="/system" element={<SystemStatus />} />
                <Route path="/settings" element={<Settings />} />
              </Routes>
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppLayout />
    </BrowserRouter>
  );
}
