import { useEffect, useState } from 'react';
import api from '../../api/axios';
import Spinner from '../../components/Spinner';
import StatusBadge from '../../components/StatusBadge';
import { naira, formatDate } from '../../utils/format';

const STATUSES = ['processing', 'shipped', 'delivered', 'cancelled'];

export default function VendorOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await api.get('/api/orders');
        setOrders(res.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const updateStatus = async (orderId, status) => {
    let trackingNumber;
    if (status === 'shipped') {
      trackingNumber = window.prompt('Enter a tracking number (optional):') || '';
    }
    try {
      await api.put(`/api/orders/${orderId}/status`, {
        orderStatus: status,
        ...(trackingNumber !== undefined ? { trackingNumber } : {}),
      });
      setOrders((prev) =>
        prev.map((o) =>
          o._id === orderId
            ? { ...o, orderStatus: status, trackingNumber: trackingNumber !== undefined ? trackingNumber : o.trackingNumber }
            : o
        )
      );
    } catch (error) {
      alert(error.response?.data?.message || 'Could not update status');
    }
  };

  if (loading) return <Spinner full />;

  return (
    <div>
      <h1 className="dash-title">Orders</h1>
      {orders.length === 0 ? (
        <div className="empty"><p>No orders for your products yet.</p></div>
      ) : (
        <div className="table-wrap">
          <table className="table">
            <thead>
              <tr>
                <th>Order</th>
                <th>Customer</th>
                <th>Date</th>
                <th>Total</th>
                <th>Payment</th>
                <th>Order status</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((o) => (
                <tr key={o._id}>
                  <td>{o.orderNumber}</td>
                  <td>{o.buyer?.fullName || '—'}</td>
                  <td>{formatDate(o.createdAt)}</td>
                  <td>{naira(o.totalAmount)}</td>
                  <td><StatusBadge status={o.paymentStatus} /></td>
                  <td>
                    <select
                      className="input input-sm"
                      value={o.orderStatus}
                      onChange={(e) => updateStatus(o._id, e.target.value)}
                    >
                      {STATUSES.map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
