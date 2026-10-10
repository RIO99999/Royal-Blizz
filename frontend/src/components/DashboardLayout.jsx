import { NavLink, Outlet, useNavigate, Link } from 'react-router-dom';
import {
  FaTachometerAlt,
  FaShoppingBag,
  FaBox,
  FaPlus,
  FaReceipt,
  FaStore,
  FaUser,
  FaCog,
  FaHeart,
  FaUsers,
  FaSignOutAlt,
} from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';

const ICONS = {
  dashboard: FaTachometerAlt,
  shop: FaShoppingBag,
  products: FaBox,
  add: FaPlus,
  orders: FaReceipt,
  store: FaStore,
  profile: FaUser,
  settings: FaCog,
  wishlist: FaHeart,
  users: FaUsers,
  vendors: FaStore,
};

const NAV = {
  buyer: [
    { to: '/buyer', label: 'Dashboard', end: true, icon: 'dashboard' },
    { to: '/shop', label: 'Shop', icon: 'shop' },
    { to: '/buyer/orders', label: 'Orders', icon: 'orders' },
    { to: '/buyer/wishlist', label: 'Wishlist', icon: 'wishlist' },
    { to: '/buyer/profile', label: 'Profile', icon: 'profile' },
    { to: '/buyer/settings', label: 'Settings', icon: 'settings' },
  ],
  vendor: [
    { to: '/vendor', label: 'Dashboard', end: true, icon: 'dashboard' },
    { to: '/vendor/products', label: 'Products', end: true, icon: 'products' },
    { to: '/vendor/products/new', label: 'Add Product', icon: 'add' },
    { to: '/vendor/orders', label: 'Orders', end: true, icon: 'orders' },
    { to: '/vendor/profile', label: 'Store Profile', icon: 'store' },
    { to: '/vendor/settings', label: 'Settings', icon: 'settings' },
  ],
  admin: [
    { to: '/admin', label: 'Dashboard', end: true, icon: 'dashboard' },
    { to: '/admin/users', label: 'Users', icon: 'users' },
    { to: '/admin/vendors', label: 'Vendors', icon: 'vendors' },
    { to: '/admin/products', label: 'Products', end: true, icon: 'products' },
    { to: '/admin/orders', label: 'Orders', end: true, icon: 'orders' },
  ],
};

const ROLE_LABEL = { buyer: 'Buyer', vendor: 'Vendor', admin: 'Admin' };

export default function DashboardLayout({ role }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const links = NAV[role] || [];

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="dash">
      <aside className="dash-sidebar">
        <Link to="/" className="brand brand-sidebar">
          <span className="brand-name">ROYAL BLIZ</span>
          <span className="brand-tag">{ROLE_LABEL[role]} panel</span>
        </Link>
        <nav className="dash-nav">
          {links.map((l) => {
            const Icon = ICONS[l.icon];
            return (
              <NavLink
                key={l.to}
                to={l.to}
                end={l.end}
                className={({ isActive }) => (isActive ? 'dash-link active' : 'dash-link')}
              >
                <Icon />
                <span>{l.label}</span>
              </NavLink>
            );
          })}
        </nav>
        <button className="btn btn-outline dash-logout" onClick={handleLogout}>
          <FaSignOutAlt /> <span>Logout</span>
        </button>
      </aside>

      <div className="dash-main">
        <div className="dash-topbar">
          <Link to="/" className="brand">
            <span className="brand-name">ROYAL BLIZ</span>
          </Link>
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
          <button className="btn btn-outline btn-sm dash-logout-mobile" onClick={handleLogout}>
            <FaSignOutAlt /> Logout
          </button>
        </div>

        {/* Icon navigation bar shown only on mobile (top bar instead of sidebar). */}
        <nav className="dash-mobilenav">
          {links.map((l) => {
            const Icon = ICONS[l.icon];
            return (
              <NavLink
                key={l.to}
                to={l.to}
                end={l.end}
                className={({ isActive }) => (isActive ? 'dash-mobile-link active' : 'dash-mobile-link')}
              >
                <Icon />
                <span>{l.label}</span>
              </NavLink>
            );
          })}
        </nav>

        <div className="dash-content">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
