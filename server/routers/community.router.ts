import { router, protectedProcedure, publicProcedure } from '../_core/trpc';
import { z } from 'zod';

export const communityRouter = router({
  // Create review
  createReview: protectedProcedure
    .input(z.object({
      productId: z.string(),
      rating: z.number().min(1).max(5),
      title: z.string(),
      comment: z.string(),
      images: z.array(z.string()).optional(),
    }))
    .mutation(async ({ input, ctx }) => {
      return {
        success: true,
        review: {
          id: 'review-' + Date.now(),
          productId: input.productId,
          userId: ctx.user?.id,
          ...input,
          verified: true,
          helpful: 0,
          createdAt: new Date(),
        },
      };
    }),

  // Get product reviews
  getProductReviews: publicProcedure
    .input(z.object({
      productId: z.string(),
      limit: z.number().default(20),
      sortBy: z.enum(['helpful', 'recent', 'rating']).default('helpful'),
    }))
    .query(async ({ input }) => {
      return {
        success: true,
        reviews: [
          {
            id: 'review-1',
            productId: input.productId,
            rating: 5,
            title: 'Excelente qualidade!',
            comment: 'Produto de alta qualidade, entrega rápida',
            author: 'João S.',
            verified: true,
            helpful: 45,
            unhelpful: 2,
            date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
          },
        ],
        stats: {
          avgRating: 4.7,
          totalReviews: 250,
          distribution: {
            5: 180,
            4: 50,
            3: 15,
            2: 3,
            1: 2,
          },
        },
      };
    }),

  // Mark review as helpful
  markReviewHelpful: protectedProcedure
    .input(z.object({
      reviewId: z.string(),
      helpful: z.boolean(),
    }))
    .mutation(async ({ input }) => {
      return {
        success: true,
        message: `Review marked as ${input.helpful ? 'helpful' : 'unhelpful'}`,
      };
    }),

  // Create forum post
  createForumPost: protectedProcedure
    .input(z.object({
      title: z.string(),
      content: z.string(),
      category: z.string(),
      tags: z.array(z.string()).optional(),
    }))
    .mutation(async ({ input, ctx }) => {
      return {
        success: true,
        post: {
          id: 'post-' + Date.now(),
          userId: ctx.user?.id,
          ...input,
          views: 0,
          replies: 0,
          likes: 0,
          createdAt: new Date(),
        },
      };
    }),

  // Get forum posts
  getForumPosts: publicProcedure
    .input(z.object({
      category: z.string().optional(),
      limit: z.number().default(20),
      sortBy: z.enum(['recent', 'popular', 'trending']).default('recent'),
    }))
    .query(async ({ input }) => {
      return {
        success: true,
        posts: [
          {
            id: 'post-1',
            title: 'Qual é a melhor cachaça para presentear?',
            author: 'Maria P.',
            category: 'Recomendações',
            views: 250,
            replies: 15,
            likes: 45,
            date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
          },
        ],
      };
    }),

  // Reply to forum post
  replyToPost: protectedProcedure
    .input(z.object({
      postId: z.string(),
      content: z.string(),
    }))
    .mutation(async ({ input, ctx }) => {
      return {
        success: true,
        reply: {
          id: 'reply-' + Date.now(),
          postId: input.postId,
          userId: ctx.user?.id,
          content: input.content,
          createdAt: new Date(),
        },
      };
    }),

  // Get user profile
  getUserProfile: publicProcedure
    .input(z.object({
      userId: z.string(),
    }))
    .query(async ({ input }) => {
      return {
        success: true,
        profile: {
          id: input.userId,
          name: 'João Silva',
          avatar: 'https://example.com/avatar.jpg',
          bio: 'Apaixonado por cachaça artesanal',
          joinedAt: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000),
          reviews: 45,
          posts: 120,
          followers: 250,
          following: 180,
          badges: ['Reviewer Verificado', 'Contribuidor Ativo'],
        },
      };
    }),

  // Follow user
  followUser: protectedProcedure
    .input(z.object({
      userId: z.string(),
    }))
    .mutation(async ({ input, ctx }) => {
      return {
        success: true,
        message: `Now following user ${input.userId}`,
      };
    }),

  // Get user followers
  getUserFollowers: publicProcedure
    .input(z.object({
      userId: z.string(),
      limit: z.number().default(20),
    }))
    .query(async ({ input }) => {
      return {
        success: true,
        followers: [
          {
            id: 'user-1',
            name: 'Pedro Santos',
            avatar: 'https://example.com/avatar1.jpg',
          },
        ],
      };
    }),

  // Share product
  shareProduct: protectedProcedure
    .input(z.object({
      productId: z.string(),
      platform: z.enum(['facebook', 'twitter', 'whatsapp', 'email']),
      message: z.string().optional(),
    }))
    .mutation(async ({ input }) => {
      return {
        success: true,
        shareUrl: `https://example.com/share/${input.productId}`,
      };
    }),

  // Get trending products
  getTrendingProducts: publicProcedure
    .input(z.object({
      limit: z.number().default(10),
    }))
    .query(async ({ input }) => {
      return {
        success: true,
        trending: [
          {
            id: 'prod-1',
            name: 'Cachaça Premium',
            shares: 250,
            mentions: 450,
            trend: 'upward',
          },
        ],
      };
    }),

  // Get community insights
  getCommunityInsights: publicProcedure.query(async () => {
    return {
      success: true,
      insights: {
        totalMembers: 5000,
        activeMembers: 1250,
        totalReviews: 2500,
        totalPosts: 3200,
        mostActiveCategory: 'Recomendações',
        topContributors: [
          { name: 'João Silva', contributions: 150 },
          { name: 'Maria Santos', contributions: 120 },
        ],
      },
    };
  }),

  // Report content
  reportContent: publicProcedure
    .input(z.object({
      contentId: z.string(),
      contentType: z.enum(['review', 'post', 'comment']),
      reason: z.string(),
      description: z.string().optional(),
    }))
    .mutation(async ({ input }) => {
      return {
        success: true,
        report: {
          id: 'report-' + Date.now(),
          ...input,
          status: 'pending_review',
          createdAt: new Date(),
        },
      };
    }),

  // Get community guidelines
  getCommunityGuidelines: publicProcedure.query(async () => {
    return {
      success: true,
      guidelines: [
        'Seja respeitoso com outros membros',
        'Não compartilhe informações pessoais',
        'Não faça spam ou publicidade',
        'Mantenha as discussões relevantes',
        'Respeite a propriedade intelectual',
      ],
    };
  }),
});
