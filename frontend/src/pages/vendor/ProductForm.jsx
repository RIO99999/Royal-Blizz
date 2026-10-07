import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../../api/axios';
import Spinner from '../../components/Spinner';

const CATEGORIES = ['Electronics', 'Fashion', 'Beauty', 'Home', 'Sports', 'Accessories'];

export default function ProductForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [form, setForm] = useState({
    name: '',
    description: '',
    price: '',
    category: 'Electronics',
    stock: '',
  });
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isEdit) return;
    const fetchProduct = async () => {
      try {
        const res = await api.get(`/api/products/${id}`);
        const p = res.data;
        setForm({
          name: p.name,
          description: p.description,
          price: p.price,
          category: p.category,
          stock: p.stock,
        });
      } catch (err) {
        setError(err.response?.data?.message || 'Could not load product');
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id, isEdit]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSaving(true);
    try {
      const data = new FormData();
      data.append('name', form.name);
      data.append('description', form.description);
      data.append('price', form.price);
      data.append('category', form.category);
      data.append('stock', form.stock);
      if (image) data.append('image', image);

      if (isEdit) {
        await api.put(`/api/products/${id}`, data);
      } else {
        await api.post('/api/products', data);
      }
      navigate('/vendor/products');
    } catch (err) {
      setError(err.response?.data?.message || 'Could not save product');
      setSaving(false);
    }
  };

  if (loading) return <Spinner full />;

  return (
    <div>
      <h1 className="dash-title">{isEdit ? 'Edit Product' : 'Add Product'}</h1>
      {error && <div className="alert alert-danger">{error}</div>}

      <form className="card form-card" onSubmit={handleSubmit}>
        <label className="field">
          <span>Product name</span>
          <input type="text" name="name" className="input" required value={form.name} onChange={handleChange} />
        </label>
        <label className="field">
          <span>Description</span>
          <textarea name="description" className="input" rows="4" required value={form.description} onChange={handleChange} />
        </label>
        <div className="form-row">
          <label className="field">
            <span>Price (₦)</span>
            <input type="number" name="price" className="input" min="0" required value={form.price} onChange={handleChange} />
          </label>
          <label className="field">
            <span>Category</span>
            <select name="category" className="input" value={form.category} onChange={handleChange}>
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </label>
        </div>
        <div className="form-row">
          <label className="field">
            <span>Stock</span>
            <input type="number" name="stock" className="input" min="0" required value={form.stock} onChange={handleChange} />
          </label>
          <label className="field">
            <span>Ratings</span>
            <p className="muted small" style={{ margin: 0 }}>
              Ratings are given by buyers, not set by you.
            </p>
          </label>
        </div>
        <label className="field">
          <span>Product image {isEdit ? '(leave empty to keep current)' : ''}</span>
          <input type="file" accept="image/*" className="input" onChange={(e) => setImage(e.target.files[0])}
            required={!isEdit} />
        </label>

        <div className="form-actions">
          <button type="button" className="btn btn-outline" onClick={() => navigate('/vendor/products')}>Cancel</button>
          <button className="btn btn-orange" disabled={saving}>
            {saving ? 'Saving...' : isEdit ? 'Update Product' : 'Create Product'}
          </button>
        </div>
      </form>
    </div>
  );
}
