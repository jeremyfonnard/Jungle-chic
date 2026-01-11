'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { useAuthStore } from '@/lib/stores/auth';
import axios from 'axios';
import { Package, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';

export default function AccountPage() {
  const t = useTranslations('account');
  const params = useParams();
  const locale = params.locale as string;
  const { user, token } = useAuthStore();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('orders');

  useEffect(() => {
    if (!user) {
      window.location.href = `/${locale}/auth`;
      return;
    }
    fetchOrders();
  }, [user]);

  const fetchOrders = async () => {
    try {
      const response = await axios.get('/api/orders', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setOrders(response.data);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      case 'shipped':
        return 'bg-purple-100 text-purple-800';
      case 'delivered':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const translateStatus = (status: string) => {
    if (locale === 'fr') {
      const translations: any = {
        confirmed: 'Confirmée',
        processing: 'En traitement',
        shipped: 'Expédiée',
        delivered: 'Livrée',
      };
      return translations[status] || status;
    }
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  if (!user) return null;

  return (
    <>
      <Navbar locale={locale} />
      <div className="min-h-screen">
        <div className="texture-overlay" />
        <div className="max-w-[1200px] mx-auto px-6 md:px-12 py-12">
          <h1 className="text-4xl md:text-5xl font-serif tracking-tight text-primary mb-8">
            {t('title')}
          </h1>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            <aside className="lg:col-span-1">
              <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-sm p-6">
                <div className="flex flex-col gap-2">
                  <button
                    onClick={() => setActiveTab('orders')}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                      activeTab === 'orders'
                        ? 'bg-primary text-primary-foreground'
                        : 'hover:bg-primary/10 text-foreground'
                    }`}
                  >
                    <Package className="w-5 h-5" />
                    {t('orders')}
                  </button>
                  <button
                    onClick={() => setActiveTab('profile')}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                      activeTab === 'profile'
                        ? 'bg-primary text-primary-foreground'
                        : 'hover:bg-primary/10 text-foreground'
                    }`}
                  >
                    <User className="w-5 h-5" />
                    {t('profile')}
                  </button>
                </div>
              </div>
            </aside>

            <main className="lg:col-span-3">
              {activeTab === 'orders' && (
                <div>
                  <h2 className="text-2xl font-serif text-primary mb-6">{t('orders')}</h2>
                  {loading ? (
                    <div className="flex items-center justify-center py-12">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
                    </div>
                  ) : orders.length === 0 ? (
                    <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-sm p-12 text-center">
                      <p className="text-foreground/70 mb-4">{t('no_orders')}</p>
                      <Button
                        onClick={() => (window.location.href = `/${locale}/shop`)}
                        className="bg-primary text-primary-foreground rounded-full px-8 py-3 hover:bg-primary/90"
                      >
                        {locale === 'fr' ? 'Commencer mes achats' : 'Start shopping'}
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {orders.map((order, idx) => (
                        <div
                          key={order.id}
                          className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-sm p-6"
                        >
                          <div className="flex justify-between items-start mb-4">
                            <div>
                              <p className="text-sm text-foreground/70 mb-1">
                                {t('order_number')} #{order.id.slice(0, 8)}
                              </p>
                              <p className="text-xs text-foreground/50">
                                {new Date(order.created_at).toLocaleDateString(locale, {
                                  year: 'numeric',
                                  month: 'long',
                                  day: 'numeric',
                                })}
                              </p>
                            </div>
                            <div className="flex flex-col items-end gap-2">
                              <span
                                className={`px-3 py-1 rounded-full text-xs font-medium ${
                                  getStatusColor(order.order_status)
                                }`}
                              >
                                {translateStatus(order.order_status)}
                              </span>
                              <span className="text-lg font-semibold text-secondary">
                                {order.total_amount.toFixed(2)}€
                              </span>
                            </div>
                          </div>

                          <div className="space-y-2">
                            {order.items.map((item: any, itemIdx: number) => (
                              <div key={itemIdx} className="flex justify-between text-sm">
                                <span className="text-foreground/80">
                                  {item.product_name} - {item.size} | {item.color} x{item.quantity}
                                </span>
                                <span className="text-foreground/70">
                                  {(item.price * item.quantity).toFixed(2)}€
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'profile' && (
                <div>
                  <h2 className="text-2xl font-serif text-primary mb-6">{t('profile')}</h2>
                  <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-sm p-8">
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm text-foreground/70">
                          {locale === 'fr' ? 'Prénom' : 'First name'}
                        </label>
                        <p className="text-lg font-medium text-primary">{user.first_name}</p>
                      </div>
                      <div>
                        <label className="text-sm text-foreground/70">
                          {locale === 'fr' ? 'Nom' : 'Last name'}
                        </label>
                        <p className="text-lg font-medium text-primary">{user.last_name}</p>
                      </div>
                      <div>
                        <label className="text-sm text-foreground/70">Email</label>
                        <p className="text-lg font-medium text-primary">{user.email}</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </main>
          </div>
        </div>
      </div>
      <Footer locale={locale} />
    </>
  );
}