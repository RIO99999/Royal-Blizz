import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="container page center">
      <div className="empty">
        <h1>404</h1>
        <h2>Page not found</h2>
        <p>The page you're looking for doesn't exist.</p>
        <Link to="/" className="btn btn-orange">Back to Home</Link>
      </div>
    </div>
  );
}
