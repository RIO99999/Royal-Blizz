export default function StatusBadge({ status }) {
  const map = {
    paid: 'success',
    pending: 'warning',
    failed: 'danger',
    processing: 'warning',
    shipped: 'info',
    delivered: 'success',
    cancelled: 'danger',
  };
  const cls = map[status] || 'neutral';
  return <span className={`badge badge-${cls}`}>{status}</span>;
}
