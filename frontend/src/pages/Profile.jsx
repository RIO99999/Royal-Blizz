import { useState } from 'react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import PhoneField from '../components/PhoneField';
import { validateName, validatePhone, NAME_HINT, PHONE_HINT } from '../utils/validation';

export default function Profile() {
  const { user, updateUser } = useAuth();
  const [form, setForm] = useState({
    fullName: user?.fullName || '',
    phone: user?.phone || '',
    address: user?.address || '',
    storeName: user?.storeName || '',
    storeDescription: user?.storeDescription || '',
  });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    if (!validateName(form.fullName)) {
      setError(NAME_HINT);
      return;
    }
    if (form.phone && !validatePhone(form.phone)) {
      setError(PHONE_HINT);
      return;
    }

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

      <form className="card form-card" onSubmit={handleSubmit}>
        <label className="field">
          <span>Full name</span>
          <input type="text" name="fullName" className="input" value={form.fullName} onChange={handleChange} />
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
          onChange={(phone) => setForm({ ...form, phone })}
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
