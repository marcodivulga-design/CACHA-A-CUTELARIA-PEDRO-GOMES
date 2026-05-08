import React, { useState } from 'react';
import { MessageCircle, TrendingUp, Users, Clock, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { StoreSupportChat } from '@/components/StoreSupportChat';

export function AISupportPage() {
  const [showChat, setShowChat] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-amber-600 to-orange-600 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-3 mb-4">
            <MessageCircle className="w-8 h-8" />
            <h1 className="text-4xl font-bold">Atendimento IA 24/7</h1>
          </div>
          <p className="text-lg opacity-90">
            Assistente inteligente para ajudá-lo a encontrar a faca perfeita
          </p>
        </div>
      </div>

      {/* Conteúdo Principal */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Coluna Esquerda - Informações */}
          <div className="lg:col-span-2 space-y-6">
            {/* Benefícios */}
            <Card className="p-6 bg-white">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Como Funciona</h2>
              <div className="space-y-4">
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center">
                    <MessageCircle className="w-6 h-6 text-amber-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900">Chat Inteligente</h3>
                    <p className="text-gray-600 text-sm">
                      Converse com nossa IA especializada em facas artesanais. Ela entende suas necessidades e oferece recomendações personalizadas.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <TrendingUp className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900">Recomendações Precisas</h3>
                    <p className="text-gray-600 text-sm">
                      Baseado em suas respostas, a IA recomenda a faca que melhor se adequa ao seu perfil e orçamento.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Clock className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900">Suporte 24/7</h3>
                    <p className="text-gray-600 text-sm">
                      Disponível a qualquer hora do dia ou da noite. Responde em segundos, sem filas de espera.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                    <Users className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900">Escalação para Humano</h3>
                    <p className="text-gray-600 text-sm">
                      Se precisar de ajuda mais específica, a IA conecta você com um agente humano especializado.
                    </p>
                  </div>
                </div>
              </div>
            </Card>

            {/* Estatísticas */}
            <Card className="p-6 bg-white">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Resultados</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-amber-600">95%</div>
                  <p className="text-sm text-gray-600">Satisfação</p>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-amber-600">2.5s</div>
                  <p className="text-sm text-gray-600">Tempo Resposta</p>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-amber-600">1000+</div>
                  <p className="text-sm text-gray-600">Conversas</p>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-amber-600">24/7</div>
                  <p className="text-sm text-gray-600">Disponível</p>
                </div>
              </div>
            </Card>

            {/* Casos de Uso */}
            <Card className="p-6 bg-white">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Casos de Uso</h2>
              <div className="space-y-3">
                <div className="p-4 bg-amber-50 rounded-lg border border-amber-200">
                  <p className="font-semibold text-amber-900">❓ "Qual faca é melhor para iniciantes?"</p>
                  <p className="text-sm text-amber-700 mt-2">
                    A IA recomenda facas fáceis de usar e manter, com excelente custo-benefício.
                  </p>
                </div>

                <div className="p-4 bg-amber-50 rounded-lg border border-amber-200">
                  <p className="font-semibold text-amber-900">💰 "Tenho R$ 100 de orçamento"</p>
                  <p className="text-sm text-amber-700 mt-2">
                    Recomenda as melhores opções dentro dessa faixa de preço com análise de custo-benefício.
                  </p>
                </div>

                <div className="p-4 bg-amber-50 rounded-lg border border-amber-200">
                  <p className="font-semibold text-amber-900">🚚 "Como é o frete?"</p>
                  <p className="text-sm text-amber-700 mt-2">
                    Explica sobre frete grátis, prazos de entrega e rastreamento.
                  </p>
                </div>

                <div className="p-4 bg-amber-50 rounded-lg border border-amber-200">
                  <p className="font-semibold text-amber-900">✅ "Qual é a garantia?"</p>
                  <p className="text-sm text-amber-700 mt-2">
                    Detalha a garantia de 2 anos e política de devolução de 30 dias.
                  </p>
                </div>
              </div>
            </Card>

            {/* Avaliações */}
            <Card className="p-6 bg-white">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Avaliações de Clientes</h2>
              <div className="space-y-4">
                <div className="flex gap-4">
                  <div className="flex gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">Atendimento Excelente!</p>
                    <p className="text-sm text-gray-600">
                      "A IA me ajudou a escolher a faca perfeita. Muito rápido e eficiente!"
                    </p>
                    <p className="text-xs text-gray-500 mt-2">- João Silva</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">Recomendação Perfeita</p>
                    <p className="text-sm text-gray-600">
                      "Comprei a faca que a IA recomendou e amei! Exatamente o que eu procurava."
                    </p>
                    <p className="text-xs text-gray-500 mt-2">- Maria Santos</p>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Coluna Direita - Chat */}
          <div className="lg:col-span-1">
            <div className="sticky top-4">
              {!showChat ? (
                <Card className="p-6 bg-white text-center space-y-4">
                  <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto">
                    <MessageCircle className="w-8 h-8 text-amber-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">Comece Agora</h3>
                    <p className="text-sm text-gray-600 mt-2">
                      Clique no botão abaixo para conversar com nossa IA especializada.
                    </p>
                  </div>
                  <Button
                    onClick={() => setShowChat(true)}
                    className="w-full bg-amber-600 hover:bg-amber-700 text-white"
                    size="lg"
                  >
                    <MessageCircle className="w-5 h-5 mr-2" />
                    Iniciar Chat
                  </Button>
                </Card>
              ) : (
                <StoreSupportChat
                  productId={selectedProduct}
                  onClose={() => setShowChat(false)}
                  onProductRecommendation={(rec) => console.log('Recomendação:', rec)}
                />
              )}
            </div>
          </div>
        </div>
      </div>

      {/* CTA Final */}
      <div className="bg-amber-50 border-t border-amber-200 py-12">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Pronto para encontrar sua faca ideal?
          </h2>
          <p className="text-lg text-gray-600 mb-6">
            Converse com nossa IA agora e receba uma recomendação personalizada
          </p>
          <Button
            onClick={() => setShowChat(true)}
            className="bg-amber-600 hover:bg-amber-700 text-white"
            size="lg"
          >
            <MessageCircle className="w-5 h-5 mr-2" />
            Conversar com IA
          </Button>
        </div>
      </div>
    </div>
  );
}
