# --- Imports ---
import requests
from bs4 import BeautifulSoup
from datetime import datetime
import locale
import time
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

# --- Constants ---
BASE_URL = "https://www.cm-faro.pt/pt/agenda.aspx?page="
BASE_DOMAIN = "https://www.cm-faro.pt"
HEADERS = {
    "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/89.0.4389.82 Safari/537.36"
}
# NOTE: The DATE_FORMAT assumes Portuguese month abbreviations (e.g., 'abr')
# This requires the locale to be set correctly using set_portuguese_locale()
DATE_FORMAT = "%d %b %Y" # Example: 12 abr 2025
NUM_PAGES_TO_SCRAPE = 3  # Ajustar número de páginas para scrape conforme necessário
REQUEST_TIMEOUT = 15 # Seconds for request timeout
DELAY_BETWEEN_REQUESTS = 0.5 # Seconds delay between page requests (set to 0 to disable)
JSON_OUTPUT_FILENAME = "events_data.json" # Nome do ficheiro JSON de saída

# --- Month name mapping (for potential manual normalization if locale fails) ---
# Note: Verify Python's actual %b output for your pt_PT locale if using mapping.
# Common locale outputs: 'jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez'
PORTUGUESE_MONTH_MAP = {
    # Maps full/alternative names to expected 3-letter abbr. for locale %b
    'janeiro': 'jan', 'fevereiro': 'fev', 'março': 'mar', 'abril': 'abr',
    'maio': 'mai', 'junho': 'jun', 'julho': 'jul', 'agosto': 'ago',
    'setembro': 'set', # Check if your locale uses 'set' or 'sep'
    'outubro': 'out', 'novembro': 'nov', 'dezembro': 'dez',
    # Add variations like 'mar' -> 'mar' if needed, though usually not required if source is consistent
}

# --- Helper Functions ---

def set_portuguese_locale():
    """
    Attempts to set the system's locale for time functions to Portuguese (pt_PT).
    Returns True if successful, False otherwise.
    """
    # Get current time to display today's date according to locale
    now = datetime.now()
    locale_options = ['pt_PT.UTF-8', 'Portuguese_Portugal.1252', 'pt_PT'] # Common Linux/macOS and Windows codes
    for loc in locale_options:
        try:
            locale.setlocale(locale.LC_TIME, loc)
            print(f"Locale definido com sucesso para '{loc}'. Exemplo data hoje: {now.strftime('%A, %d de %B de %Y')}")
            return True
        except locale.Error:
            continue # Try the next option

    print("\nAviso: Não foi possível definir o locale para Português (pt_PT).")
    print("A interpretação dos nomes dos meses (%b) pode falhar.")
    print(f"Verifique se um dos seguintes locales está instalado no sistema: {locale_options}")
    return False

def normalize_month(date_str):
    """ Replaces full Portuguese month names with 3-letter abbr based on PORTUGUESE_MONTH_MAP """
    parts = date_str.split()
    if len(parts) == 3:
        month_original = parts[1].lower().strip('.') # Handle abbr like 'set.' if needed
        # Use the mapped abbreviation if found, otherwise keep original part
        month_normalized = PORTUGUESE_MONTH_MAP.get(month_original, parts[1])
        if month_normalized != parts[1]: # Only reconstruct if changed
             # Return using the potentially mapped month name
            return f"{parts[0]} {month_normalized} {parts[2]}"
    # Return original string if not in expected format or no mapping needed
    return date_str


def parse_date_string(date_str):
    """
    Parses a date string using the defined DATE_FORMAT.
    Handles specific error/missing strings and optionally normalizes month names.
    Returns a datetime object on success, or datetime.max on failure.
    """
    if not date_str or any(marker in date_str.lower() for marker in ["sem data", "erro", "inválid"]):
        return datetime.max

    original_for_warning = date_str # Keep original for warning message
    # --- Optional: Uncomment the next block if locale parsing fails due to full month names ---
    # date_str_normalized = normalize_month(date_str)
    # if date_str_normalized != date_str:
    #      print(f"--- DEBUG Parse: Normalized month: '{date_str}' -> '{date_str_normalized}'")
    #      date_str = date_str_normalized # Use the normalized string for parsing
    # --- End Optional ---

    try:
        # Attempt to parse the (potentially normalized) date string
        return datetime.strptime(date_str, DATE_FORMAT)
    except ValueError as e:
        # If parsing fails, log the warning with the string that was attempted
        print(f"Aviso: Não foi possível converter a data '{date_str}' (Original: '{original_for_warning}') usando o formato '{DATE_FORMAT}'. Erro: {e}")
        return datetime.max

def format_url(relative_url):
    """
    Creates an absolute URL from a relative URL using the BASE_DOMAIN.
    Returns the absolute URL or None if input is invalid.
    """
    if not relative_url or isinstance(relative_url, (list, dict)):
        return None
    relative_url = str(relative_url).strip()
    if relative_url.startswith("http://") or relative_url.startswith("https://"):
        return relative_url
    if not relative_url.startswith("/"):
        relative_url = "/" + relative_url
    return f"{BASE_DOMAIN}{relative_url}"

# --- Core Scraping Function (Corrected multi-day detection) ---

def get_events_from_page(page_number):
    """
    Scrapes event data from a single agenda page specified by page_number.
    Includes corrected multi-day detection and optional debugging prints.
    Returns a list of dictionaries, each representing an event.
    """
    url = f"{BASE_URL}{page_number}"
    print(f"A processar página: {url}")

    try:
        response = requests.get(url, headers=HEADERS, timeout=REQUEST_TIMEOUT)
        response.raise_for_status()
    except requests.exceptions.RequestException as e:
        print(f"Erro ao aceder à página {page_number}: {e}")
        return []

    soup = BeautifulSoup(response.text, "html.parser")
    eventos_pagina = []

    for item in soup.select("div.list_agenda ul"):
        titulo_tag = item.select_one("p.title a")
        titulo = titulo_tag.get_text(strip=True) if titulo_tag else None
        if not titulo:
            continue
        current_event_title_for_debug = titulo # For debug messages

        link_relativo = titulo_tag.get("href") if titulo_tag else None
        link_absoluto = format_url(link_relativo) or "Sem link"
        capa_tag = item.select_one("li.thumb img")
        capa_relativa = capa_tag.get("src") if capa_tag else None
        capa_absoluta = format_url(capa_relativa) or "Sem capa"
        descricao_tag = item.select_one("p.desc")
        descricao = descricao_tag.get_text(strip=True) if descricao_tag else "Sem descrição"

        data_tag = item.select_one("p.data")
        data_inicio_str = "Sem data"
        data_fim_str = "Sem data"

        if data_tag:
            # Get text, normalize whitespace robustly
            raw_text = data_tag.get_text(separator=' ', strip=False)
            full_text = ' '.join(raw_text.split()).strip()

            # --- Check for multi-day separator ---
            is_multi_day = False
            split_parts = None
            # Check for hyphen, en-dash, em-dash surrounded by spaces
            for sep in [" - ", " – ", " — "]:
                if sep in full_text:
                    is_multi_day = True
                    split_parts = full_text.split(sep, 1)
                    break

            # --- Multi-day event logic ---
            if is_multi_day and split_parts and len(split_parts) == 2:
                try:
                    data_inicio_str = split_parts[0].strip()
                    # Basic validation of start date format
                    start_parts_check = data_inicio_str.split()
                    if not (len(start_parts_check) >= 3 and start_parts_check[0].isdigit()):
                            print(f"--- Aviso Multi-Dia: Formato data início inválido: '{data_inicio_str}' em '{current_event_title_for_debug}'")

                    # Attempt to extract end date
                    end_part_raw = split_parts[1].strip()
                    end_parts = end_part_raw.split()
                    extracted_end_date = None
                    if len(end_parts) >= 3 and end_parts[0].isdigit() and end_parts[1].isalpha() and end_parts[2].isdigit() and len(end_parts[2]) == 4:
                            extracted_end_date = f"{end_parts[0]} {end_parts[1]} {end_parts[2]}"

                    if extracted_end_date:
                        data_fim_str = extracted_end_date
                    else:
                        print(f"--- Aviso Multi-Dia: Não foi possível extrair data fim de '{end_part_raw}' para '{current_event_title_for_debug}'.")
                        data_fim_str = "Erro data Fim"

                except Exception as e:
                        print(f"Aviso: Exceção ao processar data multi-dia '{full_text}' para '{current_event_title_for_debug}': {e}")
                        data_inicio_str = "Erro data Início"
                        data_fim_str = "Erro data Fim"

            # --- Single-day event logic ---
            else: # Enters here if not multi-day OR split failed unexpectedly
                date_parts = full_text.split()
                if len(date_parts) >= 3 and date_parts[0].isdigit() and date_parts[1].isalpha() and date_parts[2].isdigit() and len(date_parts[2]) == 4:
                    potential_date = f"{date_parts[0]} {date_parts[1]} {date_parts[2]}"
                    data_inicio_str = potential_date
                    data_fim_str = potential_date
                else:
                    # print(f"--- Aviso Dia Único: Formato inesperado/incompleto: '{full_text}' para '{current_event_title_for_debug}'. Usando texto completo.") # Optional Debug
                    data_inicio_str = full_text # Keep full text if format is weird
                    data_fim_str = full_text # Assume same if it's single day

        else: # No data tag found
             print(f"--- Aviso: Sem tag <p class='data'> encontrada para '{current_event_title_for_debug}' ---")


        # --- Date Parsing ---
        data_inicio_dt = parse_date_string(data_inicio_str)
        data_fim_dt = parse_date_string(data_fim_str)

        # --- Append event data ---
        eventos_pagina.append({
            "titulo": titulo,
            "data_inicio": data_inicio_str, # String original como extraída
            "data_fim": data_fim_str,       # String original como extraída
            "data_inicio_dt": data_inicio_dt, # Objeto datetime (ou datetime.max)
            "data_fim_dt": data_fim_dt,     # Objeto datetime (ou datetime.max)
            "descricao": descricao,
            "link": link_absoluto,
            "capa": capa_absoluta
        })
        # --- End of loop for one event item ---

    return eventos_pagina
# --- End of get_events_from_page function ---

def fetch_events():
    """
    Função principal para buscar eventos da Câmara Municipal de Faro e da Viralagenda,
    formatar e salvar no formato esperado pela aplicação.
    """
    # Attempt to set locale for date parsing - script continues even if it fails
    set_portuguese_locale()

    # Buscar eventos da Câmara Municipal de Faro
    print(f"\nA iniciar scraping de {NUM_PAGES_TO_SCRAPE} página(s) da agenda de Faro...")
    print(f"(Executado em {datetime.now().strftime('%Y-%m-%d %H:%M:%S')})")
    
    all_events = []
    # Loop through the specified number of pages
    for page_num in range(1, NUM_PAGES_TO_SCRAPE + 1):
        events_from_page = get_events_from_page(page_num)
        if events_from_page: # Check if list is not empty before extending
             all_events.extend(events_from_page)
        
        # Optional polite delay between requests
        if DELAY_BETWEEN_REQUESTS > 0 and page_num < NUM_PAGES_TO_SCRAPE:
             print(f"A aguardar {DELAY_BETWEEN_REQUESTS} segundos...")
             time.sleep(DELAY_BETWEEN_REQUESTS)
    
    print(f"\nScraping concluído. Total de {len(all_events)} eventos brutos encontrados.")
    
    # Sort all collected events by their start date (using the datetime object)
    # Events with parsing errors (datetime.max) will be placed at the end.
    eventos_ordenados = sorted(all_events, key=lambda x: x["data_inicio_dt"])
    
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
    for i, evento in enumerate(eventos_ordenados):
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
    
    # Converter as datas para objetos datetime para ordenação
    for evento in combined_events:
        # Extrair a data do evento para ordenação
        data_str = evento["date"].split(" - ")[0] if " - " in evento["date"] else evento["date"]
        try:
            # Tentar converter a data para um objeto datetime
            # Primeiro, verificar se é um formato da Viralagenda (maiúsculas)
            if "ABR" in data_str or "MAI" in data_str or "JUN" in data_str:
                # Converter para minúsculas para compatibilidade
                data_str = data_str.lower()
            
            # Tentar converter usando o formato padrão
            data_dt = datetime.strptime(data_str, DATE_FORMAT)
            evento["_data_ordenacao"] = data_dt
        except ValueError:
            # Se falhar, usar a data atual como fallback
            print(f"Aviso: Não foi possível converter a data '{data_str}' para ordenação. Usando data máxima.")
            evento["_data_ordenacao"] = datetime.max
    
    # Ordenar eventos por data (mais recentes primeiro)
    combined_events = sorted(combined_events, key=lambda x: x["_data_ordenacao"])
    
    # Remover o campo auxiliar de ordenação
    for evento in combined_events:
        if "_data_ordenacao" in evento:
            del evento["_data_ordenacao"]
    
    # Reatribuir IDs sequenciais
    for i, evento in enumerate(combined_events):
        evento["id"] = i + 1
    
    # Salvar em um arquivo JSON
    script_dir = os.path.dirname(os.path.abspath(__file__))
    src_dir = os.path.abspath(os.path.join(script_dir, "../.."))  # Subir dois níveis para chegar à pasta src
    output_path = os.path.join(src_dir, JSON_OUTPUT_FILENAME)
    
    with open(output_path, "w", encoding="utf-8") as f:
        json.dump(combined_events, f, ensure_ascii=False, indent=2)
    
    print(f"Total de {len(combined_events)} eventos salvos em {output_path}")
    return combined_events

if __name__ == "__main__":
    fetch_events()