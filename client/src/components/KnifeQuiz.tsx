import React, { useState } from 'react';
import { ChevronRight, ChevronLeft } from 'lucide-react';
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
  }[];
}

interface KnifeQuizProps {
  onComplete?: (result: any) => void;
  onClose?: () => void;
}

const questions: QuizQuestion[] = [
  {
    id: 'experience',
    question: 'Qual é seu nível de experiência na cozinha?',
    options: [
      { text: 'Iniciante', value: 'beginner', icon: '🌱' },
      { text: 'Intermediário', value: 'intermediate', icon: '👨‍🍳' },
      { text: 'Profissional', value: 'professional', icon: '👨‍🍳‍' },
    ],
  },
  {
    id: 'usage',
    question: 'Para qual uso principal você precisa da faca?',
    options: [
      { text: 'Frutas e Legumes', value: 'vegetables', icon: '🥕' },
      { text: 'Carnes', value: 'meat', icon: '🥩' },
      { text: 'Pão e Bolos', value: 'bread', icon: '🍞' },
      { text: 'Uso Geral', value: 'general', icon: '🔪' },
    ],
  },
  {
    id: 'frequency',
    question: 'Com que frequência você usa facas?',
    options: [
      { text: 'Ocasionalmente', value: 'occasional', icon: '📅' },
      { text: 'Regularmente', value: 'regular', icon: '📆' },
      { text: 'Diariamente', value: 'daily', icon: '⏰' },
    ],
  },
  {
    id: 'maintenance',
    question: 'Você está disposto a fazer manutenção regular?',
    options: [
      { text: 'Não, prefiro baixa manutenção', value: 'low', icon: '✋' },
      { text: 'Sim, manutenção moderada', value: 'moderate', icon: '👍' },
      { text: 'Sim, manutenção completa', value: 'high', icon: '💪' },
    ],
  },
  {
    id: 'size',
    question: 'Qual tamanho de faca você prefere?',
    options: [
      { text: 'Pequena (até 10cm)', value: 'small', icon: '📏' },
      { text: 'Média (10-20cm)', value: 'medium', icon: '📐' },
      { text: 'Grande (acima de 20cm)', value: 'large', icon: '📊' },
    ],
  },
  {
    id: 'budget',
    question: 'Qual é seu orçamento?',
    options: [
      { text: 'Econômico (até R$ 70)', value: 'budget', icon: '💰' },
      { text: 'Intermediário (R$ 70-130)', value: 'mid', icon: '💵' },
      { text: 'Premium (acima de R$ 130)', value: 'premium', icon: '💎' },
    ],
  },
];

export function KnifeQuiz({ onComplete, onClose }: KnifeQuizProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [result, setResult] = useState<any>(null);

  const currentQuestion = questions[currentStep];
  const progress = ((currentStep + 1) / questions.length) * 100;

  const handleAnswer = (value: string) => {
    const newAnswers = { ...answers, [currentQuestion.id]: value };
    setAnswers(newAnswers);

    if (currentStep < questions.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // Quiz completo - gerar resultado
      generateResult(newAnswers);
    }
  };

  const generateResult = (finalAnswers: Record<string, string>) => {
    // Lógica para recomendar faca baseado nas respostas
    const recommendations: Record<string, any> = {
      beginner_vegetables_budget: {
        name: 'Faca de Frutas',
        reason: 'Perfeita para iniciantes, versátil e fácil de manter',
        id: 'knife-002',
      },
      beginner_general_mid: {
        name: 'Faca de Chef',
        reason: 'Excelente para iniciantes que querem versatilidade',
        id: 'knife-005',
      },
      professional_meat_premium: {
        name: 'Faca Artesanal Premium',
        reason: 'Qualidade profissional para uso intenso',
        id: 'knife-010',
      },
      intermediate_general_mid: {
        name: 'Faca de Chef',
        reason: 'Versátil e confiável para cozinheiros intermediários',
        id: 'knife-005',
      },
      professional_meat_high: {
        name: 'Faca de Açougue',
        reason: 'Profissional para cortes grandes',
        id: 'knife-009',
      },
    };

    const key = `${finalAnswers.experience}_${finalAnswers.usage}_${finalAnswers.budget}`;
    const recommendation = recommendations[key] || {
      name: 'Faca de Chef',
      reason: 'Versátil e confiável para a maioria dos usuários',
      id: 'knife-005',
    };

    setResult({
      ...recommendation,
      answers: finalAnswers,
    });
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
          <p className="text-gray-600">Baseado em suas respostas, recomendamos:</p>
        </div>

        <Card className="p-8 text-center space-y-4">
          <div className="text-6xl mb-4">🔪</div>
          <h3 className="text-2xl font-bold text-gray-900">{result.name}</h3>
          <p className="text-gray-600">{result.reason}</p>

          <div className="bg-amber-50 p-4 rounded-lg">
            <p className="text-sm text-gray-600 mb-2">Seu Perfil:</p>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>
                <p className="font-semibold text-gray-900">Experiência</p>
                <p className="text-gray-600 capitalize">{result.answers.experience}</p>
              </div>
              <div>
                <p className="font-semibold text-gray-900">Uso</p>
                <p className="text-gray-600 capitalize">{result.answers.usage}</p>
              </div>
              <div>
                <p className="font-semibold text-gray-900">Frequência</p>
                <p className="text-gray-600 capitalize">{result.answers.frequency}</p>
              </div>
              <div>
                <p className="font-semibold text-gray-900">Orçamento</p>
                <p className="text-gray-600 capitalize">{result.answers.budget}</p>
              </div>
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              onClick={() => {
                onComplete?.(result);
                onClose?.();
              }}
              className="flex-1 bg-amber-600 hover:bg-amber-700"
            >
              Ver Faca
            </Button>
            <Button onClick={handleReset} variant="outline" className="flex-1">
              Refazer Quiz
            </Button>
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
          <h2 className="text-2xl font-bold text-gray-900">Quiz: Encontre Sua Faca Ideal</h2>
          <p className="text-gray-600">Pergunta {currentStep + 1} de {questions.length}</p>
        </div>
        {onClose && (
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            ✕
          </button>
        )}
      </div>

      {/* Barra de Progresso */}
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div
          className="bg-amber-600 h-full rounded-full transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Pergunta */}
      <Card className="p-8 space-y-6">
        <div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">{currentQuestion.question}</h3>
          {currentQuestion.description && (
            <p className="text-gray-600">{currentQuestion.description}</p>
          )}
        </div>

        {/* Opções */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {currentQuestion.options.map(option => (
            <button
              key={option.value}
              onClick={() => handleAnswer(option.value)}
              className="p-4 border-2 border-gray-200 rounded-lg hover:border-amber-600 hover:bg-amber-50 transition text-left"
            >
              <div className="flex items-center gap-3">
                {option.icon && <span className="text-2xl">{option.icon}</span>}
                <span className="font-semibold text-gray-900">{option.text}</span>
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
    </div>
  );
}
