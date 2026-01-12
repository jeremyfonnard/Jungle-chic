import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';
import { Button } from '../components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { toast } from 'sonner';
import { ShoppingBag, Heart } from 'lucide-react';

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

export default function ProductDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [currentImage, setCurrentImage] = useState(0);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      const response = await axios.get(`${API}/products/${id}`);
      setProduct(response.data);
      if (response.data.sizes?.length > 0) {
        setSelectedSize(response.data.sizes[0]);
      }
      if (response.data.colors?.length > 0) {
        setSelectedColor(response.data.colors[0]);
      }
    } catch (error) {
      console.error('Error fetching product:', error);
      toast.error('Produit introuvable');
      navigate('/shop');
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async () => {
    if (!user) {
      toast.error('Veuillez vous connecter pour ajouter au panier');
      navigate('/auth');
      return;
    }

    if (!selectedSize || !selectedColor) {
      toast.error('Veuillez sélectionner une taille et une couleur');
      return;
    }

    try {
      await addToCart(product.id, selectedSize, selectedColor, quantity);
      toast.success('Ajouté au panier!');
    } catch (error) {
      toast.error('Erreur lors de l\'ajout au panier');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
      </div>
    );
  }

  if (!product) return null;

  return (
    <div className="min-h-screen">
      <div className="texture-overlay" />
      <div className="max-w-[1600px] mx-auto px-6 md:px-12 lg:px-24 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div>
            <div className="aspect-[3/4] overflow-hidden rounded-2xl bg-gray-100 mb-4">
              <img
                src={product.images[currentImage]}
                alt={product.name}
                data-testid="product-main-image"
                className="object-cover w-full h-full"
              />
            </div>
            {product.images.length > 1 && (
              <div className="grid grid-cols-4 gap-4">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentImage(idx)}
                    data-testid={`product-thumbnail-${idx}`}
                    className={`aspect-square overflow-hidden rounded-lg ${
                      currentImage === idx ? 'ring-2 ring-primary' : ''
                    }`}
                  >
                    <img src={img} alt={`${product.name} ${idx + 1}`} className="object-cover w-full h-full" />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div>
            <h1 data-testid="product-name" className="text-4xl md:text-5xl font-serif tracking-tight text-primary mb-4">
              {product.name}
            </h1>
            <p data-testid="product-price" className="text-3xl text-secondary font-semibold mb-6">
              {product.price.toFixed(2)}€
            </p>
            <p data-testid="product-description" className="text-base leading-relaxed text-foreground/80 mb-8">
              {product.description}
            </p>

            <div className="space-y-6">
              <div>
                <label className="block font-medium mb-2 text-primary">Taille</label>
                <Select value={selectedSize} onValueChange={setSelectedSize}>
                  <SelectTrigger data-testid="size-select">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {product.sizes.map((size) => (
                      <SelectItem key={size} value={size}>
                        {size}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block font-medium mb-2 text-primary">Couleur</label>
                <div className="flex gap-3">
                  {product.colors.map((color) => (
                    <button
                      key={color}
                      data-testid={`color-option-${color}`}
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
                <label className="block font-medium mb-2 text-primary">Quantité</label>
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    data-testid="quantity-decrease"
                    className="w-10 h-10 rounded-lg border border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-colors"
                  >
                    -
                  </button>
                  <span data-testid="quantity-value" className="text-lg font-medium">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    data-testid="quantity-increase"
                    className="w-10 h-10 rounded-lg border border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-colors"
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <Button
                  onClick={handleAddToCart}
                  data-testid="add-to-cart-button"
                  className="flex-1 bg-primary text-primary-foreground rounded-full px-8 py-4 hover:bg-primary/90 transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-1 font-medium tracking-wide"
                >
                  <ShoppingBag className="mr-2 w-5 h-5" />
                  Ajouter au panier
                </Button>
                <Button
                  variant="outline"
                  data-testid="wishlist-button"
                  className="w-12 h-12 rounded-full border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground"
                >
                  <Heart className="w-5 h-5" />
                </Button>
              </div>
            </div>

            <div className="mt-12 space-y-4 border-t border-gray-200 pt-8">
              <div>
                <h3 className="font-semibold text-primary mb-2">Livraison</h3>
                <p className="text-foreground/70">Livraison gratuite dès 50€ d'achat</p>
              </div>
              <div>
                <h3 className="font-semibold text-primary mb-2">Retours</h3>
                <p className="text-foreground/70">Retours gratuits sous 30 jours</p>
              </div>
              <div>
                <h3 className="font-semibold text-primary mb-2">Matériaux</h3>
                <p className="text-foreground/70">Tissu recyclé et durable</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}