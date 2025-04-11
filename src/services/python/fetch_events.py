import requests
from bs4 import BeautifulSoup
from datetime import datetime
import json
import os
import importlib.util
import sys

# Importar o módulo fetch_viralagenda_events
try:
    # Tenta importar diretamente
    from fetch_viralagenda_events import fetch_viralagenda_events
except ImportError:
    try:
        # Tenta importar usando o caminho completo
        script_dir = os.path.dirname(os.path.abspath(__file__))
        viralagenda_path = os.path.join(script_dir, "fetch_viralagenda_events.py")
        
        spec = importlib.util.spec_from_file_location("fetch_viralagenda_events", viralagenda_path)
        viralagenda_module = importlib.util.module_from_spec(spec)
        sys.modules["fetch_viralagenda_events"] = viralagenda_module
        spec.loader.exec_module(viralagenda_module)
        fetch_viralagenda_events = viralagenda_module.fetch_viralagenda_events
    except Exception as e:
        print(f"Erro ao importar fetch_viralagenda_events: {e}")
        # Função vazia como fallback
        def fetch_viralagenda_events():
            print("Módulo fetch_viralagenda_events não disponível")
            return []

base_url = "https://www.cm-faro.pt/pt/agenda.aspx?page="
headers = {
    "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/89.0.4389.82 Safari/537.36"
}

def get_events_from_page(page_number):
    url = f"{base_url}{page_number}"
    response = requests.get(url, headers=headers)
    
    if response.status_code == 200:
        soup = BeautifulSoup(response.text, "html.parser")
        
        eventos = []
        for evento in soup.select("div.list_agenda ul"):
            titulo_tag = evento.select_one("p.title a")
            titulo = titulo_tag.get_text(strip=True) if titulo_tag else "Sem título"
            
            if titulo == "Sem título":
                continue
            
            link = titulo_tag["href"] if titulo_tag else None
            link = f"https://www.cm-faro.pt{link}" if link and not link.startswith("http") else "Sem link"
            
            data_tag = evento.select_one("p.data")
            data = " ".join(data_tag.stripped_strings) if data_tag else "Sem data"
            data = data.replace("\r\n", "").strip()
            
            descricao_tag = evento.select_one("p.desc")
            descricao = descricao_tag.get_text(strip=True) if descricao_tag else "Sem descrição"
            
            capa_tag = evento.select_one("li.thumb img")
            capa = capa_tag["src"] if capa_tag else None
            capa = f"https://www.cm-faro.pt{capa}" if capa and not capa.startswith("http") else capa
            
            # Extrair a data de início e fim
            if "-" in data:
                data_inicio, data_fim = data.split("-")
                data_inicio, data_fim = data_inicio.strip(), data_fim.strip()
            else:
                data_inicio = data
                data_fim = data

            # Converter datas para objetos datetime
            formato_data = "%d %b %Y"
            try:
                data_inicio_dt = datetime.strptime(data_inicio, formato_data)
            except ValueError:
                data_inicio_dt = datetime.max

            try:
                data_fim_dt = datetime.strptime(data_fim, formato_data)
            except ValueError:
                data_fim_dt = datetime.max

            eventos.append({
                "titulo": titulo,
                "data_inicio": data_inicio,
                "data_fim": data_fim,
                "data_inicio_dt": data_inicio_dt.isoformat() if data_inicio_dt != datetime.max else None,
                "data_fim_dt": data_fim_dt.isoformat() if data_fim_dt != datetime.max else None,
                "descricao": descricao,
                "link": link,
                "capa": capa
            })

        # Ordenar os eventos pela data de fim
        eventos_ordenados = sorted(eventos, key=lambda x: x["data_fim_dt"] if x["data_fim_dt"] else "")

        return eventos_ordenados
    else:
        print(f"Erro ao aceder à página {page_number}: {response.status_code}")
        return []

def fetch_events():
    # Buscar eventos da Câmara Municipal de Faro
    eventos_totais = []
    for page_number in range(1, 4):  # Ajustar o número de páginas conforme necessário
        eventos_totais.extend(get_events_from_page(page_number))
    
    # Buscar eventos da Viralagenda
    print("Buscando eventos da Viralagenda...")
    try:
        viralagenda_events = fetch_viralagenda_events()
        print(f"Encontrados {len(viralagenda_events)} eventos da Viralagenda")
    except Exception as e:
        print(f"Erro ao buscar eventos da Viralagenda: {e}")
        viralagenda_events = []
    
    # Converter para o formato esperado pela aplicação
    formatted_events = []
    for i, evento in enumerate(eventos_totais):
        # Determinar a categoria com base em palavras-chave no título ou descrição
        categoria = "Cultural"  # Categoria padrão
        
        keywords = {
            "música": "Música",
            "concerto": "Música",
            "festival": "Música",
            "gastronomia": "Comida & Bebida",
            "culinária": "Comida & Bebida",
            "degustação": "Comida & Bebida",
            "ambiente": "Ambiente",
            "ecologia": "Ambiente",
            "natureza": "Ambiente",
            "feira": "Compras",
            "mercado": "Compras",
            "artesanato": "Compras",
            "desporto": "Desporto",
            "corrida": "Desporto",
            "torneio": "Desporto",
            "tecnologia": "Tecnologia",
            "digital": "Tecnologia",
            "inovação": "Tecnologia"
        }
        
        texto_completo = (evento["titulo"] + " " + evento["descricao"]).lower()
        for keyword, cat in keywords.items():
            if keyword in texto_completo:
                categoria = cat
                break
        
        # Formatar a data para exibição
        data_exibicao = ""
        if evento["data_inicio"] == evento["data_fim"]:
            data_exibicao = evento["data_inicio"]
        else:
            data_exibicao = f"{evento['data_inicio']} - {evento['data_fim']}"
        
        formatted_events.append({
            "id": i + 1,
            "title": evento["titulo"],
            "description": evento["descricao"],
            "date": data_exibicao,
            "time": "Consulte o site para horários",
            "location": "Faro",
            "category": categoria,
            "attendees": 0,  # Valor inicial
            "imageUrl": evento["capa"],
            "organizer": "Câmara Municipal de Faro",
            "link": evento["link"]
        })
    
    # Combinar eventos da Câmara Municipal com eventos da Viralagenda
    combined_events = formatted_events + viralagenda_events
    
    # Salvar em um arquivo JSON
    output_dir = os.path.dirname(os.path.abspath(__file__))
    output_path = os.path.join(output_dir, "events_data.json")
    
    with open(output_path, "w", encoding="utf-8") as f:
        json.dump(combined_events, f, ensure_ascii=False, indent=2)
    
    print(f"Total de {len(combined_events)} eventos salvos em {output_path}")
    return combined_events

if __name__ == "__main__":
    fetch_events()