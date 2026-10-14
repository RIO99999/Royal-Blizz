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

      <section className="dash-section">
        <h2>Recent Orders</h2>
        {recentOrders.length === 0 ? (
          <p className="muted">No orders yet.</p>
        ) : (
          <div className="table-wrap">
            <table className="table dashboard-table">
              <thead>
                <tr>
                  <th>Order</th>
                  <th>Date</th>
                  <th>Total</th>
                  <th>Payment</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((o) => (
                  <tr key={o._id}>
                    <td><strong>{o.orderNumber}</strong></td>
                    <td>{formatDate(o.createdAt)}</td>
                    <td>{naira(o.totalAmount)}</td>
                    <td><StatusBadge status={o.paymentStatus} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <section className="dash-section">
        <h2>Top Products</h2>
        {topProducts.length === 0 ? (
          <p className="muted">No products yet.</p>
        ) : (
          <div className="table-wrap">
            <table className="table dashboard-table">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Rating</th>
                  <th>Price</th>
                </tr>
              </thead>
              <tbody>
                {topProducts.map((p) => (
                  <tr key={p._id}>
                    <td>
                      <div className="table-product">
                        <img src={p.image} alt={p.name} />
                        <strong>{p.name}</strong>
                      </div>
                    </td>
                    <td><FaStar style={{ color: 'var(--orange)' }} /> {p.rating.toFixed(1)}</td>
                    <td>{naira(p.price)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <Link to="/vendor/products/new" className="btn btn-orange" style={{ marginTop: 16 }}>
        + Add Product
      </Link>
    </div>
  );
}
