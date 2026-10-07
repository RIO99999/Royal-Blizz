import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import api from '../api/axios';
import AuthLayout from '../components/AuthLayout';
import { validatePassword, PASSWORD_HINT } from '../utils/validation';

export default function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({ password: '', confirmPassword: '' });
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    if (!validatePassword(form.password)) {
      setError(PASSWORD_HINT);
      return;
    }
    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    setLoading(true);
    try {
      const res = await api.post(`/api/auth/reset-password/${token}`, form);
      setMessage(res.data.message);
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <div className="auth-card card">
        <div className="auth-brand">
          <div className="brand-name">ROYAL BLIZ</div>
          <div className="brand-tag">SHOP • SELL • GROW</div>
        </div>
        <h2>Reset password</h2>
        <p className="muted">Choose a new password for your account.</p>

        {error && <div className="alert alert-danger">{error}</div>}
        {message && <div className="alert alert-success">{message}</div>}

        <form onSubmit={handleSubmit}>
          <label className="field">
            <span>New password</span>
            <input type="password" className="input" required value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })} />
            <small className="muted">Min 8 chars with uppercase, lowercase, number &amp; special character.</small>
          </label>
          <label className="field">
            <span>Confirm new password</span>
            <input type="password" className="input" required value={form.confirmPassword}
              onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })} />
          </label>
          <button className="btn btn-orange btn-block" disabled={loading}>
            {loading ? 'Resetting...' : 'Reset password'}
          </button>
        </form>

        <p className="center muted">
          <Link to="/login" className="link-orange">Back to login</Link>
        </p>
      </div>
    </AuthLayout>
  );
}
