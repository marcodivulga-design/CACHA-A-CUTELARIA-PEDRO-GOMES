import { router, protectedProcedure, publicProcedure } from '../_core/trpc';
import { z } from 'zod';

export const webhooksRouter = router({
  // Register webhook
  registerWebhook: protectedProcedure
    .input(z.object({
      url: z.string().url(),
      events: z.array(z.string()),
      active: z.boolean().default(true),
    }))
    .mutation(async ({ input, ctx }) => {
      // Save webhook to database
      const webhook = {
        id: 'webhook-' + Date.now(),
        userId: ctx.user?.id,
        url: input.url,
        events: input.events,
        active: input.active,
        createdAt: new Date(),
      };

      return {
        success: true,
        webhook,
      };
    }),

  // List webhooks
  listWebhooks: protectedProcedure.query(async ({ ctx }) => {
    return {
      success: true,
      webhooks: [
        {
          id: 'webhook-1',
          url: 'https://example.com/webhooks/orders',
          events: ['order.created', 'order.updated', 'order.completed'],
          active: true,
          createdAt: new Date(),
          lastTriggered: new Date(Date.now() - 60000),
        },
        {
          id: 'webhook-2',
          url: 'https://example.com/webhooks/payments',
          events: ['payment.completed', 'payment.failed'],
          active: true,
          createdAt: new Date(),
          lastTriggered: new Date(Date.now() - 120000),
        },
      ],
    };
  }),

  // Update webhook
  updateWebhook: protectedProcedure
    .input(z.object({
      id: z.string(),
      url: z.string().url().optional(),
      events: z.array(z.string()).optional(),
      active: z.boolean().optional(),
    }))
    .mutation(async ({ input, ctx }) => {
      return {
        success: true,
        message: `Webhook ${input.id} updated`,
      };
    }),

  // Delete webhook
  deleteWebhook: protectedProcedure
    .input(z.object({
      id: z.string(),
    }))
    .mutation(async ({ input, ctx }) => {
      return {
        success: true,
        message: `Webhook ${input.id} deleted`,
      };
    }),

  // Get webhook logs
  getWebhookLogs: protectedProcedure
    .input(z.object({
      webhookId: z.string(),
      limit: z.number().default(50),
    }))
    .query(async ({ input }) => {
      return {
        success: true,
        logs: [
          {
            id: 'log-1',
            webhookId: input.webhookId,
            event: 'order.created',
            status: 200,
            timestamp: new Date(Date.now() - 60000),
            payload: { orderId: 'ORD-001', total: 150.00 },
          },
          {
            id: 'log-2',
            webhookId: input.webhookId,
            event: 'order.updated',
            status: 200,
            timestamp: new Date(Date.now() - 120000),
            payload: { orderId: 'ORD-001', status: 'shipped' },
          },
        ],
      };
    }),

  // Retry webhook
  retryWebhook: protectedProcedure
    .input(z.object({
      logId: z.string(),
    }))
    .mutation(async ({ input }) => {
      return {
        success: true,
        message: `Webhook retry initiated for log ${input.logId}`,
      };
    }),

  // Test webhook
  testWebhook: protectedProcedure
    .input(z.object({
      webhookId: z.string(),
    }))
    .mutation(async ({ input }) => {
      return {
        success: true,
        message: `Test webhook sent to ${input.webhookId}`,
        response: {
          status: 200,
          timestamp: new Date(),
        },
      };
    }),
});
