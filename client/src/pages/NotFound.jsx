import { Link } from 'react-router-dom';
import { Home } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="py-24 text-center space-y-4">
      <div className="text-6xl font-black text-emerald-400">404</div>
      <h1 className="text-2xl font-bold text-white">Page Not Found</h1>
      <p className="text-sm text-slate-400">The requested tournament page does not exist.</p>
      <div>
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-500 text-white font-bold text-sm shadow hover:bg-emerald-600 transition-colors"
        >
          <Home className="w-4 h-4" />
          Back to Home
        </Link>
      </div>
    </div>
  );
}
