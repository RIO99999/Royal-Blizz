import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../../api/axios';
import Spinner from '../../components/Spinner';
import { useForm } from '../../utils/useForm';

const CATEGORIES = ['Electronics', 'Fashion', 'Beauty', 'Home', 'Sports', 'Accessories'];

const validate = (values) => ({
  ...(!values.name.trim() ? { name: 'Enter a product name' } : {}),
  ...(!values.description.trim() ? { description: 'Enter a product description' } : {}),
  ...(values.price === '' || !Number.isFinite(Number(values.price)) || Number(values.price) < 0
    ? { price: 'Enter a valid price of 0 or more' }
    : {}),
  ...(!CATEGORIES.includes(values.category) ? { category: 'Choose a valid category' } : {}),
  ...(values.stock === '' || !Number.isInteger(Number(values.stock)) || Number(values.stock) < 0
    ? { stock: 'Enter a whole number of 0 or more' }
    : {}),
});

export default function ProductForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const { values: form, handleChange, handleBlur, errorFor, markAllTouched, hasErrors, setValues } = useForm({
    name: '',
    description: '',
    price: '',
    category: 'Electronics',
    stock: '',
  }, validate);
  const [image, setImage] = useState(null);
  const [imageTouched, setImageTouched] = useState(false);
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isEdit) return;
    const fetchProduct = async () => {
      try {
        const res = await api.get(`/api/products/${id}`);
        const p = res.data;
        setValues({
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
  }, [id, isEdit, setValues]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    markAllTouched();
    setImageTouched(true);
    if (hasErrors || (!isEdit && !image)) return;
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

      <form className="card form-card" onSubmit={handleSubmit} noValidate>
        <label className="field">
          <span>Product name</span>
          <input type="text" name="name" className={`input ${errorFor('name') ? 'input-error' : ''}`} required value={form.name} onChange={handleChange} onBlur={handleBlur} />
          {errorFor('name') && <small className="field-error">{errorFor('name')}</small>}
        </label>
        <label className="field">
          <span>Description</span>
          <textarea name="description" className={`input ${errorFor('description') ? 'input-error' : ''}`} rows="4" required value={form.description} onChange={handleChange} onBlur={handleBlur} />
          {errorFor('description') && <small className="field-error">{errorFor('description')}</small>}
        </label>
        <div className="form-row">
          <label className="field">
            <span>Price (₦)</span>
            <input type="number" name="price" className={`input ${errorFor('price') ? 'input-error' : ''}`} min="0" required value={form.price} onChange={handleChange} onBlur={handleBlur} />
            {errorFor('price') && <small className="field-error">{errorFor('price')}</small>}
          </label>
          <label className="field">
            <span>Category</span>
            <select name="category" className="input" value={form.category} onChange={handleChange} onBlur={handleBlur}>
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
            {errorFor('category') && <small className="field-error">{errorFor('category')}</small>}
          </label>
        </div>
        <div className="form-row">
          <label className="field">
            <span>Stock</span>
            <input type="number" name="stock" className={`input ${errorFor('stock') ? 'input-error' : ''}`} min="0" required value={form.stock} onChange={handleChange} onBlur={handleBlur} />
            {errorFor('stock') && <small className="field-error">{errorFor('stock')}</small>}
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
          <input type="file" accept="image/*" className={`input ${!isEdit && imageTouched && !image ? 'input-error' : ''}`}
            onBlur={() => setImageTouched(true)}
            onChange={(e) => { setImage(e.target.files[0]); setImageTouched(true); }}
            required={!isEdit} />
          {!isEdit && imageTouched && !image && <small className="field-error">Choose a product image</small>}
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
