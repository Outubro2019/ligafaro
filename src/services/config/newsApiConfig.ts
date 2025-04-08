
// Configurações das APIs de notícias

import { NewsApiConfig } from '../types/newsTypes';

// Original NewsAPI key (não funciona com requisições do navegador devido ao CORS)
export const NEWS_API: NewsApiConfig = {
  baseUrl: 'https://newsapi.org/v2',
  apiKey: '4de1a201587246909d7b1820b6b70bdf'
};

// API GNews (funciona com requisições do navegador)
export const GNEWS_API: NewsApiConfig = {
  baseUrl: 'https://gnews.io/api/v4',
  // Chave API atualizada
  apiKey: '9f53f0ddb6a62ab4fcb59db531c24618'
};


// Domínios de fontes locais de notícias
export const LOCAL_NEWS_DOMAINS = [
  'postal.pt',
  'sulinformacao.pt',
  'regiaosul.pt',
  'barlavento.pt',
  'jornaldoalgarve.pt'
];

// Domínios de fontes nacionais de notícias
export const NATIONAL_NEWS_DOMAINS = [
  'publico.pt',
  'expresso.pt',
  'sapo.pt',
  'jn.pt',
  'dn.pt',
  'observador.pt',
  'rtp.pt',
  'sicnoticias.pt',
  'tsf.pt'
];
