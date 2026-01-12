'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { useCartStore } from '@/lib/stores/cart';
import { Button } from '@/components/ui/button';
import axios from 'axios';
import { Trash2, Plus, Minus } from 'lucide-react';
import { toast } from 'sonner';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import Image from 'next/image';

export default function CartPage() {
  const t = useTranslations('cart');
  const params = useParams();
  const locale = params.locale as string;
  const { cart, updateCartItem, removeFromCart } = useCartStore();
  const [products, setProducts] = useState<any>({});
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
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateQuantity = async (item: any, newQuantity: number) => {
    if (newQuantity < 1) return;
    try {
      await updateCartItem(item.product_id, item.size, item.color, newQuantity);
    } catch (error) {
      toast.error(locale === 'fr' ? 'Erreur lors de la mise à jour' : 'Error updating cart');
    }
  };

  const handleRemove = async (item: any) => {
    try {
      await removeFromCart(item.product_id, item.size, item.color);
      toast.success(locale === 'fr' ? 'Article retiré du panier' : 'Item removed from cart');
    } catch (error) {
      toast.error(locale === 'fr' ? 'Erreur lors de la suppression' : 'Error removing item');
    }
  };

  const calculateTotal = () => {
    return (
      cart?.items?.reduce((total, item) => {
        const product = products[item.product_id];
        return total + (product?.price || 0) * item.quantity;
      }, 0) || 0
    );
  };

  if (loading) {
    return (
      <>
        <Navbar locale={locale} />
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
        </div>
        <Footer locale={locale} />
      </>
    );
  }

  if (!cart?.items?.length) {
    return (
      <>
        <Navbar locale={locale} />
        <div className="min-h-screen flex flex-col items-center justify-center">
          <div className="texture-overlay" />
          <h1 className="text-3xl font-serif text-primary mb-4">{t('empty')}</h1>
          <Button
            onClick={() => (window.location.href = `/${locale}/shop`)}
            className="bg-primary text-primary-foreground rounded-full px-8 py-3 hover:bg-primary/90 transition-all duration-300"
          >
            {t('continue_shopping')}
          </Button>
        </div>
        <Footer locale={locale} />
      </>
    );
  }

  return (
    <>
      <Navbar locale={locale} />
      <div className="min-h-screen">
        <div className="texture-overlay" />
        <div className="max-w-[1200px] mx-auto px-6 md:px-12 py-12">
          <h1 className="text-4xl md:text-5xl font-serif tracking-tight text-primary mb-8">
            {t('title')}
          </h1>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-4">
              {cart.items.map((item, idx) => {
                const product = products[item.product_id];
                if (!product) return null;

                return (
                  <div
                    key={`${item.product_id}-${item.size}-${item.color}`}
                    className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-sm p-6 flex gap-6"
                  >
                    <div className="relative w-24 h-32 flex-shrink-0">
                      <Image
                        src={product.images[0]}
                        alt={product.name}
                        fill
                        className="object-cover rounded-lg"
                      />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-primary mb-1">{product.name}</h3>
                      <p className="text-sm text-foreground/70 mb-2">
                        {locale === 'fr' ? 'Taille' : 'Size'}: {item.size} |{' '}
                        {locale === 'fr' ? 'Couleur' : 'Color'}: {item.color}
                      </p>
                      <p className="text-lg text-secondary font-semibold mb-4">
                        {product.price.toFixed(2)}€
                      </p>

                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleUpdateQuantity(item, item.quantity - 1)}
                            className="w-8 h-8 rounded-lg border border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-colors"
                          >
                            <Minus className="w-4 h-4 mx-auto" />
                          </button>
                          <span className="font-medium w-8 text-center">{item.quantity}</span>
                          <button
                            onClick={() => handleUpdateQuantity(item, item.quantity + 1)}
                            className="w-8 h-8 rounded-lg border border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-colors"
                          >
                            <Plus className="w-4 h-4 mx-auto" />
                          </button>
                        </div>

                        <button
                          onClick={() => handleRemove(item)}
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
                <h2 className="text-2xl font-serif text-primary mb-6">
                  {locale === 'fr' ? 'Résumé' : 'Summary'}
                </h2>

                <div className="space-y-3 mb-6">
                  <div className="flex justify-between">
                    <span className="text-foreground/70">{t('subtotal')}</span>
                    <span className="font-medium">{calculateTotal().toFixed(2)}€</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-foreground/70">{t('shipping')}</span>
                    <span className="font-medium">
                      {calculateTotal() >= 50
                        ? locale === 'fr'
                          ? 'Gratuit'
                          : 'Free'
                        : '5.00€'}
                    </span>
                  </div>
                  <div className="border-t border-gray-200 pt-3 flex justify-between text-lg font-semibold">
                    <span className="text-primary">{t('total')}</span>
                    <span className="text-secondary">
                      {(calculateTotal() + (calculateTotal() >= 50 ? 0 : 5)).toFixed(2)}€
                    </span>
                  </div>
                </div>

                {calculateTotal() < 50 && (
                  <p className="text-sm text-foreground/70 mb-6">
                    {locale === 'fr'
                      ? `Ajoutez ${(50 - calculateTotal()).toFixed(2)}€ pour la livraison gratuite`
                      : `Add €${(50 - calculateTotal()).toFixed(2)} for free shipping`}
                  </p>
                )}

                <Button
                  onClick={() => (window.location.href = `/${locale}/checkout`)}
                  className="w-full bg-primary text-primary-foreground rounded-full px-8 py-3 hover:bg-primary/90 transition-all duration-300 shadow-lg hover:shadow-xl font-medium tracking-wide"
                >
                  {t('checkout')}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer locale={locale} />
    </>
  );
}
