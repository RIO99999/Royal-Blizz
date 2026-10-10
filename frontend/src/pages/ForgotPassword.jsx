import { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import AuthLayout from '../components/AuthLayout';
import { useForm } from '../utils/useForm';
import { validateEmail, EMAIL_HINT } from '../utils/validation';

const validate = ({ email }) => (validateEmail(email) ? {} : { email: EMAIL_HINT });

export default function ForgotPassword() {
  const { values, handleChange, handleBlur, errorFor, markAllTouched, hasErrors } =
    useForm({ email: '' }, validate);
  const { email } = values;
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    markAllTouched();
    if (hasErrors) return;
    setError('');
    setMessage('');
    setLoading(true);
    try {
      const res = await api.post('/api/auth/forgot-password', { email });
      setMessage(res.data.message || 'Check your email for a reset link');
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
        <h2>Forgot password</h2>
        <p className="muted">Enter your email and we'll send you a reset link.</p>

        {error && <div className="alert alert-danger">{error}</div>}
        {message && <div className="alert alert-success">{message}</div>}

        <form onSubmit={handleSubmit} noValidate>
          <label className="field">
            <span>Email</span>
            <input type="email" name="email" className={`input ${errorFor('email') ? 'input-error' : ''}`} required value={email} onChange={handleChange} onBlur={handleBlur} />
            {errorFor('email') && <small className="field-error">{errorFor('email')}</small>}
          </label>
          <button className="btn btn-orange btn-block" disabled={loading}>
            {loading ? 'Sending...' : 'Send reset link'}
          </button>
        </form>

        <p className="center muted">
          Remembered it? <Link to="/login" className="link-orange">Log in</Link>
        </p>
      </div>
    </AuthLayout>
  );
}
