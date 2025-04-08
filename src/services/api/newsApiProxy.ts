
// Serviço de API do NewsAPI através de proxy

import { NewsItem, NewsResponse } from '../types/newsTypes';
import { NEWS_API, LOCAL_NEWS_DOMAINS, NATIONAL_NEWS_DOMAINS } from '../config/newsApiConfig';

export const fetchLocalNewsViaProxy = async (pageSize: number): Promise<NewsItem[]> => {
  try {
    console.log('Trying NewsAPI with local sources through proxy...');
    const domains = LOCAL_NEWS_DOMAINS.join(',');
    
    const localSourcesProxyUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(
      `${NEWS_API.baseUrl}/everything?q=Faro Algarve&pageSize=${pageSize}&language=pt&domains=${domains}&sortBy=publishedAt&apiKey=${NEWS_API.apiKey}`
    )}`;
    
    const localProxyResponse = await fetch(localSourcesProxyUrl);
    
    if (localProxyResponse.ok) {
      const localData: NewsResponse = await localProxyResponse.json();
      if (localData.articles && localData.articles.length > 0) {
        console.log('Successfully fetched data from local sources via NewsAPI proxy');
        return localData.articles;
      }
    }
    return [];
  } catch (error) {
    console.error('Error with local sources NewsAPI proxy:', error);
    return [];
  }
};

export const fetchNationalNewsViaProxy = async (pageSize: number): Promise<NewsItem[]> => {
  try {
    console.log('Trying NewsAPI with national sources through proxy...');
    const domains = NATIONAL_NEWS_DOMAINS.join(',');
    
    const nationalSourcesProxyUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(
      `${NEWS_API.baseUrl}/everything?q=Faro Algarve&pageSize=${pageSize}&language=pt&domains=${domains}&sortBy=publishedAt&apiKey=${NEWS_API.apiKey}`
    )}`;
    
    const nationalProxyResponse = await fetch(nationalSourcesProxyUrl);
    
    if (nationalProxyResponse.ok) {
      const nationalData: NewsResponse = await nationalProxyResponse.json();
      if (nationalData.articles && nationalData.articles.length > 0) {
        console.log('Successfully fetched data from national sources via NewsAPI proxy');
        return nationalData.articles;
      }
    }
    return [];
  } catch (error) {
    console.error('Error with national sources NewsAPI proxy:', error);
    return [];
  }
};
