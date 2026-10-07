import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaShoppingBag, FaStore } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import AuthLayout from '../components/AuthLayout';
import { validateName, validatePassword, NAME_HINT, PASSWORD_HINT } from '../utils/validation';

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'buyer',
  });
  const [profilePicture, setProfilePicture] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!validateName(form.fullName)) {
      setError(NAME_HINT);
      return;
    }
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
      const data = new FormData();
      data.append('fullName', form.fullName);
      data.append('email', form.email);
      data.append('password', form.password);
      data.append('confirmPassword', form.confirmPassword);
      data.append('role', form.role);
      if (profilePicture) {
        data.append('profilePicture', profilePicture);
      }

      const user = await register(data);
      navigate(user.role === 'vendor' ? '/vendor' : '/buyer', { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <div className="auth-card card auth-card-wide">
        <div className="auth-brand">
          <div className="brand-name">ROYAL BLIZ</div>
          <div className="brand-tag">SHOP • SELL • GROW</div>
        </div>
        <h2>Create your account</h2>
        <p className="muted">Join as a buyer or a vendor. It's free.</p>

        {error && <div className="alert alert-danger">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="field">
            <span>Account type</span>
            <div className="role-picker">
              <button
                type="button"
                className={form.role === 'buyer' ? 'role-option active' : 'role-option'}
                onClick={() => setForm({ ...form, role: 'buyer' })}
              >
                <FaShoppingBag className="role-icon" />
                <strong>Buyer</strong>
                <small>Shop for products</small>
              </button>
              <button
                type="button"
                className={form.role === 'vendor' ? 'role-option active' : 'role-option'}
                onClick={() => setForm({ ...form, role: 'vendor' })}
              >
                <FaStore className="role-icon" />
                <strong>Vendor</strong>
                <small>Sell your products</small>
              </button>
            </div>
          </div>

          <label className="field">
            <span>Full name</span>
            <input type="text" name="fullName" className="input" required value={form.fullName} onChange={handleChange} />
          </label>
          <label className="field">
            <span>Email</span>
            <input type="email" name="email" className="input" required value={form.email} onChange={handleChange} />
          </label>
          <div className="form-row">
            <label className="field">
              <span>Password</span>
              <input type="password" name="password" className="input" required value={form.password} onChange={handleChange} />
              <small className="muted">Min 8 chars with uppercase, lowercase, number &amp; special character.</small>
            </label>
            <label className="field">
              <span>Confirm password</span>
              <input type="password" name="confirmPassword" className="input" required value={form.confirmPassword} onChange={handleChange} />
            </label>
          </div>
          <label className="field">
            <span>Profile picture (optional)</span>
            <input type="file" accept="image/*" className="input" onChange={(e) => setProfilePicture(e.target.files[0])} />
          </label>

          <button className="btn btn-orange btn-block" disabled={loading}>
            {loading ? 'Creating account...' : 'Create account'}
          </button>
        </form>

        <p className="center muted">
          Already have an account? <Link to="/login" className="link-orange">Log in</Link>
        </p>
      </div>
    </AuthLayout>
  );
}
