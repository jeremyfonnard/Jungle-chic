'use client';

import { useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { useAuthStore } from '@/lib/stores/auth';
import axios from 'axios';
import { CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';

export default function CheckoutSuccessPage() {
  const t = useTranslations('checkout');
  const params = useParams();
  const searchParams = useSearchParams();
  const locale = params.locale as string;
  const { token } = useAuthStore();
  const [loading, setLoading] = useState(true);
  const [order, setOrder] = useState<any>(null);
  const [pollingAttempts, setPollingAttempts] = useState(0);

  const sessionId = searchParams.get('session_id');

  useEffect(() => {
    if (sessionId && token) {
      pollPaymentStatus();
    }
  }, [sessionId, token]);

  const pollPaymentStatus = async () => {
    const maxAttempts = 5;
    const pollInterval = 2000;

    if (pollingAttempts >= maxAttempts) {
      setLoading(false);
      return;
    }

    try {
      const response = await axios.get(`/api/payments/status/${sessionId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data.status === 'paid') {
        const orderResponse = await axios.get(`/api/orders/${response.data.order_id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setOrder(orderResponse.data);
        setLoading(false);
      } else {
        setPollingAttempts(pollingAttempts + 1);
        setTimeout(pollPaymentStatus, pollInterval);
      }
    } catch (error) {
      console.error('Error checking payment status:', error);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <>
        <Navbar locale={locale} />
        <div className="min-h-screen flex flex-col items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4" />
          <p className="text-foreground/70">
            {locale === 'fr' ? 'Vérification du paiement...' : 'Checking payment...'}
          </p>
        </div>
        <Footer locale={locale} />
      </>
    );
  }

  return (
    <>
      <Navbar locale={locale} />
      <div className="min-h-screen flex items-center justify-center">
        <div className="texture-overlay" />
        <div className="max-w-2xl mx-auto px-6 py-12 text-center">
          <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-lg p-12">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-12 h-12 text-green-600" />
            </div>

            <h1 className="text-4xl font-serif text-primary mb-4">{t('success_title')}</h1>

            <p className="text-lg text-foreground/80 mb-6">{t('success_message')}</p>

            {order && (
              <div className="bg-gray-50 rounded-lg p-6 mb-6 text-left">
                <p className="text-sm text-foreground/70 mb-2">
                  <strong>{locale === 'fr' ? 'Numéro de commande:' : 'Order number:'}</strong>{' '}                  {order.id}
                </p>
                <p className="text-sm text-foreground/70">
                  <strong>{locale === 'fr' ? 'Montant total:' : 'Total amount:'}</strong>{' '}
                  {order.total_amount.toFixed(2)}€
                </p>
              </div>
            )}

            <div className="flex gap-4 justify-center">
              <Button
                onClick={() => (window.location.href = `/${locale}/account`)}
                className="bg-primary text-primary-foreground rounded-full px-8 py-3 hover:bg-primary/90 transition-all duration-300"
              >
                {locale === 'fr' ? 'Voir mes commandes' : 'View orders'}
              </Button>
              <Button
                onClick={() => (window.location.href = `/${locale}/shop`)}
                variant="outline"
                className="border-2 border-primary text-primary rounded-full px-8 py-3 hover:bg-primary hover:text-primary-foreground transition-all duration-300"
              >
                {locale === 'fr' ? 'Continuer mes achats' : 'Continue shopping'}
              </Button>
            </div>
          </div>
        </div>
      </div>
      <Footer locale={locale} />
    </>
  );
}