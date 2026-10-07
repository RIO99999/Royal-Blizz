import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-grid">
        <div>
          <div className="brand-name">ROYAL BLIZ</div>
          <div className="brand-tag">SHOP • SELL • GROW</div>
          <p className="footer-text">
            A modern marketplace for buyers and vendors. Discover products, grow your store.
          </p>
        </div>
        <div>
          <h4>Shop</h4>
          <Link to="/shop">All Products</Link>
          <Link to="/shop?category=Electronics">Electronics</Link>
          <Link to="/shop?category=Fashion">Fashion</Link>
          <Link to="/shop?category=Home">Home</Link>
        </div>
        <div>
          <h4>Account</h4>
          <Link to="/login">Login</Link>
          <Link to="/register">Create account</Link>
          <Link to="/forgot-password">Reset password</Link>
        </div>
      </div>
      <div className="footer-bottom">
        © {new Date().getFullYear()} ROYAL BLIZ. All rights reserved.
      </div>
    </footer>
  );
}
