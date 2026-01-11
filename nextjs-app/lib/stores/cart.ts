import { create } from 'zustand';
import axios from 'axios';
import { useAuthStore } from './auth';

interface CartItem {
  product_id: string;
  size: string;
  color: string;
  quantity: number;
}

interface Cart {
  id: string;
  user_id: string;
  items: CartItem[];
  updated_at: string;
}

interface CartState {
  cart: Cart | null;
  loading: boolean;
  fetchCart: () => Promise<void>;
  addToCart: (product_id: string, size: string, color: string, quantity: number) => Promise<void>;
  updateCartItem: (product_id: string, size: string, color: string, quantity: number) => Promise<void>;
  removeFromCart: (product_id: string, size: string, color: string) => Promise<void>;
  clearCart: () => Promise<void>;
}

export const useCartStore = create<CartState>()((set) => ({
  cart: null,
  loading: false,

  fetchCart: async () => {
    const token = useAuthStore.getState().token;
    if (!token) return;

    try {
      set({ loading: true });
      const response = await axios.get('/api/cart', {
        headers: { Authorization: `Bearer ${token}` },
      });
      set({ cart: response.data, loading: false });
    } catch (error) {
      console.error('Error fetching cart:', error);
      set({ loading: false });
    }
  },

  addToCart: async (product_id, size, color, quantity) => {
    const token = useAuthStore.getState().token;
    if (!token) throw new Error('Not authenticated');

    await axios.post(
      '/api/cart/add',
      { product_id, size, color, quantity },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    await useCartStore.getState().fetchCart();
  },

  updateCartItem: async (product_id, size, color, quantity) => {
    const token = useAuthStore.getState().token;
    if (!token) throw new Error('Not authenticated');

    await axios.post(
      '/api/cart/update',
      { product_id, size, color, quantity },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    await useCartStore.getState().fetchCart();
  },

  removeFromCart: async (product_id, size, color) => {
    const token = useAuthStore.getState().token;
    if (!token) throw new Error('Not authenticated');

    await axios.delete(`/api/cart/remove/${product_id}/${size}/${color}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    await useCartStore.getState().fetchCart();
  },

  clearCart: async () => {
    set({ cart: null });
  },
}));