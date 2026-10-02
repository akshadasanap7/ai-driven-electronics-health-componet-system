import { motion } from 'framer-motion';
import { statusBg } from '../utils/formatters';

export default function StatusBadge({ status }) {
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border ${statusBg(status)}`}>
      <span className={`status-dot ${status?.toLowerCase()}`} />
      {status?.toUpperCase()}
    </span>
  );
}
