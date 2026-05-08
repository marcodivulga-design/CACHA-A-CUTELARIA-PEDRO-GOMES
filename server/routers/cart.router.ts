import { router, protectedProcedure } from '../_core/trpc';
import { z } from 'zod';

export const cartRouter = router({
  // Obter carrinho
  get: protectedProcedure.query(async ({ ctx }) => {
    return {
      id: '',
      userId: ctx.user?.id || '',
      items: [],
      total: 0,
    };
  }),

  // Adicionar ao carrinho
  addItem: protectedProcedure
    .input(
      z.object({
        productId: z.string(),
        quantity: z.number().min(1),
      })
    )
    .mutation(async ({ input }) => {
      return { success: true };
    }),

  // Remover do carrinho
  removeItem: protectedProcedure
    .input(z.object({ itemId: z.string() }))
    .mutation(async ({ input }) => {
      return { success: true };
    }),

  // Limpar carrinho
  clear: protectedProcedure.mutation(async () => {
    return { success: true };
  }),
});
