import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { FaHeart, FaStar } from 'react-icons/fa';
import api from '../api/axios';
import RatingStars from '../components/RatingStars';
import Spinner from '../components/Spinner';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { naira, formatDate } from '../utils/format';

export default function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart, buyNow } = useCart();
  const { user } = useAuth();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [message, setMessage] = useState('');

  // Reviews
  const [reviews, setReviews] = useState([]);
  const [reviewRating, setReviewRating] = useState(0);
  const [ratingTouched, setRatingTouched] = useState(false);
  const [reviewComment, setReviewComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);
  const [reviewError, setReviewError] = useState('');

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await api.get(`/api/products/${id}`);
        setProduct(res.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const res = await api.get(`/api/products/${id}/reviews`);
        setReviews(res.data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchReviews();
  }, [id]);

  const showMessage = (msg) => {
    setMessage(msg);
    setTimeout(() => setMessage(''), 2000);
  };

  const refreshReviews = async () => {
    try {
      const [pRes, rRes] = await Promise.all([
        api.get(`/api/products/${id}`),
        api.get(`/api/products/${id}/reviews`),
      ]);
      setProduct(pRes.data);
      setReviews(rRes.data);
    } catch (error) {
      console.error(error);
    }
  };

  const submitReview = async (e) => {
    e.preventDefault();
    setReviewError('');
    setRatingTouched(true);
    if (reviewRating < 1) {
      setReviewError('Please choose a star rating');
      return;
    }
    setSubmittingReview(true);
    try {
      await api.post(`/api/products/${id}/reviews`, {
        rating: reviewRating,
        comment: reviewComment,
      });
      setReviewRating(0);
      setReviewComment('');
      showMessage('Thanks for your review!');
      await refreshReviews();
    } catch (err) {
      setReviewError(err.response?.data?.message || 'Could not submit review');
    } finally {
      setSubmittingReview(false);
    }
  };

  if (loading) return <Spinner full />;
  if (!product) {
    return (
      <div className="container page">
        <div className="empty"><h3>Product not found</h3></div>
      </div>
    );
  }

  const handleAdd = () => {
    addToCart(product, quantity);
    showMessage('Added to cart');
  };

  const handleBuyNow = () => {
    buyNow(product, quantity);
    navigate('/checkout');
  };

  const toggleWishlist = async () => {
    if (!user || user.role !== 'buyer') {
      navigate('/login');
      return;
    }
    try {
      await api.post(`/api/wishlist/${product._id}`);
      showMessage('Added to wishlist');
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="container page">
      {message && <div className="toast">{message}</div>}
      <div className="product-details">
        <div className="pd-image">
          <img src={product.image} alt={product.name} />
        </div>
        <div className="pd-info">
          <span className="badge badge-category">{product.category}</span>
          <h1>{product.name}</h1>
          <div className="pd-rating">
            <RatingStars rating={product.rating} size={18} />
            <span className="muted">{product.rating.toFixed(1)}</span>
            <span className="rating-count">({product.ratingCount || 0} reviews)</span>
          </div>
          <div className="price pd-price">{naira(product.price)}</div>
          <p className="pd-desc">{product.description}</p>

          <div className="pd-meta">
            <span>
              Vendor: <strong>{product.vendor?.storeName || product.vendor?.fullName}</strong>
            </span>
            {product.vendor && (
              <span className="rating-row">
                <FaStar style={{ color: 'var(--orange)' }} />
                <strong>{product.vendor.rating?.toFixed(1) ?? '0.0'}</strong>
                <span className="muted">({product.vendor.ratingCount || 0})</span>
              </span>
            )}
            <span className={product.stock > 0 ? 'stock in' : 'stock out'}>
              {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
            </span>
          </div>

          <div className="qty-row">
            <label>Quantity</label>
            <div className="qty-control">
              <button onClick={() => setQuantity(Math.max(1, quantity - 1))}>−</button>
              <span>{quantity}</span>
              <button onClick={() => setQuantity(quantity + 1)}>+</button>
            </div>
          </div>

          <div className="pd-actions">
            <button className="btn btn-orange" disabled={product.stock < 1} onClick={handleAdd}>
              Add to Cart
            </button>
            <button className="btn btn-navy" disabled={product.stock < 1} onClick={handleBuyNow}>
              Buy Now
            </button>
            <button className="btn btn-outline" onClick={toggleWishlist}>
              <FaHeart style={{ color: 'var(--orange)' }} /> Wishlist
            </button>
          </div>
        </div>
      </div>

      {/* Reviews */}
      <section className="reviews-section">
        <h3>Ratings &amp; Reviews</h3>

        {user?.role === 'buyer' ? (
          <form className="review-form" onSubmit={submitReview}>
            <div className="star-picker">
              {[1, 2, 3, 4, 5].map((n) => (
                <button
                  key={n}
                  type="button"
                  className={n <= reviewRating ? 'active' : ''}
                  onClick={() => { setReviewRating(n); setRatingTouched(true); setReviewError(''); }}
                  aria-label={`${n} star`}
                >
                  <FaStar />
                </button>
              ))}
            </div>
            {ratingTouched && reviewRating < 1 && <small className="field-error">Choose a star rating</small>}
            <label className="field">
              <span>Your feedback (optional)</span>
              <textarea
                className="input"
                rows="3"
                value={reviewComment}
                onChange={(e) => setReviewComment(e.target.value)}
                placeholder="Share your experience with this product..."
              />
            </label>
            {reviewError && <div className="alert alert-danger">{reviewError}</div>}
            <button className="btn btn-orange" disabled={submittingReview}>
              {submittingReview ? 'Submitting...' : 'Submit Review'}
            </button>
          </form>
        ) : (
          <p className="muted">
            <Link to="/login" className="link-orange">Log in</Link> as a buyer to leave a review.
          </p>
        )}

        {reviews.length === 0 ? (
          <p className="muted">No reviews yet. Be the first to review this product.</p>
        ) : (
          <div className="list">
            {reviews.map((r) => (
              <div key={r._id} className="review-item">
                <div className="review-avatar">{(r.buyer?.fullName || '?').charAt(0).toUpperCase()}</div>
                <div className="review-body">
                  <div className="review-head">
                    <strong>{r.buyer?.fullName || 'Buyer'}</strong>
                    <span className="review-date">{formatDate(r.createdAt)}</span>
                  </div>
                  <RatingStars rating={r.rating} size={12} />
                  {r.comment && <p className="review-comment">{r.comment}</p>}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
