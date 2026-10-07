import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { FaCheck, FaTimes } from 'react-icons/fa';
import api from '../api/axios';
import Spinner from '../components/Spinner';
import { useCart } from '../context/CartContext';
import { naira } from '../utils/format';

export default function PaymentVerify() {
  const [searchParams] = useSearchParams();
  const reference = searchParams.get('reference');
  const { clearCart } = useCart();
  const [state, setState] = useState('loading'); // loading | success | failed
  const [order, setOrder] = useState(null);
  const [message, setMessage] = useState('');

  const downloadReceipt = async () => {
    try {
      const res = await api.get(`/api/orders/${order._id}/receipt/download`, { responseType: 'blob' });
      const url = URL.createObjectURL(res.data);
      const a = document.createElement('a');
      a.href = url;
      a.download = `receipt-${order.orderNumber}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch (err) {
      alert(err.response?.data?.message || 'Could not download receipt');
    }
  };

  useEffect(() => {
    if (!reference) {
      setState('failed');
      setMessage('No payment reference found.');
      return;
    }
    const verify = async () => {
      try {
        const res = await api.get(`/api/payments/verify/${reference}`);
        if (res.data.status) {
          setOrder(res.data.order);
          setState('success');
          clearCart();
        } else {
          setState('failed');
          setMessage(res.data.message || 'Payment was not successful.');
        }
      } catch (err) {
        setState('failed');
        setMessage(err.response?.data?.message || 'Could not verify payment.');
      }
    };
    verify();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reference]);

  if (state === 'loading') {
    return (
      <div className="container page center">
        <Spinner />
        <p>Verifying your payment...</p>
      </div>
    );
  }

  if (state === 'failed') {
    return (
      <div className="container page">
        <div className="card payment-result">
          <div className="result-icon fail"><FaTimes /></div>
          <h2>Payment Failed</h2>
          <p>{message}</p>
          <Link to="/shop" className="btn btn-orange">Back to Shop</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container page">
      <div className="card payment-result">
        <div className="result-icon ok"><FaCheck /></div>
        <h2>Payment Successful</h2>
        <p>Thank you! Your payment has been verified.</p>
        <div className="summary-row">
          <span>Order number</span>
          <strong>{order.orderNumber}</strong>
        </div>
        <div className="summary-row">
          <span>Amount paid</span>
          <strong>{naira(order.totalAmount)}</strong>
        </div>
        <div className="summary-row">
          <span>Status</span>
          <span className="badge badge-success">PAID</span>
        </div>
        <div className="result-actions">
          <button className="btn btn-navy" onClick={downloadReceipt}>Download Receipt</button>
          <Link to="/buyer/orders" className="btn btn-orange">View Orders</Link>
        </div>
      </div>
    </div>
  );
}
