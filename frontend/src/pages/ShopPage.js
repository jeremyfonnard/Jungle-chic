import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { ProductCard } from '../components/ProductCard';
import { Button } from '../components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Slider } from '../components/ui/slider';
import { Filter } from 'lucide-react';

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

export default function ShopPage() {
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
      const response = await axios.get(`${API}/products`);
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
      filtered = filtered.filter((p) => p.category === category);
    }

    filtered = filtered.filter((p) => p.price >= priceRange[0] && p.price <= priceRange[1]);

    if (sortBy === 'price-asc') {
      filtered.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-desc') {
      filtered.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'featured') {
      filtered.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
    }

    setFilteredProducts(filtered);
  };

  const categories = ['all', 'one-piece', 'bikini', 'tankini', 'cover-up'];
  const categoryLabels = {
    all: 'Tous',
    'one-piece': 'Une pièce',
    bikini: 'Bikini',
    tankini: 'Tankini',
    'cover-up': 'Paréos',
  };

  return (
    <div className="min-h-screen">
      <div className="texture-overlay" />

      <section className="bg-primary text-primary-foreground py-16">
        <div className="max-w-[1600px] mx-auto px-6 md:px-12 lg:px-24 text-center">
          <h1 data-testid="shop-title" className="text-5xl md:text-6xl font-serif tracking-tight mb-4">
            Notre Collection
          </h1>
          <p className="text-lg md:text-xl leading-relaxed opacity-90">
            Découvrez nos maillots de bain élégants pour toutes les occasions
          </p>
        </div>
      </section>

      <div className="max-w-[1600px] mx-auto px-6 md:px-12 lg:px-24 py-12">
        <div className="flex flex-col lg:flex-row gap-12">
          <aside className="lg:w-64 flex-shrink-0">
            <div className="lg:sticky lg:top-24">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-serif font-semibold text-primary">Filtres</h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowFilters(!showFilters)}
                  data-testid="toggle-filters-button"
                  className="lg:hidden"
                >
                  <Filter className="w-5 h-5" />
                </Button>
              </div>

              <div className={`${showFilters ? 'block' : 'hidden'} lg:block space-y-8`}>
                <div>
                  <h3 className="font-medium mb-3 text-primary">Catégorie</h3>
                  <div className="space-y-2">
                    {categories.map((cat) => (
                      <button
                        key={cat}
                        data-testid={`category-filter-${cat}`}
                        onClick={() => setCategory(cat)}
                        className={`block w-full text-left px-3 py-2 rounded-lg transition-colors ${
                          category === cat
                            ? 'bg-primary text-primary-foreground'
                            : 'hover:bg-primary/10 text-foreground'
                        }`}
                      >
                        {categoryLabels[cat]}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="font-medium mb-3 text-primary">Prix (€)</h3>
                  <Slider
                    min={0}
                    max={200}
                    step={10}
                    value={priceRange}
                    onValueChange={setPriceRange}
                    data-testid="price-range-slider"
                    className="mb-2"
                  />
                  <div className="flex justify-between text-sm text-foreground/70">
                    <span>{priceRange[0]}€</span>
                    <span>{priceRange[1]}€</span>
                  </div>
                </div>

                <div>
                  <h3 className="font-medium mb-3 text-primary">Trier par</h3>
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger data-testid="sort-select">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="featured">Vedettes</SelectItem>
                      <SelectItem value="price-asc">Prix croissant</SelectItem>
                      <SelectItem value="price-desc">Prix décroissant</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </aside>

          <main className="flex-1">
            <div className="mb-6">
              <p className="text-foreground/70" data-testid="product-count">
                {filteredProducts.length} produit{filteredProducts.length > 1 ? 's' : ''}
              </p>
            </div>

            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="animate-pulse">
                    <div className="aspect-[3/4] bg-gray-200 rounded-2xl mb-4" />
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
                    <div className="h-4 bg-gray-200 rounded w-1/4" />
                  </div>
                ))}
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="text-center py-20">
                <p className="text-xl text-foreground/70">Aucun produit trouvé</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16">
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}