import { router, protectedProcedure, publicProcedure } from '../_core/trpc';
import { z } from 'zod';

export const loyaltyRouter = router({
  // Get user loyalty points
  getLoyaltyPoints: protectedProcedure.query(async ({ ctx }) => {
    return {
      success: true,
      loyalty: {
        userId: ctx.user?.id,
        totalPoints: 2500,
        availablePoints: 2500,
        tier: 'Gold',
        nextTier: 'Platinum',
        pointsToNextTier: 1500,
        joinedAt: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000),
      },
    };
  }),

  // Earn points
  earnPoints: protectedProcedure
    .input(z.object({
      orderId: z.string(),
      amount: z.number(),
    }))
    .mutation(async ({ input, ctx }) => {
      const points = Math.floor(input.amount * 10); // 1 ponto por R$ 0.10

      return {
        success: true,
        transaction: {
          id: 'trans-' + Date.now(),
          userId: ctx.user?.id,
          orderId: input.orderId,
          points,
          type: 'purchase',
          timestamp: new Date(),
        },
      };
    }),

  // Redeem points
  redeemPoints: protectedProcedure
    .input(z.object({
      points: z.number(),
      rewardId: z.string(),
    }))
    .mutation(async ({ input, ctx }) => {
      return {
        success: true,
        transaction: {
          id: 'trans-' + Date.now(),
          userId: ctx.user?.id,
          points: input.points,
          type: 'redemption',
          reward: input.rewardId,
          timestamp: new Date(),
        },
      };
    }),

  // Get available rewards
  getAvailableRewards: protectedProcedure.query(async ({ ctx }) => {
    return {
      success: true,
      rewards: [
        {
          id: 'reward-1',
          name: 'Desconto 10%',
          points: 500,
          description: 'Desconto de 10% na próxima compra',
          category: 'discount',
        },
        {
          id: 'reward-2',
          name: 'Frete Grátis',
          points: 300,
          description: 'Frete grátis em qualquer pedido',
          category: 'shipping',
        },
        {
          id: 'reward-3',
          name: 'Produto Exclusivo',
          points: 1000,
          description: 'Acesso a produto exclusivo para membros',
          category: 'exclusive',
        },
      ],
    };
  }),

  // Get loyalty tiers
  getLoyaltyTiers: publicProcedure.query(async () => {
    return {
      success: true,
      tiers: [
        {
          id: 'tier-1',
          name: 'Bronze',
          minPoints: 0,
          benefits: ['Pontos em compras', 'Newsletter'],
          multiplier: 1.0,
        },
        {
          id: 'tier-2',
          name: 'Silver',
          minPoints: 1000,
          benefits: ['Pontos em compras', 'Frete 50% off', 'Early access'],
          multiplier: 1.5,
        },
        {
          id: 'tier-3',
          name: 'Gold',
          minPoints: 5000,
          benefits: ['Pontos em compras', 'Frete grátis', 'Early access', 'Birthday gift'],
          multiplier: 2.0,
        },
        {
          id: 'tier-4',
          name: 'Platinum',
          minPoints: 15000,
          benefits: ['Pontos em compras', 'Frete grátis', 'VIP support', 'Birthday gift', 'Exclusive events'],
          multiplier: 3.0,
        },
      ],
    };
  }),

  // Get badges
  getUserBadges: protectedProcedure.query(async ({ ctx }) => {
    return {
      success: true,
      badges: [
        {
          id: 'badge-1',
          name: 'Primeiro Pedido',
          description: 'Realizou seu primeiro pedido',
          icon: 'https://example.com/badge1.png',
          earnedAt: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000),
        },
        {
          id: 'badge-2',
          name: 'Revisor Verificado',
          description: 'Deixou 10 reviews verificados',
          icon: 'https://example.com/badge2.png',
          earnedAt: new Date(Date.now() - 180 * 24 * 60 * 60 * 1000),
        },
        {
          id: 'badge-3',
          name: 'Colecionador',
          description: 'Comprou 5 produtos diferentes',
          icon: 'https://example.com/badge3.png',
          earnedAt: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000),
        },
      ],
    };
  }),

  // Get achievements
  getAvailableAchievements: protectedProcedure.query(async ({ ctx }) => {
    return {
      success: true,
      achievements: [
        {
          id: 'ach-1',
          name: 'Spender',
          description: 'Gaste R$ 1000',
          progress: 750,
          target: 1000,
          reward: 100,
        },
        {
          id: 'ach-2',
          name: 'Social Butterfly',
          description: 'Compartilhe 10 produtos',
          progress: 7,
          target: 10,
          reward: 50,
        },
        {
          id: 'ach-3',
          name: 'Reviewer',
          description: 'Deixe 5 reviews',
          progress: 5,
          target: 5,
          reward: 75,
          completed: true,
        },
      ],
    };
  }),

  // Referral program
  getReferralCode: protectedProcedure.query(async ({ ctx }) => {
    return {
      success: true,
      referral: {
        code: 'JOAO2024',
        link: 'https://example.com/ref/JOAO2024',
        reward: 100,
        rewardType: 'points',
        referrals: 5,
        totalEarned: 500,
      },
    };
  }),

  // Invite friend
  inviteFriend: protectedProcedure
    .input(z.object({
      email: z.string().email(),
      message: z.string().optional(),
    }))
    .mutation(async ({ input, ctx }) => {
      return {
        success: true,
        invitation: {
          id: 'invite-' + Date.now(),
          email: input.email,
          referrerCode: 'JOAO2024',
          status: 'sent',
          createdAt: new Date(),
        },
      };
    }),

  // Get referral history
  getReferralHistory: protectedProcedure.query(async ({ ctx }) => {
    return {
      success: true,
      referrals: [
        {
          id: 'ref-1',
          email: 'friend@example.com',
          status: 'completed',
          reward: 100,
          date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
        },
        {
          id: 'ref-2',
          email: 'friend2@example.com',
          status: 'pending',
          reward: 100,
          date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        },
      ],
    };
  }),

  // Get loyalty dashboard
  getLoyaltyDashboard: protectedProcedure.query(async ({ ctx }) => {
    return {
      success: true,
      dashboard: {
        points: {
          total: 2500,
          available: 2500,
          pending: 0,
        },
        tier: {
          current: 'Gold',
          progress: 75,
        },
        badges: 3,
        achievements: 8,
        referrals: 5,
        nextReward: {
          name: 'Desconto 10%',
          points: 500,
          daysToEarn: 15,
        },
      },
    };
  }),

  // Get points history
  getPointsHistory: protectedProcedure
    .input(z.object({
      limit: z.number().default(50),
    }))
    .query(async ({ input, ctx }) => {
      return {
        success: true,
        history: [
          {
            id: 'trans-1',
            type: 'purchase',
            description: 'Compra do pedido #12345',
            points: 150,
            date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
          },
          {
            id: 'trans-2',
            type: 'referral',
            description: 'Amigo completou primeira compra',
            points: 100,
            date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
          },
          {
            id: 'trans-3',
            type: 'review',
            description: 'Review deixado no produto',
            points: 25,
            date: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
          },
        ],
      };
    }),

  // Spin the wheel (bonus points)
  spinTheWheel: protectedProcedure.mutation(async ({ ctx }) => {
    const prizes = [10, 25, 50, 100, 200, 500];
    const prize = prizes[Math.floor(Math.random() * prizes.length)];

    return {
      success: true,
      spin: {
        prize,
        message: `Parabéns! Você ganhou ${prize} pontos!`,
        nextSpinIn: 24 * 60 * 60 * 1000, // 24 hours
      },
    };
  }),

  // Birthday bonus
  getBirthdayBonus: protectedProcedure.query(async ({ ctx }) => {
    return {
      success: true,
      bonus: {
        available: true,
        points: 250,
        message: 'Parabéns! Ganhe 250 pontos de presente de aniversário',
        expiresIn: 30 * 24 * 60 * 60 * 1000, // 30 days
      },
    };
  }),
});
