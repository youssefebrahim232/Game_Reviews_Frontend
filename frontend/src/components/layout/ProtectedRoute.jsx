import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Spinner from '../common/Spinner';

/**
 * Route guard component.
 * @param {object} props
 * @param {React.ReactNode} props.children
 * @param {boolean} [props.requireAdmin] - Require Admin or SuperAdmin role
 * @param {boolean} [props.requireSuperAdmin] - Require SuperAdmin role
 */
export default function ProtectedRoute({ children, requireAdmin = false, requireSuperAdmin = false }) {
  const { isAuthenticated, isAdmin, isSuperAdmin, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <Spinner size={40} />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (requireSuperAdmin && !isSuperAdmin) {
    return <Navigate to="/" replace />;
  }

  if (requireAdmin && !isAdmin) {
    return <Navigate to="/" replace />;
  }

  return children;
}
