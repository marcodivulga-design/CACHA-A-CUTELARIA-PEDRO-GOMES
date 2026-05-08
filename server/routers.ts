import { router } from './_core/trpc';
import { productsRouter } from './routers/products.router';
import { cartRouter } from './routers/cart.router';
import { ordersRouter } from './routers/orders.router';
import { paymentsRouter } from './routers/payments.router';
import { adminRouter } from './routers/admin.router';
import { recommendationsRouter } from './routers/recommendations.router';

export const appRouter = router({
  products: productsRouter,
  cart: cartRouter,
  orders: ordersRouter,
  payments: paymentsRouter,
  admin: adminRouter,
  recommendations: recommendationsRouter,
});

export type AppRouter = typeof appRouter;
