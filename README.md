# 🏙️ LigaFaro - Plataforma Digital Comunitária de Faro

![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)
![Node.js Version](https://img.shields.io/badge/Node.js-18+-green)
![React Version](https://img.shields.io/badge/React-18.3-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.6-blue)

**LigaFaro** é uma plataforma digital comunitária inovadora que conecta residentes e visitantes de Faro, Portugal. Oferece ferramentas para fortalecer laços comunitários, compartilhar eventos locais, participar em discussões e promover empreendedorismo local.

![Logo LigaFaro](public/Logo_Liga_Faro.png)

## 📋 Índice

- [Visão Geral](#visão-geral)
- [Características Principais](#características-principais)
- [Stack Tecnológico](#stack-tecnológico)
- [Estrutura do Projeto](#estrutura-do-projeto)
- [Instalação](#instalação)
- [Uso](#uso)
- [Variáveis de Ambiente](#variáveis-de-ambiente)
- [Scripts Disponíveis](#scripts-disponíveis)
- [Arquitetura](#arquitetura)
- [Contribuição](#contribuição)
- [Suporte](#suporte)
- [Licença](#licença)

---

## 🎯 Visão Geral

LigaFaro é uma aplicação web **full-stack** construída com tecnologias modernas para criar uma comunidade digital vibrante em Faro. A plataforma integra notícias locais, calendário de eventos, fórum de discussão, marketplace local, oportunidades de voluntariado e um assistente virtual inteligente.

**Objetivo**: Fortalecer os laços comunitários, facilitar o acesso a informações da cidade e promover economia local.

---

## ✨ Características Principais

### 📊 Dashboard
- Visão geral de atividades comunitárias
- Eventos em destaque
- Notícias recentes
- Posts do fórum em destaque
- Itens do marketplace em destaque

### 📰 Notícias
- Agregação de notícias locais do Algarve
- Integração com GNews API e NewsAPI
- Caching inteligente de conteúdo
- Filtros por data e categoria

### 📅 Eventos
- Calendário de eventos locais
- Scraping de múltiplas fontes (CMF, ViralAgenda)
- Marcadores HOJE/AMANHÃ
- Abas para eventos em exibição e próximos

### 💬 Fórum
- Discussões comunitárias
- Posts com curtidas e respostas
- Gestão de tópicos

### 👥 Comunidade
- Perfis de membros
- Networking local
- Diretório de usuários

### 🏪 Marketplace
- Compra e venda de produtos/serviços
- Categorias de itens
- Sistema de avaliações

### 🤝 Voluntariado
- Oportunidades de contribuição
- Causas locais
- Gestão de participação

### 🤖 Chatbot IA
- Assistente virtual para perguntas sobre Faro
- Integração com backend Python
- Respostas contextualizadas

### 🗺️ Mapa
- Visualização geográfica de associações
- Clustering de marcadores
- Busca e filtros

### 🏢 Associações
- Diretório de organizações locais
- Informações de contacto
- Localização no mapa

---

## 🛠️ Stack Tecnológico

### Frontend
- **React 18.3** - Framework UI
- **TypeScript 5.6** - Tipagem estática
- **Vite 6.2** - Build tool otimizado
- **Tailwind CSS 3.4** - Styling utilitário
- **Shadcn UI** - Componentes reutilizáveis
- **React Router DOM 6.26** - Routing SPA
- **TanStack React Query 5.56** - State management e cache
- **React Hook Form 7.53** - Gestão de formulários
- **Leaflet & React Leaflet 4.2** - Mapas interativos
- **Recharts 2.12** - Gráficos
- **Sonner 1.5** - Notificações toast
- **Lucide React 0.462** - Ícones vetoriais
- **Next Themes 0.3** - Gestão de temas

### Backend
- **Node.js 18+** - Runtime JavaScript
- **Express 4.21** - Web framework
- **Firebase 11.5** - Autenticação e hospedagem
- **Python 3.8+** - Scripts de processamento

### Dados e APIs
- **JSON estático** - Events, News, Entities
- **GNews API** - Notícias
- **NewsAPI** - Notícias alternativas
- **Open Meteo** - Dados meteorológicos
- **Google Geocoding** - Geocodificação

### Deployment
- **Netlify** - Hospedagem e serverless
- **Netlify Functions** - APIs serverless
- **GitHub** - Controlo de versão

---

## 📁 Estrutura do Projeto

```
ligafaro/
├── src/
│   ├── components/
│   │   ├── ui/                    # Componentes Shadcn UI (51+)
│   │   ├── dashboard/             # Componentes do dashboard
│   │   ├── auth/                  # Autenticação
│   │   ├── events/                # Componentes de eventos
│   │   ├── Layout.tsx             # Layout principal
│   │   ├── UserMenu.tsx           # Menu de utilizador
│   │   ├── LeafletMap.tsx         # Mapa interativo
│   │   ├── AssociacoesMap.tsx     # Mapa de associações
│   │   └── ...
│   │
│   ├── pages/
│   │   ├── Dashboard.tsx          # Página principal
│   │   ├── News.tsx               # Notícias
│   │   ├── Events.tsx             # Eventos
│   │   ├── Forum.tsx              # Fórum
│   │   ├── Community.tsx          # Comunidade
│   │   ├── Marketplace.tsx        # Marketplace
│   │   ├── Associacoes.tsx        # Associações
│   │   ├── Volunteer.tsx          # Voluntariado
│   │   ├── Chatbot.tsx            # Chatbot IA
│   │   ├── Map.tsx                # Mapa
│   │   └── ...
│   │
│   ├── services/
│   │   ├── authService.ts         # Autenticação Firebase
│   │   ├── newsService.ts         # Notícias
│   │   ├── eventsService.ts       # Eventos
│   │   ├── geocodeService.ts      # Geocodificação
│   │   ├── api/                   # Integrações API
│   │   └── python/                # Scripts Python
│   │
│   ├── hooks/                      # Hooks customizados
│   ├── contexts/                   # React Context
│   ├── types/                      # TypeScript types
│   ├── data/                       # Dados estáticos
│   ├── utils/                      # Funções utilitárias
│   ├── lib/                        # Bibliotecas auxiliares
│   ├── App.tsx                    # Componente raiz
│   └── main.tsx                   # Ponto de entrada
│
├── public/
│   ├── index.html                 # HTML template
│   ├── events_data.json           # Dados de eventos
│   ├── noticias_faro.json         # Dados de notícias
│   ├── entidades_faro.json        # Entidades locais
│   ├── moradas_com_coordenadas.json
│   └── ...
│
├── scripts/
│   ├── gerir_dados.sh             # Gestão de dados
│   ├── update_coordinates.js      # Atualizar coordenadas
│   ├── verify_coordinates.js      # Verificar coordenadas
│   ├── fix_json.py                # Corrigir JSON
│   ├── fetch_events.py            # Obter eventos
│   └── ...
│
├── functions/                      # Netlify serverless
├── vite.config.ts                 # Configuração Vite
├── tsconfig.json                  # TypeScript config
├── tailwind.config.ts             # Tailwind config
├── netlify.toml                   # Netlify config
├── package.json                   # Dependências npm
├── server.js                      # Servidor Express
├── requirements.txt               # Dependências Python
└── README.md                      # Este ficheiro
```

### Arquitetura de Páginas

| Rota | Componente | Descrição |
|------|-----------|-----------|
| `/` | Dashboard | Página principal com visão geral |
| `/events` | Events | Calendário e lista de eventos |
| `/news` | News | Notícias agregadas |
| `/forum` | Forum | Discussões comunitárias |
| `/community` | Community | Perfis de membros |
| `/associacoes` | Associacoes | Diretório de organizações |
| `/marketplace` | Marketplace | Plataforma de compra/venda |
| `/volunteer` | Volunteer | Oportunidades de voluntariado |
| `/chatbot` | Chatbot | Assistente IA |
| `/map` | Map | Visualização geográfica |
| `/*` | NotFound | Página 404 |

---

## 🚀 Instalação

### Pré-requisitos
- **Node.js** 18+ e npm/yarn
- **Python** 3.8+ (para scripts backend)
- **Git**

### Passos de Instalação

1. **Clone o repositório**
   ```bash
   git clone https://github.com/Outubro2019/ligafaro.git
   cd ligafaro
   ```

2. **Instale dependências Node.js**
   ```bash
   npm install
   ```

3. **Instale dependências Python** (opcional, para scripts)
   ```bash
   pip install -r requirements.txt
   ```

4. **Configure variáveis de ambiente**
   ```bash
   cp .env.example .env
   # Edite .env com suas chaves API
   ```

5. **Inicie o servidor de desenvolvimento**
   ```bash
   npm run dev
   ```

A aplicação estará disponível em `http://localhost:5173`

---

## 📖 Uso

### Desenvolvimento

```bash
# Servidor de desenvolvimento (Vite + Express)
npm run dev

# Ou usando Netlify
npm run netlify:serve

# Iniciar apenas o servidor backend
node server.js

# Build para produção
npm run build

# Visualizar build de produção localmente
npm run preview
```

### Acesso Local

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:3000
- **Netlify Dev**: http://localhost:8888

---

## 🔐 Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto:

```env
# Firebase
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
VITE_FIREBASE_PROJECT_ID=your_firebase_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
VITE_FIREBASE_APP_ID=your_firebase_app_id

# APIs Externas
VITE_NEWS_API_KEY=your_newsapi_key
VITE_GNEWS_API_KEY=your_gnews_api_key
OPENAI_API_KEY=your_openai_api_key
WEATHER_API_KEY=your_weather_api_key

# Configurações da Aplicação
VITE_APP_URL=http://localhost:5173
VITE_API_URL=http://localhost:3000
```

> **Nota**: Variáveis com prefixo `VITE_` são acessíveis no frontend. Outras são exclusivamente backend.

---

## 📦 Scripts Disponíveis

### Desenvolvimento e Build

| Script | Descrição |
|--------|-----------|
| `npm run dev` | Inicia servidor Vite + Express |
| `npm run build` | Build otimizado para produção |
| `npm run preview` | Visualiza build localmente |
| `npm run netlify:serve` | Servidor Netlify completo |

### Gestão de Dados

| Script | Descrição |
|--------|-----------|
| `sh scripts/gerir_dados.sh` | Script de gestão de dados |
| `node scripts/update_coordinates.js` | Atualiza coordenadas |
| `node scripts/verify_coordinates.js` | Verifica coordenadas |
| `python scripts/fix_json.py` | Corrige erros JSON |
| `python scripts/fetch_events.py` | Obtém eventos |
| `python scripts/fetch_news.py` | Obtém notícias |

---

## 🏗️ Arquitetura

### Fluxo de Dados

```
┌─────────────────────────────────────────────────┐
│              React Frontend (Vite)              │
│  (Components, Pages, Hooks, Context, Queries)  │
└────────────────┬────────────────────────────────┘
                 │ HTTP/REST
┌────────────────▼────────────────────────────────┐
│          Express Backend (Node.js)              │
│  (Routes, Middleware, API Gateway)             │
└────────┬──────────────────┬─────────────┬───────┘
         │                  │             │
    ┌────▼──┐         ┌─────▼──┐    ┌───▼────┐
    │Firebase│        │Python   │    │External│
    │ Auth   │        │Scripts  │    │ APIs   │
    └────────┘        └─────────┘    └────────┘
```

### Code Splitting (Vite)

A aplicação utiliza estratégia de chunking otimizado:

- `react-vendor`: React, React DOM, React Router (~120KB)
- `radix-ui`: Componentes Radix UI (~80KB)
- `firebase`: Firebase library (~50KB)
- `maps`: Leaflet & React Leaflet (~90KB)
- `charts`: Recharts (~40KB)
- `vendors`: Outras dependências (~100KB)

### Autenticação

- **Provedor**: Firebase Authentication
- **Métodos**: Google OAuth + Email/Password
- **Context**: `AuthContext.tsx`
- **Proteção**: Route guards nas páginas

---

## 🔄 Fluxo de Desenvolvimento

1. **Criar feature branch**
   ```bash
   git checkout -b feature/minha-feature
   ```

2. **Desenvolver e testar**
   ```bash
   npm run dev
   ```

3. **Commit e push**
   ```bash
   git add .
   git commit -m "feat: descrição da feature"
   git push origin feature/minha-feature
   ```

4. **Pull request e merge**

---

## 🤝 Contribuição

Contribuições são bem-vindas! Para colaborar:

1. Fork o repositório
2. Crie uma branch para sua feature (`git checkout -b feature/MinhaFeature`)
3. Commit suas mudanças (`git commit -m 'Add MinhaFeature'`)
4. Push para a branch (`git push origin feature/MinhaFeature`)
5. Abra um Pull Request

### Padrões de Código

- **TypeScript**: Sempre tipado
- **Componentes**: Functional com hooks
- **Styling**: Tailwind + Shadcn UI
- **Nomes**: camelCase para variáveis/funções, PascalCase para componentes

---

## 📱 Responsividade

A aplicação é totalmente responsiva:
- **Desktop**: 1920px+
- **Tablet**: 768px - 1024px
- **Mobile**: 320px - 767px

---

## 🚀 Deploy

### Netlify (Recomendado)

1. **Conectar repositório**
   ```bash
   netlify link
   ```

2. **Deploy automático**
   - Merge em `main` = deploy automático
   - Preview deploy para PRs

---

## 🐛 Issues e Suporte

- **Issues**: [GitHub Issues](https://github.com/Outubro2019/ligafaro/issues)
- **Email**: [contacto@ligafaro.pt](mailto:contacto@ligafaro.pt)

---

## 📄 Licença

Este projeto está licenciado sob a Licença MIT - veja o arquivo [LICENSE](LICENSE) para detalhes.

---

**Desenvolvido com ❤️ para a comunidade de Faro**

*Última atualização: 27 de Outubro de 2025*
