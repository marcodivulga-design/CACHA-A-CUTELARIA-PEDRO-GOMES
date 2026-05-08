import { router } from './_core/trpc';
import { productsRouter } from './routers/products.router';
import { cartRouter } from './routers/cart.router';
import { ordersRouter } from './routers/orders.router';
import { paymentsRouter } from './routers/payments.router';
import { adminRouter } from './routers/admin.router';
import { recommendationsRouter } from './routers/recommendations.router';
import { analyticsRouter } from './routers/analytics.router';
import { authRouter } from './routers/auth.router';
import { webhooksRouter } from './routers/webhooks.router';
import { notificationsRouter } from './routers/notifications.router';
import { integrationsRouter } from './routers/integrations.router';
import { automationsRouter } from './routers/automations.router';

export const appRouter = router({
  products: productsRouter,
  cart: cartRouter,
  orders: ordersRouter,
  payments: paymentsRouter,
  admin: adminRouter,
  recommendations: recommendationsRouter,
  analytics: analyticsRouter,
  auth: authRouter,
  webhooks: webhooksRouter,
  notifications: notificationsRouter,
  integrations: integrationsRouter,
  automations: automationsRouter,
});

export type AppRouter = typeof appRouter;
