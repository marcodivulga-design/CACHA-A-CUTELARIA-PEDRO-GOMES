import { mysqlTable, varchar, int, text, boolean, datetime } from 'drizzle-orm/mysql-core';
import { relations } from 'drizzle-orm';

// Tabela de Galeria de Fotos
export const knifeGallery = mysqlTable('knife_gallery', {
  id: varchar('id', { length: 36 }).primaryKey(),
  knifeId: varchar('knife_id', { length: 36 }).notNull(),
  
  // Foto
  imageUrl: varchar('image_url', { length: 500 }).notNull(),
  imagePath: varchar('image_path', { length: 500 }), // Caminho local
  
  // Metadados
  title: varchar('title', { length: 255 }),
  description: text('description'),
  
  // Tipo de foto
  photoType: varchar('photo_type', { length: 50 }).default('frontal'), // frontal, lateral, detalhe, uso, ambiente
  
  // Ordem
  order: int('order').default(0),
  
  // Status
  isMain: boolean('is_main').default(false), // Foto principal
  isActive: boolean('is_active').default(true),
  
  // Timestamps
  createdAt: datetime('created_at').notNull().defaultNow(),
  updatedAt: datetime('updated_at').notNull().defaultNow(),
});

// Tabela de Variações de Faca (cores, tamanhos especiais, etc)
export const knifeVariations = mysqlTable('knife_variations', {
  id: varchar('id', { length: 36 }).primaryKey(),
  knifeId: varchar('knife_id', { length: 36 }).notNull(),
  
  // Variação
  name: varchar('name', { length: 255 }).notNull(), // ex: "Cabo Preto", "Edição Ouro"
  description: text('description'),
  
  // Preço (pode ser diferente)
  priceModifier: varchar('price_modifier', { length: 50 }), // ex: "+10.00", "-5.00"
  
  // Estoque
  stock: int('stock').notNull().default(0),
  
  // Foto principal da variação
  imageUrl: varchar('image_url', { length: 500 }),
  
  // Status
  isActive: boolean('is_active').default(true),
  
  // Timestamps
  createdAt: datetime('created_at').notNull().defaultNow(),
  updatedAt: datetime('updated_at').notNull().defaultNow(),
});

// Tabela de Fotos da Variação
export const variationGallery = mysqlTable('variation_gallery', {
  id: varchar('id', { length: 36 }).primaryKey(),
  variationId: varchar('variation_id', { length: 36 }).notNull(),
  
  // Foto
  imageUrl: varchar('image_url', { length: 500 }).notNull(),
  
  // Metadados
  title: varchar('title', { length: 255 }),
  photoType: varchar('photo_type', { length: 50 }).default('frontal'),
  
  // Ordem
  order: int('order').default(0),
  
  // Status
  isMain: boolean('is_main').default(false),
  isActive: boolean('is_active').default(true),
  
  // Timestamps
  createdAt: datetime('created_at').notNull().defaultNow(),
});

// Relações
export const knifeGalleryRelations = relations(knifeGallery, ({ one }) => ({
  knife: one('knives', {
    fields: [knifeGallery.knifeId],
    references: ['id'],
  }),
}));

export const knifeVariationsRelations = relations(knifeVariations, ({ one, many }) => ({
  knife: one('knives', {
    fields: [knifeVariations.knifeId],
    references: ['id'],
  }),
  gallery: many(variationGallery),
}));

export const variationGalleryRelations = relations(variationGallery, ({ one }) => ({
  variation: one(knifeVariations, {
    fields: [variationGallery.variationId],
    references: [knifeVariations.id],
  }),
}));
