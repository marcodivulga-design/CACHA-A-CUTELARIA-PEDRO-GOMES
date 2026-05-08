import { db } from '../server/db';
import { knives, knifeFeatures, knifeSpecs, knifeRecommendations } from '../drizzle/schema-facas';

const knivesData = [
  {
    id: 'knife-001',
    name: 'Faca de Manteiga',
    description: 'Faca pequena e precisa para manteiga, queijo e alimentos delicados',
    bladeSize: 'pequena',
    bladeLengthCm: 8,
    handleType: 'ipe',
    steelType: 'inox_420',
    weight: 80,
    application: 'queijo_manteiga',
    price: '45.00',
    imageUrl: 'https://example.com/faca-manteiga.jpg',
    maintenance: 'Baixa',
    durability: 5,
    sharpness: 4,
    stock: 50,
    rating: '5.00',
    reviewCount: 45,
    isActive: true,
  },
  {
    id: 'knife-002',
    name: 'Faca de Frutas',
    description: 'Faca versátil para frutas e legumes, leve e precisa',
    bladeSize: 'pequena',
    bladeLengthCm: 9,
    handleType: 'cedro',
    steelType: 'carbono',
    weight: 75,
    application: 'frutas_legumes',
    price: '55.00',
    imageUrl: 'https://example.com/faca-frutas.jpg',
    maintenance: 'Média',
    durability: 4,
    sharpness: 5,
    stock: 40,
    rating: '4.95',
    reviewCount: 38,
    isActive: true,
  },
  {
    id: 'knife-003',
    name: 'Faca de Desossa',
    description: 'Faca específica para desossar carnes com precisão',
    bladeSize: 'pequena',
    bladeLengthCm: 10,
    handleType: 'jacaranda',
    steelType: 'inox_440',
    weight: 85,
    application: 'carnes',
    price: '65.00',
    imageUrl: 'https://example.com/faca-desossa.jpg',
    maintenance: 'Baixa',
    durability: 5,
    sharpness: 5,
    stock: 35,
    rating: '5.00',
    reviewCount: 52,
    isActive: true,
  },
  {
    id: 'knife-004',
    name: 'Faca de Pão',
    description: 'Faca com serrilha para cortar pão e bolos sem esmagar',
    bladeSize: 'media',
    bladeLengthCm: 15,
    handleType: 'pau_darco',
    steelType: 'carbono',
    weight: 150,
    application: 'pao_bolos',
    price: '85.00',
    imageUrl: 'https://example.com/faca-pao.jpg',
    maintenance: 'Média',
    durability: 5,
    sharpness: 4,
    stock: 30,
    rating: '4.90',
    reviewCount: 41,
    isActive: true,
  },
  {
    id: 'knife-005',
    name: 'Faca de Chef',
    description: 'Faca versátil para uso geral na cozinha, profissional',
    bladeSize: 'media',
    bladeLengthCm: 18,
    handleType: 'ipe',
    steelType: 'inox_440',
    weight: 180,
    application: 'uso_geral',
    price: '120.00',
    imageUrl: 'https://example.com/faca-chef.jpg',
    maintenance: 'Baixa',
    durability: 5,
    sharpness: 5,
    stock: 60,
    rating: '5.00',
    reviewCount: 125,
    isActive: true,
    isFeatured: true,
  },
  {
    id: 'knife-006',
    name: 'Faca Santoku',
    description: 'Faca japonesa para precisão em vegetais, peixes e carnes',
    bladeSize: 'media',
    bladeLengthCm: 17,
    handleType: 'cedro',
    steelType: 'inox_440',
    weight: 170,
    application: 'frutas_legumes',
    price: '110.00',
    imageUrl: 'https://example.com/faca-santoku.jpg',
    maintenance: 'Baixa',
    durability: 5,
    sharpness: 5,
    stock: 45,
    rating: '4.98',
    reviewCount: 89,
    isActive: true,
  },
  {
    id: 'knife-007',
    name: 'Faca de Churrasco',
    description: 'Faca robusta para cortar carnes assadas no churrasco',
    bladeSize: 'media',
    bladeLengthCm: 16,
    handleType: 'jacaranda',
    steelType: 'carbono',
    weight: 160,
    application: 'carnes',
    price: '95.00',
    imageUrl: 'https://example.com/faca-churrasco.jpg',
    maintenance: 'Média',
    durability: 5,
    sharpness: 5,
    stock: 55,
    rating: '4.92',
    reviewCount: 67,
    isActive: true,
  },
  {
    id: 'knife-008',
    name: 'Faca de Carne',
    description: 'Faca grande para cortar carnes e preparações profissionais',
    bladeSize: 'grande',
    bladeLengthCm: 22,
    handleType: 'ipe',
    steelType: 'inox_440',
    weight: 220,
    application: 'carnes',
    price: '135.00',
    imageUrl: 'https://example.com/faca-carne.jpg',
    maintenance: 'Baixa',
    durability: 5,
    sharpness: 5,
    stock: 25,
    rating: '5.00',
    reviewCount: 78,
    isActive: true,
  },
  {
    id: 'knife-009',
    name: 'Faca de Açougue',
    description: 'Faca profissional para cortes grandes de carne',
    bladeSize: 'grande',
    bladeLengthCm: 25,
    handleType: 'pau_darco',
    steelType: 'carbono',
    weight: 250,
    application: 'profissional',
    price: '150.00',
    imageUrl: 'https://example.com/faca-acougue.jpg',
    maintenance: 'Alta',
    durability: 5,
    sharpness: 5,
    stock: 15,
    rating: '4.95',
    reviewCount: 34,
    isActive: true,
  },
  {
    id: 'knife-010',
    name: 'Faca Artesanal Premium',
    description: 'Faca artesanal premium forjada manualmente, edição limitada',
    bladeSize: 'grande',
    bladeLengthCm: 24,
    handleType: 'jacaranda',
    steelType: 'carbono_forjado',
    weight: 240,
    application: 'profissional',
    price: '180.00',
    imageUrl: 'https://example.com/faca-premium.jpg',
    maintenance: 'Alta',
    durability: 5,
    sharpness: 5,
    stock: 10,
    isLimited: true,
    limitedEdition: 1,
    totalLimitedEdition: 50,
    hasNFT: true,
    nftTokenId: 'nft-001',
    nftPrice: '0.5',
    rating: '5.00',
    reviewCount: 23,
    isActive: true,
    isFeatured: true,
  },
];

const featuresData = [
  // Faca de Manteiga
  { id: 'feat-001', knifeId: 'knife-001', feature: 'Lâmina Afiada', description: 'Mantém o fio por muito tempo' },
  { id: 'feat-002', knifeId: 'knife-001', feature: 'Cabo Confortável', description: 'Ergonômico para uso prolongado' },
  { id: 'feat-003', knifeId: 'knife-001', feature: 'Resistente à Corrosão', description: 'Aço inox de qualidade' },
  
  // Faca de Chef
  { id: 'feat-004', knifeId: 'knife-005', feature: 'Versátil', description: 'Ideal para múltiplas tarefas' },
  { id: 'feat-005', knifeId: 'knife-005', feature: 'Profissional', description: 'Usada em cozinhas profissionais' },
  { id: 'feat-006', knifeId: 'knife-005', feature: 'Durável', description: 'Longa vida útil' },
  
  // Faca Artesanal Premium
  { id: 'feat-007', knifeId: 'knife-010', feature: 'Forjada Manualmente', description: 'Cada faca é única' },
  { id: 'feat-008', knifeId: 'knife-010', feature: 'Edição Limitada', description: 'Apenas 50 unidades' },
  { id: 'feat-009', knifeId: 'knife-010', feature: 'NFT Incluído', description: 'Certificado digital' },
];

const specsData = [
  // Faca de Manteiga
  { id: 'spec-001', knifeId: 'knife-001', spec: 'Dureza Rockwell', value: '54-56 HRC' },
  { id: 'spec-002', knifeId: 'knife-001', spec: 'Comprimento da Lâmina', value: '8 cm' },
  { id: 'spec-003', knifeId: 'knife-001', spec: 'Peso', value: '80 g' },
  
  // Faca de Chef
  { id: 'spec-004', knifeId: 'knife-005', spec: 'Dureza Rockwell', value: '57-59 HRC' },
  { id: 'spec-005', knifeId: 'knife-005', spec: 'Comprimento da Lâmina', value: '18 cm' },
  { id: 'spec-006', knifeId: 'knife-005', spec: 'Peso', value: '180 g' },
  { id: 'spec-007', knifeId: 'knife-005', spec: 'Ângulo de Fio', value: '15-20 graus' },
  
  // Faca Artesanal Premium
  { id: 'spec-008', knifeId: 'knife-010', spec: 'Dureza Rockwell', value: '58-60 HRC' },
  { id: 'spec-009', knifeId: 'knife-010', spec: 'Comprimento da Lâmina', value: '24 cm' },
  { id: 'spec-010', knifeId: 'knife-010', spec: 'Peso', value: '240 g' },
  { id: 'spec-011', knifeId: 'knife-010', spec: 'Processo de Fabricação', value: 'Forjada manualmente' },
];

const recommendationsData = [
  // Faca de Manteiga
  { id: 'rec-001', knifeId: 'knife-001', profile: 'Iniciante', reason: 'Fácil de usar e manter', priority: 1 },
  { id: 'rec-002', knifeId: 'knife-001', profile: 'Gourmet', reason: 'Perfeita para queijos finos', priority: 2 },
  
  // Faca de Chef
  { id: 'rec-003', knifeId: 'knife-005', profile: 'Iniciante', reason: 'Versátil para começar', priority: 1 },
  { id: 'rec-004', knifeId: 'knife-005', profile: 'Profissional', reason: 'Padrão profissional', priority: 1 },
  { id: 'rec-005', knifeId: 'knife-005', profile: 'Cozinheiro Caseiro', reason: 'Ideal para uso diário', priority: 1 },
  
  // Faca Santoku
  { id: 'rec-006', knifeId: 'knife-006', profile: 'Gourmet', reason: 'Precisão em vegetais', priority: 1 },
  { id: 'rec-007', knifeId: 'knife-006', profile: 'Profissional', reason: 'Técnica japonesa', priority: 2 },
  
  // Faca Artesanal Premium
  { id: 'rec-008', knifeId: 'knife-010', profile: 'Colecionador', reason: 'Edição limitada com NFT', priority: 1 },
  { id: 'rec-009', knifeId: 'knife-010', profile: 'Profissional', reason: 'Qualidade máxima', priority: 1 },
];

async function seedKnives() {
  try {
    console.log('🌱 Iniciando seed de facas...');

    // Insert knives
    console.log('📦 Inserindo facas...');
    for (const knife of knivesData) {
      await db.insert(knives).values(knife);
    }
    console.log(`✅ ${knivesData.length} facas inseridas`);

    // Insert features
    console.log('🎯 Inserindo características...');
    for (const feature of featuresData) {
      await db.insert(knifeFeatures).values(feature);
    }
    console.log(`✅ ${featuresData.length} características inseridas`);

    // Insert specs
    console.log('⚙️ Inserindo especificações técnicas...');
    for (const spec of specsData) {
      await db.insert(knifeSpecs).values(spec);
    }
    console.log(`✅ ${specsData.length} especificações inseridas`);

    // Insert recommendations
    console.log('💡 Inserindo recomendações...');
    for (const rec of recommendationsData) {
      await db.insert(knifeRecommendations).values(rec);
    }
    console.log(`✅ ${recommendationsData.length} recomendações inseridas`);

    console.log('🎉 Seed de facas concluído com sucesso!');
  } catch (error) {
    console.error('❌ Erro ao fazer seed de facas:', error);
    throw error;
  }
}

// Execute seed
seedKnives().then(() => {
  console.log('✨ Processo finalizado');
  process.exit(0);
}).catch(error => {
  console.error('💥 Erro fatal:', error);
  process.exit(1);
});
