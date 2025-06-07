import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { hasAccess, getInitialRoute } from '../../utils/roles';

const PrivateRoute = ({ children }) => {
  const { currentUser, userRoles } = useAuth();
  const location = useLocation();

  if (!currentUser) {
    return <Navigate to="/login" />;
  }

  if (!userRoles || userRoles.length === 0) {
    return <Navigate to="/login" />;
  }

  if (!hasAccess(userRoles, location.pathname)) {
    return <Navigate to={getInitialRoute(userRoles)} />;
  }

  return children;
};

export default PrivateRoute; 