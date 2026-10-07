import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import PhoneField from '../components/PhoneField';
import { validateName, validatePhone, NAME_HINT, PHONE_HINT } from '../utils/validation';
import { naira } from '../utils/format';

export default function Checkout() {
  const { cart, subtotal, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: user?.fullName || '',
    email: user?.email || '',
    phone: user?.phone || '',
    address: user?.address || '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handlePay = async (e) => {
    e.preventDefault();
    setError('');

    if (!validateName(form.name)) {
      setError(NAME_HINT);
      return;
    }
    if (!validatePhone(form.phone)) {
      setError(PHONE_HINT);
      return;
    }

    setLoading(true);
    try {
      // 1. Create a pending order.
      const items = cart.map((i) => ({ product: i.product, quantity: i.quantity }));
      const orderRes = await api.post('/api/orders', {
        items,
        shippingAddress: form,
      });
      const order = orderRes.data;

      // 2. Initialize Paystack (test mode) on the backend.
      const payRes = await api.post('/api/payments/initialize', { orderId: order._id });

      // 3. Redirect the user to Paystack.
      window.location.href = payRes.data.authorizationUrl;
    } catch (err) {
      setError(err.response?.data?.message || 'Could not start payment');
      setLoading(false);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="container page">
        <div className="empty">
          <h2>Nothing to checkout</h2>
          <button className="btn btn-orange" onClick={() => navigate('/shop')}>Go Shopping</button>
        </div>
      </div>
    );
  }

  return (
    <div className="container page">
      <h1 className="page-title">Checkout</h1>
      {error && <div className="alert alert-danger">{error}</div>}

      <div className="checkout-layout">
        <form className="card checkout-form" onSubmit={handlePay}>
          <h3>Shipping Details</h3>
          <label className="field">
            <span>Full name</span>
            <input type="text" name="name" className="input" required value={form.name} onChange={handleChange} />
          </label>
          <label className="field">
            <span>Email</span>
            <input type="email" name="email" className="input" required value={form.email} onChange={handleChange} />
          </label>
          <PhoneField
            label="Phone (with country code)"
            value={form.phone}
            onChange={(phone) => setForm({ ...form, phone })}
            required
          />
          <label className="field">
            <span>Address</span>
            <textarea name="address" className="input" rows="3" required value={form.address} onChange={handleChange} />
          </label>

          <button className="btn btn-orange btn-block" disabled={loading}>
            {loading ? 'Starting payment...' : `Pay ${naira(subtotal)} with Paystack`}
          </button>
          <p className="muted center small">You will be redirected to Paystack (test mode).</p>
        </form>

        <div className="cart-summary card">
          <h3>Your Order</h3>
          {cart.map((item) => (
            <div key={item.product} className="summary-row">
              <span>{item.name} × {item.quantity}</span>
              <span>{naira(item.price * item.quantity)}</span>
            </div>
          ))}
          <div className="summary-row total">
            <span>Total</span>
            <span>{naira(subtotal)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
