import { router, protectedProcedure } from '../_core/trpc';
import { z } from 'zod';

export const ordersRouter = router({
  // Listar pedidos
  list: protectedProcedure
    .input(
      z.object({
        limit: z.number().default(20),
        offset: z.number().default(0),
      })
    )
    .query(async ({ input, ctx }) => {
      return {
        orders: [],
        total: 0,
        limit: input.limit,
        offset: input.offset,
      };
    }),

  // Obter pedido
  get: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input }) => {
      return {
        id: input.id,
        items: [],
        total: 0,
        status: 'pending',
      };
    }),

  // Criar pedido
  create: protectedProcedure
    .input(
      z.object({
        items: z.array(
          z.object({
            productId: z.string(),
            quantity: z.number(),
            price: z.number(),
          })
        ),
        shippingAddress: z.object({
          street: z.string(),
          city: z.string(),
          state: z.string(),
          zipCode: z.string(),
        }),
      })
    )
    .mutation(async ({ input }) => {
      return {
        id: '',
        status: 'pending',
        total: 0,
      };
    }),

  // Cancelar pedido
  cancel: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input }) => {
      return { success: true };
    }),
});
