import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import axios from 'axios';
import { useAuthStore } from './auth';

interface CartItem {
  product_id: string;
  name?: string;
  price?: number;
  image?: string;
  size: string;
  color: string;
  quantity: number;
}

interface Cart {
  id?: string;
  user_id?: string;
  items: CartItem[];
  updated_at?: string;
}

interface CartState {
  cart: Cart | null;
  loading: boolean;
  fetchCart: () => Promise<void>;
  addToCart: (product_id: string, size: string, color: string, quantity: number, productDetails?: { name: string; price: number; image: string }) => Promise<void>;
  updateCartItem: (product_id: string, size: string, color: string, quantity: number) => Promise<void>;
  removeFromCart: (product_id: string, size: string, color: string) => Promise<void>;
  clearCart: () => void;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      cart: { items: [] },
      loading: false,

      fetchCart: async () => {
        const token = useAuthStore.getState().token;
        if (!token) {
          // Use local cart for non-authenticated users
          return;
        }

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

      addToCart: async (product_id, size, color, quantity, productDetails) => {
        const token = useAuthStore.getState().token;
        const currentCart = get().cart || { items: [] };
        
        // Add to local cart first
        const existingItemIndex = currentCart.items.findIndex(
          item => item.product_id === product_id && item.size === size && item.color === color
        );

        let newItems: CartItem[];
        if (existingItemIndex > -1) {
          newItems = currentCart.items.map((item, index) =>
            index === existingItemIndex
              ? { ...item, quantity: item.quantity + quantity }
              : item
          );
        } else {
          newItems = [...currentCart.items, { 
            product_id, 
            size, 
            color, 
            quantity,
            name: productDetails?.name,
            price: productDetails?.price,
            image: productDetails?.image
          }];
        }

        set({ cart: { ...currentCart, items: newItems } });

        // Sync with server if authenticated
        if (token) {
          try {
            await axios.post(
              '/api/cart/add',
              { product_id, size, color, quantity },
              { headers: { Authorization: `Bearer ${token}` } }
            );
          } catch (error) {
            console.error('Error syncing cart:', error);
          }
        }
      },

      updateCartItem: async (product_id, size, color, quantity) => {
        const token = useAuthStore.getState().token;
        const currentCart = get().cart || { items: [] };

        if (quantity <= 0) {
          await get().removeFromCart(product_id, size, color);
          return;
        }

        const newItems = currentCart.items.map(item =>
          item.product_id === product_id && item.size === size && item.color === color
            ? { ...item, quantity }
            : item
        );

        set({ cart: { ...currentCart, items: newItems } });

        if (token) {
          try {
            await axios.post(
              '/api/cart/update',
              { product_id, size, color, quantity },
              { headers: { Authorization: `Bearer ${token}` } }
            );
          } catch (error) {
            console.error('Error updating cart:', error);
          }
        }
      },

      removeFromCart: async (product_id, size, color) => {
        const token = useAuthStore.getState().token;
        const currentCart = get().cart || { items: [] };

        const newItems = currentCart.items.filter(
          item => !(item.product_id === product_id && item.size === size && item.color === color)
        );

        set({ cart: { ...currentCart, items: newItems } });

        if (token) {
          try {
            await axios.delete(`/api/cart/remove/${product_id}/${size}/${color}`, {
              headers: { Authorization: `Bearer ${token}` },
            });
          } catch (error) {
            console.error('Error removing from cart:', error);
          }
        }
      },

      clearCart: () => {
        set({ cart: { items: [] } });
      },
    }),
    {
      name: 'cart-storage',
      partialize: (state) => ({ cart: state.cart }),
    }
  )
);