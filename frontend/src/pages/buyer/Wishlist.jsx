import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/axios';
import ProductCard from '../../components/ProductCard';
import Spinner from '../../components/Spinner';
import { useCart } from '../../context/CartContext';

export default function Wishlist() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();

  const fetchWishlist = async () => {
    try {
      const res = await api.get('/api/wishlist');
      setItems(res.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWishlist();
  }, []);

  const removeItem = async (productId) => {
    try {
      await api.delete(`/api/wishlist/${productId}`);
      setItems((prev) => prev.filter((p) => p._id !== productId));
    } catch (error) {
      console.error(error);
    }
  };

  if (loading) return <Spinner full />;

  return (
    <div>
      <h1 className="dash-title">Wishlist</h1>
      {items.length === 0 ? (
        <div className="empty">
          <p>Your wishlist is empty.</p>
          <Link to="/shop" className="btn btn-orange">Browse Products</Link>
        </div>
      ) : (
        <div className="wishlist-grid">
          {items.map((p) => (
            <div key={p._id} className="card wishlist-card">
              <ProductCard product={p} onAdd={addToCart} />
              <button className="btn btn-outline btn-block" onClick={() => removeItem(p._id)}>
                Remove from wishlist
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
