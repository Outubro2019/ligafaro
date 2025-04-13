// Serviço para geocodificar endereços (converter endereços em coordenadas)
export interface GeocodingResult {
  lat: number;
  lng: number;
  display_name: string;
}

// Função para geocodificar um endereço usando a API Nominatim do OpenStreetMap
export async function geocodeAddress(address: string): Promise<GeocodingResult | null> {
  try {
    // Formatar o endereço para a URL
    const formattedAddress = encodeURIComponent(`${address}, Faro, Portugal`);
    
    // Fazer a requisição para a API Nominatim
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${formattedAddress}&limit=1`,
      {
        headers: {
          'User-Agent': 'LigaFaro/1.0'
        }
      }
    );
    
    if (!response.ok) {
      throw new Error(`Erro na geocodificação: ${response.statusText}`);
    }
    
    const data = await response.json();
    
    // Verificar se encontrou algum resultado
    if (data && data.length > 0) {
      return {
        lat: parseFloat(data[0].lat),
        lng: parseFloat(data[0].lon),
        display_name: data[0].display_name
      };
    }
    
    return null;
  } catch (error) {
    console.error('Erro ao geocodificar endereço:', error);
    return null;
  }
}

// Cache para armazenar resultados de geocodificação e evitar requisições repetidas
const geocodeCache: Record<string, GeocodingResult> = {};

// Função para geocodificar com cache
export async function geocodeWithCache(address: string): Promise<GeocodingResult | null> {
  // Se o endereço já estiver no cache, retornar o resultado armazenado
  if (geocodeCache[address]) {
    return geocodeCache[address];
  }
  
  // Caso contrário, fazer a requisição e armazenar no cache
  const result = await geocodeAddress(address);
  
  if (result) {
    geocodeCache[address] = result;
  }
  
  return result;
}