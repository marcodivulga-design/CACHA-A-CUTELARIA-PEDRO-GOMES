import { db } from './db';
import { products, categories } from '../drizzle/schema-catalog';

export const seedProducts = async () => {
  // Categorias
  const categoriesData = [
    {
      id: 'cat-1',
      name: 'Facas de Chef',
      description: 'Facas profissionais para chef',
      slug: 'facas-de-chef',
    },
    {
      id: 'cat-2',
      name: 'Facas Artesanais',
      description: 'Facas artesanais feitas à mão',
      slug: 'facas-artesanais',
    },
    {
      id: 'cat-3',
      name: 'Facas de Caça',
      description: 'Facas para caça e pesca',
      slug: 'facas-de-caca',
    },
  ];

  // Produtos
  const productsData = [
    {
      id: 'prod-001',
      categoryId: 'cat-2',
      name: 'Faca Artesanal #1',
      description: 'Faca artesanal de qualidade premium, feita à mão com técnica tradicional',
      price: 199.99,
      stock: 10,
      sku: 'FACA-001',
      images: [],
    },
    {
      id: 'prod-002',
      categoryId: 'cat-2',
      name: 'Faca Artesanal #2',
      description: 'Faca artesanal de qualidade premium, feita à mão com técnica tradicional',
      price: 219.99,
      stock: 8,
      sku: 'FACA-002',
      images: [],
    },
    {
      id: 'prod-003',
      categoryId: 'cat-2',
      name: 'Faca Artesanal #3',
      description: 'Faca artesanal de qualidade premium, feita à mão com técnica tradicional',
      price: 239.99,
      stock: 12,
      sku: 'FACA-003',
      images: [],
    },
    {
      id: 'prod-004',
      categoryId: 'cat-2',
      name: 'Faca Artesanal #4',
      description: 'Faca artesanal de qualidade premium, feita à mão com técnica tradicional',
      price: 249.99,
      stock: 6,
      sku: 'FACA-004',
      images: [],
    },
    {
      id: 'prod-005',
      categoryId: 'cat-2',
      name: 'Faca Artesanal #5',
      description: 'Faca artesanal de qualidade premium, feita à mão com técnica tradicional',
      price: 269.99,
      stock: 9,
      sku: 'FACA-005',
      images: [],
    },
    {
      id: 'prod-006',
      categoryId: 'cat-2',
      name: 'Faca Artesanal #6',
      description: 'Faca artesanal de qualidade premium, feita à mão com técnica tradicional',
      price: 279.99,
      stock: 7,
      sku: 'FACA-006',
      images: [],
    },
    {
      id: 'prod-007',
      categoryId: 'cat-2',
      name: 'Faca Artesanal #7',
      description: 'Faca artesanal de qualidade premium, feita à mão com técnica tradicional',
      price: 289.99,
      stock: 11,
      sku: 'FACA-007',
      images: [],
    },
    {
      id: 'prod-008',
      categoryId: 'cat-2',
      name: 'Faca Artesanal #8',
      description: 'Faca artesanal de qualidade premium, feita à mão com técnica tradicional',
      price: 299.99,
      stock: 5,
      sku: 'FACA-008',
      images: [],
    },
    {
      id: 'prod-009',
      categoryId: 'cat-2',
      name: 'Faca Artesanal #9',
      description: 'Faca artesanal de qualidade premium, feita à mão com técnica tradicional',
      price: 319.99,
      stock: 8,
      sku: 'FACA-009',
      images: [],
    },
    {
      id: 'prod-010',
      categoryId: 'cat-2',
      name: 'Faca Artesanal #10',
      description: 'Faca artesanal de qualidade premium, feita à mão com técnica tradicional',
      price: 329.99,
      stock: 4,
      sku: 'FACA-010',
      images: [],
    },
    {
      id: 'prod-011',
      categoryId: 'cat-2',
      name: 'Faca Artesanal #11',
      description: 'Faca artesanal de qualidade premium, feita à mão com técnica tradicional',
      price: 339.99,
      stock: 6,
      sku: 'FACA-011',
      images: [],
    },
    {
      id: 'prod-012',
      categoryId: 'cat-2',
      name: 'Faca Artesanal #12',
      description: 'Faca artesanal de qualidade premium, feita à mão com técnica tradicional',
      price: 349.99,
      stock: 10,
      sku: 'FACA-012',
      images: [],
    },
  ];

  console.log('Seeding categories...');
  // await db.insert(categories).values(categoriesData);

  console.log('Seeding products...');
  // await db.insert(products).values(productsData);

  console.log('✅ Seed completo!');
};
