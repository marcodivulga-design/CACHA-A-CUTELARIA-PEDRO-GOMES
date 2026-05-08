import React, { useState, useEffect } from 'react';
import { X, Plus, Download, Share2, Zap, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { trpc } from '@/lib/trpc';

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
  demand?: number;
}

interface KnifeComparatorAIProps {
  availableKnives: KnifeForComparison[];
  onClose?: () => void;
}

export function KnifeComparatorAI({ availableKnives, onClose }: KnifeComparatorAIProps) {
  const [selectedKnives, setSelectedKnives] = useState<KnifeForComparison[]>([]);
  const [showSelector, setShowSelector] = useState(false);
  const [aiAnalysis, setAiAnalysis] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [bestValue, setBestValue] = useState<string | null>(null);

  // Calcular melhor custo-benefício
  useEffect(() => {
    if (selectedKnives.length > 0) {
      const valueScores = selectedKnives.map(k => ({
        id: k.id,
        name: k.name,
        score: (k.rating * k.durability * k.sharpness) / k.price,
      }));
      const best = valueScores.reduce((a, b) => a.score > b.score ? a : b);
      setBestValue(best.id);
    }
  }, [selectedKnives]);

  const addKnife = (knife: KnifeForComparison) => {
    if (selectedKnives.length < 4 && !selectedKnives.find(k => k.id === knife.id)) {
      setSelectedKnives([...selectedKnives, knife]);
      setShowSelector(false);
    }
  };

  const removeKnife = (id: string) => {
    setSelectedKnives(selectedKnives.filter(k => k.id !== id));
  };

  const handleAIAnalysis = async () => {
    setLoading(true);
    try {
      // Simulação - em produção chamaria a API
      const analysis = {
        winner: selectedKnives.reduce((a, b) => a.rating > b.rating ? a : b).name,
        bestValue: selectedKnives.reduce((a, b) => 
          ((a.rating * a.durability) / a.price) > ((b.rating * b.durability) / b.price) ? a : b
        ).name,
        recommendations: [
          `${selectedKnives[0]?.name} é ideal para iniciantes - fácil de manter`,
          `${selectedKnives[1]?.name} oferece melhor custo-benefício`,
          selectedKnives.length > 2 ? `${selectedKnives[2]?.name} é premium - para profissionais` : null,
        ].filter(Boolean),
        insights: [
          'Facas de aço carbono têm melhor fio, mas requerem mais manutenção',
          'Cabos de madeira premium duram mais que plástico',
          'Peso importa: facas mais leves são melhores para precisão',
        ],
      };
      setAiAnalysis(analysis);
    } finally {
      setLoading(false);
    }
  };

  const specs = [
    { label: 'Preço', key: 'price', format: (v: any) => `R$ ${v.toFixed(2)}`, highlight: 'min' },
    { label: 'Tamanho', key: 'bladeLength', format: (v: any) => `${v} cm`, highlight: 'none' },
    { label: 'Peso', key: 'weight', format: (v: any) => `${v}g`, highlight: 'min' },
    { label: 'Cabo', key: 'handleType', format: (v: any) => v, highlight: 'none' },
    { label: 'Aço', key: 'steelType', format: (v: any) => v, highlight: 'none' },
    { label: 'Durabilidade', key: 'durability', format: (v: any) => `${v}/5 ⭐`, highlight: 'max' },
    { label: 'Nitidez', key: 'sharpness', format: (v: any) => `${v}/5 ⭐`, highlight: 'max' },
    { label: 'Rating', key: 'rating', format: (v: any) => `${v}/5 ⭐`, highlight: 'max' },
    { label: 'Estoque', key: 'stock', format: (v: any) => v > 0 ? `${v} un.` : 'Fora', highlight: 'none' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Comparador Inteligente</h2>
          <p className="text-gray-600">Análise com IA e otimização de vendas</p>
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
          <div
            key={knife.id}
            className={`relative flex-shrink-0 w-32 h-40 rounded-lg overflow-hidden group border-2 ${
              bestValue === knife.id ? 'border-green-500' : 'border-gray-200'
            }`}
          >
            <img src={knife.image} alt={knife.name} className="w-full h-full object-cover" />
            {bestValue === knife.id && (
              <div className="absolute top-2 left-2 bg-green-500 text-white px-2 py-1 rounded text-xs font-bold">
                🏆 Melhor
              </div>
            )}
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
          <p className="font-semibold text-gray-900 mb-3">Selecione uma faca:</p>
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
            <Button
              onClick={handleAIAnalysis}
              disabled={loading}
              className="flex-1 bg-purple-600 hover:bg-purple-700"
            >
              <Zap className="w-4 h-4 mr-2" />
              {loading ? 'Analisando...' : 'Análise IA'}
            </Button>
            <Button variant="outline" className="flex-1">
              <Share2 className="w-4 h-4 mr-2" />
              Compartilhar
            </Button>
            <Button variant="outline" className="flex-1">
              <Download className="w-4 h-4 mr-2" />
              Baixar
            </Button>
          </div>

          {/* Tabela Comparativa */}
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <tbody>
                {specs.map((spec, idx) => {
                  const values = selectedKnives.map(k => (k as any)[spec.key]);
                  let maxIdx = -1, minIdx = -1;

                  if (spec.highlight === 'max') {
                    maxIdx = values.indexOf(Math.max(...values));
                  } else if (spec.highlight === 'min') {
                    minIdx = values.indexOf(Math.min(...values));
                  }

                  return (
                    <tr key={idx} className={idx % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                      <td className="border p-3 font-semibold text-gray-900 min-w-40 bg-gray-100">
                        {spec.label}
                      </td>
                      {selectedKnives.map((knife, kIdx) => (
                        <td
                          key={knife.id}
                          className={`border p-3 text-center ${
                            kIdx === maxIdx ? 'bg-green-100' : kIdx === minIdx ? 'bg-blue-100' : ''
                          }`}
                        >
                          <div className="font-semibold text-gray-900">
                            {spec.format((knife as any)[spec.key])}
                          </div>
                          {kIdx === maxIdx && spec.highlight === 'max' && (
                            <div className="text-xs text-green-600">✓ Melhor</div>
                          )}
                          {kIdx === minIdx && spec.highlight === 'min' && (
                            <div className="text-xs text-blue-600">✓ Menor</div>
                          )}
                        </td>
                      ))}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Análise IA */}
          {aiAnalysis && (
            <Card className="p-4 space-y-4 bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200">
              <div>
                <p className="font-bold text-gray-900 mb-2">🤖 Análise Inteligente</p>
                <div className="space-y-2 text-sm">
                  <p>
                    <strong>Melhor Geral:</strong> {aiAnalysis.winner}
                  </p>
                  <p>
                    <strong>Melhor Custo-Benefício:</strong> {aiAnalysis.bestValue}
                  </p>
                </div>
              </div>

              <div>
                <p className="font-bold text-gray-900 mb-2">💡 Recomendações</p>
                <ul className="text-sm space-y-1">
                  {aiAnalysis.recommendations.map((rec: string, idx: number) => (
                    <li key={idx} className="flex gap-2">
                      <span>→</span>
                      <span>{rec}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <p className="font-bold text-gray-900 mb-2">📊 Insights</p>
                <ul className="text-sm space-y-1">
                  {aiAnalysis.insights.map((insight: string, idx: number) => (
                    <li key={idx} className="flex gap-2">
                      <span>💭</span>
                      <span>{insight}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Gatilhos Psicológicos */}
              <div className="bg-white/50 p-3 rounded-lg">
                <p className="font-bold text-gray-900 mb-2 text-sm">🎯 Gatilhos de Conversão</p>
                <div className="flex gap-2 flex-wrap">
                  <span className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded">⚡ Escassez</span>
                  <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">👥 Prova Social</span>
                  <span className="text-xs bg-orange-100 text-orange-700 px-2 py-1 rounded">⏰ Urgência</span>
                </div>
              </div>
            </Card>
          )}

          {/* Recomendação de Compra */}
          {selectedKnives.length > 1 && (
            <Card className="p-4 bg-amber-50 border-amber-200">
              <div className="flex items-start gap-3">
                <TrendingUp className="w-5 h-5 text-amber-600 mt-1 flex-shrink-0" />
                <div>
                  <p className="font-bold text-amber-900">Recomendação de Compra</p>
                  <p className="text-sm text-amber-800 mt-1">
                    {bestValue === selectedKnives[0]?.id
                      ? `${selectedKnives[0]?.name} é a melhor escolha para você - oferece a melhor relação qualidade-preço!`
                      : `Considere ${selectedKnives.find(k => k.id === bestValue)?.name} - melhor custo-benefício!`}
                  </p>
                  <Button className="mt-3 bg-amber-600 hover:bg-amber-700 w-full">
                    Comprar Agora
                  </Button>
                </div>
              </div>
            </Card>
          )}
        </div>
      )}

      {/* Mensagem Vazia */}
      {selectedKnives.length === 0 && (
        <Card className="p-8 text-center">
          <p className="text-gray-600 mb-4">Selecione até 4 facas para comparar com análise IA</p>
          <Button onClick={() => setShowSelector(true)} className="bg-purple-600 hover:bg-purple-700">
            <Plus className="w-4 h-4 mr-2" />
            Adicionar Faca
          </Button>
        </Card>
      )}
    </div>
  );
}
