import Role from '@api/dtos/role';
import { Navigate, Outlet } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';

interface ProtectedRouteProps {
  roles: Role[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ roles }) => {
  const [userLoading, userError, user] = useAuth();

  if (userLoading)
    return (
      <div>
        <h1>Loading</h1>
      </div>
    );
  if (userError)
    return (
      <div id="error-page">
        <h1>Oops!</h1>
        <p>Sorry, an unexpected error has occurred.</p>
      </div>
    );
  if (!user || !roles.includes(user.role)) return <Navigate to="/library" />;

  return <Outlet />;
};

export default ProtectedRoute;
