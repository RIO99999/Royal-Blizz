import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import PhoneField from '../components/PhoneField';
import { validateName, validatePhone, validateEmail, NAME_HINT, PHONE_HINT, EMAIL_HINT } from '../utils/validation';
import { useForm } from '../utils/useForm';
import { naira } from '../utils/format';

const validate = (values) => ({
  ...(!validateName(values.name) ? { name: NAME_HINT } : {}),
  ...(!validateEmail(values.email) ? { email: EMAIL_HINT } : {}),
  ...(!validatePhone(values.phone) ? { phone: PHONE_HINT } : {}),
  ...(!values.address.trim() ? { address: 'Enter your delivery address' } : {}),
});

export default function Checkout() {
  const { cart, subtotal, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const { values: form, handleChange, handleBlur, errorFor, markAllTouched, hasErrors, setField } = useForm({
    name: user?.fullName || '',
    email: user?.email || '',
    phone: user?.phone || '',
    address: user?.address || '',
  }, validate);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handlePay = async (e) => {
    e.preventDefault();
    setError('');
    markAllTouched();
    if (hasErrors) return;

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
        <form className="card checkout-form" onSubmit={handlePay} noValidate>
          <h3>Shipping Details</h3>
          <label className="field">
            <span>Full name</span>
            <input type="text" name="name" className={`input ${errorFor('name') ? 'input-error' : ''}`} required value={form.name} onChange={handleChange} onBlur={handleBlur} />
            {errorFor('name') && <small className="field-error">{errorFor('name')}</small>}
          </label>
          <label className="field">
            <span>Email</span>
            <input type="email" name="email" className={`input ${errorFor('email') ? 'input-error' : ''}`} required value={form.email} onChange={handleChange} onBlur={handleBlur} />
            {errorFor('email') && <small className="field-error">{errorFor('email')}</small>}
          </label>
          <PhoneField
            label="Phone (with country code)"
            value={form.phone}
            onChange={(phone) => setField('phone', phone)}
            onBlur={handleBlur}
            error={errorFor('phone')}
            required
          />
          <label className="field">
            <span>Address</span>
            <textarea name="address" className={`input ${errorFor('address') ? 'input-error' : ''}`} rows="3" required value={form.address} onChange={handleChange} onBlur={handleBlur} />
            {errorFor('address') && <small className="field-error">{errorFor('address')}</small>}
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
