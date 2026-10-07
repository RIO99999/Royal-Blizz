import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/axios';
import ProductCard from '../../components/ProductCard';
import Spinner from '../../components/Spinner';
import StatusBadge from '../../components/StatusBadge';
import { useCart } from '../../context/CartContext';
import { naira, formatDate } from '../../utils/format';

export default function BuyerDashboard() {
  const [orders, setOrders] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [recommended, setRecommended] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [ordersRes, wishRes, prodRes] = await Promise.all([
          api.get('/api/orders'),
          api.get('/api/wishlist'),
          api.get('/api/products'),
        ]);
        setOrders(ordersRes.data);
        setWishlist(wishRes.data);
        // Recommend the top-rated products.
        setRecommended([...prodRes.data].sort((a, b) => b.rating - a.rating).slice(0, 4));
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <Spinner full />;

  const totalSpent = orders
    .filter((o) => o.paymentStatus === 'paid')
    .reduce((sum, o) => sum + o.totalAmount, 0);
  const recentOrders = orders.slice(0, 5);

  return (
    <div>
      <h1 className="dash-title">Dashboard</h1>

      <div className="stat-grid">
        <div className="stat-card card">
          <span className="stat-label">Total Orders</span>
          <span className="stat-value">{orders.length}</span>
        </div>
        <div className="stat-card card">
          <span className="stat-label">Wishlist</span>
          <span className="stat-value">{wishlist.length}</span>
        </div>
        <div className="stat-card card">
          <span className="stat-label">Total Spent</span>
          <span className="stat-value">{naira(totalSpent)}</span>
        </div>
      </div>

      <div className="dash-section">
        <h2>Recent Orders</h2>
        {recentOrders.length === 0 ? (
          <div className="empty">
            <p>No orders yet.</p>
            <Link to="/shop" className="btn btn-orange">Start Shopping</Link>
          </div>
        ) : (
          <div className="table-wrap">
            <table className="table">
              <thead>
                <tr>
                  <th>Order</th>
                  <th>Date</th>
                  <th>Total</th>
                  <th>Payment</th>
                  <th>Status</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((o) => (
                  <tr key={o._id}>
                    <td>{o.orderNumber}</td>
                    <td>{formatDate(o.createdAt)}</td>
                    <td>{naira(o.totalAmount)}</td>
                    <td><StatusBadge status={o.paymentStatus} /></td>
                    <td><StatusBadge status={o.orderStatus} /></td>
                    <td><Link className="link-orange" to={`/buyer/orders/${o._id}`}>View</Link></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="dash-section">
        <h2>Recommended for you</h2>
        <div className="product-grid">
          {recommended.map((p) => (
            <ProductCard key={p._id} product={p} onAdd={addToCart} />
          ))}
        </div>
      </div>
    </div>
  );
}
