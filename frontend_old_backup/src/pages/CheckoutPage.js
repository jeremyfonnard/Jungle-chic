import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import axios from 'axios';
import { toast } from 'sonner';
import { CheckCircle } from 'lucide-react';

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

export default function CheckoutPage() {
  const navigate = useNavigate();
  const { user, token } = useAuth();
  const { cart } = useCart();
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState({});
  const [step, setStep] = useState(1);
  const [shippingData, setShippingData] = useState({
    first_name: user?.first_name || '',
    last_name: user?.last_name || '',
    address: '',
    city: '',
    postal_code: '',
    country: 'France',
    phone: '',
  });

  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }
    if (!cart?.items?.length) {
      navigate('/cart');
      return;
    }
    fetchProductDetails();
  }, [user, cart]);

  const fetchProductDetails = async () => {
    if (!cart?.items?.length) return;

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
    }
  };

  const calculateTotal = () => {
    const subtotal = cart?.items?.reduce((total, item) => {
      const product = products[item.product_id];
      return total + (product?.price || 0) * item.quantity;
    }, 0) || 0;
    const shipping = subtotal >= 50 ? 0 : 5;
    return subtotal + shipping;
  };

  const handleCreateOrder = async () => {
    setLoading(true);
    try {
      const orderResponse = await axios.post(
        `${API}/orders`,
        shippingData,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const order = orderResponse.data;
      const originUrl = window.location.origin;

      const paymentResponse = await axios.post(
        `${API}/payments/checkout`,
        {
          order_id: order.id,
          origin_url: originUrl,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      window.location.href = paymentResponse.data.url;
    } catch (error) {
      console.error('Error creating order:', error);
      toast.error('Erreur lors de la création de la commande');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitShipping = (e) => {
    e.preventDefault();
    setStep(2);
  };

  if (!cart?.items?.length) return null;

  return (
    <div className="min-h-screen">
      <div className="texture-overlay" />
      <div className="max-w-[1200px] mx-auto px-6 md:px-12 py-12">
        <h1 data-testid="checkout-title" className="text-4xl md:text-5xl font-serif tracking-tight text-primary mb-8">
          Finaliser la commande
        </h1>

        <div className="mb-8 flex gap-4">
          <div className={`flex-1 h-2 rounded-full ${
            step >= 1 ? 'bg-primary' : 'bg-gray-200'
          }`} />
          <div className={`flex-1 h-2 rounded-full ${
            step >= 2 ? 'bg-primary' : 'bg-gray-200'
          }`} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            {step === 1 && (
              <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-sm p-8">
                <h2 className="text-2xl font-serif text-primary mb-6">Adresse de livraison</h2>
                <form onSubmit={handleSubmitShipping} className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="first_name">Prénom</Label>
                      <Input
                        id="first_name"
                        data-testid="shipping-first-name"
                        value={shippingData.first_name}
                        onChange={(e) => setShippingData({ ...shippingData, first_name: e.target.value })}
                        required
                        className="rounded-xl border-primary/20 bg-white/50"
                      />
                    </div>
                    <div>
                      <Label htmlFor="last_name">Nom</Label>
                      <Input
                        id="last_name"
                        data-testid="shipping-last-name"
                        value={shippingData.last_name}
                        onChange={(e) => setShippingData({ ...shippingData, last_name: e.target.value })}
                        required
                        className="rounded-xl border-primary/20 bg-white/50"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="address">Adresse</Label>
                    <Input
                      id="address"
                      data-testid="shipping-address"
                      value={shippingData.address}
                      onChange={(e) => setShippingData({ ...shippingData, address: e.target.value })}
                      required
                      className="rounded-xl border-primary/20 bg-white/50"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="city">Ville</Label>
                      <Input
                        id="city"
                        data-testid="shipping-city"
                        value={shippingData.city}
                        onChange={(e) => setShippingData({ ...shippingData, city: e.target.value })}
                        required
                        className="rounded-xl border-primary/20 bg-white/50"
                      />
                    </div>
                    <div>
                      <Label htmlFor="postal_code">Code postal</Label>
                      <Input
                        id="postal_code"
                        data-testid="shipping-postal-code"
                        value={shippingData.postal_code}
                        onChange={(e) => setShippingData({ ...shippingData, postal_code: e.target.value })}
                        required
                        className="rounded-xl border-primary/20 bg-white/50"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="country">Pays</Label>
                      <Input
                        id="country"
                        data-testid="shipping-country"
                        value={shippingData.country}
                        onChange={(e) => setShippingData({ ...shippingData, country: e.target.value })}
                        required
                        className="rounded-xl border-primary/20 bg-white/50"
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone">Téléphone</Label>
                      <Input
                        id="phone"
                        data-testid="shipping-phone"
                        value={shippingData.phone}
                        onChange={(e) => setShippingData({ ...shippingData, phone: e.target.value })}
                        required
                        className="rounded-xl border-primary/20 bg-white/50"
                      />
                    </div>
                  </div>

                  <Button
                    type="submit"
                    data-testid="continue-to-payment-button"
                    className="w-full bg-primary text-primary-foreground rounded-full px-8 py-3 hover:bg-primary/90 transition-all duration-300 shadow-lg hover:shadow-xl font-medium tracking-wide"
                  >
                    Continuer vers le paiement
                  </Button>
                </form>
              </div>
            )}

            {step === 2 && (
              <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-sm p-8">
                <h2 className="text-2xl font-serif text-primary mb-6">Paiement</h2>
                
                <div className="mb-6">
                  <h3 className="font-semibold text-primary mb-3">Adresse de livraison</h3>
                  <div className="bg-gray-50 rounded-lg p-4 text-sm">
                    <p>{shippingData.first_name} {shippingData.last_name}</p>
                    <p>{shippingData.address}</p>
                    <p>{shippingData.postal_code} {shippingData.city}</p>
                    <p>{shippingData.country}</p>
                    <p>{shippingData.phone}</p>
                  </div>
                  <button
                    onClick={() => setStep(1)}
                    data-testid="edit-shipping-button"
                    className="text-primary hover:text-secondary transition-colors text-sm mt-2 underline"
                  >
                    Modifier l'adresse
                  </button>
                </div>

                <div className="mb-6">
                  <p className="text-foreground/70 mb-4">
                    Vous allez être redirigé vers Stripe pour effectuer le paiement de manière sécurisée.
                  </p>
                </div>

                <Button
                  onClick={handleCreateOrder}
                  data-testid="proceed-to-stripe-button"
                  disabled={loading}
                  className="w-full bg-primary text-primary-foreground rounded-full px-8 py-3 hover:bg-primary/90 transition-all duration-300 shadow-lg hover:shadow-xl font-medium tracking-wide"
                >
                  {loading ? 'Création de la commande...' : 'Procéder au paiement'}
                </Button>
              </div>
            )}
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-sm p-6 sticky top-24">
              <h2 className="text-2xl font-serif text-primary mb-6">Résumé</h2>
              
              <div className="space-y-4 mb-6">
                {cart.items.map((item) => {
                  const product = products[item.product_id];
                  if (!product) return null;

                  return (
                    <div key={`${item.product_id}-${item.size}-${item.color}`} className="flex gap-3">
                      <img
                        src={product.images[0]}
                        alt={product.name}
                        className="w-16 h-20 object-cover rounded-lg"
                      />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-primary">{product.name}</p>
                        <p className="text-xs text-foreground/70">
                          {item.size} | {item.color} | x{item.quantity}
                        </p>
                        <p className="text-sm text-secondary font-semibold">
                          {(product.price * item.quantity).toFixed(2)}€
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="border-t border-gray-200 pt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-foreground/70">Sous-total</span>
                  <span className="font-medium">{(calculateTotal() - (calculateTotal() >= 55 ? 0 : 5)).toFixed(2)}€</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-foreground/70">Livraison</span>
                  <span className="font-medium">
                    {calculateTotal() - 5 >= 50 ? 'Gratuit' : '5.00€'}
                  </span>
                </div>
                <div className="flex justify-between text-lg font-semibold pt-2 border-t border-gray-200">
                  <span className="text-primary">Total</span>
                  <span data-testid="checkout-total" className="text-secondary">{calculateTotal().toFixed(2)}€</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}