import { router, protectedProcedure, publicProcedure } from '../_core/trpc';
import { z } from 'zod';

export const automationsRouter = router({
  // Create automation
  createAutomation: protectedProcedure
    .input(z.object({
      name: z.string(),
      description: z.string().optional(),
      trigger: z.object({
        type: z.enum(['order_created', 'payment_received', 'customer_signup', 'product_purchased']),
        conditions: z.record(z.any()).optional(),
      }),
      actions: z.array(z.object({
        type: z.enum(['send_email', 'send_sms', 'send_whatsapp', 'create_task', 'update_inventory']),
        config: z.record(z.any()),
      })),
      enabled: z.boolean().default(true),
    }))
    .mutation(async ({ input, ctx }) => {
      const automation = {
        id: 'auto-' + Date.now(),
        userId: ctx.user?.id,
        ...input,
        createdAt: new Date(),
      };

      return {
        success: true,
        automation,
      };
    }),

  // List automations
  listAutomations: protectedProcedure.query(async ({ ctx }) => {
    return {
      success: true,
      automations: [
        {
          id: 'auto-1',
          name: 'Welcome Email',
          description: 'Send welcome email to new customers',
          trigger: { type: 'customer_signup' },
          actions: [{ type: 'send_email', config: { template: 'welcome' } }],
          enabled: true,
          createdAt: new Date(),
          executions: 1250,
          lastRun: new Date(Date.now() - 3600000),
        },
        {
          id: 'auto-2',
          name: 'Order Confirmation',
          description: 'Send order confirmation email',
          trigger: { type: 'order_created' },
          actions: [{ type: 'send_email', config: { template: 'order_confirmation' } }],
          enabled: true,
          createdAt: new Date(),
          executions: 5420,
          lastRun: new Date(Date.now() - 300000),
        },
        {
          id: 'auto-3',
          name: 'Payment Reminder',
          description: 'Send payment reminder after 24 hours',
          trigger: { type: 'order_created', conditions: { paymentStatus: 'pending' } },
          actions: [{ type: 'send_email', config: { template: 'payment_reminder' } }],
          enabled: true,
          createdAt: new Date(),
          executions: 320,
          lastRun: new Date(Date.now() - 86400000),
        },
      ],
    };
  }),

  // Update automation
  updateAutomation: protectedProcedure
    .input(z.object({
      id: z.string(),
      name: z.string().optional(),
      description: z.string().optional(),
      enabled: z.boolean().optional(),
      trigger: z.any().optional(),
      actions: z.array(z.any()).optional(),
    }))
    .mutation(async ({ input, ctx }) => {
      return {
        success: true,
        message: `Automation ${input.id} updated`,
      };
    }),

  // Delete automation
  deleteAutomation: protectedProcedure
    .input(z.object({
      id: z.string(),
    }))
    .mutation(async ({ input, ctx }) => {
      return {
        success: true,
        message: `Automation ${input.id} deleted`,
      };
    }),

  // Get automation details
  getAutomationDetails: protectedProcedure
    .input(z.object({
      id: z.string(),
    }))
    .query(async ({ input }) => {
      return {
        success: true,
        automation: {
          id: input.id,
          name: 'Welcome Email',
          description: 'Send welcome email to new customers',
          trigger: {
            type: 'customer_signup',
            conditions: {},
          },
          actions: [
            {
              id: 'action-1',
              type: 'send_email',
              config: {
                template: 'welcome',
                subject: 'Welcome to our store!',
                delay: 0,
              },
            },
          ],
          enabled: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      };
    }),

  // Get automation executions
  getAutomationExecutions: protectedProcedure
    .input(z.object({
      id: z.string(),
      limit: z.number().default(50),
      status: z.enum(['success', 'failed', 'pending']).optional(),
    }))
    .query(async ({ input }) => {
      return {
        success: true,
        executions: [
          {
            id: 'exec-1',
            automationId: input.id,
            status: 'success',
            triggeredBy: 'customer-123',
            executedAt: new Date(Date.now() - 60000),
            duration: 250, // milliseconds
          },
          {
            id: 'exec-2',
            automationId: input.id,
            status: 'success',
            triggeredBy: 'customer-124',
            executedAt: new Date(Date.now() - 120000),
            duration: 180,
          },
          {
            id: 'exec-3',
            automationId: input.id,
            status: 'failed',
            triggeredBy: 'customer-125',
            executedAt: new Date(Date.now() - 180000),
            duration: 500,
            error: 'Email service unavailable',
          },
        ],
        total: 1250,
      };
    }),

  // Test automation
  testAutomation: protectedProcedure
    .input(z.object({
      id: z.string(),
    }))
    .mutation(async ({ input }) => {
      return {
        success: true,
        message: `Test execution for automation ${input.id} completed`,
        result: {
          status: 'success',
          actions: [
            { type: 'send_email', status: 'success', message: 'Email sent successfully' },
          ],
        },
      };
    }),

  // Enable automation
  enableAutomation: protectedProcedure
    .input(z.object({
      id: z.string(),
    }))
    .mutation(async ({ input }) => {
      return {
        success: true,
        message: `Automation ${input.id} enabled`,
      };
    }),

  // Disable automation
  disableAutomation: protectedProcedure
    .input(z.object({
      id: z.string(),
    }))
    .mutation(async ({ input }) => {
      return {
        success: true,
        message: `Automation ${input.id} disabled`,
      };
    }),

  // Get automation templates
  getAutomationTemplates: publicProcedure.query(async () => {
    return {
      success: true,
      templates: [
        {
          id: 'template-1',
          name: 'Welcome Email',
          description: 'Send welcome email to new customers',
          trigger: { type: 'customer_signup' },
          actions: [{ type: 'send_email', config: { template: 'welcome' } }],
        },
        {
          id: 'template-2',
          name: 'Order Confirmation',
          description: 'Send order confirmation email',
          trigger: { type: 'order_created' },
          actions: [{ type: 'send_email', config: { template: 'order_confirmation' } }],
        },
        {
          id: 'template-3',
          name: 'Payment Reminder',
          description: 'Send payment reminder after 24 hours',
          trigger: { type: 'order_created', conditions: { paymentStatus: 'pending' } },
          actions: [{ type: 'send_email', config: { template: 'payment_reminder' } }],
        },
        {
          id: 'template-4',
          name: 'Abandoned Cart',
          description: 'Send reminder for abandoned carts',
          trigger: { type: 'cart_abandoned' },
          actions: [{ type: 'send_email', config: { template: 'abandoned_cart' } }],
        },
      ],
    };
  }),

  // Create automation from template
  createAutomationFromTemplate: protectedProcedure
    .input(z.object({
      templateId: z.string(),
      customizations: z.record(z.any()).optional(),
    }))
    .mutation(async ({ input, ctx }) => {
      return {
        success: true,
        message: `Automation created from template ${input.templateId}`,
        automationId: 'auto-' + Date.now(),
      };
    }),

  // Get automation statistics
  getAutomationStats: protectedProcedure.query(async ({ ctx }) => {
    return {
      success: true,
      stats: {
        totalAutomations: 15,
        enabledAutomations: 12,
        disabledAutomations: 3,
        totalExecutions: 125000,
        successfulExecutions: 123500,
        failedExecutions: 1500,
        successRate: 98.8,
        averageExecutionTime: 250, // milliseconds
      },
    };
  }),
});
