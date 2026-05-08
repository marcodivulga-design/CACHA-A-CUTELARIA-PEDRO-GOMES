import React, { useState } from 'react';
import { Search, Filter, Star, ShoppingCart } from 'lucide-react';
import { trpc } from '../lib/trpc';

export default function Catalog() {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState<string | undefined>();
  const [limit] = useState(20);
  const [offset, setOffset] = useState(0);

  // Queries
  const { data: products, isLoading } = trpc.products.list.useQuery({
    search: search || undefined,
    category,
    limit,
    offset,
  });

  const { data: categories } = trpc.products.listCategories?.useQuery?.() || { data: [] };

  // Mutations
  const addToCart = trpc.cart.addItem.useMutation();

  const handleAddToCart = (productId: string) => {
    addToCart.mutate(
      { productId, quantity: 1 },
      {
        onSuccess: () => {
          alert('Produto adicionado ao carrinho!');
        },
      }
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white">
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="mb-12">
          <h1 className="font-playfair text-5xl font-bold text-gray-900 mb-2">Catálogo Premium</h1>
          <p className="text-lg text-gray-600">Cachaças artesanais e cutelaria fina de qualidade excepcional</p>
        </div>

        {/* Search and Filters */}
        <div className="mb-8 flex flex-col gap-4 md:flex-row">
          <input
            type="text"
            placeholder="Buscar facas..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setOffset(0);
            }}
            className="flex-1 px-4 py-2 border border-border rounded-lg bg-background text-foreground"
          />

          <select
            value={category || ''}
            onChange={(e) => {
              setCategory(e.target.value || undefined);
              setOffset(0);
            }}
            className="px-4 py-2 border border-border rounded-lg bg-background text-foreground"
          >
            <option value="">Todas as categorias</option>
            {categories?.map((cat: any) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        {/* Products Grid */}
        {isLoading ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Carregando produtos...</p>
          </div>
        ) : !products?.products || products.products.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Nenhum produto encontrado</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {products.products.map((product: any) => (
                <div key={product.id} className="border border-border rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
                  {/* Product Image */}
                  <div className="aspect-square bg-muted flex items-center justify-center">
                    {product.images?.[0] ? (
                      <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="text-muted-foreground">Sem imagem</div>
                    )}
                  </div>

                  {/* Product Info */}
                  <div className="p-4">
                    <h3 className="font-semibold text-foreground mb-2">{product.name}</h3>
                    <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{product.description}</p>

                    {/* Price and Stock */}
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-lg font-bold text-foreground">R$ {parseFloat(product.price).toFixed(2)}</span>
                      <span className="text-sm text-muted-foreground">
                        {product.stock > 0 ? `${product.stock} em estoque` : 'Fora de estoque'}
                      </span>
                    </div>

                    {/* Add to Cart Button */}
                    <button
                      onClick={() => handleAddToCart(product.id)}
                      disabled={product.stock === 0 || addToCart.isPending}
                      className="w-full bg-primary text-primary-foreground py-2 rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      {addToCart.isPending ? 'Adicionando...' : 'Adicionar ao Carrinho'}
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            <div className="mt-8 flex justify-center gap-4">
              <button
                onClick={() => setOffset(Math.max(0, offset - limit))}
                disabled={offset === 0}
                className="px-4 py-2 border border-border rounded-lg hover:bg-muted disabled:opacity-50"
              >
                Anterior
              </button>
              <span className="py-2 text-muted-foreground">
                Página {Math.floor(offset / limit) + 1} de {Math.ceil((products?.total || 0) / limit)}
              </span>
              <button
                onClick={() => setOffset(offset + limit)}
                disabled={offset + limit >= (products?.total || 0)}
                className="px-4 py-2 border border-border rounded-lg hover:bg-muted disabled:opacity-50"
              >
                Próxima
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
