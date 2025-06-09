import { API_URL as ENV_API_URL } from '@env';
import Constants from 'expo-constants';

// Obtém a URL da API do arquivo .env ou do app.config.js
export const API_URL = ENV_API_URL || Constants.expoConfig?.extra?.apiUrl || 'http://192.168.0.25:3333';

// Função para construir URLs completas
export const getFullUrl = (path: string) => {
  // Remove barras iniciais duplicadas
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `${API_URL}${cleanPath}`;
};

// Função para construir URLs de imagens
export const getImageUrl = (imageUrl: string) => {
  if (imageUrl.startsWith('http')) {
    return imageUrl;
  }
  return getFullUrl(imageUrl);
};