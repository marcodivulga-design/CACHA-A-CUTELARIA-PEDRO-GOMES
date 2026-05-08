import React, { useState } from 'react';
import { X, Plus, Download, Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface KnifeForComparison {
  id: string;
  name: string;
  image: string;
  price: number;
  rating: number;
  bladeLength: number;
  weight: number;
  handleType: string;
  steelType: string;
  maintenance: string;
  durability: number;
  sharpness: number;
  stock: number;
}

interface KnifeComparatorProps {
  availableKnives: KnifeForComparison[];
  onClose?: () => void;
}

export function KnifeComparator({ availableKnives, onClose }: KnifeComparatorProps) {
  const [selectedKnives, setSelectedKnives] = useState<KnifeForComparison[]>([]);
  const [showSelector, setShowSelector] = useState(false);

  const addKnife = (knife: KnifeForComparison) => {
    if (selectedKnives.length < 4 && !selectedKnives.find(k => k.id === knife.id)) {
      setSelectedKnives([...selectedKnives, knife]);
      setShowSelector(false);
    }
  };

  const removeKnife = (id: string) => {
    setSelectedKnives(selectedKnives.filter(k => k.id !== id));
  };

  const handleShare = () => {
    const knifeIds = selectedKnives.map(k => k.id).join(',');
    const url = `${window.location.origin}?compare=${knifeIds}`;
    
    if (navigator.share) {
      navigator.share({
        title: 'Comparação de Facas',
        text: `Veja minha comparação de ${selectedKnives.length} facas`,
        url,
      });
    } else {
      navigator.clipboard.writeText(url);
      alert('Link copiado para a área de transferência!');
    }
  };

  const handleDownload = () => {
    const csv = generateCSV();
    const element = document.createElement('a');
    element.setAttribute('href', 'data:text/csv;charset=utf-8,' + encodeURIComponent(csv));
    element.setAttribute('download', 'comparacao-facas.csv');
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const generateCSV = () => {
    const headers = ['Faca', 'Preço', 'Tamanho', 'Peso', 'Cabo', 'Aço', 'Manutenção', 'Durabilidade', 'Nitidez'];
    const rows = selectedKnives.map(k => [
      k.name,
      `R$ ${k.price.toFixed(2)}`,
      `${k.bladeLength}cm`,
      `${k.weight}g`,
      k.handleType,
      k.steelType,
      k.maintenance,
      `${k.durability}/5`,
      `${k.sharpness}/5`,
    ]);

    return [headers, ...rows].map(row => row.join(',')).join('\n');
  };

  const specs = [
    { label: 'Preço', key: 'price', format: (v: any) => `R$ ${v.toFixed(2)}` },
    { label: 'Tamanho da Lâmina', key: 'bladeLength', format: (v: any) => `${v} cm` },
    { label: 'Peso', key: 'weight', format: (v: any) => `${v} g` },
    { label: 'Tipo de Cabo', key: 'handleType', format: (v: any) => v },
    { label: 'Tipo de Aço', key: 'steelType', format: (v: any) => v },
    { label: 'Manutenção', key: 'maintenance', format: (v: any) => v },
    { label: 'Durabilidade', key: 'durability', format: (v: any) => `${v}/5 ⭐` },
    { label: 'Nitidez', key: 'sharpness', format: (v: any) => `${v}/5 ⭐` },
    { label: 'Rating', key: 'rating', format: (v: any) => `${v}/5 ⭐` },
    { label: 'Estoque', key: 'stock', format: (v: any) => v > 0 ? `${v} unidades` : 'Fora de estoque' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Comparador de Facas</h2>
          <p className="text-gray-600">
            {selectedKnives.length} de 4 facas selecionadas
          </p>
        </div>
        {onClose && (
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-6 h-6" />
          </button>
        )}
      </div>

      {/* Seletor de Facas */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {selectedKnives.map(knife => (
          <div key={knife.id} className="relative flex-shrink-0 w-32 h-40 rounded-lg overflow-hidden group">
            <img src={knife.image} alt={knife.name} className="w-full h-full object-cover" />
            <button
              onClick={() => removeKnife(knife.id)}
              className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition"
            >
              <X className="w-4 h-4" />
            </button>
            <div className="absolute bottom-0 left-0 right-0 bg-black/80 text-white text-xs p-2">
              {knife.name}
            </div>
          </div>
        ))}

        {selectedKnives.length < 4 && (
          <button
            onClick={() => setShowSelector(!showSelector)}
            className="flex-shrink-0 w-32 h-40 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center hover:border-amber-600 transition"
          >
            <Plus className="w-8 h-8 text-gray-400" />
          </button>
        )}
      </div>

      {/* Seletor Dropdown */}
      {showSelector && (
        <Card className="p-4">
          <p className="font-semibold text-gray-900 mb-3">Selecione uma faca para adicionar:</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 max-h-64 overflow-y-auto">
            {availableKnives
              .filter(k => !selectedKnives.find(sk => sk.id === k.id))
              .map(knife => (
                <button
                  key={knife.id}
                  onClick={() => addKnife(knife)}
                  className="p-2 text-left border rounded-lg hover:bg-amber-50 transition"
                >
                  <img src={knife.image} alt={knife.name} className="w-full h-16 object-cover rounded mb-1" />
                  <p className="text-xs font-semibold text-gray-900 line-clamp-2">{knife.name}</p>
                  <p className="text-xs text-amber-600">R$ {knife.price.toFixed(2)}</p>
                </button>
              ))}
          </div>
        </Card>
      )}

      {/* Comparação */}
      {selectedKnives.length > 0 && (
        <div className="space-y-4">
          {/* Botões de Ação */}
          <div className="flex gap-2">
            <Button onClick={handleShare} variant="outline" className="flex-1">
              <Share2 className="w-4 h-4 mr-2" />
              Compartilhar
            </Button>
            <Button onClick={handleDownload} variant="outline" className="flex-1">
              <Download className="w-4 h-4 mr-2" />
              Baixar CSV
            </Button>
          </div>

          {/* Tabela de Comparação */}
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <tbody>
                {specs.map((spec, idx) => (
                  <tr key={idx} className={idx % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                    <td className="border p-3 font-semibold text-gray-900 min-w-40 bg-gray-100">
                      {spec.label}
                    </td>
                    {selectedKnives.map(knife => (
                      <td key={knife.id} className="border p-3 text-center">
                        <div className="font-semibold text-gray-900">
                          {spec.format((knife as any)[spec.key])}
                        </div>
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Recomendação */}
          {selectedKnives.length > 1 && (
            <Card className="p-4 bg-blue-50 border-blue-200">
              <p className="font-semibold text-blue-900 mb-2">💡 Análise Comparativa</p>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>
                  • <strong>Melhor Preço:</strong>{' '}
                  {selectedKnives.reduce((a, b) => a.price < b.price ? a : b).name}
                </li>
                <li>
                  • <strong>Melhor Avaliação:</strong>{' '}
                  {selectedKnives.reduce((a, b) => a.rating > b.rating ? a : b).name}
                </li>
                <li>
                  • <strong>Mais Leve:</strong>{' '}
                  {selectedKnives.reduce((a, b) => a.weight < b.weight ? a : b).name}
                </li>
                <li>
                  • <strong>Melhor Durabilidade:</strong>{' '}
                  {selectedKnives.reduce((a, b) => a.durability > b.durability ? a : b).name}
                </li>
              </ul>
            </Card>
          )}
        </div>
      )}

      {/* Mensagem Vazia */}
      {selectedKnives.length === 0 && (
        <Card className="p-8 text-center">
          <p className="text-gray-600 mb-4">Selecione até 4 facas para comparar</p>
          <Button onClick={() => setShowSelector(true)} className="bg-amber-600 hover:bg-amber-700">
            <Plus className="w-4 h-4 mr-2" />
            Adicionar Faca
          </Button>
        </Card>
      )}
    </div>
  );
}
