import React from 'react';
import { Button } from '../components/ui/button';
import { useNavigate } from 'react-router-dom';
import { Leaf, Droplets, Heart } from 'lucide-react';

export default function AboutPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen">
      <div className="texture-overlay" />

      <section className="bg-primary text-primary-foreground py-20">
        <div className="max-w-[1200px] mx-auto px-6 md:px-12 lg:px-24 text-center">
          <h1 data-testid="about-title" className="text-5xl md:text-6xl font-serif tracking-tight mb-6">
            Notre Histoire
          </h1>
          <p className="text-lg md:text-xl leading-relaxed opacity-90 max-w-3xl mx-auto">
            Une passion pour la mode durable et l'élégance naturelle
          </p>
        </div>
      </section>

      <section className="max-w-[1200px] mx-auto px-6 md:px-12 lg:px-24 py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl md:text-4xl font-serif text-primary mb-6">
              Élégance Tropicale
            </h2>
            <p className="text-base leading-relaxed text-foreground/80 mb-4">
              Jungle Chic est né d'une passion pour la beauté tropicale et le désir de créer des
              maillots de bain qui allient élégance, confort et durabilité.
            </p>
            <p className="text-base leading-relaxed text-foreground/80 mb-4">
              Chaque pièce est conçue avec soin pour sublimer votre silhouette tout en respectant
              l'environnement. Nous utilisons des matériaux recyclés et durables pour créer des
              maillots qui durent dans le temps.
            </p>
          </div>
          <div>
            <img
              src="https://images.unsplash.com/photo-1623114857732-02a86271e09f?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2NzB8MHwxfHNlYXJjaHwzfHx3b21hbiUyMGluJTIwc3dpbXdlYXIlMjB0cm9waWNhbCUyMGp1bmdsZSUyMGJlYWNoJTIwZWxlZ2FudHxlbnwwfHx8fDE3NjgxMzQ0MTd8MA&ixlib=rb-4.1.0&q=85"
              alt="Élégance tropicale"
              className="rounded-2xl shadow-lg w-full h-[500px] object-cover"
            />
          </div>
        </div>
      </section>

      <section className="bg-primary/5 py-20">
        <div className="max-w-[1200px] mx-auto px-6 md:px-12 lg:px-24">
          <h2 className="text-3xl md:text-4xl font-serif text-primary text-center mb-12">
            Nos Valeurs
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Leaf className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-primary mb-3">Éco-responsable</h3>
              <p className="text-foreground/70">
                Matériaux recyclés et production éthique pour un impact environnemental minimal
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Droplets className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-primary mb-3">Qualité Premium</h3>
              <p className="text-foreground/70">
                Tissus de haute qualité, résistants au chlore et aux UV pour une durée de vie optimale
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-primary mb-3">Conçu avec Amour</h3>
              <p className="text-foreground/70">
                Chaque modèle est pensé pour sublimer toutes les morphologies avec élégance
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-[1200px] mx-auto px-6 md:px-12 lg:px-24 py-20 text-center">
        <h2 className="text-3xl md:text-4xl font-serif text-primary mb-6">
          Prête pour l'aventure ?
        </h2>
        <p className="text-lg text-foreground/80 mb-8 max-w-2xl mx-auto">
          Découvrez notre collection et trouvez le maillot parfait pour vos prochaines évasions
        </p>
        <Button
          onClick={() => navigate('/shop')}
          data-testid="about-shop-button"
          className="bg-primary text-primary-foreground rounded-full px-8 py-4 hover:bg-primary/90 transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-1 font-medium tracking-wide"
        >
          Découvrir la collection
        </Button>
      </section>
    </div>
  );
}