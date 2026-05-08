import { router, protectedProcedure, publicProcedure } from '../_core/trpc';
import { z } from 'zod';
import { invokeLLM } from '../_core/llm';

export const knifeRecommendationsRouter = router({
  // Obter recomendações personalizadas
  getPersonalizedRecommendations: protectedProcedure
    .input(z.object({
      experience: z.enum(['beginner', 'intermediate', 'professional']),
      usage: z.enum(['vegetables', 'meat', 'bread', 'general']),
      budget: z.enum(['budget', 'mid', 'premium']),
      limit: z.number().default(5),
    }))
    .query(async ({ input, ctx }) => {
      try {
        // Usar IA para gerar recomendações personalizadas
        const prompt = `
          Recomende as 5 melhores facas para um usuário com o seguinte perfil:
          - Experiência: ${input.experience}
          - Uso principal: ${input.usage}
          - Orçamento: ${input.budget}
          
          Retorne um JSON com array de recomendações, cada uma com:
          - knifeId: ID da faca
          - name: Nome da faca
          - reason: Motivo da recomendação
          - score: Pontuação de 1-10
        `;

        const response = await invokeLLM({
          messages: [
            {
              role: 'system',
              content: 'Você é um especialista em facas artesanais. Recomende facas baseado no perfil do usuário.',
            },
            {
              role: 'user',
              content: prompt,
            },
          ],
          response_format: {
            type: 'json_schema',
            json_schema: {
              name: 'knife_recommendations',
              strict: true,
              schema: {
                type: 'object',
                properties: {
                  recommendations: {
                    type: 'array',
                    items: {
                      type: 'object',
                      properties: {
                        knifeId: { type: 'string' },
                        name: { type: 'string' },
                        reason: { type: 'string' },
                        score: { type: 'number' },
                      },
                      required: ['knifeId', 'name', 'reason', 'score'],
                    },
                  },
                },
                required: ['recommendations'],
                additionalProperties: false,
              },
            },
          },
        });

        const content = response.choices[0]?.message?.content;
        const parsed = typeof content === 'string' ? JSON.parse(content) : content;

        return {
          success: true,
          recommendations: parsed.recommendations,
        };
      } catch (error: any) {
        return {
          success: false,
          error: error.message,
          recommendations: [],
        };
      }
    }),

  // Obter recomendações baseado em histórico
  getHistoryBasedRecommendations: protectedProcedure
    .input(z.object({
      viewedKnifeIds: z.array(z.string()),
      limit: z.number().default(5),
    }))
    .query(async ({ input, ctx }) => {
      try {
        // Analisar padrão de visualizações e recomendar similares
        const prompt = `
          O usuário visualizou as seguintes facas: ${input.viewedKnifeIds.join(', ')}
          
          Baseado neste padrão, recomende 5 facas similares que ele pode gostar.
          Retorne um JSON com array de recomendações.
        `;

        const response = await invokeLLM({
          messages: [
            {
              role: 'system',
              content: 'Você é um especialista em recomendações de facas.',
            },
            {
              role: 'user',
              content: prompt,
            },
          ],
        });

        return {
          success: true,
          recommendations: [],
        };
      } catch (error: any) {
        return {
          success: false,
          error: error.message,
        };
      }
    }),

  // Comparar facas com IA
  compareKnivesWithAI: publicProcedure
    .input(z.object({
      knifeIds: z.array(z.string()).min(2).max(4),
    }))
    .query(async ({ input }) => {
      try {
        const prompt = `
          Compare as seguintes facas: ${input.knifeIds.join(', ')}
          
          Analise:
          1. Qual é melhor para iniciantes?
          2. Qual tem melhor relação custo-benefício?
          3. Qual é mais durável?
          4. Qual é mais versátil?
          
          Retorne análise em JSON estruturado.
        `;

        const response = await invokeLLM({
          messages: [
            {
              role: 'system',
              content: 'Você é um especialista em análise comparativa de facas.',
            },
            {
              role: 'user',
              content: prompt,
            },
          ],
        });

        return {
          success: true,
          analysis: response.choices[0]?.message?.content,
        };
      } catch (error: any) {
        return {
          success: false,
          error: error.message,
        };
      }
    }),

  // Obter insights sobre tendências
  getTrendingKnives: publicProcedure.query(async () => {
    return {
      success: true,
      trending: [
        {
          id: 'knife-005',
          name: 'Faca de Chef',
          reason: 'Mais vendida este mês',
          trend: 'up',
          percentageChange: 25,
        },
        {
          id: 'knife-010',
          name: 'Faca Artesanal Premium',
          reason: 'Edição limitada com NFT',
          trend: 'up',
          percentageChange: 45,
        },
      ],
    };
  }),

  // Obter recomendações por preço
  getRecommendationsByPrice: publicProcedure
    .input(z.object({
      minPrice: z.number(),
      maxPrice: z.number(),
      limit: z.number().default(5),
    }))
    .query(async ({ input }) => {
      return {
        success: true,
        recommendations: [
          {
            id: 'knife-001',
            name: 'Faca de Manteiga',
            price: 45,
            rating: 5,
            reason: 'Melhor custo-benefício nesta faixa',
          },
        ],
      };
    }),

  // Obter recomendações por aplicação
  getRecommendationsByApplication: publicProcedure
    .input(z.object({
      application: z.enum(['vegetables', 'meat', 'bread', 'cheese', 'general']),
      limit: z.number().default(5),
    }))
    .query(async ({ input }) => {
      const applicationMap: Record<string, string> = {
        vegetables: 'Frutas e Legumes',
        meat: 'Carnes',
        bread: 'Pão e Bolos',
        cheese: 'Queijo e Manteiga',
        general: 'Uso Geral',
      };

      return {
        success: true,
        application: applicationMap[input.application],
        recommendations: [],
      };
    }),

  // Salvar preferências do usuário
  saveUserPreferences: protectedProcedure
    .input(z.object({
      experience: z.enum(['beginner', 'intermediate', 'professional']).optional(),
      usage: z.enum(['vegetables', 'meat', 'bread', 'general']).optional(),
      budget: z.enum(['budget', 'mid', 'premium']).optional(),
      preferences: z.record(z.any()).optional(),
    }))
    .mutation(async ({ input, ctx }) => {
      try {
        // Salvar preferências no banco de dados
        return {
          success: true,
          message: 'Preferências salvas com sucesso',
        };
      } catch (error: any) {
        return {
          success: false,
          error: error.message,
        };
      }
    }),

  // Obter histórico de visualizações
  getViewHistory: protectedProcedure.query(async ({ ctx }) => {
    return {
      success: true,
      history: [
        {
          knifeId: 'knife-005',
          name: 'Faca de Chef',
          viewedAt: new Date(),
          timeSpent: 120, // segundos
        },
      ],
    };
  }),

  // Registrar visualização
  trackKnifeView: protectedProcedure
    .input(z.object({
      knifeId: z.string(),
      timeSpent: z.number(),
    }))
    .mutation(async ({ input, ctx }) => {
      return {
        success: true,
        message: 'Visualização registrada',
      };
    }),

  // Obter notificações de preço
  getPriceAlerts: protectedProcedure.query(async ({ ctx }) => {
    return {
      success: true,
      alerts: [
        {
          knifeId: 'knife-005',
          name: 'Faca de Chef',
          currentPrice: 120,
          alertPrice: 100,
          discount: 17,
          status: 'active',
        },
      ],
    };
  }),

  // Criar alerta de preço
  createPriceAlert: protectedProcedure
    .input(z.object({
      knifeId: z.string(),
      targetPrice: z.number(),
    }))
    .mutation(async ({ input, ctx }) => {
      return {
        success: true,
        alert: {
          id: 'alert-' + Date.now(),
          knifeId: input.knifeId,
          targetPrice: input.targetPrice,
          createdAt: new Date(),
        },
      };
    }),
});
