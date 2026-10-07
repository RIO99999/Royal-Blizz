import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FaCheck, FaTruck } from 'react-icons/fa';
import api from '../../api/axios';
import Spinner from '../../components/Spinner';
import StatusBadge from '../../components/StatusBadge';
import { naira, formatDate } from '../../utils/format';

const STATUS_FLOW = ['processing', 'shipped', 'delivered'];

export default function OrderDetails() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await api.get(`/api/orders/${id}`);
        setOrder(res.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [id]);

  const downloadReceipt = async () => {
    try {
      const res = await api.get(`/api/orders/${id}/receipt/download`, { responseType: 'blob' });
      const url = URL.createObjectURL(res.data);
      const a = document.createElement('a');
      a.href = url;
      a.download = `receipt-${order.orderNumber}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch (error) {
      alert(error.response?.data?.message || 'Could not download receipt');
    }
  };

  if (loading) return <Spinner full />;
  if (!order) return <div className="empty"><p>Order not found.</p></div>;

  const history = order.statusHistory || [];
  const at = (status) => {
    const h = history.find((x) => x.status === status);
    return h && h.at ? h.at : '';
  };
  const steps = [
    { label: 'Placed', at: order.createdAt },
    { label: 'Processing', at: at('processing') || order.createdAt },
    { label: 'Shipped', at: at('shipped') },
    { label: 'Delivered', at: at('delivered') },
  ];
  const currentIndex = order.orderStatus === 'cancelled' ? -1 : STATUS_FLOW.indexOf(order.orderStatus) + 1;

  return (
    <div>
      <div className="row-between">
        <h1 className="dash-title">Order {order.orderNumber}</h1>
        <Link to="/buyer/orders" className="link-orange">← Back to orders</Link>
      </div>

      {order.orderStatus === 'cancelled' ? (
        <div className="alert alert-danger">This order has been cancelled.</div>
      ) : (
        <div className="card" style={{ padding: 20, marginBottom: 20 }}>
          <h3 style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <FaTruck style={{ color: 'var(--orange)' }} /> Track your order
          </h3>
          <div className="tracker">
            {steps.map((step, i) => (
              <div
                key={step.label}
                className={`tracker-step ${i < currentIndex ? 'done' : i === currentIndex ? 'current' : ''}`}
              >
                <span className="tracker-dot">
                  {i < currentIndex ? <FaCheck /> : i + 1}
                </span>
                <span className="tracker-label">{step.label}</span>
                {step.at && <span className="tracker-date">{formatDate(step.at)}</span>}
              </div>
            ))}
          </div>
          {order.trackingNumber && (
            <p className="muted" style={{ margin: 0 }}>
              Tracking number: <strong>{order.trackingNumber}</strong>
            </p>
          )}
        </div>
      )}

      <div className="order-grid">
        <div className="card">
          <h3>Items</h3>
          {order.items.map((item, idx) => (
            <div key={idx} className="order-item">
              <img src={item.image} alt={item.name} />
              <div>
                <strong>{item.name}</strong>
                <span className="muted">Qty: {item.quantity}</span>
              </div>
              <span>{naira(item.price * item.quantity)}</span>
            </div>
          ))}
          <div className="summary-row total">
            <span>Total</span>
            <span>{naira(order.totalAmount)}</span>
          </div>
        </div>

        <div className="card">
          <h3>Status</h3>
          <div className="summary-row">
            <span>Payment</span>
            <StatusBadge status={order.paymentStatus} />
          </div>
          <div className="summary-row">
            <span>Order</span>
            <StatusBadge status={order.orderStatus} />
          </div>
          <div className="summary-row">
            <span>Placed</span>
            <span>{formatDate(order.createdAt)}</span>
          </div>
          {order.paidAt && (
            <div className="summary-row">
              <span>Paid</span>
              <span>{formatDate(order.paidAt)}</span>
            </div>
          )}
          {order.receiptNumber && (
            <div className="summary-row">
              <span>Receipt no.</span>
              <span>{order.receiptNumber}</span>
            </div>
          )}
          {order.paymentStatus === 'paid' && (
            <button className="btn btn-navy btn-block" onClick={downloadReceipt}>
              Download Receipt
            </button>
          )}

          <h3 style={{ marginTop: 20 }}>Shipping</h3>
          <p className="muted">
            {order.shippingAddress.name}<br />
            {order.shippingAddress.email}<br />
            {order.shippingAddress.phone}<br />
            {order.shippingAddress.address}
          </p>
        </div>
      </div>
    </div>
  );
}
