import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import AuthLayout from '../components/AuthLayout';
import { useForm } from '../utils/useForm';
import { validateEmail, EMAIL_HINT } from '../utils/validation';

const validate = (values) => ({
  ...(!validateEmail(values.email) ? { email: EMAIL_HINT } : {}),
  ...(!values.password.trim() ? { password: 'Enter your password' } : {}),
});

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { values: form, handleChange, handleBlur, errorFor, markAllTouched, hasErrors } =
    useForm({ email: '', password: '' }, validate);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    markAllTouched();
    if (hasErrors) return;
    setError('');
    setLoading(true);
    try {
      const user = await login(form.email, form.password);
      // Redirect according to the role returned by the backend.
      const dest =
        user.role === 'admin' ? '/admin' : user.role === 'vendor' ? '/vendor' : '/buyer';
      navigate(location.state?.from?.pathname || dest, { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
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
        <h2>Welcome back</h2>
        <p className="muted">Log in to your account to continue.</p>

        {error && <div className="alert alert-danger">{error}</div>}

        <form onSubmit={handleSubmit} noValidate>
          <label className="field">
            <span>Email</span>
            <input type="email" name="email" className={`input ${errorFor('email') ? 'input-error' : ''}`} required value={form.email} onChange={handleChange} onBlur={handleBlur} />
            {errorFor('email') && <small className="field-error">{errorFor('email')}</small>}
          </label>
          <label className="field">
            <span>Password</span>
            <input type="password" name="password" className={`input ${errorFor('password') ? 'input-error' : ''}`} required value={form.password} onChange={handleChange} onBlur={handleBlur} />
            {errorFor('password') && <small className="field-error">{errorFor('password')}</small>}
          </label>
          <div className="row-between">
            <span />
            <Link to="/forgot-password" className="link-orange">Forgot password?</Link>
          </div>
          <button className="btn btn-orange btn-block" disabled={loading}>
            {loading ? 'Logging in...' : 'Log in'}
          </button>
        </form>

        <p className="center muted">
          Don't have an account? <Link to="/register" className="link-orange">Sign up</Link>
        </p>
      </div>
    </AuthLayout>
  );
}
