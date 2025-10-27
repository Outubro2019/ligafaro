# 🏗️ Arquitetura Técnica - LigaFaro

Documentação detalhada da arquitetura técnica do projeto LigaFaro.

## 📋 Índice

- [Visão Geral da Arquitetura](#visão-geral-da-arquitetura)
- [Componentes Principais](#componentes-principais)
- [Fluxo de Dados](#fluxo-de-dados)
- [Stack Tecnológico](#stack-tecnológico)
- [Diagrama de Deployment](#diagrama-de-deployment)
- [Segurança](#segurança)
- [Performance](#performance)
- [Escalabilidade](#escalabilidade)

---

## 🎯 Visão Geral da Arquitetura

LigaFaro segue uma arquitetura **moderna e escalável** baseada em:

- **Frontend:** Single Page Application (SPA) com React 18
- **Backend:** API REST com Node.js/Express
- **Banco de Dados:** JSON estático + Firebase Realtime DB
- **Autenticação:** Firebase Authentication
- **Deployment:** Netlify (frontend + serverless)
- **CDN:** Netlify Edge Functions

```
┌─────────────────────────────────────────────────────────┐
│                    User Browser                          │
│              (React SPA + TypeScript)                    │
└────────────────┬────────────────────────────────────────┘
                 │ HTTP/REST
┌────────────────▼────────────────────────────────────────┐
│              Netlify CDN/Edge Functions                  │
│          (Cache, Rate Limiting, Compression)            │
└────────────────┬────────────────────────────────────────┘
                 │
┌────────────────▼────────────────────────────────────────┐
│           Express Backend API (Node.js)                  │
│  (Routes, Middleware, Business Logic, Validations)     │
└────────┬──────────────────┬─────────────┬───────────────┘
         │                  │             │
    ┌────▼──┐         ┌─────▼──┐    ┌───▼────────┐
    │Firebase│        │Python   │    │ External   │
    │Realtime│        │Scripts  │    │ APIs       │
    │Database│        │(Backend)│    │(GNews,etc) │
    └────┬───┘        └────┬────┘    └────┬───────┘
         │                 │              │
    ┌────▼─────────────────▼──────────────▼────┐
    │        Static Data (JSON files)           │
    │  (events, news, entities, coordinates)   │
    └──────────────────────────────────────────┘
```

---

## 🔧 Componentes Principais

### 1. Frontend (React + TypeScript)

**Localização:** `/src`

**Estrutura:**
```
src/
├── components/          # Componentes reutilizáveis
│   ├── ui/             # Shadcn UI components (51+)
│   ├── dashboard/      # Dashboard components
│   ├── auth/           # Autenticação
│   ├── events/         # Eventos
│   └── Layout.tsx      # Layout principal
├── pages/              # Page components (13)
├── services/           # API calls & business logic
├── hooks/              # Custom hooks
├── contexts/           # React Context API
├── types/              # TypeScript interfaces
└── utils/              # Utility functions
```

**Key Features:**
- React 18 com Hooks
- TypeScript tipagem completa
- TanStack React Query para data fetching
- React Router DOM para SPA routing
- Tailwind CSS para styling
- Shadcn UI para componentes polidos

### 2. Backend (Express + Node.js)

**Localização:** `/backend`

**Arquivos Principais:**
- `server.js` - Express server (porta 3000)
- `netlify.js` - Netlify dev config
- `netlify.functions.js` - Serverless functions

**Rotas Principais:**
```javascript
POST   /api/chat              # Chatbot
GET    /api/events           # Eventos
GET    /api/news             # Notícias
GET    /api/associations     # Associações
POST   /api/auth/register    # Registro
POST   /api/auth/login       # Login
```

**Middleware:**
- CORS
- Body parser (JSON)
- Rate limiting
- Error handling
- Logging (Winston)

### 3. Autenticação (Firebase)

**Integração:**
- Firebase Authentication
- Google OAuth 2.0
- Email/Password authentication
- JWT tokens

**Context:** `AuthContext.tsx`

**Guard:**
```typescript
<ProtectedRoute>
  <AdminPanel />
</ProtectedRoute>
```

### 4. Data Layer

**Dados Estáticos (JSON):**
- `events_data.json` - ~500 eventos
- `noticias_faro.json` - Notícias agregadas
- `entidades_faro.json` - ~90 organizações
- `moradas_com_coordenadas.json` - ~500 endereços

**Banco de Dados em Tempo Real:**
- Firebase Realtime Database
- Discussões do fórum
- Mensagens do chat
- Perfis de usuários

**Cache:**
- TanStack React Query (frontend)
- Redis (backend, futuro)

### 5. Scripts Python

**Localização:** `/scripts`

**Principais Scripts:**
- `gerar_noticias_json.py` - Scraping de notícias
- `noticias_faro.py` - Processamento de notícias
- `fix_json.py` - Validação JSON
- `update_coordinates.js` - Geocoding
- `chatbot.py` - IA chatbot

---

## 📊 Fluxo de Dados

### Fluxo de Notícias

```
External APIs (GNews, NewsAPI)
         │
         ▼
Python Scripts (gerar_noticias_json.py)
         │
         ▼
JSON Processing (fix_json.py)
         │
         ▼
Static File (noticias_faro.json)
         │
         ▼
Express Backend (/api/news)
         │
         ▼
React Frontend (News Page)
         │
         ▼
User Browser
```

### Fluxo de Autenticação

```
User Input (Login Form)
         │
         ▼
React Component (LoginForm.tsx)
         │
         ▼
Firebase Authentication
         │
         ▼
JWT Token Generated
         │
         ▼
AuthContext Updated
         │
         ▼
Protected Routes Unlocked
```

### Fluxo de Eventos

```
CSV/APIs Sources
         │
         ▼
Event Scraper (fetch_events.py)
         │
         ▼
Database (Firebase)
         │
         ▼
Express API (/api/events)
         │
         ▼
React Query (useEvents Hook)
         │
         ▼
Events Component
         │
         ▼
User Interface
```

---

## 🛠️ Stack Tecnológico

### Frontend Stack

| Camada | Tecnologia | Versão | Uso |
|--------|-----------|--------|-----|
| Runtime | Node.js | 18+ | Desenvolvimento |
| Framework | React | 18.3 | UI |
| Language | TypeScript | 5.6 | Tipagem |
| Build | Vite | 6.2 | Build tool |
| Styling | Tailwind CSS | 3.4 | CSS utilities |
| UI Library | Shadcn UI | Latest | Componentes |
| Routing | React Router | 6.26 | SPA routing |
| State | TanStack Query | 5.56 | Data fetching |
| Forms | React Hook Form | 7.53 | Form management |
| Icons | Lucide React | 0.462 | Icons |
| Maps | Leaflet | 1.9.4 | Mapas |
| Charts | Recharts | 2.12 | Gráficos |
| Notifications | Sonner | 1.5 | Toast notifications |

### Backend Stack

| Camada | Tecnologia | Versão | Uso |
|--------|-----------|--------|-----|
| Runtime | Node.js | 18+ | Backend |
| Framework | Express | 4.21 | Web framework |
| Language | JavaScript | ES2020+ | Backend code |
| Auth | Firebase | 11.5 | Autenticação |
| Scripting | Python | 3.8+ | Data processing |
| Server | Netlify | - | Deployment |

### Data & APIs

| Serviço | Uso | Documentação |
|---------|-----|--------------|
| GNews | Notícias | https://gnews.io |
| NewsAPI | Notícias alternativas | https://newsapi.org |
| Firebase Realtime DB | Real-time data | https://firebase.google.com |
| Google Maps | Geocoding | https://developers.google.com/maps |
| Open Meteo | Clima | https://open-meteo.com |
| OpenAI | Chatbot IA | https://openai.com/api |

---

## 🚀 Diagrama de Deployment

### Development Environment

```
Local Machine
    ├── npm run dev (Vite @ :5173)
    ├── node backend/server.js (Express @ :3000)
    ├── Python scripts (local)
    └── .env (local config)
```

### Production Environment (Netlify)

```
GitHub (Source)
    │
    ▼
Netlify (Deployment)
    ├── Build: npm run build
    ├── Publish: dist/
    ├── Functions: /functions
    ├── Redirects: _redirects
    └── Environment: Netlify UI
        │
        ▼
    Edge Functions (Caching, routing)
        │
        ▼
    CDN (Global distribution)
        │
        ▼
    Static Assets (dist/)
        │
        ▼
    Serverless Functions
        │
        ▼
    External APIs
```

### Architecture Diagram

```
                      ┌──────────────────┐
                      │  GitHub (Repo)   │
                      └────────┬─────────┘
                               │
                        git push/pull
                               │
                      ┌────────▼─────────┐
                      │  GitHub Actions  │
                      │  (CI/CD Pipeline)│
                      └────────┬─────────┘
                               │
                    Test, build, deploy
                               │
              ┌────────────────▼────────────────┐
              │       Netlify Cloud             │
              │  ┌──────────────────────────┐   │
              │  │  Build & Deployment      │   │
              │  └──────────────────────────┘   │
              │  ┌──────────────────────────┐   │
              │  │  Edge Functions          │   │
              │  │  (Rate limit, cache)     │   │
              │  └──────────────────────────┘   │
              │  ┌──────────────────────────┐   │
              │  │  Serverless Functions    │   │
              │  └──────────────────────────┘   │
              └────────────────┬────────────────┘
                               │
            ┌──────────────────┼──────────────────┐
            │                  │                  │
     ┌──────▼──────┐   ┌──────▼──────┐   ┌──────▼──────┐
     │  Static CDN │   │   External   │   │   Firebase  │
     │  (dist/)    │   │   APIs       │   │   Services  │
     └─────────────┘   └──────────────┘   └─────────────┘
            │
            ▼
      ┌───────────────┐
      │  User Browser │
      │  (React SPA)  │
      └───────────────┘
```

---

## 🔐 Segurança

### Autenticação & Autorização

- **Method:** Firebase Authentication
- **OAuth:** Google Sign-In
- **Tokens:** JWT (Firebase managed)
- **Route Guards:** ProtectedRoute components

### Validação de Dados

- **Frontend:** React Hook Form + Zod
- **Backend:** Express middleware
- **API:** Type checking com TypeScript

### Headers de Segurança

```
X-Frame-Options: SAMEORIGIN
X-Content-Type-Options: nosniff
X-XSS-Protection: 1; mode=block
Strict-Transport-Security: max-age=31536000
Content-Security-Policy: default-src 'self'
```

### Proteção contra Ataques

- ✓ CSRF Protection (Firebase handles)
- ✓ SQL Injection (usando Firebase)
- ✓ XSS Protection (React escapes by default)
- ✓ Rate Limiting (Netlify + custom)
- ✓ CORS Configuration

### Dados Sensíveis

- Não commit: `.env`
- Variáveis: `VITE_` (frontend), `process.env` (backend)
- Secrets: Netlify UI para produção

---

## ⚡ Performance

### Code Splitting Strategy

```javascript
// vite.config.ts
{
  react: { chunk for: React, React DOM, Router }
  radix-ui: { all Radix components }
  firebase: { Firebase library }
  maps: { Leaflet + React Leaflet }
  charts: { Recharts }
  vendors: { other packages }
}
```

### Otimizações

- **Tree Shaking:** Remove unused code
- **Lazy Loading:** Code splitting por rota
- **Image Optimization:** WebP + lazy loading
- **Caching:** TanStack Query + Browser cache
- **CDN:** Netlify Edge caching
- **Compression:** Gzip/Brotli

### Métricas de Performance

- **LCP:** < 2.5s
- **FID:** < 100ms
- **CLS:** < 0.1
- **Build Size:** < 500KB (gzipped)

---

## 📈 Escalabilidade

### Horizontal Scaling

1. **Frontend:** CDN global (Netlify)
2. **Backend:** Serverless (Node functions)
3. **Database:** Firebase auto-scaling

### Database Optimization

- Indexing em Firebase
- Query optimization
- Data partitioning
- Archive old data

### Load Balancing

- Netlify distribui traffic
- Edge Functions para caching
- Serverless auto-scales

---

## 🔄 CI/CD Pipeline

### GitHub Actions (Futuro)

```yaml
on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - run: npm install
      - run: npm run lint
      - run: npm run test
      - run: npm run build
```

### Deployment Flow

```
Code Push → GitHub
    │
    ├→ GitHub Actions
    │  ├─ Lint
    │  ├─ Test
    │  └─ Build
    │
    └→ Netlify Deploy
       ├─ Preview (PRs)
       └─ Production (main)
```

---

## 🐛 Monitoring & Logging

### Logging

- Frontend: Browser console
- Backend: Winston logger
- Error tracking: Sentry (recommended)

### Monitoring

- Uptime: Netlify status
- Performance: Netlify analytics
- Errors: Sentry dashboard
- User analytics: Google Analytics

---

## 📚 Referências Arquiteturais

- [React Architecture Patterns](https://react.dev/learn)
- [Express Best Practices](https://expressjs.com/en/advanced/best-practice-performance.html)
- [Netlify Documentation](https://docs.netlify.com/)
- [Firebase Architecture](https://firebase.google.com/docs)

---

**Desenvolvido com ❤️ para a comunidade de Faro**

*Última atualização: 27 de Outubro de 2025*
