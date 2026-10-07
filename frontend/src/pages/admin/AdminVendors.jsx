import { useEffect, useState } from 'react';
import api from '../../api/axios';
import Spinner from '../../components/Spinner';
import { formatDate } from '../../utils/format';

export default function AdminVendors() {
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchVendors = async () => {
    try {
      const res = await api.get('/api/admin/vendors');
      setVendors(res.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVendors();
  }, []);

  const toggleStatus = async (vendor) => {
    try {
      await api.patch(`/api/admin/vendors/${vendor._id}/status`, { isActive: !vendor.isActive });
      fetchVendors();
    } catch (error) {
      alert(error.response?.data?.message || 'Could not update vendor');
    }
  };

  if (loading) return <Spinner full />;

  return (
    <div>
      <h1 className="dash-title">Vendors</h1>
      {vendors.length === 0 ? (
        <div className="empty"><p>No vendors yet.</p></div>
      ) : (
        <div className="table-wrap">
          <table className="table">
            <thead>
              <tr>
                <th>Store</th>
                <th>Email</th>
                <th>Products</th>
                <th>Status</th>
                <th>Joined</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {vendors.map((v) => (
                <tr key={v._id}>
                  <td>
                    <strong>{v.storeName || v.fullName}</strong>
                    <div className="muted">{v.fullName}</div>
                  </td>
                  <td>{v.email}</td>
                  <td>{v.productCount}</td>
                  <td>
                    <span className={`badge ${v.isActive ? 'badge-success' : 'badge-danger'}`}>
                      {v.isActive ? 'active' : 'deactivated'}
                    </span>
                  </td>
                  <td>{formatDate(v.createdAt)}</td>
                  <td>
                    <button
                      className={v.isActive ? 'btn btn-outline btn-sm' : 'btn btn-orange btn-sm'}
                      onClick={() => toggleStatus(v)}
                    >
                      {v.isActive ? 'Deactivate' : 'Activate'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
