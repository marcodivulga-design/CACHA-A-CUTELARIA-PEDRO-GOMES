import { mysqlTable, varchar, text, decimal, int, timestamp, enum as mysqlEnum, json } from 'drizzle-orm/mysql-core';
import { relations } from 'drizzle-orm';

export const categories = mysqlTable('categories', {
  id: varchar('id', { length: 36 }).primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  description: text('description'),
  slug: varchar('slug', { length: 255 }).unique().notNull(),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const products = mysqlTable('products', {
  id: varchar('id', { length: 36 }).primaryKey(),
  categoryId: varchar('category_id', { length: 36 }).notNull(),
  name: varchar('name', { length: 255 }).notNull(),
  description: text('description'),
  price: decimal('price', { precision: 10, scale: 2 }).notNull(),
  stock: int('stock').notNull().default(0),
  images: json('images').$type<string[]>().default([]),
  sku: varchar('sku', { length: 255 }).unique(),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const carts = mysqlTable('carts', {
  id: varchar('id', { length: 36 }).primaryKey(),
  userId: varchar('user_id', { length: 36 }).notNull(),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const cartItems = mysqlTable('cart_items', {
  id: varchar('id', { length: 36 }).primaryKey(),
  cartId: varchar('cart_id', { length: 36 }).notNull(),
  productId: varchar('product_id', { length: 36 }).notNull(),
  quantity: int('quantity').notNull().default(1),
  price: decimal('price', { precision: 10, scale: 2 }).notNull(),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const orders = mysqlTable('orders', {
  id: varchar('id', { length: 36 }).primaryKey(),
  userId: varchar('user_id', { length: 36 }).notNull(),
  total: decimal('total', { precision: 10, scale: 2 }).notNull(),
  status: mysqlEnum('status', ['pending', 'processing', 'shipped', 'delivered', 'cancelled']).default('pending'),
  shippingAddress: json('shipping_address').$type<{
    street: string;
    number: string;
    city: string;
    state: string;
    zipCode: string;
  }>(),
  paymentMethod: mysqlEnum('payment_method', ['credit_card', 'pix', 'boleto']),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const orderItems = mysqlTable('order_items', {
  id: varchar('id', { length: 36 }).primaryKey(),
  orderId: varchar('order_id', { length: 36 }).notNull(),
  productId: varchar('product_id', { length: 36 }).notNull(),
  quantity: int('quantity').notNull(),
  price: decimal('price', { precision: 10, scale: 2 }).notNull(),
  createdAt: timestamp('created_at').defaultNow(),
});

export const productsRelations = relations(products, ({ one, many }) => ({
  category: one(categories, {
    fields: [products.categoryId],
    references: [categories.id],
  }),
  cartItems: many(cartItems),
  orderItems: many(orderItems),
}));

export const categoriesRelations = relations(categories, ({ many }) => ({
  products: many(products),
}));

export const cartsRelations = relations(carts, ({ many }) => ({
  items: many(cartItems),
}));

export const cartItemsRelations = relations(cartItems, ({ one }) => ({
  cart: one(carts, {
    fields: [cartItems.cartId],
    references: [carts.id],
  }),
  product: one(products, {
    fields: [cartItems.productId],
    references: [products.id],
  }),
}));

export const ordersRelations = relations(orders, ({ many }) => ({
  items: many(orderItems),
}));

export const orderItemsRelations = relations(orderItems, ({ one }) => ({
  order: one(orders, {
    fields: [orderItems.orderId],
    references: [orders.id],
  }),
  product: one(products, {
    fields: [orderItems.productId],
    references: [products.id],
  }),
}));
