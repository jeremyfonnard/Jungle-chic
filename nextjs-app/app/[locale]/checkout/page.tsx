'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { useAuthStore } from '@/lib/stores/auth';
import { useCartStore } from '@/lib/stores/cart';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import axios from 'axios';
import { toast } from 'sonner';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import Image from 'next/image';

export default function CheckoutPage() {
  const t = useTranslations('checkout');
  const params = useParams();
  const locale = params.locale as string;
  const { user, token } = useAuthStore();
  const { cart } = useCartStore();
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState<any>({});
  const [step, setStep] = useState(1);
  const [shippingData, setShippingData] = useState({
    first_name: user?.first_name || '',
    last_name: user?.last_name || '',
    address: '',
    city: '',
    postal_code: '',
    country: locale === 'fr' ? 'France' : 'United States',
    phone: '',
  });

  useEffect(() => {
    if (!user) {
      window.location.href = `/${locale}/auth`;
      return;
    }
    if (!cart?.items?.length) {
      window.location.href = `/${locale}/cart`;
      return;
    }
    fetchProductDetails();
  }, [user, cart]);

  const fetchProductDetails = async () => {
    if (!cart?.items?.length) return;

    try {
      const productIds = [...new Set(cart.items.map((item) => item.product_id))];
      const productData: any = {};

      await Promise.all(
        productIds.map(async (id) => {
          const response = await axios.get(`/api/products/${id}`);
          productData[id] = response.data;
        })
      );

      setProducts(productData);
    } catch (error) {
      console.error('Error fetching product details:', error);
    }
  };

  const calculateTotal = () => {
    const subtotal =
      cart?.items?.reduce((total, item) => {
        const product = products[item.product_id];
        return total + (product?.price || 0) * item.quantity;
      }, 0) || 0;
    const shipping = subtotal >= 50 ? 0 : 5;
    return subtotal + shipping;
  };

  const handleCreateOrder = async () => {
    setLoading(true);
    try {
      const orderResponse = await axios.post('/api/orders', shippingData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const order = orderResponse.data;
      const originUrl = window.location.origin;

      const paymentResponse = await axios.post(
        '/api/payments/checkout',
        {
          order_id: order.id,
          origin_url: originUrl,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      window.location.href = paymentResponse.data.url;
    } catch (error) {
      console.error('Error creating order:', error);
      toast.error(locale === 'fr' ? 'Erreur lors de la création de la commande' : 'Error creating order');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitShipping = (e: React.FormEvent) => {
    e.preventDefault();
    setStep(2);
  };

  if (!cart?.items?.length) return null;

  return (
    <>
      <Navbar locale={locale} />
      <div className="min-h-screen">
        <div className="texture-overlay" />
        <div className="max-w-[1200px] mx-auto px-6 md:px-12 py-12">
          <h1 className="text-4xl md:text-5xl font-serif tracking-tight text-primary mb-8">
            {t('title')}
          </h1>

          <div className="mb-8 flex gap-4">
            <div className={`flex-1 h-2 rounded-full ${step >= 1 ? 'bg-primary' : 'bg-gray-200'}`} />
            <div className={`flex-1 h-2 rounded-full ${step >= 2 ? 'bg-primary' : 'bg-gray-200'}`} />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              {step === 1 && (
                <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-sm p-8">
                  <h2 className="text-2xl font-serif text-primary mb-6">{t('shipping_address')}</h2>
                  <form onSubmit={handleSubmitShipping} className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="first_name">{locale === 'fr' ? 'Prénom' : 'First name'}</Label>
                        <Input
                          id="first_name"
                          value={shippingData.first_name}
                          onChange={(e) => setShippingData({ ...shippingData, first_name: e.target.value })}
                          required
                          className="rounded-xl border-primary/20 bg-white/50"
                        />
                      </div>
                      <div>
                        <Label htmlFor="last_name">{locale === 'fr' ? 'Nom' : 'Last name'}</Label>
                        <Input
                          id="last_name"
                          value={shippingData.last_name}
                          onChange={(e) => setShippingData({ ...shippingData, last_name: e.target.value })}
                          required
                          className="rounded-xl border-primary/20 bg-white/50"
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="address">{t('address')}</Label>
                      <Input
                        id="address"
                        value={shippingData.address}
                        onChange={(e) => setShippingData({ ...shippingData, address: e.target.value })}
                        required
                        className="rounded-xl border-primary/20 bg-white/50"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="city">{t('city')}</Label>
                        <Input
                          id="city"
                          value={shippingData.city}
                          onChange={(e) => setShippingData({ ...shippingData, city: e.target.value })}
                          required
                          className="rounded-xl border-primary/20 bg-white/50"
                        />
                      </div>
                      <div>
                        <Label htmlFor="postal_code">{t('postal_code')}</Label>
                        <Input
                          id="postal_code"
                          value={shippingData.postal_code}
                          onChange={(e) => setShippingData({ ...shippingData, postal_code: e.target.value })}
                          required
                          className="rounded-xl border-primary/20 bg-white/50"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="country">{t('country')}</Label>
                        <Input
                          id="country"
                          value={shippingData.country}
                          onChange={(e) => setShippingData({ ...shippingData, country: e.target.value })}
                          required
                          className="rounded-xl border-primary/20 bg-white/50"
                        />
                      </div>
                      <div>
                        <Label htmlFor="phone">{t('phone')}</Label>
                        <Input
                          id="phone"
                          value={shippingData.phone}
                          onChange={(e) => setShippingData({ ...shippingData, phone: e.target.value })}
                          required
                          className="rounded-xl border-primary/20 bg-white/50"
                        />
                      </div>
                    </div>

                    <Button
                      type="submit"
                      className="w-full bg-primary text-primary-foreground rounded-full px-8 py-3 hover:bg-primary/90 transition-all duration-300 shadow-lg hover:shadow-xl font-medium tracking-wide"
                    >
                      {locale === 'fr' ? 'Continuer vers le paiement' : 'Continue to payment'}
                    </Button>
                  </form>
                </div>
              )}

              {step === 2 && (
                <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-sm p-8">
                  <h2 className="text-2xl font-serif text-primary mb-6">{t('payment')}</h2>

                  <div className="mb-6">
                    <h3 className="font-semibold text-primary mb-3">{t('shipping_address')}</h3>
                    <div className="bg-gray-50 rounded-lg p-4 text-sm">
                      <p>
                        {shippingData.first_name} {shippingData.last_name}
                      </p>
                      <p>{shippingData.address}</p>
                      <p>
                        {shippingData.postal_code} {shippingData.city}
                      </p>
                      <p>{shippingData.country}</p>
                      <p>{shippingData.phone}</p>
                    </div>
                    <button
                      onClick={() => setStep(1)}
                      className="text-primary hover:text-secondary transition-colors text-sm mt-2 underline"
                    >
                      {locale === 'fr' ? "Modifier l'adresse" : 'Edit address'}
                    </button>
                  </div>

                  <div className="mb-6">
                    <p className="text-foreground/70 mb-4">
                      {locale === 'fr'
                        ? 'Vous allez être redirigé vers Stripe pour effectuer le paiement de manière sécurisée.'
                        : 'You will be redirected to Stripe to complete your payment securely.'}
                    </p>
                  </div>

                  <Button
                    onClick={handleCreateOrder}
                    disabled={loading}
                    className="w-full bg-primary text-primary-foreground rounded-full px-8 py-3 hover:bg-primary/90 transition-all duration-300 shadow-lg hover:shadow-xl font-medium tracking-wide"
                  >
                    {loading
                      ? locale === 'fr'
                        ? 'Création de la commande...'
                        : 'Creating order...'
                      : t('proceed_to_payment')}
                  </Button>
                </div>
              )}
            </div>

            <div className="lg:col-span-1">
              <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-sm p-6 sticky top-24">
                <h2 className="text-2xl font-serif text-primary mb-6">
                  {locale === 'fr' ? 'Résumé' : 'Summary'}
                </h2>

                <div className="space-y-4 mb-6">
                  {cart.items.map((item) => {
                    const product = products[item.product_id];
                    if (!product) return null;

                    return (
                      <div key={`${item.product_id}-${item.size}-${item.color}`} className="flex gap-3">
                        <div className="relative w-16 h-20 flex-shrink-0">
                          <Image
                            src={product.images[0]}
                            alt={product.name}
                            fill
                            className="object-cover rounded-lg"
                          />
                        </div>
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
                    <span className="text-foreground/70">
                      {locale === 'fr' ? 'Sous-total' : 'Subtotal'}
                    </span>
                    <span className="font-medium">
                      {(calculateTotal() - (calculateTotal() >= 55 ? 0 : 5)).toFixed(2)}€
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-foreground/70">
                      {locale === 'fr' ? 'Livraison' : 'Shipping'}
                    </span>
                    <span className="font-medium">
                      {calculateTotal() - 5 >= 50
                        ? locale === 'fr'
                          ? 'Gratuit'
                          : 'Free'
                        : '5.00€'}
                    </span>
                  </div>
                  <div className="flex justify-between text-lg font-semibold pt-2 border-t border-gray-200">
                    <span className="text-primary">{locale === 'fr' ? 'Total' : 'Total'}</span>
                    <span className="text-secondary">{calculateTotal().toFixed(2)}€</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer locale={locale} />
    </>
  );
}