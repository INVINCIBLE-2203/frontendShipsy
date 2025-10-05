
import { create } from 'zustand';

interface User {
  id: string;
  email: string;
  username: string;
  organizationId?: string;
}

interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  organizationId: string | null;
  setUser: (user: User | null) => void;
  setTokens: (accessToken: string, refreshToken: string) => void;
  setOrganization: (orgId: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  accessToken: localStorage.getItem('accessToken'),
  refreshToken: localStorage.getItem('refreshToken'),
  organizationId: localStorage.getItem('organizationId'),
  isAuthenticated: !!localStorage.getItem('accessToken'),
  setUser: (user) => {
    if (user?.organizationId) {
      localStorage.setItem('organizationId', user.organizationId);
    }
    set((state) => ({ 
      user, 
      isAuthenticated: user ? true : state.isAuthenticated, 
      organizationId: user?.organizationId || null 
    }));
  },
  setTokens: (accessToken, refreshToken) => {
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
    set({ accessToken, refreshToken, isAuthenticated: true });
  },
  setOrganization: (orgId) => {
    localStorage.setItem('organizationId', orgId);
    set({ organizationId: orgId });
  },
  logout: () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('organizationId');
    set({ user: null, accessToken: null, refreshToken: null, organizationId: null, isAuthenticated: false });
    window.location.href = '/login';
  },
}));
