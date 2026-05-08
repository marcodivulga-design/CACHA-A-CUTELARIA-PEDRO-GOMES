import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Grid3x3, List } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface Photo {
  id: string;
  imageUrl: string;
  title?: string;
  photoType: 'frontal' | 'lateral' | 'detalhe' | 'uso' | 'ambiente';
  order: number;
  isMain: boolean;
}

interface KnifeVariation {
  id: string;
  name: string;
  imageUrl: string;
  priceModifier?: string;
  stock: number;
  photos: Photo[];
}

interface KnifeGalleryProps {
  knifeName: string;
  mainImage: string;
  variations: KnifeVariation[];
  onVariationSelect?: (variationId: string) => void;
}

export function KnifeGallery({
  knifeName,
  mainImage,
  variations,
  onVariationSelect,
}: KnifeGalleryProps) {
  const [selectedVariation, setSelectedVariation] = useState<string>(variations[0]?.id || '');
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const [viewMode, setViewMode] = useState<'grid' | 'carousel'>('carousel');

  const currentVariation = variations.find(v => v.id === selectedVariation);
  const photos = currentVariation?.photos || [];
  const currentPhoto = photos[currentPhotoIndex] || { imageUrl: mainImage };

  const handlePrevPhoto = () => {
    setCurrentPhotoIndex(prev => (prev === 0 ? photos.length - 1 : prev - 1));
  };

  const handleNextPhoto = () => {
    setCurrentPhotoIndex(prev => (prev === photos.length - 1 ? 0 : prev + 1));
  };

  const handleVariationChange = (variationId: string) => {
    setSelectedVariation(variationId);
    setCurrentPhotoIndex(0);
    onVariationSelect?.(variationId);
  };

  const getPhotoTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      frontal: 'Frontal',
      lateral: 'Lateral',
      detalhe: 'Detalhe',
      uso: 'Em Uso',
      ambiente: 'Ambiente',
    };
    return labels[type] || type;
  };

  return (
    <div className="w-full space-y-6">
      {/* Galeria Principal */}
      <div className="space-y-4">
        {/* Foto Principal */}
        <div className="relative bg-gray-100 rounded-lg overflow-hidden aspect-square">
          <img
            src={currentPhoto.imageUrl}
            alt={`${knifeName} - ${getPhotoTypeLabel(currentPhoto.photoType)}`}
            className="w-full h-full object-cover"
          />

          {/* Navegação de Fotos */}
          {photos.length > 1 && (
            <>
              <button
                onClick={handlePrevPhoto}
                className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow-lg transition"
                aria-label="Foto anterior"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={handleNextPhoto}
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow-lg transition"
                aria-label="Próxima foto"
              >
                <ChevronRight className="w-5 h-5" />
              </button>

              {/* Indicador de Foto */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
                {currentPhotoIndex + 1} / {photos.length}
              </div>
            </>
          )}

          {/* Badge de Tipo de Foto */}
          <div className="absolute top-4 right-4 bg-amber-600 text-white px-3 py-1 rounded-full text-xs font-semibold">
            {getPhotoTypeLabel(currentPhoto.photoType)}
          </div>
        </div>

        {/* Controles de Visualização */}
        <div className="flex gap-2">
          <Button
            variant={viewMode === 'carousel' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('carousel')}
            className="flex-1"
          >
            <ChevronLeft className="w-4 h-4 mr-2" />
            Carrossel
          </Button>
          <Button
            variant={viewMode === 'grid' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('grid')}
            className="flex-1"
          >
            <Grid3x3 className="w-4 h-4 mr-2" />
            Grade
          </Button>
        </div>
      </div>

      {/* Miniaturas de Fotos */}
      {viewMode === 'carousel' && photos.length > 1 && (
        <div className="space-y-2">
          <p className="text-sm font-semibold text-gray-700">Visualizações desta faca:</p>
          <div className="flex gap-2 overflow-x-auto pb-2">
            {photos.map((photo, index) => (
              <button
                key={photo.id}
                onClick={() => setCurrentPhotoIndex(index)}
                className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition ${
                  currentPhotoIndex === index
                    ? 'border-amber-600'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                title={getPhotoTypeLabel(photo.photoType)}
              >
                <img
                  src={photo.imageUrl}
                  alt={`Miniatura ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Grade de Fotos */}
      {viewMode === 'grid' && photos.length > 1 && (
        <div className="space-y-2">
          <p className="text-sm font-semibold text-gray-700">Todas as visualizações:</p>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {photos.map((photo, index) => (
              <button
                key={photo.id}
                onClick={() => {
                  setCurrentPhotoIndex(index);
                  setViewMode('carousel');
                }}
                className="relative group overflow-hidden rounded-lg aspect-square"
              >
                <img
                  src={photo.imageUrl}
                  alt={`Foto ${index + 1}`}
                  className="w-full h-full object-cover group-hover:scale-105 transition"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition flex items-center justify-center">
                  <div className="text-white text-xs font-semibold bg-black/50 px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition">
                    {getPhotoTypeLabel(photo.photoType)}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Seletor de Variações */}
      {variations.length > 1 && (
        <div className="space-y-3 border-t pt-6">
          <p className="text-sm font-semibold text-gray-700">Variações disponíveis:</p>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {variations.map(variation => (
              <button
                key={variation.id}
                onClick={() => handleVariationChange(variation.id)}
                className={`p-3 rounded-lg border-2 transition text-left ${
                  selectedVariation === variation.id
                    ? 'border-amber-600 bg-amber-50'
                    : 'border-gray-200 hover:border-amber-300'
                }`}
              >
                <img
                  src={variation.imageUrl}
                  alt={variation.name}
                  className="w-full h-20 object-cover rounded mb-2"
                />
                <p className="text-sm font-semibold text-gray-800">{variation.name}</p>
                {variation.priceModifier && (
                  <p className="text-xs text-amber-600 font-semibold">
                    {variation.priceModifier}
                  </p>
                )}
                <p className="text-xs text-gray-500">
                  {variation.stock > 0 ? `${variation.stock} em estoque` : 'Fora de estoque'}
                </p>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Info de Fotos */}
      {photos.length > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm text-blue-700">
          <p className="font-semibold mb-1">📸 Galeria Completa</p>
          <p>
            Esta faca tem <strong>{photos.length} visualizações</strong> diferentes para você
            explorar todos os detalhes antes de comprar.
          </p>
        </div>
      )}
    </div>
  );
}
