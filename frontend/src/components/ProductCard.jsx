import { Link } from 'react-router-dom';
import { naira } from '../utils/format';
import RatingStars from './RatingStars';

export default function ProductCard({ product, onAdd }) {
  return (
    <div className="card product-card">
      <Link to={`/product/${product._id}`} className="product-card-image">
        <img src={product.image} alt={product.name} loading="lazy" />
      </Link>
      <div className="product-card-body">
        <span className="badge badge-category">{product.category}</span>
        <Link to={`/product/${product._id}`} className="product-card-title">
          {product.name}
        </Link>
        {product.vendor && (
          <span className="product-card-vendor muted small">
            by {product.vendor.storeName || product.vendor.fullName}
          </span>
        )}
        <RatingStars rating={product.rating} />
        <div className="product-card-footer">
          <span className="price">{naira(product.price)}</span>
          <button
            className="btn btn-orange btn-sm"
            disabled={product.stock < 1}
            onClick={() => onAdd && onAdd(product)}
          >
            {product.stock < 1 ? 'Out of stock' : 'Add to Cart'}
          </button>
        </div>
      </div>
    </div>
  );
}
