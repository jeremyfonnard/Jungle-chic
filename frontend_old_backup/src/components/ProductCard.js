import React from 'react';
import { Link } from 'react-router-dom';

export const ProductCard = ({ product }) => {
  return (
    <Link
      to={`/product/${product.id}`}
      data-testid={`product-card-${product.id}`}
      className="group relative flex flex-col gap-4 product-card"
    >
      <div className="aspect-[3/4] overflow-hidden rounded-2xl bg-gray-100 relative">
        <img
          src={product.images[0]}
          alt={product.name}
          className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-105 product-image"
        />
        {product.featured && (
          <span className="absolute top-4 left-4 bg-accent text-accent-foreground px-3 py-1 rounded-full text-sm font-medium">
            Vedette
          </span>
        )}
      </div>
      <div className="flex flex-col gap-2">
        <h3 className="text-lg font-medium text-primary">{product.name}</h3>
        <p className="text-base text-secondary font-semibold">{product.price.toFixed(2)}€</p>
      </div>
    </Link>
  );
};