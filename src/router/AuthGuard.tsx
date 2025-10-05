
import { useAuthStore } from '../store/auth';
import { Navigate } from 'react-router-dom';

const AuthGuard = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuthStore();

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  return <>{children}</>;
};

export default AuthGuard;
