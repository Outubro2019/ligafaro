import requests
from bs4 import BeautifulSoup
from datetime import datetime
import json
import os

def get_viralagenda_events():
    """Obtém eventos da Viralagenda para Faro."""
    # URL para extrair os eventos
    url = "https://www.viralagenda.com/pt/faro/faro"
    
    # Obtém a data e hora atuais
    now = datetime.now()
    today_str = now.strftime("%d-%m-%Y")
    
    try:
        response = requests.get(url, headers={'User-Agent': 'Mozilla/5.0'})
        
        if response.status_code != 200:
            print(f"Erro ao acessar a página: {response.status_code}")
            return []
        
        soup = BeautifulSoup(response.text, 'html.parser')
        return extract_events(soup, today_str, now)
    except Exception as e:
        print(f"Erro ao buscar eventos da Viralagenda: {e}")
        return []

def format_event_date(day, month, year, today_str):
    """Formata a data do evento e verifica se é hoje."""
    event_date_str = f"{day}-{month}-{year}"
    
    # Verifica se o evento é hoje
    if event_date_str == today_str:
        return f"{day} {month} {year} - Hoje!"
    return f"{day} {month} {year}"

def extract_events(soup, today_str, now):
    """Extrai os detalhes dos eventos da página."""
    events_list = []
    event_items = soup.find_all('li', class_='viral-item')
    
    for item in event_items:
        # Extrair data
        date_element = item.find('div', class_='viral-event-date')
        if date_element:
            weekday = date_element.find('label', class_='viral-event-weekday').text
            day = date_element.find('label', class_='viral-event-day').text
            month = date_element.find('label', class_='viral-event-month').text
            year = date_element.find('label', class_='viral-event-year')
            year = year.text if year else str(now.year)  # Caso o ano não seja encontrado, usa o ano atual
            date = format_event_date(day, month, year, today_str)
        else:
            date = "Data não encontrada"

        # Extrair hora
        time_element = item.find('div', class_='viral-event-hour')
        time = time_element.text.strip() if time_element else "Hora não encontrada"

        # Extrair título
        title_element = item.find('div', class_='viral-event-title')
        title = title_element.text.strip() if title_element else "Título não encontrado"

        # Extrair local
        location_element = item.find('a', class_='viral-event-place')
        location = location_element.text.strip() if location_element else "Local não encontrado"
        
        # Extrair link
        link_element = item.find('a', class_='viral-event-title')
        link = link_element['href'] if link_element and 'href' in link_element.attrs else None
        
        # Filtra os eventos que têm o local "Local não encontrado" ou "Auchan Live Faro"
        if location in ["Local não encontrado", "Auchan Live Faro"]:
            continue

        # Adiciona o evento à lista apenas se as informações essenciais forem encontradas
        if "não encontrado" not in [title, time, location]:
            # Extrair imagem
            image_element = item.find('div', class_='viral-event-image')
            image_url = image_element['data-img'] if image_element and 'data-img' in image_element.attrs else None
            
            # Determinar categoria com base em palavras-chave no título
            categoria = determinar_categoria(title)
            
            events_list.append({
                'titulo': title,
                'data': date,
                'hora': time,
                'local': location,
                'imagem': image_url,
                'link': link,
                'categoria': categoria
            })

    return events_list

def determinar_categoria(titulo):
    """Determina a categoria do evento com base em palavras-chave no título."""
    titulo_lower = titulo.lower()
    
    keywords = {
        'música': "Música",
        'concerto': "Música",
        'festival': "Música",
        'dj': "Música",
        'banda': "Música",
        'gastronomia': "Comida & Bebida",
        'culinária': "Comida & Bebida",
        'degustação': "Comida & Bebida",
        'jantar': "Comida & Bebida",
        'almoço': "Comida & Bebida",
        'ambiente': "Ambiente",
        'ecologia': "Ambiente",
        'natureza': "Ambiente",
        'feira': "Compras",
        'mercado': "Compras",
        'artesanato': "Compras",
        'desporto': "Desporto",
        'corrida': "Desporto",
        'torneio': "Desporto",
        'tecnologia': "Tecnologia",
        'digital': "Tecnologia",
        'inovação': "Tecnologia",
        'workshop': "Educação",
        'curso': "Educação",
        'palestra': "Educação",
        'teatro': "Cultural",
        'exposição': "Cultural",
        'arte': "Cultural",
        'cinema': "Cultural",
        'filme': "Cultural"
    }
    
    for keyword, cat in keywords.items():
        if keyword in titulo_lower:
            return cat
    
    return "Cultural"  # Categoria padrão

def format_viralagenda_events(events):
    """Formata os eventos da Viralagenda para o formato esperado pela aplicação."""
    formatted_events = []
    
    for i, evento in enumerate(events):
        formatted_events.append({
            "id": 10000 + i,  # IDs a partir de 10000 para evitar conflitos com outros eventos
            "title": evento["titulo"],
            "description": f"Evento em {evento['local']}",
            "date": evento["data"],
            "time": evento["hora"],
            "location": evento["local"],
            "category": evento["categoria"],
            "attendees": 0,
            "imageUrl": evento["imagem"],
            "organizer": "Viralagenda",
            "link": evento["link"]
        })
    
    return formatted_events

def fetch_viralagenda_events():
    """Função principal para buscar e formatar eventos da Viralagenda."""
    events = get_viralagenda_events()
    formatted_events = format_viralagenda_events(events)
    
    # Salvar em um arquivo JSON
    output_dir = os.path.dirname(os.path.abspath(__file__))
    output_path = os.path.join(output_dir, "viralagenda_events.json")
    
    with open(output_path, "w", encoding="utf-8") as f:
        json.dump(formatted_events, f, ensure_ascii=False, indent=2)
    
    print(f"Dados da Viralagenda salvos em {output_path}")
    return formatted_events

if __name__ == "__main__":
    fetch_viralagenda_events()