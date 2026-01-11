'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { useAuthStore } from '@/lib/stores/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';

export default function AuthPage() {
  const t = useTranslations('auth');
  const params = useParams();
  const locale = params.locale as string;
  const { login, register } = useAuthStore();
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    first_name: '',
    last_name: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isLogin) {
        await login(formData.email, formData.password);
        toast.success(t('login_success'));
      } else {
        await register(formData.email, formData.password, formData.first_name, formData.last_name);
        toast.success(t('signup_success'));
      }
      window.location.href = `/${locale}/home`;
    } catch (error: any) {
      toast.error(error.response?.data?.detail || (locale === 'fr' ? 'Une erreur est survenue' : 'An error occurred'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar locale={locale} />
      <div className="min-h-screen flex items-center justify-center py-12">
        <div className="texture-overlay" />
        <div className="max-w-md w-full mx-4">
          <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-lg p-8">
            <h1 className="text-3xl font-serif font-bold text-center text-primary mb-8">
              {isLogin ? t('login_title') : t('signup_title')}
            </h1>

            <form onSubmit={handleSubmit} className="space-y-6">
              {!isLogin && (
                <>
                  <div>
                    <Label htmlFor="first_name">{t('first_name')}</Label>
                    <Input
                      id="first_name"
                      type="text"
                      value={formData.first_name}
                      onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                      required
                      className="rounded-xl border-primary/20 bg-white/50 focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all duration-200"
                    />
                  </div>
                  <div>
                    <Label htmlFor="last_name">{t('last_name')}</Label>
                    <Input
                      id="last_name"
                      type="text"
                      value={formData.last_name}
                      onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                      required
                      className="rounded-xl border-primary/20 bg-white/50 focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all duration-200"
                    />
                  </div>
                </>
              )}

              <div>
                <Label htmlFor="email">{t('email')}</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                  className="rounded-xl border-primary/20 bg-white/50 focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all duration-200"
                />
              </div>

              <div>
                <Label htmlFor="password">{t('password')}</Label>
                <Input
                  id="password"
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required
                  className="rounded-xl border-primary/20 bg-white/50 focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all duration-200"
                />
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-primary text-primary-foreground rounded-full px-8 py-3 hover:bg-primary/90 transition-all duration-300 shadow-lg hover:shadow-xl font-medium tracking-wide"
              >
                {loading
                  ? (locale === 'fr' ? 'Chargement...' : 'Loading...')
                  : isLogin
                  ? t('login_button')
                  : t('signup_button')}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <button
                onClick={() => setIsLogin(!isLogin)}
                className="text-primary hover:text-secondary transition-colors underline-offset-4 hover:underline"
              >
                {isLogin ? t('no_account') : t('have_account')}
              </button>
            </div>
          </div>
        </div>
      </div>
      <Footer locale={locale} />
    </>
  );
}