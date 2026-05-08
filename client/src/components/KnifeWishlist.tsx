import React, { useState, useEffect } from 'react';
import { Heart, Share2, Copy, Download, X, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface WishlistKnife {
  id: string;
  name: string;
  image: string;
  price: number;
  addedAt: Date;
}

interface KnifeWishlistProps {
  onClose?: () => void;
}

export function KnifeWishlist({ onClose }: KnifeWishlistProps) {
  const [wishlist, setWishlist] = useState<WishlistKnife[]>([]);
  const [shareUrl, setShareUrl] = useState<string>('');
  const [copied, setCopied] = useState(false);

  // Carregar wishlist do localStorage
  useEffect(() => {
    const saved = localStorage.getItem('knifeWishlist');
    if (saved) {
      const parsed = JSON.parse(saved);
      setWishlist(parsed.map((k: any) => ({ ...k, addedAt: new Date(k.addedAt) })));
    }
  }, []);

  // Salvar wishlist no localStorage
  useEffect(() => {
    localStorage.setItem('knifeWishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  const removeFromWishlist = (id: string) => {
    setWishlist(wishlist.filter(k => k.id !== id));
  };

  const handleShare = async () => {
    const knifeIds = wishlist.map(k => k.id).join(',');
    const url = `${window.location.origin}?wishlist=${knifeIds}`;
    setShareUrl(url);

    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Minha Wishlist de Facas',
          text: `Veja minha wishlist com ${wishlist.length} faca(s)!`,
          url,
        });
      } catch (error) {
        console.log('Erro ao compartilhar:', error);
      }
    }
  };

  const handleCopyLink = () => {
    if (shareUrl) {
      navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleDownloadList = () => {
    const csv = [
      ['Faca', 'Preço', 'Data Adicionada'].join(','),
      ...wishlist.map(k =>
        [k.name, `R$ ${k.price.toFixed(2)}`, k.addedAt.toLocaleDateString('pt-BR')].join(',')
      ),
    ].join('\n');

    const element = document.createElement('a');
    element.setAttribute('href', 'data:text/csv;charset=utf-8,' + encodeURIComponent(csv));
    element.setAttribute('download', 'wishlist-facas.csv');
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const totalPrice = wishlist.reduce((sum, k) => sum + k.price, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Minha Wishlist</h2>
          <p className="text-gray-600">{wishlist.length} faca(s) salva(s)</p>
        </div>
        {onClose && (
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-6 h-6" />
          </button>
        )}
      </div>

      {wishlist.length > 0 ? (
        <>
          {/* Resumo */}
          <Card className="p-4 bg-amber-50 border-amber-200">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">Total de Facas</p>
                <p className="text-2xl font-bold text-amber-600">{wishlist.length}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Valor Total</p>
                <p className="text-2xl font-bold text-amber-600">R$ {totalPrice.toFixed(2)}</p>
              </div>
            </div>
          </Card>

          {/* Ações */}
          <div className="flex gap-2">
            <Button
              onClick={handleShare}
              className="flex-1 bg-blue-600 hover:bg-blue-700"
            >
              <Share2 className="w-4 h-4 mr-2" />
              Compartilhar
            </Button>
            <Button
              onClick={handleDownloadList}
              variant="outline"
              className="flex-1"
            >
              <Download className="w-4 h-4 mr-2" />
              Baixar
            </Button>
          </div>

          {/* Link de Compartilhamento */}
          {shareUrl && (
            <Card className="p-4 bg-blue-50 border-blue-200">
              <p className="text-sm font-semibold text-blue-900 mb-2">Link de Compartilhamento:</p>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={shareUrl}
                  readOnly
                  className="flex-1 px-3 py-2 border rounded-lg text-sm bg-white"
                />
                <Button
                  onClick={handleCopyLink}
                  size="sm"
                  variant="outline"
                >
                  <Copy className="w-4 h-4" />
                  {copied ? 'Copiado!' : 'Copiar'}
                </Button>
              </div>
            </Card>
          )}

          {/* Lista de Facas */}
          <div className="space-y-3">
            {wishlist.map(knife => (
              <Card key={knife.id} className="p-4 flex gap-4">
                <img
                  src={knife.image}
                  alt={knife.name}
                  className="w-20 h-20 object-cover rounded"
                />
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900">{knife.name}</h3>
                  <p className="text-amber-600 font-bold">R$ {knife.price.toFixed(2)}</p>
                  <p className="text-xs text-gray-500">
                    Adicionado em {knife.addedAt.toLocaleDateString('pt-BR')}
                  </p>
                </div>
                <button
                  onClick={() => removeFromWishlist(knife.id)}
                  className="text-red-500 hover:text-red-700 transition"
                >
                  <X className="w-5 h-5" />
                </button>
              </Card>
            ))}
          </div>

          {/* Botão Limpar */}
          <Button
            onClick={() => setWishlist([])}
            variant="outline"
            className="w-full text-red-600 hover:text-red-700"
          >
            Limpar Wishlist
          </Button>
        </>
      ) : (
        <Card className="p-12 text-center space-y-4">
          <div className="text-5xl">💔</div>
          <p className="text-gray-600">Sua wishlist está vazia</p>
          <p className="text-sm text-gray-500">
            Clique no ❤️ em qualquer faca para adicioná-la à sua wishlist
          </p>
          <Button onClick={onClose} className="bg-amber-600 hover:bg-amber-700">
            <Plus className="w-4 h-4 mr-2" />
            Explorar Facas
          </Button>
        </Card>
      )}
    </div>
  );
}
