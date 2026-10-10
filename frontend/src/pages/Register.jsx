import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaShoppingBag, FaStore } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import AuthLayout from '../components/AuthLayout';
import { validateName, validatePassword, validateEmail, NAME_HINT, PASSWORD_HINT, EMAIL_HINT } from '../utils/validation';
import { useForm } from '../utils/useForm';

const validate = (values) => ({
  ...(!validateName(values.fullName) ? { fullName: NAME_HINT } : {}),
  ...(!validateEmail(values.email) ? { email: EMAIL_HINT } : {}),
  ...(!validatePassword(values.password) ? { password: PASSWORD_HINT } : {}),
  ...(values.confirmPassword !== values.password ? { confirmPassword: 'Passwords do not match' } : {}),
});

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const { values: form, handleChange, handleBlur, errorFor, markAllTouched, hasErrors, setField } = useForm({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'buyer',
  }, validate);
  const [profilePicture, setProfilePicture] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    markAllTouched();
    if (hasErrors) return;

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

        <form onSubmit={handleSubmit} noValidate>
          <div className="field">
            <span>Account type</span>
            <div className="role-picker">
              <button
                type="button"
                className={form.role === 'buyer' ? 'role-option active' : 'role-option'}
                onClick={() => setField('role', 'buyer')}
              >
                <FaShoppingBag className="role-icon" />
                <strong>Buyer</strong>
                <small>Shop for products</small>
              </button>
              <button
                type="button"
                className={form.role === 'vendor' ? 'role-option active' : 'role-option'}
                onClick={() => setField('role', 'vendor')}
              >
                <FaStore className="role-icon" />
                <strong>Vendor</strong>
                <small>Sell your products</small>
              </button>
            </div>
          </div>

          <label className="field">
            <span>Full name</span>
            <input type="text" name="fullName" className={`input ${errorFor('fullName') ? 'input-error' : ''}`} required value={form.fullName} onChange={handleChange} onBlur={handleBlur} />
            {errorFor('fullName') && <small className="field-error">{errorFor('fullName')}</small>}
          </label>
          <label className="field">
            <span>Email</span>
            <input type="email" name="email" className={`input ${errorFor('email') ? 'input-error' : ''}`} required value={form.email} onChange={handleChange} onBlur={handleBlur} />
            {errorFor('email') && <small className="field-error">{errorFor('email')}</small>}
          </label>
          <div className="form-row">
            <label className="field">
              <span>Password</span>
              <input type="password" name="password" className={`input ${errorFor('password') ? 'input-error' : ''}`} required value={form.password} onChange={handleChange} onBlur={handleBlur} />
              {errorFor('password') && <small className="field-error">{errorFor('password')}</small>}

            </label>
            <label className="field">
              <span>Confirm password</span>
              <input type="password" name="confirmPassword" className={`input ${errorFor('confirmPassword') ? 'input-error' : ''}`} required value={form.confirmPassword} onChange={handleChange} onBlur={handleBlur} />
              {errorFor('confirmPassword') && <small className="field-error">{errorFor('confirmPassword')}</small>}
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
