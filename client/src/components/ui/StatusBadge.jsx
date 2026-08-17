import { STATUS_LABELS, STATUS_BADGE_CLASS } from '../../utils/constants';

export default function StatusBadge({ status, size = '' }) {
  const cls = STATUS_BADGE_CLASS[status] || 'badge-neutral';
  return <span className={`badge ${cls} ${size} font-medium`}>{STATUS_LABELS[status] || status}</span>;
}
