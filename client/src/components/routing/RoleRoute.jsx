import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Spinner from '../ui/Spinner';

export default function RoleRoute({ role, children }) {
  const { user, token, loading } = useAuth();

  if (loading) return <Spinner full />;
  if (!token || !user) return <Navigate to="/login" replace />;
  if (user.role !== role) return <Navigate to={user.role === 'merchant' ? '/merchant' : '/rider'} replace />;

  return children;
}
