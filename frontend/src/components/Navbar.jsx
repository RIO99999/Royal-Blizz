import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { FaHome, FaStore, FaShoppingCart, FaUser, FaSignInAlt } from 'react-icons/fa';

const brandHome = (role) => {
  if (role === 'admin') return '/admin';
  if (role === 'vendor') return '/vendor';
  return '/';
};

export default function Navbar() {
  const { user, logout } = useAuth();
  const { itemCount } = useCart();
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    setOpen(false);
    navigate('/');
  };

  return (
    <header className="navbar">
      <div className="container navbar-inner">
        <Link to={brandHome(user?.role)} className="brand" onClick={() => setOpen(false)}>
          <span className="brand-name">ROYAL BLIZ</span>
          <span className="brand-tag">SHOP • SELL • GROW</span>
        </Link>

        <nav className={`nav-links ${open ? 'open' : ''}`}>
          <NavLink to="/" onClick={() => setOpen(false)}>Home</NavLink>
          <NavLink to="/shop" onClick={() => setOpen(false)}>Shop</NavLink>

          {user ? (
            <>
              {user.role === 'buyer' && (
                <NavLink to="/buyer" onClick={() => setOpen(false)}>Dashboard</NavLink>
              )}
              {user.role === 'vendor' && (
                <NavLink to="/vendor" onClick={() => setOpen(false)}>Dashboard</NavLink>
              )}
              {user.role === 'admin' && (
                <NavLink to="/admin" onClick={() => setOpen(false)}>Admin</NavLink>
              )}
              {user.role === 'buyer' && (
                <Link to="/cart" className="cart-link" onClick={() => setOpen(false)}>
                  Cart {itemCount > 0 && <span className="cart-badge">{itemCount}</span>}
                </Link>
              )}
              <button className="btn btn-outline btn-sm" onClick={handleLogout}>Logout</button>
            </>
          ) : (
            <>
              <Link to="/cart" className="cart-link" onClick={() => setOpen(false)}>
                Cart {itemCount > 0 && <span className="cart-badge">{itemCount}</span>}
              </Link>
              <NavLink to="/login" onClick={() => setOpen(false)}>Login</NavLink>
              <NavLink to="/register" className="btn btn-orange btn-sm" onClick={() => setOpen(false)}>
                Sign up
              </NavLink>
            </>
          )}
        </nav>

        <nav className="nav-icons" aria-label="Quick navigation">
          <NavLink to="/" className="nav-icon" aria-label="Home" title="Home">
            <FaHome />
          </NavLink>
          <NavLink to="/shop" className="nav-icon" aria-label="Shop" title="Shop">
            <FaStore />
          </NavLink>
          <Link
            to="/cart"
            className="nav-icon cart-link"
            aria-label={`Cart${itemCount > 0 ? `, ${itemCount} items` : ''}`}
            title="Cart"
          >
            <FaShoppingCart />
            {itemCount > 0 && <span className="cart-badge">{itemCount}</span>}
          </Link>
          {user ? (
            <NavLink
              to={user.role === 'admin' ? '/admin' : user.role === 'vendor' ? '/vendor' : '/buyer'}
              className="nav-icon"
              aria-label="Dashboard"
              title="Dashboard"
            >
              <FaUser />
            </NavLink>
          ) : (
            <NavLink to="/login" className="nav-icon" aria-label="Log in" title="Log in">
              <FaSignInAlt />
            </NavLink>
          )}
        </nav>

        <button className="hamburger" onClick={() => setOpen(!open)} aria-label="Menu">
          <span />
          <span />
          <span />
        </button>
      </div>
    </header>
  );
}
