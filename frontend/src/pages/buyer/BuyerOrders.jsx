import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/axios';
import Spinner from '../../components/Spinner';
import StatusBadge from '../../components/StatusBadge';
import { naira, formatDate } from '../../utils/format';

export default function BuyerOrders() {
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

  const downloadReceipt = async (orderId, orderNumber) => {
    try {
      const res = await api.get(`/api/orders/${orderId}/receipt/download`, { responseType: 'blob' });
      const url = URL.createObjectURL(res.data);
      const a = document.createElement('a');
      a.href = url;
      a.download = `receipt-${orderNumber}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch (error) {
      alert(error.response?.data?.message || 'Could not download receipt');
    }
  };

  if (loading) return <Spinner full />;

  return (
    <div>
      <h1 className="dash-title">My Orders</h1>
      {orders.length === 0 ? (
        <div className="empty">
          <p>You have no orders yet.</p>
          <Link to="/shop" className="btn btn-orange">Go Shopping</Link>
        </div>
      ) : (
        <div className="table-wrap">
          <table className="table">
            <thead>
              <tr>
                <th>Order number</th>
                <th>Date</th>
                <th>Total</th>
                <th>Payment status</th>
                <th>Order status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((o) => (
                <tr key={o._id}>
                  <td>{o.orderNumber}</td>
                  <td>{formatDate(o.createdAt)}</td>
                  <td>{naira(o.totalAmount)}</td>
                  <td><StatusBadge status={o.paymentStatus} /></td>
                  <td><StatusBadge status={o.orderStatus} /></td>
                  <td className="table-actions">
                    <Link className="link-orange" to={`/buyer/orders/${o._id}`}>View Order</Link>
                    {o.paymentStatus === 'paid' && (
                      <button className="link-orange" onClick={() => downloadReceipt(o._id, o.orderNumber)}>
                        Download Receipt
                      </button>
                    )}
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
