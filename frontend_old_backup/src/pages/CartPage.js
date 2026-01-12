import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { Button } from '../components/ui/button';
import axios from 'axios';
import { Trash2, Plus, Minus } from 'lucide-react';
import { toast } from 'sonner';

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

export default function CartPage() {
  const navigate = useNavigate();
  const { cart, updateCartItem, removeFromCart } = useCart();
  const [products, setProducts] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProductDetails();
  }, [cart]);

  const fetchProductDetails = async () => {
    if (!cart?.items?.length) {
      setLoading(false);
      return;
    }

    try {
      const productIds = [...new Set(cart.items.map((item) => item.product_id))];
      const productData = {};
      
      await Promise.all(
        productIds.map(async (id) => {
          const response = await axios.get(`${API}/products/${id}`);
          productData[id] = response.data;
        })
      );
      
      setProducts(productData);
    } catch (error) {
      console.error('Error fetching product details:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateQuantity = async (item, newQuantity) => {
    if (newQuantity < 1) return;
    try {
      await updateCartItem(item.product_id, item.size, item.color, newQuantity);
    } catch (error) {
      toast.error('Erreur lors de la mise à jour');
    }
  };

  const handleRemove = async (item) => {
    try {
      await removeFromCart(item.product_id, item.size, item.color);
      toast.success('Article retiré du panier');
    } catch (error) {
      toast.error('Erreur lors de la suppression');
    }
  };

  const calculateTotal = () => {
    return cart?.items?.reduce((total, item) => {
      const product = products[item.product_id];
      return total + (product?.price || 0) * item.quantity;
    }, 0) || 0;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
      </div>
    );
  }

  if (!cart?.items?.length) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <div className="texture-overlay" />
        <h1 data-testid="empty-cart-message" className="text-3xl font-serif text-primary mb-4">
          Votre panier est vide
        </h1>
        <Button
          onClick={() => navigate('/shop')}
          data-testid="continue-shopping-button"
          className="bg-primary text-primary-foreground rounded-full px-8 py-3 hover:bg-primary/90 transition-all duration-300"
        >
          Continuer mes achats
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="texture-overlay" />
      <div className="max-w-[1200px] mx-auto px-6 md:px-12 py-12">
        <h1 data-testid="cart-title" className="text-4xl md:text-5xl font-serif tracking-tight text-primary mb-8">
          Mon Panier
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            {cart.items.map((item, idx) => {
              const product = products[item.product_id];
              if (!product) return null;

              return (
                <div
                  key={`${item.product_id}-${item.size}-${item.color}`}
                  data-testid={`cart-item-${idx}`}
                  className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-sm p-6 flex gap-6"
                >
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    className="w-24 h-32 object-cover rounded-lg flex-shrink-0"
                  />
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-primary mb-1">{product.name}</h3>
                    <p className="text-sm text-foreground/70 mb-2">
                      Taille: {item.size} | Couleur: {item.color}
                    </p>
                    <p className="text-lg text-secondary font-semibold mb-4">{product.price.toFixed(2)}€</p>
                    
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleUpdateQuantity(item, item.quantity - 1)}
                          data-testid={`decrease-quantity-${idx}`}
                          className="w-8 h-8 rounded-lg border border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-colors"
                        >
                          <Minus className="w-4 h-4 mx-auto" />
                        </button>
                        <span data-testid={`item-quantity-${idx}`} className="font-medium w-8 text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => handleUpdateQuantity(item, item.quantity + 1)}
                          data-testid={`increase-quantity-${idx}`}
                          className="w-8 h-8 rounded-lg border border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-colors"
                        >
                          <Plus className="w-4 h-4 mx-auto" />
                        </button>
                      </div>
                      
                      <button
                        onClick={() => handleRemove(item)}
                        data-testid={`remove-item-${idx}`}
                        className="ml-auto text-red-500 hover:text-red-700 transition-colors"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-sm p-6 sticky top-24">
              <h2 className="text-2xl font-serif text-primary mb-6">Résumé</h2>
              
              <div className="space-y-3 mb-6">
                <div className="flex justify-between">
                  <span className="text-foreground/70">Sous-total</span>
                  <span data-testid="cart-subtotal" className="font-medium">
                    {calculateTotal().toFixed(2)}€
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-foreground/70">Livraison</span>
                  <span className="font-medium">
                    {calculateTotal() >= 50 ? 'Gratuit' : '5.00€'}
                  </span>
                </div>
                <div className="border-t border-gray-200 pt-3 flex justify-between text-lg font-semibold">
                  <span className="text-primary">Total</span>
                  <span data-testid="cart-total" className="text-secondary">
                    {(calculateTotal() + (calculateTotal() >= 50 ? 0 : 5)).toFixed(2)}€
                  </span>
                </div>
              </div>

              {calculateTotal() < 50 && (
                <p className="text-sm text-foreground/70 mb-6">
                  Ajoutez {(50 - calculateTotal()).toFixed(2)}€ pour la livraison gratuite
                </p>
              )}

              <Button
                onClick={() => navigate('/checkout')}
                data-testid="proceed-to-checkout-button"
                className="w-full bg-primary text-primary-foreground rounded-full px-8 py-3 hover:bg-primary/90 transition-all duration-300 shadow-lg hover:shadow-xl font-medium tracking-wide"
              >
                Passer la commande
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}