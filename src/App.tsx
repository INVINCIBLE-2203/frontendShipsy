import { useEffect } from 'react';
import AppRouter from './router';
import { Toaster } from 'react-hot-toast';
import { useAuthStore } from './store/auth';
import { authService } from './api/services';

function App() {
  const { accessToken, setUser } = useAuthStore();

  useEffect(() => {
    // Fetch user data on app load if token exists
    const fetchUser = async () => {
      if (accessToken && !useAuthStore.getState().user) {
        try {
          const response = await authService.getMe();
          setUser(response.data);
        } catch (error) {
          console.error('Error fetching user:', error);
          // Token might be invalid, user will be redirected to login by AuthGuard
        }
      }
    };

    fetchUser();
  }, [accessToken, setUser]);

  return (
    <>
      <AppRouter />
      <Toaster 
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#363636',
            color: '#fff',
          },
          success: {
            duration: 3000,
            iconTheme: {
              primary: '#4ade80',
              secondary: '#fff',
            },
          },
          error: {
            duration: 4000,
            iconTheme: {
              primary: '#ef4444',
              secondary: '#fff',
            },
          },
        }}
      />
    </>
  );
}

export default App;
