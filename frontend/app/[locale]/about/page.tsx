'use client';

import { useParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import { Leaf, Droplets, Heart } from 'lucide-react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import Image from 'next/image';

export default function AboutPage() {
  const t = useTranslations('about');
  const params = useParams();
  const locale = params.locale as string;

  return (
    <>
      <Navbar locale={locale} />
      <div className="min-h-screen">
        <div className="texture-overlay" />

        <section className="bg-primary text-primary-foreground py-20">
          <div className="max-w-[1200px] mx-auto px-6 md:px-12 lg:px-24 text-center">
            <h1 className="text-5xl md:text-6xl font-serif tracking-tight mb-6">{t('title')}</h1>
            <p className="text-lg md:text-xl leading-relaxed opacity-90 max-w-3xl mx-auto">
              {t('subtitle')}
            </p>
          </div>
        </section>

        <section className="max-w-[1200px] mx-auto px-6 md:px-12 lg:px-24 py-20">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-serif text-primary mb-6">
                {locale === 'fr' ? 'Élégance Balnéaire' : 'Beach Elegance'}
              </h2>
              <p className="text-base leading-relaxed text-foreground/80 mb-4">{t('content')}</p>
              <p className="text-base leading-relaxed text-foreground/80 mb-4">
                {locale === 'fr'
                  ? "Chaque pièce est conçue avec soin pour sublimer votre silhouette tout en respectant l'environnement. Nous utilisons des matériaux recyclés et durables pour créer des maillots qui durent dans le temps."
                  : 'Each piece is carefully designed to enhance your figure while respecting the environment. We use recycled and sustainable materials to create swimwear that stands the test of time.'}
              </p>
            </div>
            <div className="relative aspect-[4/5]">
              <Image
                src="https://images.unsplash.com/photo-1619516962669-49187abe3893?w=800"
                alt="Élégance plage"
                fill
                className="rounded-2xl shadow-lg object-cover"
              />
            </div>
          </div>
        </section>

        <section className="bg-primary/5 py-20">
          <div className="max-w-[1200px] mx-auto px-6 md:px-12 lg:px-24">
            <h2 className="text-3xl md:text-4xl font-serif text-primary text-center mb-12">
              {locale === 'fr' ? 'Nos Valeurs' : 'Our Values'}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Leaf className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-primary mb-3">
                  {locale === 'fr' ? 'Éco-responsable' : 'Eco-Friendly'}
                </h3>
                <p className="text-foreground/70">
                  {locale === 'fr'
                    ? "Matériaux recyclés et production éthique pour un impact environnemental minimal"
                    : 'Recycled materials and ethical production for minimal environmental impact'}
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Droplets className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-primary mb-3">
                  {locale === 'fr' ? 'Qualité Premium' : 'Premium Quality'}
                </h3>
                <p className="text-foreground/70">
                  {locale === 'fr'
                    ? 'Tissus de haute qualité, résistants au chlore et aux UV pour une durée de vie optimale'
                    : 'High-quality fabrics, chlorine and UV resistant for optimal durability'}
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Heart className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-primary mb-3">
                  {locale === 'fr' ? 'Conçu avec Amour' : 'Made with Love'}
                </h3>
                <p className="text-foreground/70">
                  {locale === 'fr'
                    ? 'Chaque modèle est pensé pour sublimer toutes les morphologies avec élégance'
                    : 'Each design is crafted to enhance all body types with elegance'}
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="max-w-[1200px] mx-auto px-6 md:px-12 lg:px-24 py-20 text-center">
          <h2 className="text-3xl md:text-4xl font-serif text-primary mb-6">
            {locale === 'fr' ? "Prête pour l'aventure ?" : 'Ready for adventure?'}
          </h2>
          <p className="text-lg text-foreground/80 mb-8 max-w-2xl mx-auto">
            {locale === 'fr'
              ? 'Découvrez notre collection et trouvez le maillot parfait pour vos prochaines évasions'
              : 'Discover our collection and find the perfect swimsuit for your next getaway'}
          </p>
          <Button
            onClick={() => (window.location.href = `/${locale}/shop`)}
            className="bg-primary text-primary-foreground rounded-full px-8 py-4 hover:bg-primary/90 transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-1 font-medium tracking-wide"
          >
            {locale === 'fr' ? 'Découvrir la collection' : 'Discover the collection'}
          </Button>
        </section>
      </div>
      <Footer locale={locale} />
    </>
  );
}