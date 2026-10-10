import { useState } from 'react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import PhoneField from '../components/PhoneField';
import { validateName, validatePhone, NAME_HINT, PHONE_HINT } from '../utils/validation';
import { useForm } from '../utils/useForm';

const validate = (values) => ({
  ...(!validateName(values.fullName) ? { fullName: NAME_HINT } : {}),
  ...(values.phone && !validatePhone(values.phone) ? { phone: PHONE_HINT } : {}),
});

export default function Profile() {
  const { user, updateUser } = useAuth();
  const { values: form, handleChange, handleBlur, errorFor, markAllTouched, hasErrors, setField } = useForm({
    fullName: user?.fullName || '',
    phone: user?.phone || '',
    address: user?.address || '',
    storeName: user?.storeName || '',
    storeDescription: user?.storeDescription || '',
  }, validate);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    markAllTouched();
    if (hasErrors) return;

    setLoading(true);
    try {
      const res = await api.put('/api/auth/profile', form);
      updateUser(res.data.user);
      setMessage('Profile updated successfully');
    } catch (err) {
      setError(err.response?.data?.message || 'Update failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1 className="dash-title">{user?.role === 'vendor' ? 'Store Profile' : 'Profile'}</h1>

      {message && <div className="alert alert-success">{message}</div>}
      {error && <div className="alert alert-danger">{error}</div>}

      <form className="card form-card" onSubmit={handleSubmit} noValidate>
        <label className="field">
          <span>Full name</span>
          <input type="text" name="fullName" className={`input ${errorFor('fullName') ? 'input-error' : ''}`} value={form.fullName} onChange={handleChange} onBlur={handleBlur} />
          {errorFor('fullName') && <small className="field-error">{errorFor('fullName')}</small>}
        </label>

        {user?.role === 'vendor' && (
          <>
            <label className="field">
              <span>Store name</span>
              <input type="text" name="storeName" className="input" value={form.storeName} onChange={handleChange} />
            </label>
            <label className="field">
              <span>Store description</span>
              <textarea name="storeDescription" className="input" rows="3" value={form.storeDescription} onChange={handleChange} />
            </label>
          </>
        )}

        <PhoneField
          label="Phone (with country code)"
          value={form.phone}
          onChange={(phone) => setField('phone', phone)}
          onBlur={handleBlur}
          error={errorFor('phone')}
        />
        <label className="field">
          <span>Address</span>
          <input type="text" name="address" className="input" value={form.address} onChange={handleChange} />
        </label>

        <button className="btn btn-orange" disabled={loading}>
          {loading ? 'Saving...' : 'Save changes'}
        </button>
      </form>
    </div>
  );
}
