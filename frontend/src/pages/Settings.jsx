import { useState } from 'react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { formatDate } from '../utils/format';

export default function Settings() {
  const { user, updateUser } = useAuth();
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [fileTouched, setFileTouched] = useState(false);

  const handleUpload = async (e) => {
    e.preventDefault();
    setFileTouched(true);
    if (!file) {
      setError('Please choose an image first');
      return;
    }
    setMessage('');
    setError('');
    setLoading(true);
    try {
      const data = new FormData();
      data.append('profilePicture', file);
      const res = await api.put('/api/auth/profile-picture', data);
      updateUser(res.data.user);
      setFile(null);
      setMessage('Profile picture updated');
    } catch (err) {
      setError(err.response?.data?.message || 'Upload failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1 className="dash-title">Settings</h1>

      {message && <div className="alert alert-success">{message}</div>}
      {error && <div className="alert alert-danger">{error}</div>}

      <div className="settings-grid">
        <div className="card">
          <h3>Profile picture</h3>
          <div className="settings-avatar">
            {user?.profilePicture ? (
              <img src={user.profilePicture} alt="Profile" />
            ) : (
              <span>{(user?.fullName || '?').charAt(0).toUpperCase()}</span>
            )}
          </div>
          <form onSubmit={handleUpload} noValidate>
            <input type="file" accept="image/*" className={`input ${fileTouched && !file ? 'input-error' : ''}`}
              onBlur={() => setFileTouched(true)}
              onChange={(e) => { setFile(e.target.files[0]); setFileTouched(true); }} />
            {fileTouched && !file && <small className="field-error">Choose a profile picture</small>}
            <button className="btn btn-orange btn-block" disabled={loading}>
              {loading ? 'Uploading...' : 'Update picture'}
            </button>
          </form>
        </div>

        <div className="card">
          <h3>Account</h3>
          <div className="summary-row"><span>Name</span><span>{user?.fullName}</span></div>
          <div className="summary-row"><span>Email</span><span>{user?.email}</span></div>
          <div className="summary-row"><span>Role</span><span className="capitalize">{user?.role}</span></div>
          <div className="summary-row"><span>Member since</span><span>{formatDate(user?.createdAt)}</span></div>
          {user?.role === 'vendor' && (
            <div className="summary-row"><span>Store</span><span>{user?.storeName || '—'}</span></div>
          )}
        </div>
      </div>
    </div>
  );
}
