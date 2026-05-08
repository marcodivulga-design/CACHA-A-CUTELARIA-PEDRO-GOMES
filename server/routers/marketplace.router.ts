import { router, protectedProcedure, publicProcedure } from '../_core/trpc';
import { z } from 'zod';

export const marketplaceRouter = router({
  // Register vendor
  registerVendor: protectedProcedure
    .input(z.object({
      businessName: z.string(),
      email: z.string().email(),
      phone: z.string(),
      address: z.string(),
      taxId: z.string(),
      bankAccount: z.object({
        bank: z.string(),
        accountNumber: z.string(),
        routingNumber: z.string(),
      }),
    }))
    .mutation(async ({ input, ctx }) => {
      return {
        success: true,
        vendor: {
          id: 'vendor-' + Date.now(),
          userId: ctx.user?.id,
          ...input,
          status: 'pending_approval',
          createdAt: new Date(),
        },
      };
    }),

  // Get vendor profile
  getVendorProfile: protectedProcedure
    .input(z.object({
      vendorId: z.string(),
    }))
    .query(async ({ input }) => {
      return {
        success: true,
        vendor: {
          id: input.vendorId,
          businessName: 'Destilaria Premium',
          email: 'vendor@example.com',
          rating: 4.8,
          reviews: 250,
          products: 45,
          totalSales: 125000,
          status: 'active',
          commission: 0.15,
          joinedAt: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000),
        },
      };
    }),

  // List vendors
  listVendors: publicProcedure
    .input(z.object({
      limit: z.number().default(20),
      offset: z.number().default(0),
      category: z.string().optional(),
      sortBy: z.enum(['rating', 'sales', 'newest']).default('rating'),
    }))
    .query(async ({ input }) => {
      return {
        success: true,
        vendors: [
          {
            id: 'vendor-1',
            businessName: 'Destilaria Premium',
            rating: 4.8,
            reviews: 250,
            products: 45,
            totalSales: 125000,
          },
          {
            id: 'vendor-2',
            businessName: 'Cutelaria Artesanal',
            rating: 4.6,
            reviews: 180,
            products: 30,
            totalSales: 85000,
          },
        ],
        total: 2,
      };
    }),

  // Upload product as vendor
  uploadVendorProduct: protectedProcedure
    .input(z.object({
      vendorId: z.string(),
      name: z.string(),
      description: z.string(),
      price: z.number(),
      images: z.array(z.string()),
      category: z.string(),
      stock: z.number(),
    }))
    .mutation(async ({ input, ctx }) => {
      return {
        success: true,
        product: {
          id: 'prod-' + Date.now(),
          vendorId: input.vendorId,
          ...input,
          status: 'pending_approval',
          createdAt: new Date(),
        },
      };
    }),

  // Get vendor products
  getVendorProducts: publicProcedure
    .input(z.object({
      vendorId: z.string(),
      limit: z.number().default(20),
    }))
    .query(async ({ input }) => {
      return {
        success: true,
        products: [
          {
            id: 'prod-1',
            vendorId: input.vendorId,
            name: 'Cachaça Premium',
            price: 150,
            rating: 4.8,
            reviews: 45,
          },
        ],
      };
    }),

  // Calculate commission
  calculateCommission: protectedProcedure
    .input(z.object({
      vendorId: z.string(),
      amount: z.number(),
    }))
    .query(async ({ input }) => {
      const commissionRate = 0.15; // 15%
      const commission = input.amount * commissionRate;

      return {
        success: true,
        calculation: {
          grossAmount: input.amount,
          commissionRate,
          commission,
          netAmount: input.amount - commission,
        },
      };
    }),

  // Vendor payouts
  getVendorPayouts: protectedProcedure
    .input(z.object({
      vendorId: z.string(),
      limit: z.number().default(50),
    }))
    .query(async ({ input }) => {
      return {
        success: true,
        payouts: [
          {
            id: 'payout-1',
            vendorId: input.vendorId,
            amount: 8500,
            status: 'completed',
            date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
          },
          {
            id: 'payout-2',
            vendorId: input.vendorId,
            amount: 9200,
            status: 'completed',
            date: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
          },
        ],
      };
    }),

  // Request payout
  requestPayout: protectedProcedure
    .input(z.object({
      vendorId: z.string(),
      amount: z.number(),
    }))
    .mutation(async ({ input }) => {
      return {
        success: true,
        payout: {
          id: 'payout-' + Date.now(),
          vendorId: input.vendorId,
          amount: input.amount,
          status: 'pending',
          requestedAt: new Date(),
          expectedDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
        },
      };
    }),

  // Vendor analytics
  getVendorAnalytics: protectedProcedure
    .input(z.object({
      vendorId: z.string(),
      period: z.enum(['week', 'month', 'quarter']).default('month'),
    }))
    .query(async ({ input }) => {
      return {
        success: true,
        analytics: {
          vendorId: input.vendorId,
          period: input.period,
          metrics: {
            totalSales: 45000,
            totalOrders: 250,
            avgOrderValue: 180,
            conversionRate: 3.5,
            avgRating: 4.7,
            totalReviews: 180,
          },
          topProducts: [
            { id: 'prod-1', name: 'Cachaça Premium', sales: 5000 },
            { id: 'prod-2', name: 'Faca Artesanal', sales: 3500 },
          ],
        },
      };
    }),

  // Vendor reviews
  getVendorReviews: publicProcedure
    .input(z.object({
      vendorId: z.string(),
      limit: z.number().default(20),
    }))
    .query(async ({ input }) => {
      return {
        success: true,
        reviews: [
          {
            id: 'review-1',
            vendorId: input.vendorId,
            rating: 5,
            comment: 'Excelente qualidade e entrega rápida!',
            author: 'Cliente Verificado',
            date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
          },
        ],
      };
    }),

  // Approve vendor
  approveVendor: protectedProcedure
    .input(z.object({
      vendorId: z.string(),
      notes: z.string().optional(),
    }))
    .mutation(async ({ input, ctx }) => {
      return {
        success: true,
        message: `Vendor ${input.vendorId} approved`,
      };
    }),

  // Suspend vendor
  suspendVendor: protectedProcedure
    .input(z.object({
      vendorId: z.string(),
      reason: z.string(),
    }))
    .mutation(async ({ input, ctx }) => {
      return {
        success: true,
        message: `Vendor ${input.vendorId} suspended`,
      };
    }),

  // Vendor performance report
  getPerformanceReport: protectedProcedure
    .input(z.object({
      vendorId: z.string(),
    }))
    .query(async ({ input }) => {
      return {
        success: true,
        report: {
          vendorId: input.vendorId,
          overallScore: 4.7,
          categories: {
            productQuality: 4.8,
            customerService: 4.6,
            shippingSpeed: 4.7,
            returnHandling: 4.5,
          },
          recommendations: [
            'Melhorar tempo de resposta ao cliente',
            'Aumentar variedade de produtos',
            'Reduzir taxa de devoluções',
          ],
        },
      };
    }),
});
