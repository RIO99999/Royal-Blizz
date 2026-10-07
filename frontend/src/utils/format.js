// Format a number as Nigerian Naira.
export const naira = (amount) => {
  return '₦' + Number(amount || 0).toLocaleString('en-NG');
};

// Format a date nicely.
export const formatDate = (date) => {
  if (!date) return '—';
  return new Date(date).toLocaleDateString('en-NG', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

// Status badge color helper (used across dashboards).
export const statusColor = (status) => {
  const map = {
    paid: 'success',
    pending: 'warning',
    failed: 'danger',
    processing: 'warning',
    shipped: 'info',
    delivered: 'success',
    cancelled: 'danger',
  };
  return map[status] || 'neutral';
};
