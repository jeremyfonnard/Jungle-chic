'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import axios from 'axios';
import { ProductCard } from '@/components/ProductCard';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { useParams } from 'next/navigation';

export default function HomePage() {
  const t = useTranslations();
  const params = useParams();
  const locale = params.locale as string;
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFeaturedProducts();
  }, []);

  const fetchFeaturedProducts = async () => {
    try {
      const response = await axios.get('/api/products?featured=true');
      setFeaturedProducts(response.data.slice(0, 3));
    } catch (error) {
      console.error('Error fetching featured products:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar locale={locale} />
      <div className="min-h-screen">
        <div className="texture-overlay" />

        <section
          className="relative h-[90vh] flex items-center justify-center hero-section"
          style={{
            backgroundImage:
              'url(https://images.unsplash.com/photo-1762237722246-38491dbf281f?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2Njl8MHwxfHNlYXJjaHwxfHx0cm9waWNhbCUyMGJlYWNoJTIwdHVycXVvaXNlJTIwd2F0ZXIlMjBzYW5kfGVufDB8fHx8MTc2OTM0OTM1NHww&ixlib=rb-4.1.0&q=85)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          <div className="absolute inset-0 bg-black/20" />
          <div className="relative z-10 max-w-[1600px] mx-auto px-6 md:px-12 lg:px-24 text-center text-white">
            <h1
              data-testid="hero-title"
              className="text-5xl md:text-7xl font-serif tracking-tight leading-none mb-6 animate-fade-in"
            >
              {t('hero.title')}
            </h1>
            <p className="text-lg md:text-xl leading-relaxed mb-8 max-w-2xl mx-auto animate-fade-in">
              {t('hero.subtitle')}
            </p>
            <Button
              onClick={() => (window.location.href = `/${locale}/shop`)}
              data-testid="hero-shop-button"
              className="bg-primary text-primary-foreground rounded-full px-8 py-4 hover:bg-primary/90 transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-1 font-medium tracking-wide"
            >
              {t('hero.cta')} <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </div>
        </section>

        <section className="max-w-[1600px] mx-auto px-6 md:px-12 lg:px-24 py-20 md:py-32">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-serif tracking-tight mb-4 text-primary">
              {t('products.featured')}
            </h2>
            <p className="text-base leading-relaxed text-foreground/80 max-w-2xl mx-auto">
              {locale === 'fr'
                ? 'Sélection exclusive de nos maillots les plus prisés'
                : 'Exclusive selection of our most popular swimwear'}
            </p>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16">
              {[1, 2, 3].map((i) => (
                <div key={i} className="animate-pulse">
                  <div className="aspect-[3/4] bg-gray-200 rounded-2xl mb-4" />
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
                  <div className="h-4 bg-gray-200 rounded w-1/4" />
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16">
              {featuredProducts.map((product: any) => (
                <ProductCard key={product.id} product={product} locale={locale} />
              ))}
            </div>
          )}

          <div className="text-center mt-12">
            <Button
              onClick={() => (window.location.href = `/${locale}/shop`)}
              data-testid="see-all-products-button"
              className="bg-transparent border border-primary text-primary rounded-full px-8 py-4 hover:bg-primary hover:text-primary-foreground transition-all duration-300"
            >
              {locale === 'fr' ? 'Voir toute la collection' : 'View all collection'}
            </Button>
          </div>
        </section>

        <section
          className="relative py-20 md:py-32"
          style={{
            backgroundImage:
              'url(https://images.unsplash.com/photo-1585551896871-fb3cac6df620?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2Njl8MHwxfHNlYXJjaHwyfHx0cm9waWNhbCUyMGJlYWNoJTIwdHVycXVvaXNlJTIwd2F0ZXIlMjBzYW5kfGVufDB8fHx8MTc2OTM0OTM1NHww&ixlib=rb-4.1.0&q=85)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundAttachment: 'fixed',
          }}
        >
          <div className="absolute inset-0 bg-black/40" />
          <div className="relative z-10 max-w-[1600px] mx-auto px-6 md:px-12 lg:px-24 text-center text-white">
            <h2 className="text-4xl md:text-5xl font-serif tracking-tight mb-6">
              {locale === 'fr' ? 'Élégance Naturelle' : 'Natural Elegance'}
            </h2>
            <p className="text-lg md:text-xl leading-relaxed max-w-3xl mx-auto mb-8">
              {locale === 'fr'
                ? "Chaque pièce est conçue avec soin pour sublimer votre silhouette tout en respectant l'environnement. Des matériaux durables pour une mode responsable."
                : 'Each piece is carefully designed to enhance your figure while respecting the environment. Sustainable materials for responsible fashion.'}
            </p>
            <Button
              onClick={() => (window.location.href = `/${locale}/about`)}
              data-testid="learn-more-button"
              className="bg-white text-primary rounded-full px-8 py-4 hover:bg-white/90 transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-1 font-medium tracking-wide"
            >
              {locale === 'fr' ? 'En savoir plus' : 'Learn more'}
            </Button>
          </div>
        </section>
      </div>
      <Footer locale={locale} />
    </>
  );
}