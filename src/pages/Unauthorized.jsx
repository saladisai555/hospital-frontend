// Unauthorized.jsx
import { Link } from 'react-router-dom';

export default function Unauthorized() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-paper px-4">
      <div className="text-center">
        <p className="font-display text-xl font-semibold text-ink mb-2">Access denied</p>
        <p className="text-sm text-ink-muted mb-6">You don't have permission to view this page.</p>
        <Link to="/" className="text-primary font-medium hover:underline text-sm">Go back home</Link>
      </div>
    </div>
  );
}