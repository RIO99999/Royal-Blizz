import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/axios';
import Spinner from '../../components/Spinner';
import { useAuth } from '../../context/AuthContext';
import { naira } from '../../utils/format';

export default function VendorProducts() {
  const { user } = useAuth();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchProducts = async () => {
    try {
      const res = await api.get('/api/products', { params: { vendor: user._id } });
      setProducts(res.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user._id]);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this product?')) return;
    try {
      await api.delete(`/api/products/${id}`);
      setProducts((prev) => prev.filter((p) => p._id !== id));
    } catch (error) {
      alert(error.response?.data?.message || 'Delete failed');
    }
  };

  if (loading) return <Spinner full />;

  return (
    <div>
      <div className="row-between">
        <h1 className="dash-title">My Products</h1>
        <Link to="/vendor/products/new" className="btn btn-orange">+ Add Product</Link>
      </div>

      {products.length === 0 ? (
        <div className="empty">
          <p>You haven't added any products yet.</p>
          <Link to="/vendor/products/new" className="btn btn-orange">Add your first product</Link>
        </div>
      ) : (
        <div className="table-wrap">
          <table className="table">
            <thead>
              <tr>
                <th>Product</th>
                <th>Category</th>
                <th>Price</th>
                <th>Stock</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p._id}>
                  <td>
                    <div className="table-product">
                      <img src={p.image} alt={p.name} />
                      <span>{p.name}</span>
                    </div>
                  </td>
                  <td>{p.category}</td>
                  <td>{naira(p.price)}</td>
                  <td>{p.stock}</td>
                  <td className="table-actions">
                    <Link className="link-orange" to={`/vendor/products/${p._id}/edit`}>Edit</Link>
                    <button className="btn-remove" onClick={() => handleDelete(p._id)}>Delete</button>
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
