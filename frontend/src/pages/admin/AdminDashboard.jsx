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

      <section className="dash-section">
        <h2>Recent Orders</h2>
        <div className="table-wrap">
          <table className="table dashboard-table">
            <thead>
              <tr>
                <th>Order</th>
                <th>Buyer</th>
                <th>Date</th>
                <th>Total</th>
                <th>Payment</th>
              </tr>
            </thead>
            <tbody>
              {data.recentOrders.map((o) => (
                <tr key={o._id}>
                  <td><strong>{o.orderNumber}</strong></td>
                  <td>{o.buyer?.fullName || '—'}</td>
                  <td>{formatDate(o.createdAt)}</td>
                  <td>{naira(o.totalAmount)}</td>
                  <td><StatusBadge status={o.paymentStatus} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="dash-section">
        <h2>Recent Products</h2>
        <div className="table-wrap">
          <table className="table dashboard-table">
            <thead>
              <tr>
                <th>Product</th>
                <th>Vendor</th>
                <th>Price</th>
              </tr>
            </thead>
            <tbody>
              {data.recentProducts.map((p) => (
                <tr key={p._id}>
                  <td>
                    <div className="table-product">
                      <img src={p.image} alt={p.name} />
                      <strong>{p.name}</strong>
                    </div>
                  </td>
                  <td>{p.vendor?.storeName || p.vendor?.fullName || '—'}</td>
                  <td>{naira(p.price)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
