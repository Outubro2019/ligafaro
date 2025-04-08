from gnews import GNews

# Inicializa o cliente do Google News
google_news = GNews(language='pt', country='PT')

# Busca as notícias relacionadas a "Faro Algarve"
noticias = google_news.get_news('Faro Algarve')

# Exibe os títulos e links das notícias encontradas
for noticia in noticias:
    print(f"Título: {noticia['title']}")
    print(f"Link: {noticia['url']}\n")
