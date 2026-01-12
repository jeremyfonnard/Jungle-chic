import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ProductCard } from '../components/ProductCard';
import { Button } from '../components/ui/button';
import { ArrowRight } from 'lucide-react';

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

export default function HomePage() {
  const navigate = useNavigate();
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFeaturedProducts();
  }, []);

  const fetchFeaturedProducts = async () => {
    try {
      const response = await axios.get(`${API}/products?featured=true`);
      setFeaturedProducts(response.data.slice(0, 3));
    } catch (error) {
      console.error('Error fetching featured products:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen">
      <div className="texture-overlay" />

      <section
        className="relative h-[90vh] flex items-center justify-center hero-section"
        style={{
          backgroundImage:
            'url(https://images.unsplash.com/photo-1757196892910-e12bc2874300?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2NzB8MHwxfHNlYXJjaHwxfHx3b21hbiUyMGluJTIwc3dpbXdlYXIlMjB0cm9waWNhbCUyMGp1bmdsZSUyMGJlYWNoJTIwZWxlZ2FudHxlbnwwfHx8fDE3NjgxMzQ0MTd8MA&ixlib=rb-4.1.0&q=85)',
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
            Évasion Tropicale
          </h1>
          <p className="text-lg md:text-xl leading-relaxed mb-8 max-w-2xl mx-auto animate-fade-in">
            Découvrez notre collection de maillots de bain élégants inspirés par la beauté de la jungle
          </p>
          <Button
            onClick={() => navigate('/shop')}
            data-testid="hero-shop-button"
            className="bg-primary text-primary-foreground rounded-full px-8 py-4 hover:bg-primary/90 transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-1 font-medium tracking-wide"
          >
            Découvrir la collection <ArrowRight className="ml-2 w-5 h-5" />
          </Button>
        </div>
      </section>

      <section className="max-w-[1600px] mx-auto px-6 md:px-12 lg:px-24 py-20 md:py-32">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-serif tracking-tight mb-4 text-primary">
            Nos Coups de Cœur
          </h2>
          <p className="text-base leading-relaxed text-foreground/80 max-w-2xl mx-auto">
            Sélection exclusive de nos maillots les plus prisés
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
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}

        <div className="text-center mt-12">
          <Button
            onClick={() => navigate('/shop')}
            data-testid="see-all-products-button"
            className="bg-transparent border border-primary text-primary rounded-full px-8 py-4 hover:bg-primary hover:text-primary-foreground transition-all duration-300"
          >
            Voir toute la collection
          </Button>
        </div>
      </section>

      <section
        className="relative py-20 md:py-32"
        style={{
          backgroundImage:
            'url(https://images.unsplash.com/photo-1647378165401-8e101ed45ad8?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDQ2NDF8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBiZWFjaCUyMHJlc29ydCUyMHBvb2wlMjBqdW5nbGUlMjBiYWNrZ3JvdW5kfGVufDB8fHx8MTc2ODEzNDQyMXww&ixlib=rb-4.1.0&q=85)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed',
        }}
      >
        <div className="absolute inset-0 bg-black/40" />
        <div className="relative z-10 max-w-[1600px] mx-auto px-6 md:px-12 lg:px-24 text-center text-white">
          <h2 className="text-4xl md:text-5xl font-serif tracking-tight mb-6">
            Élégance Naturelle
          </h2>
          <p className="text-lg md:text-xl leading-relaxed max-w-3xl mx-auto mb-8">
            Chaque pièce est conçue avec soin pour sublimer votre silhouette tout en respectant
            l'environnement. Des matériaux durables pour une mode responsable.
          </p>
          <Button
            onClick={() => navigate('/about')}
            data-testid="learn-more-button"
            className="bg-white text-primary rounded-full px-8 py-4 hover:bg-white/90 transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-1 font-medium tracking-wide"
          >
            En savoir plus
          </Button>
        </div>
      </section>
    </div>
  );
}