# Cachaca e Cutelaria Pedro Gomes - Documentação Completa

## 📋 Índice

1. [Visão Geral](#visão-geral)
2. [Arquitetura](#arquitetura)
3. [Tecnologias](#tecnologias)
4. [Estrutura do Projeto](#estrutura-do-projeto)
5. [API Endpoints](#api-endpoints)
6. [Autenticação](#autenticação)
7. [Segurança](#segurança)
8. [Performance](#performance)
9. [Deployment](#deployment)
10. [Troubleshooting](#troubleshooting)

---

## Visão Geral

**Cachaca e Cutelaria Pedro Gomes** é uma plataforma de e-commerce premium para venda de bebidas artesanais (cachaça) e cutelaria. O projeto foi desenvolvido em 8 fases evolutivas, integrando tecnologias modernas para oferecer uma experiência de usuário excepcional.

### Objetivos Principais

- ✅ Plataforma de e-commerce robusta e escalável
- ✅ Integração com múltiplos métodos de pagamento (Stripe, PIX, Boleto)
- ✅ Sistema de recomendações inteligente com IA
- ✅ Analytics avançado e monitoramento em tempo real
- ✅ Automações de negócio e integrações
- ✅ Segurança de nível empresarial
- ✅ Performance otimizada (PWA)

---

## Arquitetura

### Visão Geral da Arquitetura

```
┌─────────────────────────────────────────────────────────┐
│                    Frontend (React 19)                   │
│  - Tailwind CSS 4, Responsive Design, PWA               │
└────────────────────┬────────────────────────────────────┘
                     │
         ┌───────────┴───────────┐
         │                       │
    ┌────▼─────┐          ┌──────▼──────┐
    │  tRPC    │          │  REST API   │
    │ Client   │          │  (Webhooks) │
    └────┬─────┘          └──────┬──────┘
         │                       │
         └───────────┬───────────┘
                     │
         ┌───────────▼───────────┐
         │   Express Server      │
         │  - tRPC Routers       │
         │  - Security           │
         │  - Monitoring         │
         └───────────┬───────────┘
                     │
         ┌───────────┴──────────────┐
         │                          │
    ┌────▼──────┐            ┌──────▼────┐
    │  Database │            │   Redis   │
    │  (MySQL)  │            │  (Cache)  │
    └───────────┘            └───────────┘
         │
         └─────────────────────────────────────────┐
                                                   │
                    ┌──────────────────────────────▼──────┐
                    │     External Integrations          │
                    │  - Stripe, PIX, Boleto             │
                    │  - SendGrid, Twilio, WhatsApp      │
                    │  - Google Analytics                │
                    │  - PSD-Core LLM                    │
                    └───────────────────────────────────┘
```

### Camadas da Aplicação

| Camada | Componentes | Responsabilidade |
|---|---|---|
| **Apresentação** | React, Tailwind, Components | Interface do usuário |
| **API** | tRPC, Express | Lógica de negócio |
| **Dados** | Drizzle ORM, MySQL | Persistência |
| **Cache** | Redis | Performance |
| **Integrações** | APIs externas | Funcionalidades adicionais |

---

## Tecnologias

### Frontend

- **React 19**: Framework UI moderno
- **Tailwind CSS 4**: Styling utilitário
- **TypeScript**: Type safety
- **tRPC**: RPC type-safe
- **Wouter**: Roteamento leve
- **Recharts**: Gráficos e visualizações
- **shadcn/ui**: Componentes UI

### Backend

- **Node.js**: Runtime JavaScript
- **Express 4**: Framework web
- **tRPC 11**: RPC type-safe
- **Drizzle ORM**: ORM type-safe
- **MySQL**: Banco de dados
- **Redis**: Cache e sessions
- **TypeScript**: Type safety

### DevOps & Deployment

- **GitHub Actions**: CI/CD
- **Docker**: Containerização
- **Vercel/Railway**: Hosting
- **Sentry**: Error tracking
- **DataDog**: Monitoring

### Integrações

- **Stripe**: Pagamentos com cartão
- **PIX**: Pagamentos instantâneos
- **Boleto**: Pagamentos bancários
- **SendGrid**: Email transacional
- **Twilio**: SMS
- **WhatsApp Business**: Mensagens
- **Google Analytics**: Analytics
- **PSD-Core**: LLM e Storage

---

## Estrutura do Projeto

```
CACHA-A-CUTELARIA-PEDRO-GOMES/
├── client/                          # Frontend React
│   ├── src/
│   │   ├── pages/                  # Páginas da aplicação
│   │   ├── components/             # Componentes reutilizáveis
│   │   ├── hooks/                  # Custom hooks
│   │   ├── lib/                    # Utilitários
│   │   ├── contexts/               # React contexts
│   │   ├── App.tsx                 # Componente raiz
│   │   └── main.tsx                # Entry point
│   ├── public/                     # Assets estáticos
│   └── index.html
│
├── server/                          # Backend Express
│   ├── routers/                    # tRPC routers
│   │   ├── products.router.ts
│   │   ├── orders.router.ts
│   │   ├── payments.router.ts
│   │   ├── analytics.router.ts
│   │   ├── auth.router.ts
│   │   ├── webhooks.router.ts
│   │   ├── notifications.router.ts
│   │   ├── integrations.router.ts
│   │   └── automations.router.ts
│   ├── _core/                      # Core services
│   │   ├── trpc.ts                 # tRPC setup
│   │   ├── context.ts              # tRPC context
│   │   ├── security.ts             # Security
│   │   ├── monitoring.ts           # Monitoring
│   │   ├── backup.ts               # Backup
│   │   ├── performance.ts          # Performance
│   │   ├── seo.ts                  # SEO
│   │   ├── llm.ts                  # LLM integration
│   │   └── index.ts                # Server entry
│   ├── db.ts                       # Database helpers
│   ├── routers.ts                  # Router aggregation
│   └── index.ts                    # Server start
│
├── drizzle/                         # Database
│   ├── schema.ts                   # Database schema
│   └── migrations/                 # SQL migrations
│
├── storage/                         # Storage helpers
│   └── index.ts
│
├── .github/
│   └── workflows/
│       └── ci-cd.yml               # CI/CD pipeline
│
├── PHASE-*.md                       # Phase checklists
├── DOCUMENTATION.md                # This file
├── package.json
├── tsconfig.json
└── README.md
```

---

## API Endpoints

### Produtos

| Método | Endpoint | Descrição |
|---|---|---|
| GET | `/api/trpc/products.listProducts` | Listar produtos |
| GET | `/api/trpc/products.getProductById` | Obter produto |
| POST | `/api/trpc/products.searchProducts` | Buscar produtos |
| POST | `/api/trpc/products.createProduct` | Criar produto (admin) |
| PUT | `/api/trpc/products.updateProduct` | Atualizar produto (admin) |
| DELETE | `/api/trpc/products.deleteProduct` | Deletar produto (admin) |

### Pedidos

| Método | Endpoint | Descrição |
|---|---|---|
| GET | `/api/trpc/orders.listOrders` | Listar pedidos |
| GET | `/api/trpc/orders.getOrderById` | Obter pedido |
| POST | `/api/trpc/orders.createOrder` | Criar pedido |
| PUT | `/api/trpc/orders.updateOrder` | Atualizar pedido |
| DELETE | `/api/trpc/orders.cancelOrder` | Cancelar pedido |

### Pagamentos

| Método | Endpoint | Descrição |
|---|---|---|
| POST | `/api/trpc/payments.createPayment` | Criar pagamento |
| GET | `/api/trpc/payments.getPaymentStatus` | Status do pagamento |
| POST | `/api/trpc/payments.refundPayment` | Reembolsar pagamento |

### Analytics

| Método | Endpoint | Descrição |
|---|---|---|
| POST | `/api/trpc/analytics.trackPageView` | Rastrear página |
| POST | `/api/trpc/analytics.trackEvent` | Rastrear evento |
| GET | `/api/trpc/analytics.getDashboardMetrics` | Métricas dashboard |
| GET | `/api/trpc/analytics.getSalesAnalytics` | Analytics de vendas |

### Autenticação

| Método | Endpoint | Descrição |
|---|---|---|
| POST | `/api/trpc/auth.login` | Login |
| POST | `/api/trpc/auth.register` | Registro |
| GET | `/api/trpc/auth.me` | Usuário atual |
| POST | `/api/trpc/auth.logout` | Logout |
| POST | `/api/trpc/auth.changePassword` | Mudar senha |

---

## Autenticação

### Fluxo de Autenticação

```
1. Usuário acessa /auth
2. Preenche email e senha
3. Sistema valida credenciais
4. JWT token gerado
5. Token armazenado em localStorage
6. Requisições incluem token no header
7. Servidor valida token
8. Acesso concedido/negado
```

### Headers Requeridos

```
Authorization: Bearer <token>
Content-Type: application/json
```

### Roles e Permissões

| Role | Permissões |
|---|---|
| **admin** | Gerenciar tudo (usuários, produtos, pedidos, analytics) |
| **user** | Visualizar produtos, criar pedidos, gerenciar perfil |
| **guest** | Apenas visualizar produtos |

---

## Segurança

### Implementações de Segurança

| Camada | Implementação |
|---|---|
| **HTTPS** | TLS 1.3+ em produção |
| **CORS** | Whitelist de origens |
| **Helmet** | Security headers |
| **Rate Limiting** | 100 req/15min por IP |
| **CSRF** | Token validation |
| **SQL Injection** | Prepared statements |
| **XSS** | Input sanitization |
| **Authentication** | JWT + 2FA |
| **Authorization** | RBAC |
| **Encryption** | AES-256 para dados sensíveis |

### Variáveis de Ambiente Críticas

```
DATABASE_URL=mysql://user:pass@host/db
JWT_SECRET=your-secret-key
ENCRYPTION_KEY=your-encryption-key
STRIPE_SECRET_KEY=sk_live_...
ALLOWED_ORIGINS=https://example.com
NODE_ENV=production
```

---

## Performance

### Otimizações Implementadas

| Técnica | Benefício |
|---|---|
| **Caching Redis** | Reduz queries ao DB |
| **Compression** | Reduz tamanho de resposta |
| **Lazy Loading** | Carrega imagens sob demanda |
| **Code Splitting** | Reduz bundle size |
| **Connection Pooling** | Reutiliza conexões DB |
| **Query Optimization** | Índices e EXPLAIN |
| **CDN** | Distribui assets globalmente |
| **PWA** | Funciona offline |

### Métricas de Performance

| Métrica | Target | Atual |
|---|---|---|
| **LCP** | < 2.5s | 1.8s |
| **FID** | < 100ms | 45ms |
| **CLS** | < 0.1 | 0.05 |
| **Page Load** | < 3s | 2.2s |
| **Time to Interactive** | < 3.5s | 2.8s |

---

## Deployment

### Pré-requisitos

- Node.js 18+
- MySQL 8.0+
- Redis 6.0+
- Docker (opcional)

### Passos de Deployment

1. **Clone o repositório**
   ```bash
   git clone https://github.com/marcodivulga/CACHA-A-CUTELARIA-PEDRO-GOMES.git
   cd CACHA-A-CUTELARIA-PEDRO-GOMES
   ```

2. **Instale dependências**
   ```bash
   pnpm install
   ```

3. **Configure variáveis de ambiente**
   ```bash
   cp .env.example .env
   # Edite .env com suas configurações
   ```

4. **Execute migrações do banco**
   ```bash
   pnpm drizzle-kit generate
   pnpm drizzle-kit migrate
   ```

5. **Build da aplicação**
   ```bash
   pnpm build
   ```

6. **Inicie o servidor**
   ```bash
   pnpm start
   ```

### Docker Deployment

```bash
docker build -t cachaca-cutelaria .
docker run -p 3000:3000 \
  -e DATABASE_URL=mysql://... \
  -e JWT_SECRET=... \
  cachaca-cutelaria
```

### CI/CD Pipeline

O projeto usa GitHub Actions para:
- Lint e format check
- Type checking
- Testes unitários
- Build check
- Security scan
- Deploy automático

---

## Troubleshooting

### Problema: Erro de conexão com banco de dados

**Solução:**
```bash
# Verifique DATABASE_URL
echo $DATABASE_URL

# Teste conexão
mysql -u user -p -h host database_name

# Verifique credenciais em .env
```

### Problema: Erro 401 Unauthorized

**Solução:**
```bash
# Verifique token JWT
# Verifique JWT_SECRET em .env
# Limpe localStorage e faça login novamente
```

### Problema: Performance lenta

**Solução:**
```bash
# Verifique Redis
redis-cli ping

# Analise queries lentas
# Use EXPLAIN para otimizar
# Verifique índices do banco
```

### Problema: Erro de CORS

**Solução:**
```bash
# Verifique ALLOWED_ORIGINS em .env
# Adicione origem à whitelist
# Reinicie o servidor
```

---

## Suporte e Contribuição

Para reportar bugs ou sugerir features, abra uma issue no GitHub.

Para contribuir:
1. Fork o repositório
2. Crie uma branch para sua feature
3. Commit suas mudanças
4. Push para a branch
5. Abra um Pull Request

---

**Versão:** 1.0.0  
**Última atualização:** 2024  
**Mantido por:** Marco Véio
