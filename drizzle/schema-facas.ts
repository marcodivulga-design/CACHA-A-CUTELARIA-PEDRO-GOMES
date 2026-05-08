import { mysqlTable, varchar, int, decimal, text, boolean, datetime, enum as mysqlEnum } from 'drizzle-orm/mysql-core';
import { relations } from 'drizzle-orm';

// Enum para tamanho
export const bladeSizeEnum = mysqlEnum('blade_size', ['pequena', 'media', 'grande']);

// Enum para tipo de cabo
export const handleTypeEnum = mysqlEnum('handle_type', ['ipe', 'cedro', 'jacaranda', 'pau_darco']);

// Enum para tipo de aço
export const steelTypeEnum = mysqlEnum('steel_type', ['inox_420', 'inox_440', 'carbono', 'carbono_forjado']);

// Enum para aplicação
export const applicationEnum = mysqlEnum('application', [
  'frutas_legumes',
  'carnes',
  'pao_bolos',
  'queijo_manteiga',
  'uso_geral',
  'profissional'
]);

// Tabela de Facas
export const knives = mysqlTable('knives', {
  id: varchar('id', { length: 36 }).primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  description: text('description'),
  
  // Especificações
  bladeSize: bladeSizeEnum.notNull(),
  bladeLengthCm: int('blade_length_cm').notNull(),
  handleType: handleTypeEnum.notNull(),
  steelType: steelTypeEnum.notNull(),
  weight: int('weight').notNull(), // em gramas
  
  // Aplicação
  application: applicationEnum.notNull(),
  
  // Preço
  price: decimal('price', { precision: 10, scale: 2 }).notNull(),
  originalPrice: decimal('original_price', { precision: 10, scale: 2 }),
  
  // Imagens
  imageUrl: varchar('image_url', { length: 500 }),
  imageUrls: text('image_urls'), // JSON array
  
  // Detalhes
  maintenance: varchar('maintenance', { length: 50 }), // Nível de manutenção
  durability: int('durability'), // 1-5 stars
  sharpness: int('sharpness'), // 1-5 stars
  
  // Estoque
  stock: int('stock').notNull().default(0),
  isLimited: boolean('is_limited').default(false),
  limitedEdition: int('limited_edition'), // Número da edição limitada
  totalLimitedEdition: int('total_limited_edition'), // Total de edições
  
  // NFT
  hasNFT: boolean('has_nft').default(false),
  nftTokenId: varchar('nft_token_id', { length: 255 }),
  nftPrice: decimal('nft_price', { precision: 10, scale: 2 }),
  
  // Metadados
  rating: decimal('rating', { precision: 3, scale: 2 }).default('5.00'),
  reviewCount: int('review_count').default(0),
  
  // Timestamps
  createdAt: datetime('created_at').notNull().defaultNow(),
  updatedAt: datetime('updated_at').notNull().defaultNow(),
  
  // Status
  isActive: boolean('is_active').default(true),
  isFeatured: boolean('is_featured').default(false),
});

// Tabela de Características da Faca
export const knifeFeatures = mysqlTable('knife_features', {
  id: varchar('id', { length: 36 }).primaryKey(),
  knifeId: varchar('knife_id', { length: 36 }).notNull(),
  
  // Características
  feature: varchar('feature', { length: 255 }).notNull(), // ex: "Lâmina Afiada", "Cabo Confortável"
  description: text('description'),
  
  createdAt: datetime('created_at').notNull().defaultNow(),
});

// Tabela de Especificações Técnicas
export const knifeSpecs = mysqlTable('knife_specs', {
  id: varchar('id', { length: 36 }).primaryKey(),
  knifeId: varchar('knife_id', { length: 36 }).notNull(),
  
  // Especificações
  spec: varchar('spec', { length: 255 }).notNull(), // ex: "Dureza Rockwell"
  value: varchar('value', { length: 255 }).notNull(), // ex: "58-60 HRC"
  
  createdAt: datetime('created_at').notNull().defaultNow(),
});

// Tabela de Recomendações
export const knifeRecommendations = mysqlTable('knife_recommendations', {
  id: varchar('id', { length: 36 }).primaryKey(),
  knifeId: varchar('knife_id', { length: 36 }).notNull(),
  
  // Recomendação
  profile: varchar('profile', { length: 255 }).notNull(), // ex: "Iniciante", "Profissional"
  reason: text('reason'),
  priority: int('priority'), // 1-3
  
  createdAt: datetime('created_at').notNull().defaultNow(),
});

// Tabela de Comparação de Facas
export const knifeComparisons = mysqlTable('knife_comparisons', {
  id: varchar('id', { length: 36 }).primaryKey(),
  knife1Id: varchar('knife1_id', { length: 36 }).notNull(),
  knife2Id: varchar('knife2_id', { length: 36 }).notNull(),
  
  // Comparação
  aspect: varchar('aspect', { length: 255 }).notNull(), // ex: "Preço", "Durabilidade"
  winner: varchar('winner', { length: 36 }), // ID da faca vencedora
  reason: text('reason'),
  
  createdAt: datetime('created_at').notNull().defaultNow(),
});

// Tabela de Coleções
export const knifeCollections = mysqlTable('knife_collections', {
  id: varchar('id', { length: 36 }).primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  description: text('description'),
  
  // Metadados
  imageUrl: varchar('image_url', { length: 500 }),
  totalPrice: decimal('total_price', { precision: 10, scale: 2 }),
  discount: decimal('discount', { precision: 5, scale: 2 }), // Percentual
  
  // Status
  isActive: boolean('is_active').default(true),
  
  createdAt: datetime('created_at').notNull().defaultNow(),
  updatedAt: datetime('updated_at').notNull().defaultNow(),
});

// Tabela de Itens da Coleção
export const collectionItems = mysqlTable('collection_items', {
  id: varchar('id', { length: 36 }).primaryKey(),
  collectionId: varchar('collection_id', { length: 36 }).notNull(),
  knifeId: varchar('knife_id', { length: 36 }).notNull(),
  
  // Ordem
  order: int('order').notNull(),
  
  createdAt: datetime('created_at').notNull().defaultNow(),
});

// Relações
export const knivesRelations = relations(knives, ({ many }) => ({
  features: many(knifeFeatures),
  specs: many(knifeSpecs),
  recommendations: many(knifeRecommendations),
  collectionItems: many(collectionItems),
}));

export const knifeCollectionsRelations = relations(knifeCollections, ({ many }) => ({
  items: many(collectionItems),
}));

export const collectionItemsRelations = relations(collectionItems, ({ one }) => ({
  collection: one(knifeCollections, {
    fields: [collectionItems.collectionId],
    references: [knifeCollections.id],
  }),
  knife: one(knives, {
    fields: [collectionItems.knifeId],
    references: [knives.id],
  }),
}));
