// Split-screen layout for auth pages: a branded image panel on the left and
// the form on the right. The panel hides on small screens.
export default function AuthLayout({ children }) {
  return (
    <div className="auth-page">
      <aside className="auth-side">
        <img src="/brand-logo-dark.jpg" alt="ROYAL BLIZ" className="auth-side-logo" />
        <p className="auth-side-tagline">SHOP • SELL • GROW</p>
        <p className="auth-side-blurb">
          Your modern marketplace for quality products and trusted vendors.
        </p>
      </aside>
      <div className="auth-main">{children}</div>
    </div>
  );
}
