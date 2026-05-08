import { router, protectedProcedure, publicProcedure } from '../_core/trpc';
import { z } from 'zod';
import { invokeLLM } from '../_core/llm';

export const aiSupportStoreRouter = router({
  // Iniciar chat de suporte na loja
  startStoreSupportChat: publicProcedure
    .input(z.object({
      userId: z.string().optional(),
      productId: z.string().optional(),
      channel: z.enum(['web', 'whatsapp', 'telegram', 'email']).default('web'),
    }))
    .mutation(async ({ input }) => {
      const conversationId = `conv_store_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

      let welcomeMessage = '👋 Olá! Bem-vindo à Cachaca e Cutelaria Pedro Gomes!';

      if (input.productId) {
        welcomeMessage += '\n\nVejo que você está interessado em um de nossos produtos. Como posso ajudá-lo?';
      } else {
        welcomeMessage += '\n\nTemos uma coleção exclusiva de facas artesanais. Como posso ajudá-lo?';
      }

      return {
        success: true,
        conversationId,
        initialMessage: welcomeMessage,
        organizationId: 'cachaca-cutelaria-pedro-gomes',
      };
    }),

  // Recomendação de faca baseada em conversa
  getKnifeRecommendation: publicProcedure
    .input(z.object({
      conversationHistory: z.array(z.object({
        role: z.enum(['user', 'assistant']),
        content: z.string(),
      })),
      budget: z.number().optional(),
      experience: z.enum(['beginner', 'intermediate', 'professional']).optional(),
    }))
    .mutation(async ({ input }) => {
      const prompt = `
        Baseado na conversa do cliente, recomende uma faca da loja Cachaca e Cutelaria Pedro Gomes.
        
        Histórico:
        ${input.conversationHistory.map(m => `${m.role}: ${m.content}`).join('\n')}
        
        ${input.budget ? `Orçamento: R$ ${input.budget}` : ''}
        ${input.experience ? `Experiência: ${input.experience}` : ''}
        
        Retorne em JSON:
        1. knifeId: ID da faca recomendada
        2. knifeName: Nome da faca
        3. reason: Por que essa faca é ideal
        4. price: Preço
        5. matchScore: 0-100% de compatibilidade
        6. sellingPoints: 3 pontos de venda principais
      `;

      try {
        const response = await invokeLLM({
          messages: [
            {
              role: 'system',
              content: 'Você é um especialista em facas artesanais. Recomende o melhor produto baseado na conversa.',
            },
            {
              role: 'user',
              content: prompt,
            },
          ],
          response_format: {
            type: 'json_schema',
            json_schema: {
              name: 'knife_recommendation',
              strict: true,
              schema: {
                type: 'object',
                properties: {
                  knifeId: { type: 'string' },
                  knifeName: { type: 'string' },
                  reason: { type: 'string' },
                  price: { type: 'number' },
                  matchScore: { type: 'number' },
                  sellingPoints: { type: 'array', items: { type: 'string' } },
                },
                required: ['knifeId', 'knifeName', 'reason', 'price', 'matchScore', 'sellingPoints'],
                additionalProperties: false,
              },
            },
          },
        });

        const content = response.choices[0]?.message?.content;
        const parsed = typeof content === 'string' ? JSON.parse(content) : content;

        return {
          success: true,
          recommendation: parsed,
        };
      } catch (error: any) {
        return {
          success: false,
          error: error.message,
        };
      }
    }),

  // Responder pergunta sobre produto
  answerProductQuestion: publicProcedure
    .input(z.object({
      productId: z.string(),
      productName: z.string(),
      question: z.string(),
      productDetails: z.object({
        bladeLength: z.number().optional(),
        weight: z.number().optional(),
        handleType: z.string().optional(),
        steelType: z.string().optional(),
        price: z.number().optional(),
      }).optional(),
    }))
    .mutation(async ({ input }) => {
      const prompt = `
        Responda a pergunta do cliente sobre o produto de forma clara e persuasiva.
        
        Produto: ${input.productName}
        Pergunta: ${input.question}
        
        ${input.productDetails ? `Detalhes:
        - Tamanho da lâmina: ${input.productDetails.bladeLength}cm
        - Peso: ${input.productDetails.weight}g
        - Tipo de cabo: ${input.productDetails.handleType}
        - Tipo de aço: ${input.productDetails.steelType}
        - Preço: R$ ${input.productDetails.price}` : ''}
        
        Responda em português, de forma amigável e profissional.
        Inclua benefícios do produto na resposta.
      `;

      try {
        const response = await invokeLLM({
          messages: [
            {
              role: 'system',
              content: 'Você é um vendedor especializado em facas artesanais. Responda perguntas de forma persuasiva e honesta.',
            },
            {
              role: 'user',
              content: prompt,
            },
          ],
        });

        const answer = response.choices[0]?.message?.content || 'Desculpe, não consegui processar sua pergunta.';

        return {
          success: true,
          answer,
        };
      } catch (error: any) {
        return {
          success: false,
          error: error.message,
        };
      }
    }),

  // Suporte para pedido
  getOrderSupport: protectedProcedure
    .input(z.object({
      orderId: z.string(),
      orderStatus: z.enum(['pending', 'processing', 'shipped', 'delivered', 'cancelled']),
      question: z.string(),
    }))
    .mutation(async ({ input }) => {
      const statusMessages: Record<string, string> = {
        pending: 'seu pedido está aguardando processamento',
        processing: 'seu pedido está sendo preparado',
        shipped: 'seu pedido foi enviado',
        delivered: 'seu pedido foi entregue',
        cancelled: 'seu pedido foi cancelado',
      };

      const prompt = `
        Responda a pergunta do cliente sobre seu pedido.
        
        ID do Pedido: ${input.orderId}
        Status: ${statusMessages[input.orderStatus]}
        Pergunta: ${input.question}
        
        Seja amigável, profissional e ofereça soluções práticas.
      `;

      try {
        const response = await invokeLLM({
          messages: [
            {
              role: 'system',
              content: 'Você é um agente de suporte ao cliente. Ajude com informações sobre pedidos.',
            },
            {
              role: 'user',
              content: prompt,
            },
          ],
        });

        const answer = response.choices[0]?.message?.content || 'Desculpe, não consegui processar sua pergunta.';

        return {
          success: true,
          answer,
        };
      } catch (error: any) {
        return {
          success: false,
          error: error.message,
        };
      }
    }),

  // Gerar resposta personalizada para checkout
  getCheckoutAssistance: publicProcedure
    .input(z.object({
      cartItems: z.array(z.object({
        productId: z.string(),
        productName: z.string(),
        price: z.number(),
        quantity: z.number(),
      })),
      totalPrice: z.number(),
      question: z.string().optional(),
    }))
    .mutation(async ({ input }) => {
      const itemsList = input.cartItems
        .map(item => `${item.quantity}x ${item.productName} - R$ ${item.price}`)
        .join('\n');

      const prompt = `
        Ajude o cliente com sua compra.
        
        Itens no carrinho:
        ${itemsList}
        
        Total: R$ ${input.totalPrice}
        
        ${input.question ? `Pergunta: ${input.question}` : 'Ofereça incentivos para completar a compra.'}
        
        Seja persuasivo mas honesto. Mencione garantia, frete grátis se aplicável, e satisfação do cliente.
      `;

      try {
        const response = await invokeLLM({
          messages: [
            {
              role: 'system',
              content: 'Você é um especialista em conversão de vendas. Ajude o cliente a completar a compra.',
            },
            {
              role: 'user',
              content: prompt,
            },
          ],
        });

        const answer = response.choices[0]?.message?.content || 'Clique em "Finalizar Compra" para completar seu pedido.';

        return {
          success: true,
          answer,
        };
      } catch (error: any) {
        return {
          success: false,
          error: error.message,
        };
      }
    }),

  // Análise de satisfação pós-compra
  collectFeedback: protectedProcedure
    .input(z.object({
      orderId: z.string(),
      rating: z.number().min(1).max(5),
      comment: z.string().optional(),
      wouldRecommend: z.boolean().optional(),
    }))
    .mutation(async ({ input, ctx }) => {
      // Aqui você salvaria o feedback no banco de dados
      console.log('📊 Feedback recebido:', input);

      // Gerar resposta personalizada baseado no rating
      let responseMessage = '';

      if (input.rating >= 4) {
        responseMessage = '😊 Fico muito feliz em ouvir! Obrigado por sua confiança. Volte sempre!';
      } else if (input.rating === 3) {
        responseMessage = '😐 Obrigado pelo feedback. Gostaríamos de melhorar. Pode nos dizer o que podemos fazer melhor?';
      } else {
        responseMessage = '😟 Desculpe ouvir isso. Gostaria de falar com nosso gerente para resolver o problema?';
      }

      return {
        success: true,
        message: responseMessage,
        feedbackId: `feedback_${Date.now()}`,
      };
    }),

  // Sugestões de produtos relacionados
  getRelatedProducts: publicProcedure
    .input(z.object({
      currentProductId: z.string(),
      currentProductName: z.string(),
      currentProductPrice: z.number(),
    }))
    .mutation(async ({ input }) => {
      const prompt = `
        Recomende 3 produtos relacionados ou complementares para:
        Produto: ${input.currentProductName}
        Preço: R$ ${input.currentProductPrice}
        
        Retorne em JSON um array com:
        1. productId
        2. productName
        3. reason (por que é complementar)
        4. estimatedPrice (preço estimado)
        5. upsellType: 'upgrade', 'complement', 'bundle'
      `;

      try {
        const response = await invokeLLM({
          messages: [
            {
              role: 'system',
              content: 'Você é especialista em cross-sell e upsell de facas artesanais.',
            },
            {
              role: 'user',
              content: prompt,
            },
          ],
        });

        const content = response.choices[0]?.message?.content;
        const recommendations = typeof content === 'string' ? JSON.parse(content) : content;

        return {
          success: true,
          recommendations,
        };
      } catch (error: any) {
        return {
          success: false,
          error: error.message,
        };
      }
    }),

  // Health check
  health: publicProcedure
    .query(async () => {
      return {
        success: true,
        status: 'operational',
        service: 'cachaca-cutelaria-ai-support',
        timestamp: new Date(),
      };
    }),
});
