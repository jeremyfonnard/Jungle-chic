import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import axios from 'axios';

interface User {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  loading: boolean;
  setUser: (user: User | null) => void;
  setToken: (token: string | null) => void;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, first_name: string, last_name: string) => Promise<void>;
  logout: () => void;
  fetchUser: () => Promise<void>;
  initialize: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      loading: true,

      setUser: (user) => set({ user }),
      setToken: (token) => set({ token }),

      login: async (email, password) => {
        const response = await axios.post('/api/auth/login', { email, password });
        const { user, token } = response.data;
        set({ user, token, loading: false });
        // Store in localStorage for persistence
        if (typeof window !== 'undefined') {
          localStorage.setItem('auth-token', token);
        }
      },

      register: async (email, password, first_name, last_name) => {
        const response = await axios.post('/api/auth/register', {
          email,
          password,
          first_name,
          last_name,
        });
        const { user, token } = response.data;
        set({ user, token, loading: false });
        if (typeof window !== 'undefined') {
          localStorage.setItem('auth-token', token);
        }
      },

      logout: () => {
        set({ user: null, token: null });
        if (typeof window !== 'undefined') {
          localStorage.removeItem('auth-token');
          localStorage.removeItem('auth-storage');
        }
      },

      fetchUser: async () => {
        const token = get().token;
        if (!token) {
          set({ loading: false });
          return;
        }

        try {
          const response = await axios.get('/api/auth/me', {
            headers: { Authorization: `Bearer ${token}` },
          });
          set({ user: response.data, loading: false });
        } catch (error) {
          set({ user: null, token: null, loading: false });
        }
      },

      initialize: async () => {
        const token = get().token;
        if (token) {
          await get().fetchUser();
        } else {
          set({ loading: false });
        }
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ token: state.token, user: state.user }),
    }
  )
);