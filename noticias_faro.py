from gnews import GNews
import json
import locale
from email.utils import parsedate_tz, mktime_tz
from datetime import datetime
import sys
import os

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

def formatar_data(data_obj):
    if data_obj:
        try:
            return data_obj.strftime('%A, %d de %B de %Y, %H:%M:%S')
        except:
            return str(data_obj)
    return "Data desconhecida"

def main():
    print("Buscando notícias sobre Faro e Farense...")
    
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
    
    # Exibe as notícias formatadas
    print(f"\nEncontradas {len(noticias_unicas)} notícias sobre Faro e Farense:\n")
    
    for i, noticia in enumerate(noticias_unicas, 1):
        titulo = noticia.get('title', 'N/A').split(" -")[0]
        print(f"📰 {i}. {titulo}")
        
        data_pub = noticia.get('published date', '')
        data_obj = converter_data(data_pub)
        print(f"📅 {formatar_data(data_obj)}")
        
        print(f"🏷️ Etiqueta: {noticia.get('origem_busca', 'Desconhecida')}")
        
        publisher = noticia.get('publisher', {})
        print(f"🏛️ {publisher.get('title', 'Desconhecida')}")
        print(f"🌍 {publisher.get('href', 'N/A')}")
        
        url = noticia.get('url', 'N/A')
        print(f"🔗 URL: {url}")
        
        descricao = noticia.get('description', 'Sem descrição disponível')
        print(f"📝 {descricao}\n")
        
        print("-" * 80 + "\n")

if __name__ == "__main__":
    main()