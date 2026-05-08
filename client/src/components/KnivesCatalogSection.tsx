import React, { useState, useMemo } from 'react';
import { Filter, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { KnifeCard } from './KnifeCard';

interface Knife {
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
  bladeSize: 'pequena' | 'media' | 'grande';
  application: string;
  weight: number;
}

interface KnivesCatalogSectionProps {
  knives: Knife[];
  onAddToCart?: (id: string) => void;
}

export function KnivesCatalogSection({ knives, onAddToCart }: KnivesCatalogSectionProps) {
  const [sortBy, setSortBy] = useState<'relevancia' | 'preco-asc' | 'preco-desc' | 'rating'>('relevancia');
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [selectedHandle, setSelectedHandle] = useState<string | null>(null);
  const [selectedSteel, setSelectedSteel] = useState<string | null>(null);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 200]);
  const [showFilters, setShowFilters] = useState(false);

  // Extrair valores únicos para filtros
  const sizes = useMemo(() => [...new Set(knives.map(k => k.bladeSize))], [knives]);
  const handles = useMemo(() => [...new Set(knives.map(k => k.handleType))], [knives]);
  const steels = useMemo(() => [...new Set(knives.map(k => k.steelType))], [knives]);

  // Aplicar filtros
  const filteredKnives = useMemo(() => {
    return knives.filter(knife => {
      if (selectedSize && knife.bladeSize !== selectedSize) return false;
      if (selectedHandle && knife.handleType !== selectedHandle) return false;
      if (selectedSteel && knife.steelType !== selectedSteel) return false;
      if (knife.price < priceRange[0] || knife.price > priceRange[1]) return false;
      return true;
    });
  }, [knives, selectedSize, selectedHandle, selectedSteel, priceRange]);

  // Ordenar
  const sortedKnives = useMemo(() => {
    const sorted = [...filteredKnives];
    switch (sortBy) {
      case 'preco-asc':
        return sorted.sort((a, b) => a.price - b.price);
      case 'preco-desc':
        return sorted.sort((a, b) => b.price - a.price);
      case 'rating':
        return sorted.sort((a, b) => b.rating - a.rating);
      default:
        return sorted;
    }
  }, [filteredKnives, sortBy]);

  const sizeLabels: Record<string, string> = {
    pequena: 'Pequena (até 10cm)',
    media: 'Média (10-20cm)',
    grande: 'Grande (acima de 20cm)',
  };

  const steelLabels: Record<string, string> = {
    inox_420: 'Inox 420',
    inox_440: 'Inox 440',
    carbono: 'Aço Carbono',
    carbono_forjado: 'Aço Carbono Forjado',
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Facas Artesanais</h2>
          <p className="text-gray-600">
            {sortedKnives.length} faca{sortedKnives.length !== 1 ? 's' : ''} encontrada{sortedKnives.length !== 1 ? 's' : ''}
          </p>
        </div>

        {/* Controles */}
        <div className="flex gap-2">
          <Button
            onClick={() => setShowFilters(!showFilters)}
            variant="outline"
            className="flex items-center gap-2"
          >
            <Filter className="w-4 h-4" />
            Filtros
          </Button>

          <div className="relative">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="appearance-none px-3 py-2 border rounded-lg text-sm pr-8 cursor-pointer"
            >
              <option value="relevancia">Relevância</option>
              <option value="preco-asc">Menor Preço</option>
              <option value="preco-desc">Maior Preço</option>
              <option value="rating">Melhor Avaliação</option>
            </select>
            <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none text-gray-400" />
          </div>
        </div>
      </div>

      {/* Filtros */}
      {showFilters && (
        <Card className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Tamanho */}
            <div className="space-y-3">
              <h3 className="font-semibold text-gray-900">Tamanho da Lâmina</h3>
              <div className="space-y-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="size"
                    value=""
                    checked={selectedSize === null}
                    onChange={() => setSelectedSize(null)}
                    className="cursor-pointer"
                  />
                  <span className="text-sm text-gray-700">Todos</span>
                </label>
                {sizes.map(size => (
                  <label key={size} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="size"
                      value={size}
                      checked={selectedSize === size}
                      onChange={() => setSelectedSize(size)}
                      className="cursor-pointer"
                    />
                    <span className="text-sm text-gray-700">{sizeLabels[size]}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Tipo de Cabo */}
            <div className="space-y-3">
              <h3 className="font-semibold text-gray-900">Tipo de Cabo</h3>
              <div className="space-y-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="handle"
                    value=""
                    checked={selectedHandle === null}
                    onChange={() => setSelectedHandle(null)}
                    className="cursor-pointer"
                  />
                  <span className="text-sm text-gray-700">Todos</span>
                </label>
                {handles.map(handle => (
                  <label key={handle} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="handle"
                      value={handle}
                      checked={selectedHandle === handle}
                      onChange={() => setSelectedHandle(handle)}
                      className="cursor-pointer"
                    />
                    <span className="text-sm text-gray-700 capitalize">{handle}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Tipo de Aço */}
            <div className="space-y-3">
              <h3 className="font-semibold text-gray-900">Tipo de Aço</h3>
              <div className="space-y-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="steel"
                    value=""
                    checked={selectedSteel === null}
                    onChange={() => setSelectedSteel(null)}
                    className="cursor-pointer"
                  />
                  <span className="text-sm text-gray-700">Todos</span>
                </label>
                {steels.map(steel => (
                  <label key={steel} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="steel"
                      value={steel}
                      checked={selectedSteel === steel}
                      onChange={() => setSelectedSteel(steel)}
                      className="cursor-pointer"
                    />
                    <span className="text-sm text-gray-700">{steelLabels[steel]}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Faixa de Preço */}
            <div className="space-y-3">
              <h3 className="font-semibold text-gray-900">Faixa de Preço</h3>
              <div className="space-y-2">
                <div className="flex gap-2">
                  <input
                    type="number"
                    min="0"
                    max="200"
                    value={priceRange[0]}
                    onChange={(e) => setPriceRange([Number(e.target.value), priceRange[1]])}
                    className="w-20 px-2 py-1 border rounded text-sm"
                    placeholder="Min"
                  />
                  <span className="text-gray-500">-</span>
                  <input
                    type="number"
                    min="0"
                    max="200"
                    value={priceRange[1]}
                    onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
                    className="w-20 px-2 py-1 border rounded text-sm"
                    placeholder="Max"
                  />
                </div>
                <input
                  type="range"
                  min="0"
                  max="200"
                  value={priceRange[1]}
                  onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
                  className="w-full"
                />
                <p className="text-sm text-gray-600">
                  R$ {priceRange[0].toFixed(2)} - R$ {priceRange[1].toFixed(2)}
                </p>
              </div>
            </div>
          </div>

          {/* Botão Limpar Filtros */}
          <Button
            onClick={() => {
              setSelectedSize(null);
              setSelectedHandle(null);
              setSelectedSteel(null);
              setPriceRange([0, 200]);
            }}
            variant="outline"
            className="w-full"
          >
            Limpar Filtros
          </Button>
        </Card>
      )}

      {/* Grid de Facas */}
      {sortedKnives.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedKnives.map(knife => (
            <KnifeCard
              key={knife.id}
              {...knife}
              onAddToCart={onAddToCart}
            />
          ))}
        </div>
      ) : (
        <Card className="p-12 text-center">
          <p className="text-gray-600 mb-4">Nenhuma faca encontrada com os filtros selecionados</p>
          <Button
            onClick={() => {
              setSelectedSize(null);
              setSelectedHandle(null);
              setSelectedSteel(null);
              setPriceRange([0, 200]);
            }}
            variant="outline"
          >
            Limpar Filtros
          </Button>
        </Card>
      )}
    </div>
  );
}
