'use client';

import Link from 'next/link';
import Image from 'next/image';

interface Product {
  id: string;
  name: string;
  price: number;
  images: string[];
  featured?: boolean;
}

export function ProductCard({ product, locale }: { product: Product; locale: string }) {
  return (
    <Link
      href={`/${locale}/product/${product.id}`}
      data-testid={`product-card-${product.id}`}
      className="group relative flex flex-col gap-4 product-card"
    >
      <div className="aspect-[3/4] overflow-hidden rounded-2xl bg-gray-100 relative">
        <Image
          src={product.images[0]}
          alt={product.name}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-105 product-image"
        />
        {product.featured && (
          <span className="absolute top-4 left-4 bg-accent text-accent-foreground px-3 py-1 rounded-full text-sm font-medium">
            {locale === 'fr' ? 'Vedette' : 'Featured'}
          </span>
        )}
      </div>
      <div className="flex flex-col gap-2">
        <h3 className="text-lg font-medium text-primary">{product.name}</h3>
        <p className="text-base text-secondary font-semibold">{product.price.toFixed(2)}€</p>
      </div>
    </Link>
  );
}