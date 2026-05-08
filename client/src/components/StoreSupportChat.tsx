import React, { useState, useEffect, useRef } from 'react';
import { Send, X, MessageCircle, ShoppingCart, AlertCircle, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { trpc } from '@/lib/trpc';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  type?: 'text' | 'recommendation' | 'product-info';
}

interface StoreSupportChatProps {
  productId?: string;
  productName?: string;
  onProductRecommendation?: (recommendation: any) => void;
  onClose?: () => void;
}

export function StoreSupportChat({
  productId,
  productName,
  onProductRecommendation,
  onClose,
}: StoreSupportChatProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [loading, setLoading] = useState(false);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [showRecommendations, setShowRecommendations] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Iniciar conversa
  useEffect(() => {
    initializeChat();
  }, []);

  // Scroll automático
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const initializeChat = async () => {
    try {
      setLoading(true);
      const newConversationId = `conv_store_${Date.now()}`;
      setConversationId(newConversationId);

      let welcomeText = '👋 Olá! Bem-vindo à Cachaca e Cutelaria Pedro Gomes!\n\n';
      if (productName) {
        welcomeText += `Vejo que você está interessado em nosso(a) ${productName}.\n\n`;
      }
      welcomeText += 'Como posso ajudá-lo hoje? Posso:';
      welcomeText += '\n• Responder dúvidas sobre produtos';
      welcomeText += '\n• Recomendar a faca ideal para você';
      welcomeText += '\n• Ajudar com seu pedido';
      welcomeText += '\n• Oferecer suporte pós-venda';

      const welcomeMessage: Message = {
        id: `msg_${Date.now()}`,
        role: 'assistant',
        content: welcomeText,
        timestamp: new Date(),
        type: 'text',
      };

      setMessages([welcomeMessage]);
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim() || !conversationId) return;

    const userMessage: Message = {
      id: `msg_${Date.now()}`,
      role: 'user',
      content: inputValue,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setLoading(true);

    try {
      // Processar mensagem
      const response = await processUserMessage(inputValue);

      const assistantMessage: Message = {
        id: `msg_${Date.now() + 1}`,
        role: 'assistant',
        content: response,
        timestamp: new Date(),
        type: 'text',
      };

      setMessages(prev => [...prev, assistantMessage]);

      // Verificar se deve mostrar recomendações
      if (messages.length > 4 && !showRecommendations) {
        setShowRecommendations(true);
      }
    } finally {
      setLoading(false);
    }
  };

  const processUserMessage = async (message: string): Promise<string> => {
    // Simulação de processamento
    const lowerMessage = message.toLowerCase();

    // Detectar tipo de pergunta
    if (lowerMessage.includes('recomend') || lowerMessage.includes('qual faca')) {
      return '🎯 Ótimo! Vou recomendar a faca ideal para você.\n\nPoderia me dizer:\n1. Qual é seu nível de experiência? (iniciante, intermediário, profissional)\n2. Para qual uso? (frutas, carnes, pão, geral)\n3. Qual é seu orçamento?';
    }

    if (lowerMessage.includes('preço') || lowerMessage.includes('custa')) {
      return '💰 Temos facas em diferentes faixas de preço:\n\n• Econômicas: R$ 45-70\n• Intermediárias: R$ 70-130\n• Premium: R$ 130+\n\nQual faixa de preço você prefere?';
    }

    if (lowerMessage.includes('frete') || lowerMessage.includes('envio')) {
      return '🚚 Ótima pergunta!\n\n✅ Frete grátis para compras acima de R$ 100\n✅ Entrega em 2-5 dias úteis\n✅ Rastreamento completo\n\nQuer saber mais sobre alguma faca?';
    }

    if (lowerMessage.includes('garantia') || lowerMessage.includes('devolv')) {
      return '✅ Garantia e Política de Devolução:\n\n✅ Garantia de 2 anos contra defeitos\n✅ Devolução em até 30 dias\n✅ Reembolso total se não gostar\n✅ Sem perguntas\n\nSua satisfação é nossa prioridade!';
    }

    if (lowerMessage.includes('obrigado') || lowerMessage.includes('valeu')) {
      return '😊 De nada! Fico feliz em ajudar.\n\nGostaria de:\n• Continuar explorando nossos produtos?\n• Finalizar uma compra?\n• Falar com um agente humano?';
    }

    return '👂 Entendi sua pergunta. Deixe-me ajudá-lo melhor.\n\nPoderia ser mais específico sobre o que você gostaria de saber?';
  };

  const handleGetRecommendation = async () => {
    setLoading(true);
    try {
      // Simulação de recomendação
      const recommendation = {
        knifeId: 'knife-005',
        knifeName: 'Faca de Chef',
        reason: 'Versátil e perfeita para iniciantes',
        price: 120,
        matchScore: 95,
        sellingPoints: [
          'Fácil de usar e manter',
          'Excelente custo-benefício',
          'Recomendada por chefs profissionais',
        ],
      };

      const recommendationMessage: Message = {
        id: `msg_${Date.now()}`,
        role: 'assistant',
        content: `🎯 Recomendação Perfeita para Você!\n\n${recommendation.knifeName}\n\n💡 Por quê: ${recommendation.reason}\n\n💰 Preço: R$ ${recommendation.price}\n\n⭐ Compatibilidade: ${recommendation.matchScore}%\n\n✨ Destaques:\n${recommendation.sellingPoints.map(p => `• ${p}`).join('\n')}\n\nGostaria de adicionar ao carrinho?`,
        timestamp: new Date(),
        type: 'recommendation',
      };

      setMessages(prev => [...prev, recommendationMessage]);
      onProductRecommendation?.(recommendation);
    } finally {
      setLoading(false);
    }
  };

  const quickReplies = [
    '🎯 Recomendar faca',
    '💰 Ver preços',
    '🚚 Frete grátis?',
    '✅ Garantia',
    '📞 Falar com alguém',
  ];

  return (
    <Card className="flex flex-col h-96 w-full max-w-md bg-white border-2 border-purple-200 shadow-lg">
      {/* Header */}
      <div className="bg-gradient-to-r from-amber-600 to-orange-600 text-white p-4 flex items-center justify-between rounded-t-lg">
        <div className="flex items-center gap-2">
          <MessageCircle className="w-5 h-5" />
          <div>
            <h3 className="font-bold">Cachaca & Cutelaria</h3>
            <p className="text-xs opacity-90">🤖 Atendimento IA 24/7</p>
          </div>
        </div>
        {onClose && (
          <button onClick={onClose} className="hover:bg-white/20 p-1 rounded">
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Mensagens */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
        {messages.map(message => (
          <div
            key={message.id}
            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-xs px-4 py-2 rounded-lg whitespace-pre-wrap ${
                message.role === 'user'
                  ? 'bg-amber-600 text-white rounded-br-none'
                  : 'bg-white text-gray-900 border border-gray-200 rounded-bl-none'
              }`}
            >
              <p className="text-sm">{message.content}</p>
              <span className="text-xs opacity-70 mt-1 block">
                {message.timestamp.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-white border border-gray-200 text-gray-900 px-4 py-2 rounded-lg rounded-bl-none">
              <div className="flex gap-1">
                <div className="w-2 h-2 bg-amber-600 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-amber-600 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-2 h-2 bg-amber-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Respostas Rápidas */}
      {messages.length < 3 && (
        <div className="px-4 py-2 border-t bg-white">
          <p className="text-xs text-gray-600 mb-2">Respostas rápidas:</p>
          <div className="flex flex-wrap gap-2">
            {quickReplies.slice(0, 3).map((reply, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setInputValue(reply);
                  setTimeout(() => handleSendMessage(), 100);
                }}
                className="text-xs bg-amber-100 text-amber-700 px-2 py-1 rounded hover:bg-amber-200 transition"
              >
                {reply}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input */}
      <div className="border-t p-3 flex gap-2 bg-white">
        <input
          type="text"
          value={inputValue}
          onChange={e => setInputValue(e.target.value)}
          onKeyPress={e => e.key === 'Enter' && handleSendMessage()}
          placeholder="Digite sua mensagem..."
          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-600"
          disabled={loading}
        />
        <Button
          onClick={handleSendMessage}
          disabled={loading || !inputValue.trim()}
          size="sm"
          className="bg-amber-600 hover:bg-amber-700"
        >
          <Send className="w-4 h-4" />
        </Button>
        {showRecommendations && (
          <Button
            onClick={handleGetRecommendation}
            disabled={loading}
            size="sm"
            variant="outline"
            title="Obter recomendação"
          >
            <Zap className="w-4 h-4" />
          </Button>
        )}
      </div>
    </Card>
  );
}
