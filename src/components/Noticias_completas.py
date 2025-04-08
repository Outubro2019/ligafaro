from newspaper import Article

url = "https://postal.pt/cultura/algarve-celebra-o-dia-mundial-do-teatro-com-espetaculos-em-faro-e-loule/"  # Altera para um artigo real
artigo = Article(url)
artigo.download()
artigo.parse()

print(f"Título: {artigo.title}")
print(f"Texto: {artigo.text[:500]}...")  # Mostra os primeiros 500 caracteres
