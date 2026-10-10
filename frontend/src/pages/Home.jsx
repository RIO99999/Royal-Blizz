import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FaMobileAlt, FaTshirt, FaSpa, FaHome, FaDumbbell, FaGem } from 'react-icons/fa';
import api from '../api/axios';
import ProductCard from '../components/ProductCard';
import Spinner from '../components/Spinner';
import { useCart } from '../context/CartContext';

const CATEGORIES = [
  { name: 'Electronics', icon: FaMobileAlt },
  { name: 'Fashion', icon: FaTshirt },
  { name: 'Beauty', icon: FaSpa },
  { name: 'Home', icon: FaHome },
  { name: 'Sports', icon: FaDumbbell },
  { name: 'Accessories', icon: FaGem },
];

export default function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await api.get('/api/products');
        setProducts(res.data.slice(0, 8));
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  return (
    <div>
      {/* Hero */}
      <section className="hero">
        <div className="container hero-inner">
          <div className="hero-text">
            <span className="hero-eyebrow">Welcome to the marketplace</span>
            <h1>
              Shop. Sell. <span className="text-orange">Grow.</span>
            </h1>
            <p>
              Discover quality products from trusted vendors, or open your own store and start
              selling in minutes.
            </p>
            <div className="hero-actions">
              <Link to="/shop" className="btn btn-orange">Shop Now</Link>
              <Link to="/register" className="btn btn-navy">Become a Vendor</Link>
            </div>
          </div>
        </div>
      </section>

    
      <section className="section">
        <div className="container">
          <h2 className="section-title">Browse Categories</h2>
          <div className="category-grid">
            {CATEGORIES.map((c) => {
              const Icon = c.icon;
              return (
                <Link key={c.name} to={`/shop?category=${c.name}`} className="category-tile">
                  <span className="category-icon"><Icon /></span>
                  <span>{c.name}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

   
      <section className="section section-alt">
        <div className="container">
          <div className="section-head">
            <h2 className="section-title">Featured Products</h2>
            <Link to="/shop" className="link-orange">View all →</Link>
          </div>
          {loading ? (
            <Spinner />
          ) : (
            <div className="product-grid">
              {products.map((p) => (
                <ProductCard key={p._id} product={p} onAdd={addToCart} />
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="section">
        <div className="container value-grid">
          <div className="value-item">
            <h3>Secure Payments</h3>
            <p>Pay safely with Paystack using card, bank or transfer.</p>
          </div>
          <div className="value-item">
            <h3>Trusted Vendors</h3>
            <p>Shop from verified vendors across Nigeria.</p>
          </div>
          <div className="value-item">
            <h3>Instant Receipts</h3>
            <p>Get a professional PDF receipt for every order.</p>
          </div>
        </div>
      </section>
    </div>
  );
}
