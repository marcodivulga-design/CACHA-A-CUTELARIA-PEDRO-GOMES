import React, { useState } from 'react';
import { useParams } from 'wouter';
import { Star, ShoppingCart, Heart, Share2, ChevronLeft, ChevronRight } from 'lucide-react';
import { trpc } from '../lib/trpc';

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);

  // Fetch product
  const { data: product, isLoading } = trpc.products.getById.useQuery(id!);

  // Add to cart mutation
  const addToCart = trpc.cart.addItem.useMutation();

  const handleAddToCart = () => {
    if (product) {
      addToCart.mutate(
        { productId: product.id, quantity },
        {
          onSuccess: () => {
            alert('Produto adicionado ao carrinho!');
          },
        }
      );
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-700"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-12">
        <p className="text-center text-gray-600">Produto não encontrado</p>
      </div>
    );
  }

  const images = product.images || ['/placeholder.jpg'];

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="grid md:grid-cols-2 gap-12">
        {/* Images */}
        <div>
          <div className="bg-gradient-to-br from-amber-100 to-amber-50 rounded-xl p-8 mb-4 relative h-96 flex items-center justify-center">
            {images[selectedImage] ? (
              <img
                src={images[selectedImage]}
                alt={product.name}
                className="max-w-full max-h-full object-contain"
              />
            ) : (
              <div className="text-6xl">🥃</div>
            )}
          </div>

          {/* Thumbnails */}
          <div className="flex gap-4 overflow-x-auto">
            {images.map((img, i) => (
              <button
                key={i}
                onClick={() => setSelectedImage(i)}
                className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition ${
                  selectedImage === i ? 'border-amber-700' : 'border-gray-200'
                }`}
              >
                <img src={img} alt={`${product.name} ${i}`} className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>

        {/* Details */}
        <div>
          {/* Category */}
          <div className="text-sm text-amber-700 font-semibold mb-2">
            {product.category}
          </div>

          {/* Title */}
          <h1 className="font-playfair text-4xl font-bold text-gray-900 mb-4">
            {product.name}
          </h1>

          {/* Rating */}
          <div className="flex items-center gap-2 mb-6">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-5 h-5 ${
                    i < Math.round(product.rating || 0)
                      ? 'fill-amber-400 text-amber-400'
                      : 'text-gray-300'
                  }`}
                />
              ))}
            </div>
            <span className="text-gray-600">
              ({product.reviews || 0} avaliações)
            </span>
          </div>

          {/* Price */}
          <div className="mb-6">
            <div className="flex items-baseline gap-4">
              <span className="text-4xl font-bold text-amber-700">
                R$ {product.price.toFixed(2)}
              </span>
              {product.originalPrice && (
                <span className="text-xl text-gray-500 line-through">
                  R$ {product.originalPrice.toFixed(2)}
                </span>
              )}
            </div>
            {product.discount && (
              <div className="text-green-600 font-semibold mt-2">
                Economia de R$ {(product.originalPrice! - product.price).toFixed(2)}
              </div>
            )}
          </div>

          {/* Description */}
          <div className="mb-8">
            <h3 className="font-bold text-gray-900 mb-2">Descrição</h3>
            <p className="text-gray-600 leading-relaxed">
              {product.description}
            </p>
          </div>

          {/* Stock */}
          <div className="mb-8">
            <p className={`text-sm font-semibold ${
              product.stock > 0 ? 'text-green-600' : 'text-red-600'
            }`}>
              {product.stock > 0
                ? `${product.stock} em estoque`
                : 'Fora de estoque'}
            </p>
          </div>

          {/* Quantity */}
          <div className="mb-8">
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Quantidade
            </label>
            <div className="flex items-center gap-4">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="p-2 border border-gray-300 rounded-lg hover:bg-gray-100"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <input
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                className="w-16 text-center border border-gray-300 rounded-lg py-2"
              />
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="p-2 border border-gray-300 rounded-lg hover:bg-gray-100"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-4 mb-8">
            <button
              onClick={handleAddToCart}
              disabled={product.stock === 0 || addToCart.isPending}
              className="flex-1 bg-amber-700 text-white py-3 rounded-lg hover:bg-amber-800 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 font-bold"
            >
              <ShoppingCart className="w-5 h-5" />
              {addToCart.isPending ? 'Adicionando...' : 'Adicionar ao Carrinho'}
            </button>
            <button
              onClick={() => setIsFavorite(!isFavorite)}
              className="px-6 py-3 border-2 border-amber-700 text-amber-700 rounded-lg hover:bg-amber-50 transition"
            >
              <Heart className={`w-5 h-5 ${isFavorite ? 'fill-current' : ''}`} />
            </button>
            <button className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition">
              <Share2 className="w-5 h-5" />
            </button>
          </div>

          {/* Shipping Info */}
          <div className="bg-amber-50 p-6 rounded-xl">
            <h3 className="font-bold text-gray-900 mb-4">Informações de Entrega</h3>
            <div className="space-y-3 text-sm text-gray-600">
              <div>
                <p className="font-semibold text-gray-900">Frete Grátis</p>
                <p>Para compras acima de R$ 300</p>
              </div>
              <div>
                <p className="font-semibold text-gray-900">Entrega Rápida</p>
                <p>Até 3 dias úteis para São Paulo</p>
              </div>
              <div>
                <p className="font-semibold text-gray-900">Garantia</p>
                <p>Satisfação garantida ou dinheiro de volta</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Related Products */}
      <div className="mt-16">
        <h2 className="font-playfair text-3xl font-bold mb-8">Produtos Relacionados</h2>
        <div className="grid md:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-white rounded-xl overflow-hidden hover:shadow-xl transition">
              <div className="bg-gradient-to-br from-amber-100 to-amber-50 h-48 flex items-center justify-center">
                <div className="text-4xl">🥃</div>
              </div>
              <div className="p-4">
                <h3 className="font-bold text-gray-900 mb-2">Produto Relacionado</h3>
                <p className="text-amber-700 font-bold">R$ 199,90</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
