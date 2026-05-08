import React, { useState } from 'react';
import { ChevronRight, ChevronLeft, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface QuizQuestion {
  id: string;
  question: string;
  description?: string;
  options: {
    text: string;
    value: string;
    icon?: string;
    psychologicalValue?: string;
  }[];
}

interface KnifeQuizAIProps {
  onComplete?: (result: any) => void;
  onClose?: () => void;
}

const questions: QuizQuestion[] = [
  {
    id: 'experience',
    question: 'Qual é seu nível de experiência na cozinha?',
    description: 'Isso nos ajuda a recomendar facas com o nível certo de manutenção',
    options: [
      { text: 'Iniciante', value: 'beginner', icon: '🌱', psychologicalValue: 'safe' },
      { text: 'Intermediário', value: 'intermediate', icon: '👨‍🍳', psychologicalValue: 'balanced' },
      { text: 'Profissional', value: 'professional', icon: '🏆', psychologicalValue: 'premium' },
    ],
  },
  {
    id: 'usage',
    question: 'Para qual uso principal você precisa da faca?',
    description: 'Diferentes tarefas exigem diferentes características',
    options: [
      { text: 'Frutas e Legumes', value: 'vegetables', icon: '🥕', psychologicalValue: 'precision' },
      { text: 'Carnes', value: 'meat', icon: '🥩', psychologicalValue: 'power' },
      { text: 'Pão e Bolos', value: 'bread', icon: '🍞', psychologicalValue: 'versatility' },
      { text: 'Uso Geral', value: 'general', icon: '🔪', psychologicalValue: 'reliability' },
    ],
  },
  {
    id: 'frequency',
    question: 'Com que frequência você usa facas?',
    description: 'Uso frequente exige maior durabilidade',
    options: [
      { text: 'Ocasionalmente (1-2x semana)', value: 'occasional', icon: '📅' },
      { text: 'Regularmente (3-5x semana)', value: 'regular', icon: '📆' },
      { text: 'Diariamente', value: 'daily', icon: '⏰' },
    ],
  },
  {
    id: 'budget',
    question: 'Qual é seu orçamento?',
    description: 'Temos opções para todos os bolsos',
    options: [
      { text: 'Econômico (até R$ 70)', value: 'budget', icon: '💰', psychologicalValue: 'value' },
      { text: 'Intermediário (R$ 70-130)', value: 'mid', icon: '💵', psychologicalValue: 'quality' },
      { text: 'Premium (acima de R$ 130)', value: 'premium', icon: '💎', psychologicalValue: 'luxury' },
    ],
  },
  {
    id: 'priority',
    question: 'O que é mais importante para você?',
    description: 'Ajuda a personalizar ainda mais a recomendação',
    options: [
      { text: 'Durabilidade', value: 'durability', icon: '💪' },
      { text: 'Fio Afiado', value: 'sharpness', icon: '⚡' },
      { text: 'Fácil Manutenção', value: 'maintenance', icon: '🧹' },
      { text: 'Estética', value: 'aesthetics', icon: '🎨' },
    ],
  },
];

export function KnifeQuizAI({ onComplete, onClose }: KnifeQuizAIProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const currentQuestion = questions[currentStep];
  const progress = ((currentStep + 1) / questions.length) * 100;

  const handleAnswer = (value: string) => {
    const newAnswers = { ...answers, [currentQuestion.id]: value };
    setAnswers(newAnswers);

    if (currentStep < questions.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      generateResult(newAnswers);
    }
  };

  const generateResult = async (finalAnswers: Record<string, string>) => {
    setLoading(true);
    try {
      // Simulação de análise com IA
      const recommendations: Record<string, any> = {
        beginner_vegetables_budget: {
          name: 'Faca de Frutas',
          reason: 'Perfeita para iniciantes - fácil de usar e manter',
          id: 'knife-002',
          score: 95,
          copywriting: 'Comece sua jornada culinária com a faca ideal para iniciantes!',
          urgency: 'Apenas 5 em estoque - aproveite agora!',
          discount: 10,
        },
        beginner_general_mid: {
          name: 'Faca de Chef',
          reason: 'Versátil e confiável para iniciantes que querem versatilidade',
          id: 'knife-005',
          score: 98,
          copywriting: 'A faca que todo cozinheiro iniciante precisa!',
          urgency: 'Promoção válida apenas hoje - 15% de desconto!',
          discount: 15,
        },
        professional_meat_premium: {
          name: 'Faca Artesanal Premium',
          reason: 'Qualidade profissional para uso intenso - edição limitada',
          id: 'knife-010',
          score: 99,
          copywriting: 'Para profissionais que exigem o melhor',
          urgency: 'Edição limitada - apenas 3 unidades restantes!',
          discount: 0,
        },
      };

      const key = `${finalAnswers.experience}_${finalAnswers.usage}_${finalAnswers.budget}`;
      const recommendation = recommendations[key] || {
        name: 'Faca de Chef',
        reason: 'Versátil e confiável para a maioria dos usuários',
        id: 'knife-005',
        score: 92,
        copywriting: 'A escolha perfeita para você!',
        urgency: 'Aproveite nossa promoção especial',
        discount: 10,
      };

      setResult({
        ...recommendation,
        answers: finalAnswers,
        personalizedMessage: generatePersonalizedMessage(finalAnswers),
        psychologicalTriggers: generateTriggers(recommendation),
      });
    } finally {
      setLoading(false);
    }
  };

  const generatePersonalizedMessage = (answers: Record<string, string>) => {
    const messages: Record<string, string> = {
      beginner: 'Como iniciante, você precisa de uma faca que seja fácil de usar e manter.',
      intermediate: 'Você já tem experiência, então podemos recomendar algo mais sofisticado.',
      professional: 'Como profissional, você merece qualidade premium.',
    };
    return messages[answers.experience] || 'Encontramos a faca perfeita para você!';
  };

  const generateTriggers = (recommendation: any) => {
    return [
      { type: 'scarcity', text: recommendation.urgency },
      { type: 'social_proof', text: '⭐ 125+ clientes satisfeitos' },
      { type: 'discount', text: `💰 ${recommendation.discount}% de desconto hoje!` },
    ].filter(t => t.text);
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleReset = () => {
    setCurrentStep(0);
    setAnswers({});
    setResult(null);
  };

  if (result) {
    return (
      <div className="space-y-6">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Sua Faca Ideal! 🎯</h2>
          <div className="flex justify-center mb-4">
            <div className="relative w-20 h-20">
              <svg className="w-full h-full" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="45" fill="none" stroke="#e5e7eb" strokeWidth="8" />
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  fill="none"
                  stroke="#16a34a"
                  strokeWidth="8"
                  strokeDasharray={`${result.score * 2.83} 283`}
                  transform="rotate(-90 50 50)"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-2xl font-bold text-green-600">{result.score}%</span>
              </div>
            </div>
          </div>
          <p className="text-gray-600 text-lg">{result.personalizedMessage}</p>
        </div>

        <Card className="p-8 space-y-4">
          {/* Recomendação Principal */}
          <div className="text-center border-b pb-4">
            <h3 className="text-2xl font-bold text-gray-900 mb-2">{result.name}</h3>
            <p className="text-gray-600 mb-3">{result.reason}</p>
            <p className="text-sm italic text-purple-600 font-semibold">{result.copywriting}</p>
          </div>

          {/* Gatilhos Psicológicos */}
          <div className="space-y-2">
            {result.psychologicalTriggers.map((trigger: any, idx: number) => (
              <div
                key={idx}
                className={`p-3 rounded-lg text-sm font-semibold ${
                  trigger.type === 'scarcity'
                    ? 'bg-red-50 text-red-700 border border-red-200'
                    : trigger.type === 'social_proof'
                    ? 'bg-green-50 text-green-700 border border-green-200'
                    : 'bg-orange-50 text-orange-700 border border-orange-200'
                }`}
              >
                {trigger.type === 'scarcity' && '⚡ '}
                {trigger.type === 'social_proof' && '👥 '}
                {trigger.type === 'discount' && '💰 '}
                {trigger.text}
              </div>
            ))}
          </div>

          {/* Perfil do Usuário */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-sm font-semibold text-gray-900 mb-3">Seu Perfil:</p>
            <div className="grid grid-cols-2 gap-3 text-sm">
              {Object.entries(result.answers).map(([key, value]) => (
                <div key={key}>
                  <p className="font-semibold text-gray-700 capitalize">{key}</p>
                  <p className="text-gray-600 capitalize">{String(value).replace(/_/g, ' ')}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Botões de Ação */}
          <div className="flex gap-3 pt-4">
            <Button
              onClick={() => {
                onComplete?.(result);
                onClose?.();
              }}
              className="flex-1 bg-green-600 hover:bg-green-700 text-white"
              size="lg"
            >
              <Zap className="w-5 h-5 mr-2" />
              Comprar Agora
            </Button>
            <Button onClick={handleReset} variant="outline" className="flex-1">
              Refazer Quiz
            </Button>
          </div>

          {/* Garantia */}
          <div className="bg-blue-50 border border-blue-200 p-3 rounded-lg text-center text-sm text-blue-700">
            ✓ Garantia de 2 anos | Frete grátis | Devolução em 30 dias
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Quiz Inteligente</h2>
          <p className="text-gray-600">Encontre sua faca ideal com IA</p>
        </div>
        {onClose && (
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            ✕
          </button>
        )}
      </div>

      {/* Barra de Progresso */}
      <div className="space-y-2">
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-gradient-to-r from-purple-600 to-blue-600 h-full rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="text-sm text-gray-600">
          Pergunta {currentStep + 1} de {questions.length}
        </p>
      </div>

      {/* Pergunta */}
      <Card className="p-8 space-y-6">
        <div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">{currentQuestion.question}</h3>
          {currentQuestion.description && (
            <p className="text-gray-600 text-sm">{currentQuestion.description}</p>
          )}
        </div>

        {/* Opções */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {currentQuestion.options.map(option => (
            <button
              key={option.value}
              onClick={() => handleAnswer(option.value)}
              className="p-4 border-2 border-gray-200 rounded-lg hover:border-purple-600 hover:bg-purple-50 transition text-left group"
            >
              <div className="flex items-center gap-3">
                {option.icon && <span className="text-2xl group-hover:scale-125 transition">{option.icon}</span>}
                <div className="flex-1">
                  <span className="font-semibold text-gray-900 group-hover:text-purple-600">{option.text}</span>
                  {option.psychologicalValue && (
                    <p className="text-xs text-gray-500 mt-1">→ {option.psychologicalValue}</p>
                  )}
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* Navegação */}
        <div className="flex gap-3 pt-4">
          <Button
            onClick={handlePrevious}
            disabled={currentStep === 0}
            variant="outline"
            className="flex-1"
          >
            <ChevronLeft className="w-4 h-4 mr-2" />
            Anterior
          </Button>
          <Button
            onClick={() => handleReset()}
            variant="outline"
            className="flex-1"
          >
            Recomeçar
          </Button>
        </div>
      </Card>

      {/* Dica */}
      <Card className="p-4 bg-blue-50 border-blue-200">
        <p className="text-sm text-blue-700">
          💡 <strong>Dica:</strong> Suas respostas ajudam a IA a recomendar a faca perfeita para seu estilo de vida.
        </p>
      </Card>
    </div>
  );
}
