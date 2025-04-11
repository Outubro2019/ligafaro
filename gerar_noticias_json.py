from gnews import GNews
import json
import locale
from email.utils import parsedate_tz, mktime_tz
from datetime import datetime
import sys
import os
import traceback
import logging

# Configurar logging
logging.basicConfig(filename='news_generation.log', level=logging.INFO,
                    format='%(asctime)s - %(levelname)s - %(message)s')

# Configurar o local para português de Portugal
try:
    locale.setlocale(locale.LC_TIME, 'pt_PT.UTF-8')
except:
    try:
        locale.setlocale(locale.LC_TIME, 'Portuguese_Portugal.1252')
    except:
        logging.warning("Não foi possível configurar o locale para português")
        pass  # Fallback para o locale padrão se não encontrar português

# Função para converter a data para objeto datetime
def converter_data(data_pub):
    if data_pub:
        try:
            data_parsed = parsedate_tz(data_pub)
            if data_parsed:
                return datetime.fromtimestamp(mktime_tz(data_parsed))
        except Exception as e:
            logging.error(f"Erro ao processar data: {e}")
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

# Função para criar notícias padrão quando não há resultados
def criar_noticias_padrao():
    logging.warning("Criando notícias padrão devido à falta de resultados")
    return [
        {
            'title': 'Bem-vindo ao Portal de Notícias de Faro',
            'description': 'Estamos trabalhando para trazer as últimas notícias sobre Faro e Farense.',
            'url': 'https://ligafaro.netlify.app',
            'image': None,
            'published date': datetime.now().strftime('%a, %d %b %Y %H:%M:%S %z'),
            'publisher': {'title': 'Liga Faro'},
            'origem_busca': 'Sistema'
        }
    ]

def main():
    import signal
    import sys

    def timeout_handler(signum, frame):
        logging.error('Tempo limite excedido ao buscar notícias')
        print('Tempo limite excedido ao buscar notícias', file=sys.stderr)
        sys.exit(1)

    try:
        # Definir um timeout de 30 segundos para a busca de notícias
        signal.signal(signal.SIGALRM, timeout_handler)
        signal.alarm(30)
        
        logging.info("Iniciando busca de notícias")
        print("Buscando notícias sobre Faro e Farense...")
        
        # Inicializa o cliente do Google News
        google_news = GNews(language='pt', country='PT', max_results=10)
        
        # Busca notícias sobre Faro e Farense separadamente
        try:
            noticias_faro = google_news.get_news('Faro Algarve')
            noticias_farense = google_news.get_news('Farense')
            logging.info(f"Notícias de Faro: {len(noticias_faro)}, Notícias do Farense: {len(noticias_farense)}")
        except Exception as e:
            logging.warning(f"Falha ao buscar notícias: {e}")
            noticias_faro = []
            noticias_farense = []
        
        # Combinar os resultados e remover duplicatas
        todas_noticias = noticias_faro + noticias_farense
        
        # Se não houver notícias, criar notícias padrão
        if not todas_noticias:
            todas_noticias = criar_noticias_padrao()
            
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
        
        # Converter para o formato esperado pela página HTML
        noticias_formatadas = []
        for noticia in noticias_unicas:
            data_pub = noticia.get('published date', '')
            
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
        
        # Salvar as notícias em um arquivo JSON
        with open('noticias_faro.json', 'w', encoding='utf-8') as f:
            json.dump(noticias_formatadas, f, ensure_ascii=False, indent=2)
        
        logging.info(f"Arquivo JSON gerado com {len(noticias_formatadas)} notícias.")
        print(f"Arquivo JSON gerado com {len(noticias_formatadas)} notícias.")
        
        # Desativar o alarme após a conclusão bem-sucedida
        signal.alarm(0)

    except Exception as e:
        logging.error(f"Erro na geração de notícias: {e}")
        logging.error(traceback.format_exc())
        print(f"Erro na geração de notícias: {e}", file=sys.stderr)
        sys.exit(1)

if __name__ == "__main__":
    main()