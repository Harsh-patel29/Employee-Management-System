import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

export default function ProtectedRoute({ children, allowedRoles }) {
  const { user } = useSelector((state) => state.auth);
  if (user.user.role !== 'Admin') {
    return <Navigate to="/unauthorized" />;
  }
  return children;
}
