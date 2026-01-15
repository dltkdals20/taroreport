import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext.jsx';
import { isEmailAllowed } from '../lib/authConfig.js';

export default function ProtectedRoute({ children }) {
  const location = useLocation();
  const { user, loading, isSupabaseConfigured } = useAuth();

  if (!isSupabaseConfigured) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (loading) {
    return (
      <div className="page auth">
        <div className="auth-card panel">
          <p className="eyebrow">AUTH</p>
          <h2>로그인 확인 중</h2>
          <p className="subtitle">세션을 확인하고 있습니다.</p>
        </div>
      </div>
    );
  }

  if (!user || !isEmailAllowed(user.email)) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}
