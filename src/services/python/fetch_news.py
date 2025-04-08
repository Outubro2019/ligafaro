from gnews import GNews
import json
import locale
from email.utils import parsedate_tz, mktime_tz
from datetime import datetime
import sys

# Configurar o local para português de Portugal
try:
    locale.setlocale(locale.LC_TIME, 'pt_PT.UTF-8')
except:
    try:
        locale.setlocale(locale.LC_TIME, 'Portuguese_Portugal.1252')
    except:
        pass  # Fallback para o locale padrão se não encontrar português

# Função para converter a data para objeto datetime
def converter_data(data_pub):
    if data_pub:
        try:
            data_parsed = parsedate_tz(data_pub)
            if data_parsed:
                return datetime.fromtimestamp(mktime_tz(data_parsed))
        except Exception as e:
            print(f"Erro ao processar data: {e}", file=sys.stderr)
    return None

# Função para remover duplicatas baseado na URL
def remover_duplicatas(lista_noticias):
    urls_vistas = set()
    noticias_unicas = []
    
    for noticia in lista_noticias:
        url = noticia.get('url', '')
        if url and url not in urls_vistas:
            urls_vistas.add(url)
            noticias_unicas.append(noticia)
    
    return noticias_unicas

def main():
    # Inicializa o cliente do Google News
    google_news = GNews(language='pt', country='PT', max_results=10)
    
    # Busca notícias sobre Faro e Farense separadamente
    noticias_faro = google_news.get_news('Faro Algarve')
    noticias_farense = google_news.get_news('Farense')
    
    # Combinar os resultados e remover duplicatas
    todas_noticias = noticias_faro + noticias_farense
    noticias_unicas = remover_duplicatas(todas_noticias)
    
    # Ordenar as notícias pela data de publicação (mais recente no topo)
    noticias_unicas.sort(key=lambda x: converter_data(x.get('published date', '')), reverse=True)
    
    # Adicionar a origem da pesquisa (Faro ou Farense)
    for noticia in noticias_unicas:
        titulo_lower = noticia.get('title', '').lower()
        descricao_lower = noticia.get('description', '').lower()
        
        if 'faro' in titulo_lower or 'faro' in descricao_lower:
            noticia['origem_busca'] = 'Faro'
        elif 'farense' in titulo_lower or 'farense' in descricao_lower:
            noticia['origem_busca'] = 'Farense'
        else:
            noticia['origem_busca'] = 'Desconhecida'
    
    # Converter para o formato esperado pela aplicação
    noticias_formatadas = []
    for noticia in noticias_unicas:
        data_pub = noticia.get('published date', '')
        data_obj = converter_data(data_pub)
        
        publisher = noticia.get('publisher', {})
        
        noticias_formatadas.append({
            'source': {
                'id': None,
                'name': publisher.get('title', 'Desconhecida')
            },
            'author': publisher.get('title', 'Desconhecida'),
            'title': noticia.get('title', 'N/A').split(" -")[0],
            'description': noticia.get('description', 'Sem descrição disponível'),
            'url': noticia.get('url', ''),
            'urlToImage': noticia.get('image', None),
            'publishedAt': data_pub,
            'content': noticia.get('description', 'Sem conteúdo disponível'),
            'origem_busca': noticia.get('origem_busca', 'Desconhecida')
        })
    
    # Imprimir o número de notícias encontradas
    print(f"Total de notícias encontradas: {len(noticias_formatadas)}", file=sys.stderr)
    
    # Retornar como JSON no formato esperado pela aplicação
    result = {
        'status': 'ok',
        'totalResults': len(noticias_formatadas),
        'articles': noticias_formatadas
    }
    
    # Imprimir o JSON para o stdout (para ser capturado pelo Node.js)
    print(json.dumps(result))

if __name__ == "__main__":
    main()