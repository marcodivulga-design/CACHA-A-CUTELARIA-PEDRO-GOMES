import { mysqlTable, varchar, text, int, decimal, datetime, boolean, enum as sqlEnum, json, index, foreignKey, primaryKey } from 'drizzle-orm/mysql-core';
import { relations } from 'drizzle-orm';

// ============================================
// USERS & ORGANIZATION
// ============================================

export const users = mysqlTable('users', {
  id: varchar('id', { length: 36 }).primaryKey(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  name: varchar('name', { length: 255 }).notNull(),
  phone: varchar('phone', { length: 20 }),
  avatar: text('avatar'),
  role: sqlEnum('role', ['admin', 'user', 'customer']).default('customer'),
  organizationId: varchar('organization_id', { length: 36 }).notNull(),
  createdAt: datetime('created_at').defaultNow(),
  updatedAt: datetime('updated_at').defaultNow(),
}, (table) => ({
  orgIdx: index('org_idx').on(table.organizationId),
}));

export const organizations = mysqlTable('organizations', {
  id: varchar('id', { length: 36 }).primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  slug: varchar('slug', { length: 255 }).notNull().unique(),
  description: text('description'),
  logo: text('logo'),
  website: varchar('website', { length: 255 }),
  email: varchar('email', { length: 255 }),
  phone: varchar('phone', { length: 20 }),
  address: text('address'),
  city: varchar('city', { length: 100 }),
  state: varchar('state', { length: 2 }),
  zipCode: varchar('zip_code', { length: 10 }),
  country: varchar('country', { length: 100 }).default('BR'),
  createdAt: datetime('created_at').defaultNow(),
  updatedAt: datetime('updated_at').defaultNow(),
});

// ============================================
// PRODUCTS (FACAS)
// ============================================

export const products = mysqlTable('products', {
  id: varchar('id', { length: 36 }).primaryKey(),
  organizationId: varchar('organization_id', { length: 36 }).notNull(),
  name: varchar('name', { length: 255 }).notNull(),
  slug: varchar('slug', { length: 255 }).notNull(),
  description: text('description'),
  longDescription: text('long_description'),
  price: decimal('price', { precision: 10, scale: 2 }).notNull(),
  originalPrice: decimal('original_price', { precision: 10, scale: 2 }),
  discount: int('discount').default(0),
  bladeLength: int('blade_length'),
  weight: int('weight'),
  handleType: varchar('handle_type', { length: 100 }),
  steelType: varchar('steel_type', { length: 100 }),
  mainImage: text('main_image'),
  rating: decimal('rating', { precision: 3, scale: 2 }).default('0'),
  reviewCount: int('review_count').default(0),
  stock: int('stock').default(0),
  sku: varchar('sku', { length: 100 }).unique(),
  active: boolean('active').default(true),
  featured: boolean('featured').default(false),
  createdAt: datetime('created_at').defaultNow(),
  updatedAt: datetime('updated_at').defaultNow(),
}, (table) => ({
  orgIdx: index('org_idx').on(table.organizationId),
  slugIdx: index('slug_idx').on(table.slug),
}));

export const productImages = mysqlTable('product_images', {
  id: varchar('id', { length: 36 }).primaryKey(),
  productId: varchar('product_id', { length: 36 }).notNull(),
  imageUrl: text('image_url').notNull(),
  photoType: sqlEnum('photo_type', ['frontal', 'lateral', 'detalhe', 'uso', 'ambiente']).default('frontal'),
  title: varchar('title', { length: 255 }),
  order: int('order').default(0),
  isMain: boolean('is_main').default(false),
  isActive: boolean('is_active').default(true),
  createdAt: datetime('created_at').defaultNow(),
}, (table) => ({
  productIdx: index('product_idx').on(table.productId),
}));

export const productVariations = mysqlTable('product_variations', {
  id: varchar('id', { length: 36 }).primaryKey(),
  productId: varchar('product_id', { length: 36 }).notNull(),
  name: varchar('name', { length: 255 }).notNull(),
  description: text('description'),
  priceModifier: decimal('price_modifier', { precision: 10, scale: 2 }).default('0'),
  stock: int('stock').default(0),
  imageUrl: text('image_url'),
  sku: varchar('sku', { length: 100 }).unique(),
  createdAt: datetime('created_at').defaultNow(),
}, (table) => ({
  productIdx: index('product_idx').on(table.productId),
}));

// ============================================
// CUSTOMERS & ORDERS
// ============================================

export const customers = mysqlTable('customers', {
  id: varchar('id', { length: 36 }).primaryKey(),
  organizationId: varchar('organization_id', { length: 36 }).notNull(),
  userId: varchar('user_id', { length: 36 }),
  email: varchar('email', { length: 255 }).notNull(),
  name: varchar('name', { length: 255 }).notNull(),
  phone: varchar('phone', { length: 20 }),
  cpf: varchar('cpf', { length: 14 }).unique(),
  birthDate: datetime('birth_date'),
  gender: sqlEnum('gender', ['M', 'F', 'O']),
  newsletter: boolean('newsletter').default(false),
  createdAt: datetime('created_at').defaultNow(),
  updatedAt: datetime('updated_at').defaultNow(),
}, (table) => ({
  orgIdx: index('org_idx').on(table.organizationId),
  emailIdx: index('email_idx').on(table.email),
}));

export const orders = mysqlTable('orders', {
  id: varchar('id', { length: 36 }).primaryKey(),
  organizationId: varchar('organization_id', { length: 36 }).notNull(),
  customerId: varchar('customer_id', { length: 36 }).notNull(),
  orderNumber: varchar('order_number', { length: 50 }).notNull().unique(),
  status: sqlEnum('status', ['pending', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded']).default('pending'),
  subtotal: decimal('subtotal', { precision: 10, scale: 2 }).notNull(),
  discount: decimal('discount', { precision: 10, scale: 2 }).default('0'),
  shipping: decimal('shipping', { precision: 10, scale: 2 }).default('0'),
  tax: decimal('tax', { precision: 10, scale: 2 }).default('0'),
  total: decimal('total', { precision: 10, scale: 2 }).notNull(),
  paymentMethod: sqlEnum('payment_method', ['credit_card', 'pix', 'boleto', 'crypto']),
  paymentStatus: sqlEnum('payment_status', ['pending', 'approved', 'failed', 'refunded']).default('pending'),
  transactionId: varchar('transaction_id', { length: 255 }),
  shippingAddress: json('shipping_address'),
  billingAddress: json('billing_address'),
  notes: text('notes'),
  createdAt: datetime('created_at').defaultNow(),
  updatedAt: datetime('updated_at').defaultNow(),
}, (table) => ({
  orgIdx: index('org_idx').on(table.organizationId),
  customerIdx: index('customer_idx').on(table.customerId),
  statusIdx: index('status_idx').on(table.status),
}));

export const orderItems = mysqlTable('order_items', {
  id: varchar('id', { length: 36 }).primaryKey(),
  orderId: varchar('order_id', { length: 36 }).notNull(),
  productId: varchar('product_id', { length: 36 }).notNull(),
  variationId: varchar('variation_id', { length: 36 }),
  quantity: int('quantity').notNull(),
  unitPrice: decimal('unit_price', { precision: 10, scale: 2 }).notNull(),
  discount: decimal('discount', { precision: 10, scale: 2 }).default('0'),
  total: decimal('total', { precision: 10, scale: 2 }).notNull(),
  createdAt: datetime('created_at').defaultNow(),
}, (table) => ({
  orderIdx: index('order_idx').on(table.orderId),
  productIdx: index('product_idx').on(table.productId),
}));

// ============================================
// PAYMENTS & TRANSACTIONS
// ============================================

export const payments = mysqlTable('payments', {
  id: varchar('id', { length: 36 }).primaryKey(),
  organizationId: varchar('organization_id', { length: 36 }).notNull(),
  orderId: varchar('order_id', { length: 36 }).notNull(),
  amount: decimal('amount', { precision: 10, scale: 2 }).notNull(),
  method: sqlEnum('method', ['credit_card', 'pix', 'boleto', 'crypto']).notNull(),
  status: sqlEnum('status', ['pending', 'approved', 'failed', 'refunded']).default('pending'),
  transactionId: varchar('transaction_id', { length: 255 }).unique(),
  gateway: varchar('gateway', { length: 100 }),
  gatewayResponse: json('gateway_response'),
  metadata: json('metadata'),
  createdAt: datetime('created_at').defaultNow(),
  updatedAt: datetime('updated_at').defaultNow(),
}, (table) => ({
  orgIdx: index('org_idx').on(table.organizationId),
  orderIdx: index('order_idx').on(table.orderId),
  statusIdx: index('status_idx').on(table.status),
}));

// ============================================
// SHIPPING & TRACKING
// ============================================

export const shipments = mysqlTable('shipments', {
  id: varchar('id', { length: 36 }).primaryKey(),
  organizationId: varchar('organization_id', { length: 36 }).notNull(),
  orderId: varchar('order_id', { length: 36 }).notNull(),
  trackingCode: varchar('tracking_code', { length: 100 }).unique(),
  carrier: varchar('carrier', { length: 100 }),
  status: sqlEnum('status', ['pending', 'processing', 'shipped', 'in_transit', 'delivered', 'failed']).default('pending'),
  estimatedDelivery: datetime('estimated_delivery'),
  actualDelivery: datetime('actual_delivery'),
  weight: decimal('weight', { precision: 10, scale: 3 }),
  dimensions: json('dimensions'),
  createdAt: datetime('created_at').defaultNow(),
  updatedAt: datetime('updated_at').defaultNow(),
}, (table) => ({
  orgIdx: index('org_idx').on(table.organizationId),
  orderIdx: index('order_idx').on(table.orderId),
  trackingIdx: index('tracking_idx').on(table.trackingCode),
}));

export const trackingEvents = mysqlTable('tracking_events', {
  id: varchar('id', { length: 36 }).primaryKey(),
  shipmentId: varchar('shipment_id', { length: 36 }).notNull(),
  status: varchar('status', { length: 100 }).notNull(),
  location: varchar('location', { length: 255 }),
  description: text('description'),
  timestamp: datetime('timestamp').defaultNow(),
  createdAt: datetime('created_at').defaultNow(),
}, (table) => ({
  shipmentIdx: index('shipment_idx').on(table.shipmentId),
}));

// ============================================
// REVIEWS & RATINGS
// ============================================

export const reviews = mysqlTable('reviews', {
  id: varchar('id', { length: 36 }).primaryKey(),
  organizationId: varchar('organization_id', { length: 36 }).notNull(),
  productId: varchar('product_id', { length: 36 }).notNull(),
  customerId: varchar('customer_id', { length: 36 }).notNull(),
  orderId: varchar('order_id', { length: 36 }),
  rating: int('rating').notNull(),
  title: varchar('title', { length: 255 }),
  comment: text('comment'),
  verified: boolean('verified').default(false),
  helpful: int('helpful').default(0),
  unhelpful: int('unhelpful').default(0),
  status: sqlEnum('status', ['pending', 'approved', 'rejected']).default('pending'),
  createdAt: datetime('created_at').defaultNow(),
  updatedAt: datetime('updated_at').defaultNow(),
}, (table) => ({
  orgIdx: index('org_idx').on(table.organizationId),
  productIdx: index('product_idx').on(table.productId),
  customerIdx: index('customer_idx').on(table.customerId),
}));

export const reviewImages = mysqlTable('review_images', {
  id: varchar('id', { length: 36 }).primaryKey(),
  reviewId: varchar('review_id', { length: 36 }).notNull(),
  imageUrl: text('image_url').notNull(),
  order: int('order').default(0),
  createdAt: datetime('created_at').defaultNow(),
}, (table) => ({
  reviewIdx: index('review_idx').on(table.reviewId),
}));

// ============================================
// AI CONVERSATIONS & SUPPORT
// ============================================

export const conversations = mysqlTable('conversations', {
  id: varchar('id', { length: 36 }).primaryKey(),
  organizationId: varchar('organization_id', { length: 36 }).notNull(),
  customerId: varchar('customer_id', { length: 36 }),
  channel: sqlEnum('channel', ['web', 'whatsapp', 'telegram', 'email']).default('web'),
  status: sqlEnum('status', ['active', 'closed', 'escalated']).default('active'),
  sentiment: sqlEnum('sentiment', ['positive', 'neutral', 'negative']).default('neutral'),
  escalatedToHuman: boolean('escalated_to_human').default(false),
  agentId: varchar('agent_id', { length: 36 }),
  createdAt: datetime('created_at').defaultNow(),
  updatedAt: datetime('updated_at').defaultNow(),
  closedAt: datetime('closed_at'),
}, (table) => ({
  orgIdx: index('org_idx').on(table.organizationId),
  customerIdx: index('customer_idx').on(table.customerId),
  statusIdx: index('status_idx').on(table.status),
}));

export const messages = mysqlTable('messages', {
  id: varchar('id', { length: 36 }).primaryKey(),
  conversationId: varchar('conversation_id', { length: 36 }).notNull(),
  role: sqlEnum('role', ['user', 'assistant', 'agent']).notNull(),
  content: text('content').notNull(),
  sentiment: sqlEnum('sentiment', ['positive', 'neutral', 'negative']),
  metadata: json('metadata'),
  createdAt: datetime('created_at').defaultNow(),
}, (table) => ({
  conversationIdx: index('conversation_idx').on(table.conversationId),
}));

export const recommendations = mysqlTable('recommendations', {
  id: varchar('id', { length: 36 }).primaryKey(),
  organizationId: varchar('organization_id', { length: 36 }).notNull(),
  conversationId: varchar('conversation_id', { length: 36 }),
  customerId: varchar('customer_id', { length: 36 }),
  productId: varchar('product_id', { length: 36 }).notNull(),
  reason: text('reason'),
  matchScore: int('match_score'),
  clicked: boolean('clicked').default(false),
  purchased: boolean('purchased').default(false),
  createdAt: datetime('created_at').defaultNow(),
}, (table) => ({
  orgIdx: index('org_idx').on(table.organizationId),
  conversationIdx: index('conversation_idx').on(table.conversationId),
  customerIdx: index('customer_idx').on(table.customerId),
}));

// ============================================
// ANALYTICS & EVENTS
// ============================================

export const events = mysqlTable('events', {
  id: varchar('id', { length: 36 }).primaryKey(),
  organizationId: varchar('organization_id', { length: 36 }).notNull(),
  customerId: varchar('customer_id', { length: 36 }),
  eventType: varchar('event_type', { length: 100 }).notNull(),
  eventData: json('event_data'),
  userAgent: text('user_agent'),
  ipAddress: varchar('ip_address', { length: 45 }),
  createdAt: datetime('created_at').defaultNow(),
}, (table) => ({
  orgIdx: index('org_idx').on(table.organizationId),
  typeIdx: index('type_idx').on(table.eventType),
}));

export const pageViews = mysqlTable('page_views', {
  id: varchar('id', { length: 36 }).primaryKey(),
  organizationId: varchar('organization_id', { length: 36 }).notNull(),
  customerId: varchar('customer_id', { length: 36 }),
  page: varchar('page', { length: 255 }).notNull(),
  referrer: varchar('referrer', { length: 255 }),
  duration: int('duration'),
  scrollDepth: int('scroll_depth'),
  createdAt: datetime('created_at').defaultNow(),
}, (table) => ({
  orgIdx: index('org_idx').on(table.organizationId),
  pageIdx: index('page_idx').on(table.page),
}));

// ============================================
// RELATIONS
// ============================================

export const usersRelations = relations(users, ({ one, many }) => ({
  organization: one(organizations, {
    fields: [users.organizationId],
    references: [organizations.id],
  }),
  conversations: many(conversations),
}));

export const organizationsRelations = relations(organizations, ({ many }) => ({
  users: many(users),
  products: many(products),
  customers: many(customers),
  orders: many(orders),
  payments: many(payments),
  shipments: many(shipments),
  reviews: many(reviews),
  conversations: many(conversations),
  events: many(events),
}));

export const productsRelations = relations(products, ({ one, many }) => ({
  organization: one(organizations, {
    fields: [products.organizationId],
    references: [organizations.id],
  }),
  images: many(productImages),
  variations: many(productVariations),
  reviews: many(reviews),
  orderItems: many(orderItems),
}));

export const customersRelations = relations(customers, ({ one, many }) => ({
  organization: one(organizations, {
    fields: [customers.organizationId],
    references: [organizations.id],
  }),
  orders: many(orders),
  reviews: many(reviews),
  conversations: many(conversations),
}));

export const ordersRelations = relations(orders, ({ one, many }) => ({
  organization: one(organizations, {
    fields: [orders.organizationId],
    references: [organizations.id],
  }),
  customer: one(customers, {
    fields: [orders.customerId],
    references: [customers.id],
  }),
  items: many(orderItems),
  payments: many(payments),
  shipments: many(shipments),
}));

export const conversationsRelations = relations(conversations, ({ one, many }) => ({
  organization: one(organizations, {
    fields: [conversations.organizationId],
    references: [organizations.id],
  }),
  customer: one(customers, {
    fields: [conversations.customerId],
    references: [customers.id],
  }),
  messages: many(messages),
  recommendations: many(recommendations),
}));
