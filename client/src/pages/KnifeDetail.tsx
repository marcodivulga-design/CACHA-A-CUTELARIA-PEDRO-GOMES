import React, { useState } from 'react';
import { useParams, useRouter } from 'wouter';
import { Star, ShoppingCart, Heart, Share2, Truck, Shield, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { KnifeGallery } from '@/components/KnifeGallery';
import { trpc } from '@/lib/trpc';

export default function KnifeDetail() {
  const [quantity, setQuantity] = useState(1);
  const [isFavorite, setIsFavorite] = useState(false);
  const { knifeId } = useParams<{ knifeId: string }>();
  const [, navigate] = useRouter();

  // Mock data - em produção virá do banco
  const knife = {
    id: knifeId,
    name: 'Faca de Chef Premium',
    description: 'Faca versátil profissional para uso geral na cozinha',
    price: 120.00,
    originalPrice: 150.00,
    rating: 4.95,
    reviewCount: 125,
    stock: 60,
    
    // Especificações
    bladeSize: 'media',
    bladeLengthCm: 18,
    handleType: 'ipe',
    steelType: 'inox_440',
    weight: 180,
    maintenance: 'Baixa',
    durability: 5,
    sharpness: 5,
    
    // Aplicação
    application: 'uso_geral',
    
    // Imagem principal
    mainImage: 'https://example.com/faca-chef-main.jpg',
    
    // Variações
    variations: [
      {
        id: 'var-1',
        name: 'Cabo Ipê Natural',
        imageUrl: 'https://example.com/faca-chef-ipe.jpg',
        priceModifier: 'R$ 0,00',
        stock: 30,
        photos: [
          {
            id: 'photo-1',
            imageUrl: 'https://example.com/faca-chef-frontal.jpg',
            title: 'Vista Frontal',
            photoType: 'frontal',
            order: 1,
            isMain: true,
          },
          {
            id: 'photo-2',
            imageUrl: 'https://example.com/faca-chef-lateral.jpg',
            title: 'Vista Lateral',
            photoType: 'lateral',
            order: 2,
            isMain: false,
          },
          {
            id: 'photo-3',
            imageUrl: 'https://example.com/faca-chef-detalhe.jpg',
            title: 'Detalhe da Lâmina',
            photoType: 'detalhe',
            order: 3,
            isMain: false,
          },
          {
            id: 'photo-4',
            imageUrl: 'https://example.com/faca-chef-uso.jpg',
            title: 'Em Uso',
            photoType: 'uso',
            order: 4,
            isMain: false,
          },
        ],
      },
      {
        id: 'var-2',
        name: 'Cabo Jacarandá Premium',
        imageUrl: 'https://example.com/faca-chef-jacaranda.jpg',
        priceModifier: '+R$ 30,00',
        stock: 15,
        photos: [
          {
            id: 'photo-5',
            imageUrl: 'https://example.com/faca-chef-jacaranda-frontal.jpg',
            title: 'Vista Frontal',
            photoType: 'frontal',
            order: 1,
            isMain: true,
          },
          {
            id: 'photo-6',
            imageUrl: 'https://example.com/faca-chef-jacaranda-lateral.jpg',
            title: 'Vista Lateral',
            photoType: 'lateral',
            order: 2,
            isMain: false,
          },
        ],
      },
    ],
    
    // Características
    features: [
      'Lâmina Afiada',
      'Cabo Confortável',
      'Resistente à Corrosão',
      'Profissional',
      'Durável',
    ],
    
    // Especificações Técnicas
    specs: [
      { spec: 'Dureza Rockwell', value: '57-59 HRC' },
      { spec: 'Comprimento da Lâmina', value: '18 cm' },
      { spec: 'Peso', value: '180 g' },
      { spec: 'Ângulo de Fio', value: '15-20 graus' },
    ],
  };

  const handleAddToCart = () => {
    // Implementar lógica de carrinho
    console.log(`Adicionando ${quantity} faca(s) ao carrinho`);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: knife.name,
        text: knife.description,
        url: window.location.href,
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <button onClick={() => navigate('/catalog')} className="hover:text-amber-600">
              Catálogo
            </button>
            <span>/</span>
            <button onClick={() => navigate('/catalog?category=facas')} className="hover:text-amber-600">
              Facas
            </button>
            <span>/</span>
            <span className="text-gray-900 font-semibold">{knife.name}</span>
          </div>
        </div>
      </div>

      {/* Conteúdo Principal */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Galeria */}
          <div>
            <KnifeGallery
              knifeName={knife.name}
              mainImage={knife.mainImage}
              variations={knife.variations}
              onVariationSelect={(variationId) => {
                console.log('Variação selecionada:', variationId);
              }}
            />
          </div>

          {/* Informações e Compra */}
          <div className="space-y-6">
            {/* Título e Rating */}
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{knife.name}</h1>
              <div className="flex items-center gap-2 mb-4">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < Math.floor(knife.rating)
                          ? 'fill-amber-400 text-amber-400'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-sm text-gray-600">
                  {knife.rating} ({knife.reviewCount} avaliações)
                </span>
              </div>
              <p className="text-gray-600">{knife.description}</p>
            </div>

            {/* Preço */}
            <div className="bg-amber-50 p-4 rounded-lg">
              <div className="flex items-baseline gap-3">
                <span className="text-3xl font-bold text-amber-600">R$ {knife.price.toFixed(2)}</span>
                {knife.originalPrice && (
                  <span className="text-lg text-gray-400 line-through">
                    R$ {knife.originalPrice.toFixed(2)}
                  </span>
                )}
              </div>
              <p className="text-sm text-green-600 font-semibold mt-2">
                Economize R$ {(knife.originalPrice - knife.price).toFixed(2)}
              </p>
            </div>

            {/* Especificações Rápidas */}
            <div className="grid grid-cols-2 gap-3">
              <Card className="p-3">
                <p className="text-xs text-gray-600">Tamanho da Lâmina</p>
                <p className="font-semibold">{knife.bladeLengthCm} cm</p>
              </Card>
              <Card className="p-3">
                <p className="text-xs text-gray-600">Peso</p>
                <p className="font-semibold">{knife.weight}g</p>
              </Card>
              <Card className="p-3">
                <p className="text-xs text-gray-600">Tipo de Aço</p>
                <p className="font-semibold">Inox 440</p>
              </Card>
              <Card className="p-3">
                <p className="text-xs text-gray-600">Manutenção</p>
                <p className="font-semibold">{knife.maintenance}</p>
              </Card>
            </div>

            {/* Estoque */}
            <div className="flex items-center gap-2">
              <div className="flex-1 bg-gray-200 rounded-full h-2">
                <div
                  className="bg-green-500 h-full rounded-full"
                  style={{ width: `${Math.min((knife.stock / 100) * 100, 100)}%` }}
                />
              </div>
              <span className="text-sm font-semibold text-gray-700">
                {knife.stock > 0 ? `${knife.stock} em estoque` : 'Fora de estoque'}
              </span>
            </div>

            {/* Quantidade */}
            <div className="flex items-center gap-4">
              <label className="text-sm font-semibold text-gray-700">Quantidade:</label>
              <div className="flex items-center border rounded-lg">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-3 py-2 hover:bg-gray-100"
                >
                  −
                </button>
                <input
                  type="number"
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-12 text-center border-l border-r"
                />
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-3 py-2 hover:bg-gray-100"
                >
                  +
                </button>
              </div>
            </div>

            {/* Botões de Ação */}
            <div className="flex gap-3">
              <Button
                onClick={handleAddToCart}
                className="flex-1 bg-amber-600 hover:bg-amber-700 text-white"
                size="lg"
              >
                <ShoppingCart className="w-5 h-5 mr-2" />
                Adicionar ao Carrinho
              </Button>
              <Button
                onClick={() => setIsFavorite(!isFavorite)}
                variant="outline"
                size="lg"
              >
                <Heart
                  className={`w-5 h-5 ${isFavorite ? 'fill-red-500 text-red-500' : ''}`}
                />
              </Button>
              <Button onClick={handleShare} variant="outline" size="lg">
                <Share2 className="w-5 h-5" />
              </Button>
            </div>

            {/* Benefícios */}
            <div className="space-y-3 border-t pt-6">
              <div className="flex gap-3">
                <Truck className="w-5 h-5 text-amber-600 flex-shrink-0 mt-1" />
                <div>
                  <p className="font-semibold text-gray-900">Frete Grátis</p>
                  <p className="text-sm text-gray-600">Acima de R$ 100</p>
                </div>
              </div>
              <div className="flex gap-3">
                <Shield className="w-5 h-5 text-amber-600 flex-shrink-0 mt-1" />
                <div>
                  <p className="font-semibold text-gray-900">Garantia de 2 Anos</p>
                  <p className="text-sm text-gray-600">Defeito de fabricação</p>
                </div>
              </div>
              <div className="flex gap-3">
                <RotateCcw className="w-5 h-5 text-amber-600 flex-shrink-0 mt-1" />
                <div>
                  <p className="font-semibold text-gray-900">Devolução Fácil</p>
                  <p className="text-sm text-gray-600">30 dias de garantia</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Especificações Técnicas */}
        <div className="mt-12 border-t pt-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Especificações Técnicas</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {knife.specs.map((spec, index) => (
              <Card key={index} className="p-4">
                <p className="text-sm text-gray-600">{spec.spec}</p>
                <p className="font-semibold text-gray-900">{spec.value}</p>
              </Card>
            ))}
          </div>
        </div>

        {/* Características */}
        <div className="mt-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Características</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {knife.features.map((feature, index) => (
              <div key={index} className="flex items-center gap-2">
                <div className="w-2 h-2 bg-amber-600 rounded-full" />
                <span className="text-gray-700">{feature}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
