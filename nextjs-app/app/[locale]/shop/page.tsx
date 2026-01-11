'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import axios from 'axios';
import { ProductCard } from '@/components/ProductCard';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Filter } from 'lucide-react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';

export default function ShopPage() {
  const t = useTranslations('products');
  const params = useParams();
  const locale = params.locale as string;
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState('all');
  const [priceRange, setPriceRange] = useState([0, 200]);
  const [sortBy, setSortBy] = useState('featured');
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [products, category, priceRange, sortBy]);

  const fetchProducts = async () => {
    try {
      const response = await axios.get('/api/products');
      setProducts(response.data);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...products];

    if (category !== 'all') {
      filtered = filtered.filter((p: any) => p.category === category);
    }

    filtered = filtered.filter((p: any) => p.price >= priceRange[0] && p.price <= priceRange[1]);

    if (sortBy === 'price-asc') {
      filtered.sort((a: any, b: any) => a.price - b.price);
    } else if (sortBy === 'price-desc') {
      filtered.sort((a: any, b: any) => b.price - a.price);
    } else if (sortBy === 'featured') {
      filtered.sort((a: any, b: any) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
    }

    setFilteredProducts(filtered);
  };

  const categories = ['all', 'one-piece', 'bikini', 'tankini', 'cover-up'];
  const categoryLabels = {
    all: locale === 'fr' ? 'Tous' : 'All',
    'one-piece': locale === 'fr' ? 'Une pièce' : 'One-piece',
    bikini: 'Bikini',
    tankini: 'Tankini',
    'cover-up': locale === 'fr' ? 'Paréos' : 'Cover-ups',
  };

  return (
    <>
      <Navbar locale={locale} />
      <div className=\"min-h-screen\">
        <div className=\"texture-overlay\" />

        <section className=\"bg-primary text-primary-foreground py-16\">
          <div className=\"max-w-[1600px] mx-auto px-6 md:px-12 lg:px-24 text-center\">
            <h1 data-testid=\"shop-title\" className=\"text-5xl md:text-6xl font-serif tracking-tight mb-4\">
              {locale === 'fr' ? 'Notre Collection' : 'Our Collection'}
            </h1>
            <p className=\"text-lg md:text-xl leading-relaxed opacity-90\">
              {locale === 'fr'
                ? 'Découvrez nos maillots de bain élégants pour toutes les occasions'
                : 'Discover our elegant swimwear for all occasions'}
            </p>
          </div>
        </section>

        <div className=\"max-w-[1600px] mx-auto px-6 md:px-12 lg:px-24 py-12\">
          <div className=\"flex flex-col lg:flex-row gap-12\">
            <aside className=\"lg:w-64 flex-shrink-0\">
              <div className=\"lg:sticky lg:top-24\">
                <div className=\"flex items-center justify-between mb-6\">
                  <h2 className=\"text-xl font-serif font-semibold text-primary\">{t('filter')}</h2>
                  <Button
                    variant=\"ghost\"
                    size=\"sm\"
                    onClick={() => setShowFilters(!showFilters)}
                    className=\"lg:hidden\"
                  >
                    <Filter className=\"w-5 h-5\" />
                  </Button>
                </div>

                <div className={`${showFilters ? 'block' : 'hidden'} lg:block space-y-8`}>
                  <div>
                    <h3 className=\"font-medium mb-3 text-primary\">{t('category')}</h3>
                    <div className=\"space-y-2\">
                      {categories.map((cat) => (
                        <button
                          key={cat}
                          onClick={() => setCategory(cat)}
                          className={`block w-full text-left px-3 py-2 rounded-lg transition-colors ${
                            category === cat
                              ? 'bg-primary text-primary-foreground'
                              : 'hover:bg-primary/10 text-foreground'
                          }`}
                        >
                          {categoryLabels[cat as keyof typeof categoryLabels]}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className=\"font-medium mb-3 text-primary\">{t('price')} (€)</h3>
                    <Slider
                      min={0}
                      max={200}
                      step={10}
                      value={priceRange}
                      onValueChange={setPriceRange}
                      className=\"mb-2\"
                    />
                    <div className=\"flex justify-between text-sm text-foreground/70\">
                      <span>{priceRange[0]}€</span>
                      <span>{priceRange[1]}€</span>
                    </div>
                  </div>

                  <div>
                    <h3 className=\"font-medium mb-3 text-primary\">{t('sort')}</h3>
                    <Select value={sortBy} onValueChange={setSortBy}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value=\"featured\">
                          {locale === 'fr' ? 'Vedettes' : 'Featured'}
                        </SelectItem>
                        <SelectItem value=\"price-asc\">
                          {locale === 'fr' ? 'Prix croissant' : 'Price: Low to High'}
                        </SelectItem>
                        <SelectItem value=\"price-desc\">
                          {locale === 'fr' ? 'Prix décroissant' : 'Price: High to Low'}
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </aside>

            <main className=\"flex-1\">
              <div className=\"mb-6\">
                <p className=\"text-foreground/70\">
                  {filteredProducts.length} {locale === 'fr' ? 'produit' : 'product'}
                  {filteredProducts.length > 1 ? 's' : ''}
                </p>
              </div>

              {loading ? (
                <div className=\"grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16\">
                  {[1, 2, 3, 4, 5, 6].map((i) => (
                    <div key={i} className=\"animate-pulse\">
                      <div className=\"aspect-[3/4] bg-gray-200 rounded-2xl mb-4\" />
                      <div className=\"h-4 bg-gray-200 rounded w-3/4 mb-2\" />
                      <div className=\"h-4 bg-gray-200 rounded w-1/4\" />
                    </div>
                  ))}
                </div>
              ) : filteredProducts.length === 0 ? (
                <div className=\"text-center py-20\">
                  <p className=\"text-xl text-foreground/70\">
                    {locale === 'fr' ? 'Aucun produit trouvé' : 'No products found'}
                  </p>
                </div>
              ) : (
                <div className=\"grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16\">
                  {filteredProducts.map((product: any) => (
                    <ProductCard key={product.id} product={product} locale={locale} />
                  ))}
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
