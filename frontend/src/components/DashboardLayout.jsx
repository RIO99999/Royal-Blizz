import { useState } from 'react';
import { NavLink, Outlet, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const NAV = {
  buyer: [
    { to: '/buyer', label: 'Dashboard', end: true },
    { to: '/shop', label: 'Shop' },
    { to: '/buyer/orders', label: 'Orders' },
    { to: '/buyer/wishlist', label: 'Wishlist' },
    { to: '/buyer/profile', label: 'Profile' },
    { to: '/buyer/settings', label: 'Settings' },
  ],
  vendor: [
    { to: '/vendor', label: 'Dashboard', end: true },
    { to: '/vendor/products', label: 'Products' },
    { to: '/vendor/products/new', label: 'Add Product' },
    { to: '/vendor/orders', label: 'Orders' },
    { to: '/vendor/profile', label: 'Store Profile' },
    { to: '/vendor/settings', label: 'Settings' },
  ],
  admin: [
    { to: '/admin', label: 'Dashboard', end: true },
    { to: '/admin/users', label: 'Users' },
    { to: '/admin/vendors', label: 'Vendors' },
    { to: '/admin/products', label: 'Products' },
    { to: '/admin/orders', label: 'Orders' },
  ],
};

const ROLE_LABEL = { buyer: 'Buyer', vendor: 'Vendor', admin: 'Admin' };

export default function DashboardLayout({ role }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const links = NAV[role] || [];

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="dash">
      <aside className={`dash-sidebar ${open ? 'open' : ''}`}>
        <Link to="/" className="brand brand-sidebar" onClick={() => setOpen(false)}>
          <span className="brand-name">ROYAL BLIZ</span>
          <span className="brand-tag">{ROLE_LABEL[role]} panel</span>
        </Link>
        <nav className="dash-nav">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.end}
              className={({ isActive }) => (isActive ? 'dash-link active' : 'dash-link')}
              onClick={() => setOpen(false)}
            >
              {l.label}
            </NavLink>
          ))}
        </nav>
        <button className="btn btn-outline dash-logout" onClick={handleLogout}>
          Logout
        </button>
      </aside>

      <div className="dash-main">
        <div className="dash-topbar">
          <button className="hamburger dark" onClick={() => setOpen(!open)} aria-label="Menu">
            <span />
            <span />
            <span />
          </button>
          <div className="dash-user">
            <div className="avatar">
              {user?.profilePicture ? (
                <img src={user.profilePicture} alt={user.fullName} />
              ) : (
                (user?.fullName || '?').charAt(0).toUpperCase()
              )}
            </div>
            <div className="dash-user-info">
              <strong>{user?.fullName}</strong>
              <span>{user?.role === 'vendor' ? (user.storeName || 'Vendor') : user?.email}</span>
            </div>
          </div>
        </div>
        <div className="dash-content">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
