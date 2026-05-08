import React, { useState } from 'react';
import { Heart, ShoppingCart, Star, ImageOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'wouter';

interface KnifeCardProps {
  id: string;
  name: string;
  image: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviewCount: number;
  stock: number;
  badge?: string;
  bladeLength: number;
  handleType: string;
  steelType: string;
  onAddToCart?: (id: string) => void;
}

export function KnifeCard({
  id,
  name,
  image,
  price,
  originalPrice,
  rating,
  reviewCount,
  stock,
  badge,
  bladeLength,
  handleType,
  steelType,
  onAddToCart,
}: KnifeCardProps) {
  const [isFavorite, setIsFavorite] = useState(false);
  const [imageError, setImageError] = useState(false);
  const discount = originalPrice ? Math.round(((originalPrice - price) / originalPrice) * 100) : 0;

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition overflow-hidden group">
      {/* Imagem */}
      <Link href={`/knife/${id}`}>
        <a className="relative block overflow-hidden bg-gray-100 aspect-square">
          {!imageError ? (
            <img
              src={image}
              alt={name}
              className="w-full h-full object-cover group-hover:scale-110 transition duration-300"
              onError={() => setImageError(true)}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-200">
              <ImageOff className="w-12 h-12 text-gray-400" />
            </div>
          )}

          {/* Badges */}
          <div className="absolute top-3 right-3 flex flex-col gap-2">
            {badge && (
              <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
                {badge}
              </span>
            )}
            {discount > 0 && (
              <span className="bg-green-500 text-white text-xs font-bold px-2 py-1 rounded">
                -{discount}%
              </span>
            )}
            {stock === 0 && (
              <span className="bg-gray-800 text-white text-xs font-bold px-2 py-1 rounded">
                Fora de Estoque
              </span>
            )}
          </div>

          {/* Overlay ao hover */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition flex items-center justify-center opacity-0 group-hover:opacity-100">
            <span className="text-white text-sm font-semibold">Ver Detalhes</span>
          </div>
        </a>
      </Link>

      {/* Conteúdo */}
      <div className="p-4 space-y-3">
        {/* Nome */}
        <Link href={`/knife/${id}`}>
          <a className="block">
            <h3 className="font-semibold text-gray-900 hover:text-amber-600 transition line-clamp-2">
              {name}
            </h3>
          </a>
        </Link>

        {/* Especificações Rápidas */}
        <div className="flex flex-wrap gap-2">
          <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
            {bladeLength}cm
          </span>
          <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
            {handleType}
          </span>
          <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
            {steelType}
          </span>
        </div>

        {/* Rating */}
        <div className="flex items-center gap-1">
          <div className="flex gap-0.5">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-3 h-3 ${
                  i < Math.floor(rating)
                    ? 'fill-amber-400 text-amber-400'
                    : 'text-gray-300'
                }`}
              />
            ))}
          </div>
          <span className="text-xs text-gray-600">
            {rating} ({reviewCount})
          </span>
        </div>

        {/* Preço */}
        <div className="space-y-1">
          <div className="flex items-baseline gap-2">
            <span className="text-lg font-bold text-gray-900">
              R$ {price.toFixed(2)}
            </span>
            {originalPrice && (
              <span className="text-sm text-gray-400 line-through">
                R$ {originalPrice.toFixed(2)}
              </span>
            )}
          </div>
        </div>

        {/* Estoque */}
        <div className="flex items-center gap-2">
          <div className="flex-1 bg-gray-200 rounded-full h-1.5">
            <div
              className={`h-full rounded-full ${
                stock > 20 ? 'bg-green-500' : stock > 0 ? 'bg-yellow-500' : 'bg-red-500'
              }`}
              style={{ width: `${Math.min((stock / 50) * 100, 100)}%` }}
            />
          </div>
          <span className="text-xs font-semibold text-gray-600">
            {stock > 0 ? `${stock}` : '0'}
          </span>
        </div>

        {/* Botões */}
        <div className="flex gap-2 pt-2">
          <Button
            onClick={() => onAddToCart?.(id)}
            disabled={stock === 0}
            className="flex-1 bg-amber-600 hover:bg-amber-700 text-white disabled:bg-gray-300"
            size="sm"
          >
            <ShoppingCart className="w-4 h-4 mr-1" />
            Comprar
          </Button>
          <Button
            onClick={() => setIsFavorite(!isFavorite)}
            variant="outline"
            size="sm"
            className="px-3"
          >
            <Heart
              className={`w-4 h-4 ${isFavorite ? 'fill-red-500 text-red-500' : ''}`}
            />
          </Button>
        </div>
      </div>
    </div>
  );
}
