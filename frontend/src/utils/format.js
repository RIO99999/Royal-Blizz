
export const naira = (amount) => {
  return '₦' + Number(amount || 0).toLocaleString('en-NG');
};


export const formatDate = (date) => {
  if (!date) return '—';
  return new Date(date).toLocaleDateString('en-NG', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};


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
