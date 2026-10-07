import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FaStar } from 'react-icons/fa';
import api from '../../api/axios';
import Spinner from '../../components/Spinner';
import StatusBadge from '../../components/StatusBadge';
import { useAuth } from '../../context/AuthContext';
import { naira, formatDate } from '../../utils/format';

export default function VendorDashboard() {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [oRes, pRes] = await Promise.all([
          api.get('/api/orders'),
          api.get('/api/products', { params: { vendor: user._id } }),
        ]);
        setOrders(oRes.data);
        setProducts(pRes.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user._id]);

  if (loading) return <Spinner full />;

  const paidOrders = orders.filter((o) => o.paymentStatus === 'paid');
  const totalSales = paidOrders.reduce((s, o) => s + o.totalAmount, 0);
  const customers = new Set(orders.map((o) => o.buyer?._id || o.buyer)).size;
  const topProducts = [...products].sort((a, b) => b.rating - a.rating).slice(0, 5);
  const recentOrders = orders.slice(0, 5);

  // Build the last 6 months of sales for the chart.
  const monthLabels = [];
  const monthTotals = [];
  const now = new Date();
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
    monthLabels.push(d.toLocaleString('en', { month: 'short' }));
    const total = paidOrders
      .filter((o) => {
        const od = new Date(o.paidAt || o.createdAt);
        return `${od.getFullYear()}-${String(od.getMonth() + 1).padStart(2, '0')}` === key;
      })
      .reduce((s, o) => s + o.totalAmount, 0);
    monthTotals.push(total);
  }
  const maxTotal = Math.max(...monthTotals, 1);

  return (
    <div>
      <h1 className="dash-title">Vendor Dashboard</h1>

      <div className="stat-grid">
        <div className="stat-card card">
          <span className="stat-label">Total Products</span>
          <span className="stat-value">{products.length}</span>
        </div>
        <div className="stat-card card">
          <span className="stat-label">Orders</span>
          <span className="stat-value">{orders.length}</span>
        </div>
        <div className="stat-card card">
          <span className="stat-label">Sales</span>
          <span className="stat-value">{naira(totalSales)}</span>
        </div>
        <div className="stat-card card">
          <span className="stat-label">Customers</span>
          <span className="stat-value">{customers}</span>
        </div>
      </div>

      <div className="dash-section card">
        <h2>Sales (last 6 months)</h2>
        <div className="chart">
          {monthTotals.map((total, i) => (
            <div key={monthLabels[i]} className="chart-col">
              <div className="chart-bar-wrap">
                <div
                  className="chart-bar"
                  style={{ height: `${Math.round((total / maxTotal) * 100)}%` }}
                  title={naira(total)}
                />
              </div>
              <span className="chart-label">{monthLabels[i]}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="dash-grid-2">
        <div className="card">
          <h2>Recent Orders</h2>
          {recentOrders.length === 0 ? (
            <p className="muted">No orders yet.</p>
          ) : (
            <div className="list">
              {recentOrders.map((o) => (
                <div key={o._id} className="list-row">
                  <div>
                    <strong>{o.orderNumber}</strong>
                    <span className="muted">{formatDate(o.createdAt)}</span>
                  </div>
                  <div className="list-row-right">
                    <span>{naira(o.totalAmount)}</span>
                    <StatusBadge status={o.paymentStatus} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="card">
          <h2>Top Products</h2>
          {topProducts.length === 0 ? (
            <p className="muted">No products yet.</p>
          ) : (
            <div className="list">
              {topProducts.map((p) => (
                <div key={p._id} className="list-row">
                  <img src={p.image} alt={p.name} className="list-thumb" />
                  <div>
                    <strong>{p.name}</strong>
                    <span className="muted"><FaStar style={{ color: 'var(--orange)' }} /> {p.rating.toFixed(1)}</span>
                  </div>
                  <span>{naira(p.price)}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <Link to="/vendor/products/new" className="btn btn-orange" style={{ marginTop: 16 }}>
        + Add Product
      </Link>
    </div>
  );
}
