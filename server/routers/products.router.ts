import { router, publicProcedure, protectedProcedure } from '../_core/trpc';
import { z } from 'zod';

export const productsRouter = router({
  // Listar produtos
  list: publicProcedure
    .input(
      z.object({
        category: z.string().optional(),
        search: z.string().optional(),
        limit: z.number().default(20),
        offset: z.number().default(0),
      })
    )
    .query(async ({ input }) => {
      return {
        products: [],
        total: 0,
        limit: input.limit,
        offset: input.offset,
      };
    }),

  // Obter produto
  get: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input }) => {
      return {
        id: input.id,
        name: '',
        description: '',
        price: 0,
        category: '',
        images: [],
        stock: 0,
      };
    }),

  // Criar produto (admin)
  create: protectedProcedure
    .input(
      z.object({
        name: z.string(),
        description: z.string(),
        price: z.number(),
        category: z.string(),
        stock: z.number(),
      })
    )
    .mutation(async ({ input }) => {
      return { id: '', ...input };
    }),

  // Atualizar produto (admin)
  update: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        name: z.string().optional(),
        description: z.string().optional(),
        price: z.number().optional(),
        stock: z.number().optional(),
      })
    )
    .mutation(async ({ input }) => {
      return { id: input.id };
    }),

  // Deletar produto (admin)
  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input }) => {
      return { success: true };
    }),
});
