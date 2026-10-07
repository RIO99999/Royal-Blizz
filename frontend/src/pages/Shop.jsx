import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../api/axios';
import ProductCard from '../components/ProductCard';
import Spinner from '../components/Spinner';
import { useCart } from '../context/CartContext';

const CATEGORIES = ['All', 'Electronics', 'Fashion', 'Beauty', 'Home', 'Sports', 'Accessories'];

export default function Shop() {
  const [products, setProducts] = useState([]);
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();

  const [searchParams, setSearchParams] = useSearchParams();
  const search = searchParams.get('search') || '';
  const category = searchParams.get('category') || 'All';
  const vendor = searchParams.get('vendor') || '';
  const minPrice = searchParams.get('minPrice') || '';
  const maxPrice = searchParams.get('maxPrice') || '';
  const sort = searchParams.get('sort') || '';

  useEffect(() => {
    const fetchVendors = async () => {
      try {
        const res = await api.get('/api/products/vendors');
        setVendors(res.data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchVendors();
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const params = {};
        if (search) params.search = search;
        if (category !== 'All') params.category = category;
        if (vendor) params.vendor = vendor;
        if (minPrice) params.minPrice = minPrice;
        if (maxPrice) params.maxPrice = maxPrice;
        if (sort) params.sort = sort;
        const res = await api.get('/api/products', { params });
        setProducts(res.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [search, category, vendor, minPrice, maxPrice, sort]);

  const updateParam = (key, value) => {
    const next = new URLSearchParams(searchParams);
    if (value) next.set(key, value);
    else next.delete(key);
    setSearchParams(next);
  };

  return (
    <div className="container page">
      <h1 className="page-title">Shop</h1>

      <div className="shop-filters">
        <input
          type="text"
          placeholder="Search products or vendors..."
          value={search}
          onChange={(e) => updateParam('search', e.target.value)}
          className="input"
        />
        <select
          value={category}
          onChange={(e) => updateParam('category', e.target.value)}
          className="input"
        >
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
        <select
          value={vendor}
          onChange={(e) => updateParam('vendor', e.target.value)}
          className="input"
        >
          <option value="">All vendors</option>
          {vendors.map((v) => (
            <option key={v._id} value={v._id}>{v.storeName || v.fullName}</option>
          ))}
        </select>
        <input
          type="number"
          placeholder="Min ₦"
          value={minPrice}
          onChange={(e) => updateParam('minPrice', e.target.value)}
          className="input"
        />
        <input
          type="number"
          placeholder="Max ₦"
          value={maxPrice}
          onChange={(e) => updateParam('maxPrice', e.target.value)}
          className="input"
        />
        <select value={sort} onChange={(e) => updateParam('sort', e.target.value)} className="input">
          <option value="">Newest</option>
          <option value="price-asc">Price: Low to High</option>
          <option value="price-desc">Price: High to Low</option>
          <option value="rating">Top Rated</option>
        </select>
      </div>

      {loading ? (
        <Spinner />
      ) : products.length === 0 ? (
        <div className="empty">
          <h3>No products found</h3>
          <p>Try changing your search or filters.</p>
        </div>
      ) : (
        <div className="product-grid">
          {products.map((p) => (
            <ProductCard key={p._id} product={p} onAdd={addToCart} />
          ))}
        </div>
      )}
    </div>
  );
}
