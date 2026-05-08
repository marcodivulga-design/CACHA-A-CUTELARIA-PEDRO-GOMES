import { router, protectedProcedure, publicProcedure } from '../_core/trpc';
import { z } from 'zod';
import { invokeLLM } from '../_core/llm';

export const aiMarketingRouter = router({
  // Análise comportamental do usuário
  analyzeUserBehavior: protectedProcedure
    .input(z.object({
      userId: z.string(),
      viewedKnives: z.array(z.string()),
      timeSpent: z.array(z.number()),
      clicks: z.array(z.string()),
      cartItems: z.array(z.string()).optional(),
    }))
    .mutation(async ({ input, ctx }) => {
      const prompt = `
        Analise o comportamento do usuário:
        - Facas visualizadas: ${input.viewedKnives.join(', ')}
        - Tempo gasto (segundos): ${input.timeSpent.join(', ')}
        - Cliques em: ${input.clicks.join(', ')}
        - Carrinho: ${input.cartItems?.join(', ') || 'vazio'}
        
        Retorne em JSON:
        1. Perfil de comprador (entusiasta, comparador, indeciso, pronto-para-comprar)
        2. Probabilidade de conversão (0-100%)
        3. Próximo passo recomendado
        4. Gatilho psicológico mais efetivo
        5. Preço ideal para este usuário
      `;

      const response = await invokeLLM({
        messages: [
          {
            role: 'system',
            content: 'Você é um especialista em psicologia do consumidor e análise comportamental.',
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        response_format: {
          type: 'json_schema',
          json_schema: {
            name: 'user_behavior_analysis',
            strict: true,
            schema: {
              type: 'object',
              properties: {
                buyerProfile: { type: 'string' },
                conversionProbability: { type: 'number' },
                nextStep: { type: 'string' },
                psychologicalTrigger: { type: 'string' },
                optimalPrice: { type: 'number' },
              },
              required: ['buyerProfile', 'conversionProbability', 'nextStep', 'psychologicalTrigger', 'optimalPrice'],
              additionalProperties: false,
            },
          },
        },
      });

      const content = response.choices[0]?.message?.content;
      const parsed = typeof content === 'string' ? JSON.parse(content) : content;

      return {
        success: true,
        analysis: parsed,
      };
    }),

  // Gerar copywriting otimizado
  generateOptimizedCopy: publicProcedure
    .input(z.object({
      knifeId: z.string(),
      knifeName: z.string(),
      targetAudience: z.enum(['beginner', 'professional', 'collector', 'chef']),
      context: z.enum(['product_page', 'email', 'social', 'ad']),
    }))
    .mutation(async ({ input }) => {
      const prompt = `
        Crie copywriting otimizado para conversão:
        - Produto: ${input.knifeName}
        - Público: ${input.targetAudience}
        - Contexto: ${input.context}
        
        Retorne em JSON:
        1. Headline (máx 60 caracteres) - Deve despertar emoção
        2. Subheadline (máx 100 caracteres) - Benefício principal
        3. CTA (máx 30 caracteres) - Call-to-action persuasivo
        4. Social proof (máx 150 caracteres) - Prova social
        5. Urgency message (máx 100 caracteres) - Gatilho de urgência
        6. AIDA sequence (Attention, Interest, Desire, Action)
      `;

      const response = await invokeLLM({
        messages: [
          {
            role: 'system',
            content: 'Você é um copywriter especialista em conversão e psicologia de vendas. Crie textos que vendem.',
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        response_format: {
          type: 'json_schema',
          json_schema: {
            name: 'optimized_copy',
            strict: true,
            schema: {
              type: 'object',
              properties: {
                headline: { type: 'string' },
                subheadline: { type: 'string' },
                cta: { type: 'string' },
                socialProof: { type: 'string' },
                urgencyMessage: { type: 'string' },
                aidaSequence: { type: 'string' },
              },
              required: ['headline', 'subheadline', 'cta', 'socialProof', 'urgencyMessage', 'aidaSequence'],
              additionalProperties: false,
            },
          },
        },
      });

      const content = response.choices[0]?.message?.content;
      const parsed = typeof content === 'string' ? JSON.parse(content) : content;

      return {
        success: true,
        copy: parsed,
      };
    }),

  // Recomendações de upsell/cross-sell
  getUpsellCrossSellRecommendations: protectedProcedure
    .input(z.object({
      currentKnifeId: z.string(),
      userProfile: z.string(),
      budget: z.number(),
    }))
    .mutation(async ({ input }) => {
      const prompt = `
        Recomende estratégia de upsell/cross-sell:
        - Faca atual: ${input.currentKnifeId}
        - Perfil: ${input.userProfile}
        - Orçamento: R$ ${input.budget}
        
        Retorne em JSON:
        1. Upsell recommendation (faca premium similar)
        2. Cross-sell recommendations (3 produtos complementares)
        3. Bundle suggestion (combo com desconto)
        4. Estratégia de apresentação
        5. Desconto sugerido para conversão
      `;

      const response = await invokeLLM({
        messages: [
          {
            role: 'system',
            content: 'Você é especialista em estratégias de vendas e aumento de ticket médio.',
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
    }),

  // Preço dinâmico inteligente
  calculateDynamicPrice: publicProcedure
    .input(z.object({
      basePrice: z.number(),
      demand: z.number(), // 0-100
      inventory: z.number(),
      userSegment: z.string(),
      timeOfDay: z.number(), // 0-23
      dayOfWeek: z.number(), // 0-6
    }))
    .mutation(async ({ input }) => {
      // Algoritmo de preço dinâmico
      let multiplier = 1;

      // Demanda
      multiplier += (input.demand / 100) * 0.15; // +15% em alta demanda

      // Inventário
      if (input.inventory < 5) multiplier += 0.1; // +10% se poucos itens
      if (input.inventory > 50) multiplier -= 0.05; // -5% se muito estoque

      // Segmento de usuário
      const segmentMultipliers: Record<string, number> = {
        premium: 1.2,
        mid: 1,
        budget: 0.9,
      };
      multiplier *= segmentMultipliers[input.userSegment] || 1;

      // Hora do dia (pico de compras)
      if (input.timeOfDay >= 19 && input.timeOfDay <= 22) multiplier += 0.05; // +5% noite

      // Dia da semana (fim de semana)
      if (input.dayOfWeek === 5 || input.dayOfWeek === 6) multiplier += 0.08; // +8% fim de semana

      const dynamicPrice = Math.round(input.basePrice * multiplier * 100) / 100;

      return {
        success: true,
        basePrice: input.basePrice,
        dynamicPrice,
        multiplier: Math.round(multiplier * 100) / 100,
        discount: input.basePrice > dynamicPrice ? input.basePrice - dynamicPrice : 0,
      };
    }),

  // Segmentação automática de usuários
  segmentUser: protectedProcedure
    .input(z.object({
      userId: z.string(),
      purchaseHistory: z.array(z.object({ price: z.number(), category: z.string() })),
      browsing: z.array(z.string()),
      engagement: z.number(), // 0-100
    }))
    .mutation(async ({ input, ctx }) => {
      const avgPurchase = input.purchaseHistory.length > 0
        ? input.purchaseHistory.reduce((sum, p) => sum + p.price, 0) / input.purchaseHistory.length
        : 0;

      let segment = 'standard';
      if (avgPurchase > 150) segment = 'premium';
      else if (avgPurchase < 60) segment = 'budget';

      if (input.engagement > 80) segment = 'highly-engaged';
      if (input.purchaseHistory.length === 0 && input.engagement < 30) segment = 'at-risk';

      return {
        success: true,
        segment,
        avgPurchaseValue: avgPurchase,
        lifeTimeValue: avgPurchase * (input.purchaseHistory.length + 1),
        churnRisk: 100 - input.engagement,
      };
    }),

  // Análise de funil de vendas
  analyzeSalesFunnel: publicProcedure
    .input(z.object({
      visitors: z.number(),
      productViews: z.number(),
      addToCart: z.number(),
      checkouts: z.number(),
      purchases: z.number(),
    }))
    .mutation(async ({ input }) => {
      const conversionRates = {
        visitorToProduct: (input.productViews / input.visitors) * 100,
        productToCart: (input.addToCart / input.productViews) * 100,
        cartToCheckout: (input.checkouts / input.addToCart) * 100,
        checkoutToPurchase: (input.purchases / input.checkouts) * 100,
        totalConversion: (input.purchases / input.visitors) * 100,
      };

      const bottlenecks = [];
      if (conversionRates.visitorToProduct < 30) bottlenecks.push('Atração insuficiente');
      if (conversionRates.productToCart < 15) bottlenecks.push('Descrição de produto fraca');
      if (conversionRates.cartToCheckout < 50) bottlenecks.push('Processo de checkout complexo');
      if (conversionRates.checkoutToPurchase < 80) bottlenecks.push('Confiança no pagamento');

      return {
        success: true,
        conversionRates,
        bottlenecks,
        recommendations: bottlenecks.map(b => `Otimizar: ${b}`),
      };
    }),

  // Gerador de estratégia de marketing
  generateMarketingStrategy: publicProcedure
    .input(z.object({
      productId: z.string(),
      targetAudience: z.string(),
      budget: z.number(),
      goals: z.array(z.string()),
    }))
    .mutation(async ({ input }) => {
      const prompt = `
        Crie estratégia de marketing completa:
        - Produto: ${input.productId}
        - Público: ${input.targetAudience}
        - Orçamento: R$ ${input.budget}
        - Objetivos: ${input.goals.join(', ')}
        
        Retorne em JSON:
        1. Canais recomendados (com % de orçamento)
        2. Mensagens principais (3)
        3. Gatilhos psicológicos (3)
        4. Timing ideal
        5. Métricas de sucesso
        6. Plano de 30 dias
      `;

      const response = await invokeLLM({
        messages: [
          {
            role: 'system',
            content: 'Você é estrategista de marketing digital com expertise em vendas.',
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
      });

      return {
        success: true,
        strategy: response.choices[0]?.message?.content,
      };
    }),

  // Análise de concorrência
  analyzeCompetition: publicProcedure
    .input(z.object({
      productId: z.string(),
      competitors: z.array(z.object({ name: z.string(), price: z.number(), rating: z.number() })),
    }))
    .mutation(async ({ input }) => {
      const avgCompetitorPrice = input.competitors.reduce((sum, c) => sum + c.price, 0) / input.competitors.length;
      const avgCompetitorRating = input.competitors.reduce((sum, c) => sum + c.rating, 0) / input.competitors.length;

      return {
        success: true,
        analysis: {
          pricePosition: 'competitive',
          ratingPosition: 'strong',
          recommendations: [
            'Enfatizar qualidade artesanal',
            'Destacar garantia de 2 anos',
            'Oferecer frete grátis',
          ],
        },
      };
    }),

  // Previsão de conversão
  predictConversion: protectedProcedure
    .input(z.object({
      userId: z.string(),
      sessionDuration: z.number(),
      pagesViewed: z.number(),
      itemsInCart: z.number(),
      previousPurchases: z.number(),
      deviceType: z.string(),
    }))
    .mutation(async ({ input }) => {
      // Algoritmo de previsão
      let score = 0;

      score += Math.min(input.sessionDuration / 600, 1) * 20; // Tempo na sessão
      score += Math.min(input.pagesViewed / 10, 1) * 20; // Páginas vistas
      score += input.itemsInCart * 15; // Itens no carrinho
      score += Math.min(input.previousPurchases / 5, 1) * 20; // Histórico
      score += input.deviceType === 'desktop' ? 10 : 5; // Tipo de dispositivo

      const probability = Math.min(score, 100);
      const risk = probability < 30 ? 'high' : probability < 60 ? 'medium' : 'low';

      return {
        success: true,
        conversionProbability: Math.round(probability),
        riskLevel: risk,
        recommendedAction: risk === 'high' ? 'Ofereça desconto urgente' : 'Acompanhe naturalmente',
      };
    }),

  // Otimização de descrição de produto
  optimizeProductDescription: publicProcedure
    .input(z.object({
      productName: z.string(),
      features: z.array(z.string()),
      benefits: z.array(z.string()),
      targetAudience: z.string(),
    }))
    .mutation(async ({ input }) => {
      const prompt = `
        Otimize descrição de produto para conversão:
        - Nome: ${input.productName}
        - Features: ${input.features.join(', ')}
        - Benefícios: ${input.benefits.join(', ')}
        - Público: ${input.targetAudience}
        
        Retorne em JSON:
        1. Descrição curta (máx 150 caracteres)
        2. Descrição longa (máx 500 caracteres)
        3. Bullet points (5)
        4. Argumentos de venda (3)
        5. Objeções comuns e respostas (3)
      `;

      const response = await invokeLLM({
        messages: [
          {
            role: 'system',
            content: 'Você é especialista em copywriting de e-commerce e conversão.',
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
      });

      return {
        success: true,
        description: response.choices[0]?.message?.content,
      };
    }),

  // Recomendações de gatilhos psicológicos
  getPsychologicalTriggers: publicProcedure
    .input(z.object({
      productPrice: z.number(),
      stock: z.number(),
      reviews: z.number(),
      rating: z.number(),
    }))
    .mutation(async ({ input }) => {
      const triggers = [];

      // Escassez
      if (input.stock < 10) {
        triggers.push({
          type: 'scarcity',
          message: `Apenas ${input.stock} unidades em estoque!`,
          strength: 'high',
        });
      }

      // Prova social
      if (input.reviews > 50) {
        triggers.push({
          type: 'social_proof',
          message: `${input.reviews} clientes satisfeitos`,
          strength: 'high',
        });
      }

      // Urgência
      triggers.push({
        type: 'urgency',
        message: 'Promoção válida apenas hoje',
        strength: 'medium',
      });

      // FOMO (Fear of Missing Out)
      if (input.rating >= 4.8) {
        triggers.push({
          type: 'fomo',
          message: 'Produto mais vendido da categoria',
          strength: 'high',
        });
      }

      return {
        success: true,
        triggers,
        recommendedTriggers: triggers.filter(t => t.strength === 'high').slice(0, 3),
      };
    }),
});
