import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';
import { CheckCircle } from 'lucide-react';
import { Button } from '../components/ui/button';

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

export default function CheckoutSuccessPage() {
  const navigate = useNavigate();
  const { token } = useAuth();
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [order, setOrder] = useState(null);
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
      const response = await axios.get(`${API}/payments/status/${sessionId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data.status === 'paid') {
        const orderResponse = await axios.get(`${API}/orders/${response.data.order_id}`, {
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
      <div className="min-h-screen flex flex-col items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4" />
        <p data-testid="payment-checking-message" className="text-foreground/70">Vérification du paiement...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="texture-overlay" />
      <div className="max-w-2xl mx-auto px-6 py-12 text-center">
        <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-lg p-12">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-12 h-12 text-green-600" />
          </div>
          
          <h1 data-testid="success-title" className="text-4xl font-serif text-primary mb-4">
            Commande confirmée !
          </h1>
          
          <p className="text-lg text-foreground/80 mb-6">
            Merci pour votre commande. Vous recevrez un email de confirmation sous peu.
          </p>

          {order && (
            <div className="bg-gray-50 rounded-lg p-6 mb-6 text-left">
              <p className="text-sm text-foreground/70 mb-2">
                <strong>Numéro de commande:</strong> {order.id}
              </p>
              <p className="text-sm text-foreground/70">
                <strong>Montant total:</strong> {order.total_amount.toFixed(2)}€
              </p>
            </div>
          )}

          <div className="flex gap-4 justify-center">
            <Button
              onClick={() => navigate('/account')}
              data-testid="view-orders-button"
              className="bg-primary text-primary-foreground rounded-full px-8 py-3 hover:bg-primary/90 transition-all duration-300"
            >
              Voir mes commandes
            </Button>
            <Button
              onClick={() => navigate('/shop')}
              data-testid="continue-shopping-button-success"
              variant="outline"
              className="border-2 border-primary text-primary rounded-full px-8 py-3 hover:bg-primary hover:text-primary-foreground transition-all duration-300"
            >
              Continuer mes achats
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}