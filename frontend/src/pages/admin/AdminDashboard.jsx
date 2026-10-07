import { useEffect, useState } from 'react';
import api from '../../api/axios';
import Spinner from '../../components/Spinner';
import StatusBadge from '../../components/StatusBadge';
import { naira, formatDate } from '../../utils/format';

export default function AdminDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get('/api/admin/dashboard');
        setData(res.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <Spinner full />;
  if (!data) return <div className="empty"><p>Could not load dashboard.</p></div>;

  const stats = [
    { label: 'Users', value: data.totalUsers },
    { label: 'Vendors', value: data.totalVendors },
    { label: 'Products', value: data.totalProducts },
    { label: 'Orders', value: data.totalOrders },
    { label: 'Total Sales', value: naira(data.totalSales) },
  ];

  return (
    <div>
      <h1 className="dash-title">Admin Dashboard</h1>

      <div className="stat-grid">
        {stats.map((s) => (
          <div key={s.label} className="stat-card card">
            <span className="stat-label">{s.label}</span>
            <span className="stat-value">{s.value}</span>
          </div>
        ))}
      </div>

      <div className="dash-grid-2">
        <div className="card">
          <h2>Recent Orders</h2>
          <div className="list">
            {data.recentOrders.map((o) => (
              <div key={o._id} className="list-row">
                <div>
                  <strong>{o.orderNumber}</strong>
                  <span className="muted">{o.buyer?.fullName || '—'} · {formatDate(o.createdAt)}</span>
                </div>
                <div className="list-row-right">
                  <span>{naira(o.totalAmount)}</span>
                  <StatusBadge status={o.paymentStatus} />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <h2>Recent Products</h2>
          <div className="list">
            {data.recentProducts.map((p) => (
              <div key={p._id} className="list-row">
                <img src={p.image} alt={p.name} className="list-thumb" />
                <div>
                  <strong>{p.name}</strong>
                  <span className="muted">{p.vendor?.storeName || p.vendor?.fullName || '—'}</span>
                </div>
                <span>{naira(p.price)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
