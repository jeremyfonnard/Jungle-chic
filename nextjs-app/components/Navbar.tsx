'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ShoppingBag, User, Menu, X, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/lib/stores/auth';
import { useCartStore } from '@/lib/stores/cart';
import { useTranslations } from 'next-intl';
import { useState, useEffect } from 'react';

export function Navbar({ locale }: { locale: string }) {
  const t = useTranslations('nav');
  const { user, logout } = useAuthStore();
  const { cart } = useCartStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  const cartItemsCount = cart?.items?.reduce((acc, item) => acc + item.quantity, 0) || 0;

  const switchLocale = (newLocale: string) => {
    const newPath = pathname.replace(`/${locale}`, `/${newLocale}`);
    window.location.href = newPath;
  };

  return (
    <nav className="sticky top-0 z-50 glassmorphism shadow-sm">
      <div className="max-w-[1600px] mx-auto px-6 md:px-12 lg:px-24">
        <div className="flex justify-between items-center h-20">
          <Link href={`/${locale}/home`} className="text-2xl md:text-3xl font-serif font-bold text-primary">
            Jungle Chic
          </Link>

          <div className="hidden md:flex items-center gap-8">
            <Link
              href={`/${locale}/shop`}
              data-testid="nav-shop-link"
              className="text-primary hover:text-secondary transition-colors duration-200 font-medium"
            >
              {t('shop')}
            </Link>
            <Link
              href={`/${locale}/about`}
              data-testid="nav-about-link"
              className="text-primary hover:text-secondary transition-colors duration-200 font-medium"
            >
              {t('about')}
            </Link>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => switchLocale(locale === 'fr' ? 'en' : 'fr')}
              className="flex items-center gap-2 text-primary hover:text-secondary transition-colors"
              data-testid="language-switcher"
            >
              <Globe className="w-5 h-5" />
              <span className="text-sm font-medium">{locale.toUpperCase()}</span>
            </button>

            {user ? (
              <>
                <Button
                  variant="ghost"
                  onClick={() => (window.location.href = `/${locale}/account`)}
                  data-testid="nav-account-button"
                  className="text-primary hover:text-secondary"
                >
                  <User className="w-5 h-5" />
                </Button>
                <Button
                  variant="ghost"
                  onClick={() => (window.location.href = `/${locale}/cart`)}
                  data-testid="nav-cart-button"
                  className="text-primary hover:text-secondary relative"
                >
                  <ShoppingBag className="w-5 h-5" />
                  {cartItemsCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-accent text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {cartItemsCount}
                    </span>
                  )}
                </Button>
                <Button
                  onClick={logout}
                  data-testid="nav-logout-button"
                  variant="ghost"
                  className="hidden md:block text-primary hover:text-secondary"
                >
                  {t('logout')}
                </Button>
              </>
            ) : (
              <Button
                onClick={() => (window.location.href = `/${locale}/auth`)}
                data-testid="nav-login-button"
                className="bg-primary text-primary-foreground rounded-full px-8 py-2 hover:bg-primary/90 transition-all duration-300"
              >
                {t('login')}
              </Button>
            )}

            <button
              className="md:hidden text-primary"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              data-testid="mobile-menu-toggle"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden pb-4 border-t border-primary/10 mt-2" data-testid="mobile-menu">
            <div className="flex flex-col gap-4 pt-4">
              <Link
                href={`/${locale}/shop`}
                className="text-primary hover:text-secondary transition-colors duration-200 font-medium"
                onClick={() => setMobileMenuOpen(false)}
              >
                {t('shop')}
              </Link>
              <Link
                href={`/${locale}/about`}
                className="text-primary hover:text-secondary transition-colors duration-200 font-medium"
                onClick={() => setMobileMenuOpen(false)}
              >
                {t('about')}
              </Link>
              {user && (
                <button
                  onClick={() => {
                    logout();
                    setMobileMenuOpen(false);
                  }}
                  className="text-primary hover:text-secondary transition-colors duration-200 font-medium text-left"
                >
                  {t('logout')}
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}