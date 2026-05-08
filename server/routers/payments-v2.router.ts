import { router, publicProcedure, protectedProcedure } from '../_core/trpc';
import { z } from 'zod';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '');

export const paymentsRouter = router({
  // Stripe - Cartão de Crédito
  createStripePaymentIntent: protectedProcedure
    .input(z.object({
      amount: z.number().positive(),
      orderId: z.string(),
      email: z.string().email(),
    }))
    .mutation(async ({ input, ctx }) => {
      try {
        const paymentIntent = await stripe.paymentIntents.create({
          amount: Math.round(input.amount * 100), // Converter para centavos
          currency: 'brl',
          metadata: {
            orderId: input.orderId,
            userId: ctx.user.id,
          },
          receipt_email: input.email,
        });

        return {
          success: true,
          clientSecret: paymentIntent.client_secret,
          paymentIntentId: paymentIntent.id,
        };
      } catch (error) {
        return {
          success: false,
          error: (error as Error).message,
        };
      }
    }),

  // Stripe - Confirmar Pagamento
  confirmStripePayment: protectedProcedure
    .input(z.object({
      paymentIntentId: z.string(),
      orderId: z.string(),
    }))
    .mutation(async ({ input }) => {
      try {
        const paymentIntent = await stripe.paymentIntents.retrieve(input.paymentIntentId);

        if (paymentIntent.status === 'succeeded') {
          return {
            success: true,
            status: 'completed',
            message: 'Pagamento confirmado com sucesso!',
          };
        }

        return {
          success: false,
          status: paymentIntent.status,
          message: 'Pagamento ainda está processando',
        };
      } catch (error) {
        return {
          success: false,
          error: (error as Error).message,
        };
      }
    }),

  // PIX - Gerar QR Code
  generatePixQrCode: protectedProcedure
    .input(z.object({
      amount: z.number().positive(),
      orderId: z.string(),
      description: z.string(),
    }))
    .mutation(async ({ input, ctx }) => {
      try {
        // Simulação - em produção usar API de PIX real
        const pixKey = 'seu-pix-key@banco.com.br'; // Substituir pela chave PIX real
        const qrCodeData = {
          orderId: input.orderId,
          amount: input.amount,
          pixKey,
          expiresAt: new Date(Date.now() + 30 * 60 * 1000), // 30 minutos
        };

        // Gerar QR Code (usar biblioteca como qrcode)
        const qrCode = Buffer.from(JSON.stringify(qrCodeData)).toString('base64');

        return {
          success: true,
          qrCode,
          pixKey,
          amount: input.amount,
          expiresAt: qrCodeData.expiresAt,
        };
      } catch (error) {
        return {
          success: false,
          error: (error as Error).message,
        };
      }
    }),

  // PIX - Verificar Pagamento
  verifyPixPayment: protectedProcedure
    .input(z.object({
      orderId: z.string(),
      transactionId: z.string(),
    }))
    .mutation(async ({ input }) => {
      try {
        // Simulação - em produção verificar com API de PIX real
        return {
          success: true,
          status: 'completed',
          message: 'Pagamento PIX confirmado!',
          transactionId: input.transactionId,
        };
      } catch (error) {
        return {
          success: false,
          error: (error as Error).message,
        };
      }
    }),

  // Boleto - Gerar Boleto
  generateBoleto: protectedProcedure
    .input(z.object({
      amount: z.number().positive(),
      orderId: z.string(),
      customerName: z.string(),
      customerEmail: z.string().email(),
      dueDate: z.date(),
    }))
    .mutation(async ({ input }) => {
      try {
        // Simulação - em produção usar API de boleto real (Gerencianet, Asaas, etc)
        const boletoNumber = `${Date.now()}${Math.random().toString().slice(2, 8)}`;

        return {
          success: true,
          boletoNumber,
          boletoUrl: `https://boleto.example.com/${boletoNumber}`,
          amount: input.amount,
          dueDate: input.dueDate,
          barcode: `12345.67890 12345.678901 12345.678901 1 12345678901234`,
        };
      } catch (error) {
        return {
          success: false,
          error: (error as Error).message,
        };
      }
    }),

  // Boleto - Verificar Pagamento
  verifyBoletoPayment: protectedProcedure
    .input(z.object({
      boletoNumber: z.string(),
      orderId: z.string(),
    }))
    .mutation(async ({ input }) => {
      try {
        // Simulação - em produção verificar com API de boleto real
        return {
          success: true,
          status: 'completed',
          message: 'Boleto pago com sucesso!',
          boletoNumber: input.boletoNumber,
        };
      } catch (error) {
        return {
          success: false,
          error: (error as Error).message,
        };
      }
    }),

  // Webhook - Stripe
  handleStripeWebhook: publicProcedure
    .input(z.object({
      event: z.any(),
    }))
    .mutation(async ({ input }) => {
      try {
        const event = input.event;

        switch (event.type) {
          case 'payment_intent.succeeded':
            // Atualizar status do pedido para pago
            console.log('Pagamento Stripe confirmado:', event.data.object.id);
            break;
          case 'payment_intent.payment_failed':
            // Notificar cliente sobre falha
            console.log('Pagamento Stripe falhou:', event.data.object.id);
            break;
        }

        return { success: true };
      } catch (error) {
        return {
          success: false,
          error: (error as Error).message,
        };
      }
    }),

  // Webhook - PIX
  handlePixWebhook: publicProcedure
    .input(z.object({
      event: z.any(),
    }))
    .mutation(async ({ input }) => {
      try {
        const event = input.event;

        if (event.type === 'pix.payment.received') {
          // Atualizar status do pedido para pago
          console.log('PIX recebido:', event.data.transactionId);
        }

        return { success: true };
      } catch (error) {
        return {
          success: false,
          error: (error as Error).message,
        };
      }
    }),

  // Webhook - Boleto
  handleBoletoWebhook: publicProcedure
    .input(z.object({
      event: z.any(),
    }))
    .mutation(async ({ input }) => {
      try {
        const event = input.event;

        if (event.type === 'boleto.paid') {
          // Atualizar status do pedido para pago
          console.log('Boleto pago:', event.data.boletoNumber);
        }

        return { success: true };
      } catch (error) {
        return {
          success: false,
          error: (error as Error).message,
        };
      }
    }),

  // Listar Métodos de Pagamento Disponíveis
  getPaymentMethods: publicProcedure.query(async () => {
    return {
      methods: [
        {
          id: 'stripe',
          name: 'Cartão de Crédito',
          icon: 'credit-card',
          description: 'Visa, Mastercard, Elo',
          fee: '2.99%',
        },
        {
          id: 'pix',
          name: 'PIX',
          icon: 'smartphone',
          description: 'Transferência instantânea',
          fee: 'Grátis',
        },
        {
          id: 'boleto',
          name: 'Boleto',
          icon: 'file-text',
          description: 'Pagamento até 3 dias úteis',
          fee: 'Grátis',
        },
      ],
    };
  }),
});
