'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import axios from 'axios';
import Image from 'next/image';
import { useAuthStore } from '@/lib/stores/auth';
import { useCartStore } from '@/lib/stores/cart';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { ShoppingBag, Heart } from 'lucide-react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';

export default function ProductDetailPage() {
  const t = useTranslations('products');
  const params = useParams();
  const locale = params.locale as string;
  const productId = params.id as string;
  const { user } = useAuthStore();
  const { addToCart } = useCartStore();
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [currentImage, setCurrentImage] = useState(0);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    fetchProduct();
  }, [productId]);

  const fetchProduct = async () => {
    try {
      const response = await axios.get(`/api/products/${productId}`);
      setProduct(response.data);
      if (response.data.sizes?.length > 0) {
        setSelectedSize(response.data.sizes[0]);
      }
      if (response.data.colors?.length > 0) {
        setSelectedColor(response.data.colors[0]);
      }
    } catch (error) {
      console.error('Error fetching product:', error);
      toast.error(locale === 'fr' ? 'Produit introuvable' : 'Product not found');
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async () => {
    if (!user) {
      toast.error(
        locale === 'fr'
          ? 'Veuillez vous connecter pour ajouter au panier'
          : 'Please login to add to cart'
      );
      window.location.href = `/${locale}/auth`;
      return;
    }

    if (!selectedSize || !selectedColor) {
      toast.error(
        locale === 'fr'
          ? 'Veuillez sélectionner une taille et une couleur'
          : 'Please select a size and color'
      );
      return;
    }

    try {
      await addToCart(product.id, selectedSize, selectedColor, quantity);
      toast.success(t('add_success'));
    } catch (error) {
      toast.error(locale === 'fr' ? "Erreur lors de l'ajout au panier" : 'Error adding to cart');
    }
  };

  if (loading) {
    return (
      <>
        <Navbar locale={locale} />
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
        </div>
        <Footer locale={locale} />
      </>
    );
  }

  if (!product) return null;

  return (
    <>
      <Navbar locale={locale} />
      <div className="min-h-screen">
        <div className="texture-overlay" />
        <div className="max-w-[1600px] mx-auto px-6 md:px-12 lg:px-24 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div>
              <div className="aspect-[3/4] overflow-hidden rounded-2xl bg-gray-100 mb-4 relative">
                <Image
                  src={product.images[currentImage]}
                  alt={product.name}
                  fill
                  className="object-cover"
                />
              </div>
              {product.images.length > 1 && (
                <div className="grid grid-cols-4 gap-4">
                  {product.images.map((img: string, idx: number) => (
                    <button
                      key={idx}
                      onClick={() => setCurrentImage(idx)}
                      className={`aspect-square overflow-hidden rounded-lg relative ${
                        currentImage === idx ? 'ring-2 ring-primary' : ''
                      }`}
                    >
                      <Image src={img} alt={`${product.name} ${idx + 1}`} fill className="object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div>
              <h1 className="text-4xl md:text-5xl font-serif tracking-tight text-primary mb-4">
                {product.name}
              </h1>
              <p className="text-3xl text-secondary font-semibold mb-6">{product.price.toFixed(2)}€</p>
              <p className="text-base leading-relaxed text-foreground/80 mb-8">{product.description}</p>

              <div className="space-y-6">
                <div>
                  <label className="block font-medium mb-2 text-primary">{t('size')}</label>
                  <Select value={selectedSize} onValueChange={setSelectedSize}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {product.sizes.map((size: string) => (
                        <SelectItem key={size} value={size}>
                          {size}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="block font-medium mb-2 text-primary">{t('color')}</label>
                  <div className="flex gap-3">
                    {product.colors.map((color: string) => (
                      <button
                        key={color}
                        onClick={() => setSelectedColor(color)}
                        className={`px-4 py-2 rounded-lg border-2 transition-all ${
                          selectedColor === color
                            ? 'border-primary bg-primary text-primary-foreground'
                            : 'border-gray-300 hover:border-primary'
                        }`}
                      >
                        {color}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block font-medium mb-2 text-primary">
                    {locale === 'fr' ? 'Quantité' : 'Quantity'}
                  </label>
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="w-10 h-10 rounded-lg border border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-colors"
                    >
                      -
                    </button>
                    <span className="text-lg font-medium">{quantity}</span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="w-10 h-10 rounded-lg border border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-colors"
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className="flex gap-4 pt-4">
                  <Button
                    onClick={handleAddToCart}
                    className="flex-1 bg-primary text-primary-foreground rounded-full px-8 py-4 hover:bg-primary/90 transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-1 font-medium tracking-wide"
                  >
                    <ShoppingBag className="mr-2 w-5 h-5" />
                    {locale === 'fr' ? 'Ajouter au panier' : 'Add to cart'}
                  </Button>
                  <Button
                    variant="outline"
                    className="w-12 h-12 rounded-full border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground"
                  >
                    <Heart className="w-5 h-5" />
                  </Button>
                </div>
              </div>

              <div className="mt-12 space-y-4 border-t border-gray-200 pt-8">
                <div>
                  <h3 className="font-semibold text-primary mb-2">
                    {locale === 'fr' ? 'Livraison' : 'Shipping'}
                  </h3>
                  <p className="text-foreground/70">
                    {locale === 'fr' ? "Livraison gratuite dès 50€ d'achat" : 'Free shipping over €50'}
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold text-primary mb-2">
                    {locale === 'fr' ? 'Retours' : 'Returns'}
                  </h3>
                  <p className="text-foreground/70">
                    {locale === 'fr' ? 'Retours gratuits sous 30 jours' : 'Free returns within 30 days'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer locale={locale} />
    </>
  );
}