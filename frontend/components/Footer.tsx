'use client';

import Link from 'next/link';
import { Facebook, Instagram, Twitter } from 'lucide-react';
import { useTranslations } from 'next-intl';

export function Footer({ locale }: { locale: string }) {
  const t = useTranslations('nav');

  return (
    <footer className="bg-primary text-primary-foreground mt-20">
      <div
        className="absolute inset-0 opacity-10 pointer-events-none"
        style={{
          backgroundImage:
            'url(https://images.unsplash.com/photo-1517008824309-6e915846619b?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1Nzh8MHwxfHNlYXJjaHwzfHx0cm9waWNhbCUyMHBhbG0lMjBsZWF2ZXMlMjB0ZXh0dXJlJTIwZWxlZ2FudCUyMHdhbGxwYXBlcnxlbnwwfHx8fDE3NjgxMzQ0MjB8MA&ixlib=rb-4.1.0&q=85)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />
      <div className="max-w-[1600px] mx-auto px-6 md:px-12 lg:px-24 py-16 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          <div>
            <h3 className="text-2xl font-serif font-bold mb-4">Jungle Chic</h3>
            <p className="text-primary-foreground/80 leading-relaxed">
              {locale === 'fr'
                ? 'Maillots de bain élégants inspirés par la nature tropicale.'
                : 'Elegant swimwear inspired by tropical nature.'}
            </p>
          </div>

          <div>
            <h4 className="font-semibold mb-4 text-lg">Navigation</h4>
            <div className="flex flex-col gap-2">
              <Link
                href={`/${locale}/shop`}
                className="text-primary-foreground/80 hover:text-primary-foreground transition-colors"
              >
                {t('shop')}
              </Link>
              <Link
                href={`/${locale}/about`}
                className="text-primary-foreground/80 hover:text-primary-foreground transition-colors"
              >
                {t('about')}
              </Link>
              <Link
                href={`/${locale}/account`}
                className="text-primary-foreground/80 hover:text-primary-foreground transition-colors"
              >
                {t('account')}
              </Link>
            </div>
          </div>

          <div>
            <h4 className="font-semibold mb-4 text-lg">
              {locale === 'fr' ? 'Service client' : 'Customer service'}
            </h4>
            <div className="flex flex-col gap-2">
              <a
                href="mailto:contact@junglechic.com"
                className="text-primary-foreground/80 hover:text-primary-foreground transition-colors"
              >
                contact@junglechic.com
              </a>
              <p className="text-primary-foreground/80">
                {locale === 'fr' ? 'Livraison gratuite dès 50€' : 'Free shipping over $50'}
              </p>
              <p className="text-primary-foreground/80">
                {locale === 'fr' ? 'Retours sous 30 jours' : '30-day returns'}
              </p>
            </div>
          </div>

          <div>
            <h4 className="font-semibold mb-4 text-lg">
              {locale === 'fr' ? 'Suivez-nous' : 'Follow us'}
            </h4>
            <div className="flex gap-4">
              <a
                href="#"
                className="text-primary-foreground/80 hover:text-primary-foreground transition-colors"
              >
                <Instagram className="w-6 h-6" />
              </a>
              <a
                href="#"
                className="text-primary-foreground/80 hover:text-primary-foreground transition-colors"
              >
                <Facebook className="w-6 h-6" />
              </a>
              <a
                href="#"
                className="text-primary-foreground/80 hover:text-primary-foreground transition-colors"
              >
                <Twitter className="w-6 h-6" />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-primary-foreground/20 text-center text-primary-foreground/60">
          <p>© 2024 Jungle Chic. {locale === 'fr' ? 'Tous droits réservés.' : 'All rights reserved.'}</p>
        </div>
      </div>
    </footer>
  );
}