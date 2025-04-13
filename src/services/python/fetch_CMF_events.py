# --- Imports ---
import requests
from bs4 import BeautifulSoup
from datetime import datetime
import locale
import time
import json # Import necessário para JSON

# --- Constants ---
BASE_URL = "https://www.cm-faro.pt/pt/agenda.aspx?page="
BASE_DOMAIN = "https://www.cm-faro.pt"
HEADERS = {
    "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/89.0.4389.82 Safari/537.36"
}
# NOTE: The DATE_FORMAT assumes Portuguese month abbreviations (e.g., 'abr')
# This requires the locale to be set correctly using set_portuguese_locale()
DATE_FORMAT = "%d %b %Y" # Example: 12 abr 2025
NUM_PAGES_TO_SCRAPE = 3  # Adjust number of pages to scrape as needed
REQUEST_TIMEOUT = 15 # Seconds for request timeout
DELAY_BETWEEN_REQUESTS = 0.5 # Seconds delay between page requests (set to 0 to disable)
JSON_OUTPUT_FILENAME = "eventos_faro.json" # Nome do ficheiro JSON de saída
HTML_OUTPUT_FILENAME = "agenda_faro.html" # Nome do ficheiro HTML de saída


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
            "Título": titulo,
            "Data Início": data_inicio_str, # String original como extraída
            "Data Fim": data_fim_str,       # String original como extraída
            "Data Início DT": data_inicio_dt, # Objeto datetime (ou datetime.max)
            "Data Fim DT": data_fim_dt,     # Objeto datetime (ou datetime.max)
            "Descrição": descricao,
            "Link": link_absoluto,
            "Capa": capa_absoluta
        })
        # --- End of loop for one event item ---

    return eventos_pagina
# --- End of get_events_from_page function ---


# --- Output Functions ---

# Opção 1: Saída na Consola Melhorada
def display_events_console_melhorada(event_list):
    """
    Imprime os eventos na consola com uma formatação ligeiramente melhorada.
    """
    if not event_list:
        print("\nNenhum evento encontrado ou processado.")
        return

    today_date = datetime.now().date()
    print(f"\n📅 AGENDA DE FARO ({len(event_list)} EVENTOS) 📅")
    print(f"   (Dados de: {today_date.strftime('%d %b %Y')}, ordenados por data de início)")
    print("=" * 60) # Separador mais forte

    for i, evento in enumerate(event_list, 1):
        print(f"\n--- Evento #{i} ---")
        print(f"✨ Título: {evento['Título']}")

        start_str = evento['Data Início']
        end_str = evento['Data Fim']
        start_norm = ' '.join(start_str.split()).strip()
        end_norm = ' '.join(end_str.split()).strip()
        start_is_valid = start_str and not any(marker in start_str.lower() for marker in ["sem data", "erro", "inválid"])
        end_is_valid = end_str and not any(marker in end_str.lower() for marker in ["sem data", "erro", "inválid"])

        if start_is_valid and end_is_valid:
            if start_norm == end_norm:
                print(f"🗓️ Data:    {start_str}")
            else:
                print(f"🗓️ Início:  {start_str}")
                print(f"🗓️ Fim:     {end_str}")
        else:
             # Fallback mais informativo
             print(f"🗓️ Data Início: {start_str} (Status: {'OK' if start_is_valid else 'Inválida/Ausente'})")
             print(f"🗓️ Data Fim:    {end_str} (Status: {'OK' if end_is_valid else 'Inválida/Ausente'})")

        print(f"📝 Desc:    {evento['Descrição']}")
        print(f"🖼️ Imagem:  {evento['Capa']}")
        print(f"🔗 Link:    {evento['Link']}")
        print("-" * 60) # Separador entre eventos

    print("\nFim da lista de eventos.")
    print("=" * 60)


# Opção 2: Saída em JSON
def output_events_as_json(event_list, filename=JSON_OUTPUT_FILENAME):
    """
    Guarda a lista de eventos num ficheiro JSON.
    Converte objetos datetime para strings ISO formatadas para compatibilidade JSON.
    """
    # Criar uma cópia para não modificar a lista original e formatar datas
    events_for_json = []
    for evento in event_list:
        evento_copy = evento.copy() # Copiar o dicionário
        # Converter datetime para string ISO 8601 (ou outro formato desejado)
        # Usar try-except porque podem ser datetime.max ou None
        try:
            # Só converte se for um datetime válido e não for datetime.max
            if isinstance(evento_copy['Data Início DT'], datetime) and evento_copy['Data Início DT'] != datetime.max:
                evento_copy['Data Início DT_ISO'] = evento_copy['Data Início DT'].isoformat()
            else:
                 evento_copy['Data Início DT_ISO'] = None # Ou string vazia "" se preferir
        except (AttributeError, TypeError):
             evento_copy['Data Início DT_ISO'] = None
        try:
            if isinstance(evento_copy['Data Fim DT'], datetime) and evento_copy['Data Fim DT'] != datetime.max:
                evento_copy['Data Fim DT_ISO'] = evento_copy['Data Fim DT'].isoformat()
            else:
                evento_copy['Data Fim DT_ISO'] = None
        except (AttributeError, TypeError):
            evento_copy['Data Fim DT_ISO'] = None

        # Remover os objetos datetime originais para evitar erros de serialização JSON
        del evento_copy['Data Início DT']
        del evento_copy['Data Fim DT']

        events_for_json.append(evento_copy)

    try:
        with open(filename, 'w', encoding='utf-8') as f:
            # indent=4 para tornar o ficheiro JSON legível por humanos
            # ensure_ascii=False para suportar caracteres portugueses corretamente
            json.dump(events_for_json, f, ensure_ascii=False, indent=4)
        print(f"\n✅ Eventos guardados com sucesso no ficheiro: {filename}")
    except IOError as e:
        print(f"\n❌ Erro ao guardar o ficheiro JSON: {e}")
    except TypeError as e:
         print(f"\n❌ Erro de tipo ao converter para JSON (verificar datas?): {e}")
         print(f"   Dados problemáticos (primeiro evento): {events_for_json[0] if events_for_json else 'Nenhum evento'}")


# Opção 3: Saída em HTML
def generate_html_output(event_list, filename=HTML_OUTPUT_FILENAME):
    """Gera um ficheiro HTML simples com os eventos."""
    if not event_list:
        print("Nenhum evento para gerar HTML.")
        return

    html_content = """
<!DOCTYPE html>
<html lang="pt">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Agenda de Faro</title>
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; line-height: 1.6; padding: 20px; background-color: #f8f9fa; color: #343a40; }
        .container { max-width: 900px; margin: auto; background: #ffffff; padding: 25px; border-radius: 10px; box-shadow: 0 4px 12px rgba(0,0,0,0.1); }
        h1 { text-align: center; color: #212529; border-bottom: 3px solid #dee2e6; padding-bottom: 15px; margin-bottom: 25px; font-weight: 600; }
        .event-card { border: 1px solid #e9ecef; border-radius: 8px; margin-bottom: 25px; padding: 20px; background-color: #fff; transition: box-shadow 0.3s ease; overflow: hidden; }
        .event-card:hover { box-shadow: 0 6px 16px rgba(0,0,0,0.12); }
        .event-card img { max-width: 100%; height: auto; border-radius: 6px; margin-bottom: 15px; display: block; margin-left: auto; margin-right: auto; max-height: 300px; object-fit: cover; border: 1px solid #eee; }
        .event-card h2 { margin-top: 0; color: #0056b3; font-size: 1.5em; font-weight: 600; margin-bottom: 10px; }
        .event-card .date { font-weight: 600; color: #495057; margin-bottom: 12px; font-size: 0.95em; }
        .event-card .date .label { color: #6c757d; font-weight: 500; } /* Added label style */
        .event-card .description { color: #495057; margin-bottom: 18px; font-size: 1em; }
        .event-card .link a { background-color: #007bff; color: white; padding: 8px 15px; border-radius: 5px; text-decoration: none; font-weight: 500; display: inline-block; transition: background-color 0.2s ease; font-size: 0.9em; }
        .event-card .link a:hover { background-color: #0056b3; text-decoration: none; }
        .event-card .link.no-link { color: #6c757d; font-style: italic; font-size: 0.9em; } /* Style for no link text */
        .error-date { color: #e74c3c; font-style: italic; font-weight: 500; }
        .footer { text-align: center; margin-top: 30px; font-size: 0.85em; color: #6c757d; }
    </style>
</head>
<body>
    <div class="container">
        <h1>📅 Agenda de Eventos - Faro</h1>
"""

    for evento in event_list:
        html_content += '        <div class="event-card">\n'
        html_content += f"            <h2>{evento['Título']}</h2>\n"

        # Imagem
        if evento['Capa'] and evento['Capa'].lower() != "sem capa":
             html_content += f'            <img src="{evento["Capa"]}" alt="Capa para {evento["Título"]}" onerror="this.style.display=\'none\'; console.error(\'Erro ao carregar imagem: {evento["Capa"]}\');">\n'

        # Datas
        start_str = evento['Data Início']
        end_str = evento['Data Fim']
        start_norm = ' '.join(start_str.split()).strip()
        end_norm = ' '.join(end_str.split()).strip()
        start_is_valid = start_str and not any(marker in start_str.lower() for marker in ["sem data", "erro", "inválid"])
        end_is_valid = end_str and not any(marker in end_str.lower() for marker in ["sem data", "erro", "inválid"])

        html_content += '            <p class="date">'
        if start_is_valid and end_is_valid:
            if start_norm == end_norm:
                html_content += f"<span class='label'>🗓️ Data:</span> {start_str}"
            else:
                html_content += f"<span class='label'>🗓️ De:</span> {start_str}<br><span class='label'>🗓️ Até:</span> {end_str}"
        else:
             html_content += f"<span class='label'>Data Início:</span> <span class='{'' if start_is_valid else 'error-date'}'>{start_str}</span><br>"
             html_content += f"<span class='label'>Data Fim:</span> <span class='{'' if end_is_valid else 'error-date'}'>{end_str}</span>"
        html_content += '</p>\n'

        # Descrição
        html_content += f'            <p class="description">📝 {evento["Descrição"]}</p>\n'

        # Link
        if evento['Link'] and evento['Link'].lower() != "sem link":
            html_content += f'            <p class="link"><a href="{evento["Link"]}" target="_blank" rel="noopener noreferrer">🔗 Mais informações</a></p>\n'
        else:
             html_content += '            <p class="link no-link">🔗 Sem link disponível</p>\n' # Added class for styling


        html_content += '        </div>\n' # Fecha event-card

    # Adiciona data de geração no rodapé
    generation_time = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
    html_content += f"""
     <p class="footer">Gerado em: {generation_time}</p>
    </div> </body>
</html>
"""
    try:
        with open(filename, 'w', encoding='utf-8') as f:
            f.write(html_content)
        print(f"\n✅ Ficheiro HTML gerado com sucesso: {filename}")
        print(f"   Pode abri-lo no seu navegador.")
    except IOError as e:
        print(f"\n❌ Erro ao gerar o ficheiro HTML: {e}")

# --- Main Execution Block ---

def main():
    """
    Main function to orchestrate the scraping process and output generation.
    """
    # Attempt to set locale for date parsing - script continues even if it fails
    set_portuguese_locale()

    all_events = []
    print(f"\nA iniciar scraping de {NUM_PAGES_TO_SCRAPE} página(s) da agenda de Faro...")
    # Use current date from context
    print(f"(Executado em {datetime.now().strftime('%Y-%m-%d %H:%M:%S')})")


    # Loop through the specified number of pages
    for page_num in range(1, NUM_PAGES_TO_SCRAPE + 1):
        events_from_page = get_events_from_page(page_num)
        if events_from_page: # Check if list is not empty before extending
             all_events.extend(events_from_page)
        # else: # Optional: Keep commented unless needed
             # print(f"Nenhum evento encontrado na página {page_num}.")

        # Optional polite delay between requests
        if DELAY_BETWEEN_REQUESTS > 0 and page_num < NUM_PAGES_TO_SCRAPE:
             print(f"A aguardar {DELAY_BETWEEN_REQUESTS} segundos...")
             time.sleep(DELAY_BETWEEN_REQUESTS)

    print(f"\nScraping concluído. Total de {len(all_events)} eventos brutos encontrados.")

    # Sort all collected events by their start date (using the datetime object)
    # Events with parsing errors (datetime.max) will be placed at the end.
    # Note: Sorting by 'Data Início DT' seems more logical than 'Data Fim DT' for an agenda view
    eventos_ordenados = sorted(all_events, key=lambda x: x["Data Início DT"])

    # --- Choose Your Output Method ---
    # 1. Output as JSON (Recommended for apps)
    output_events_as_json(eventos_ordenados)

    # 2. Output as HTML (Good for direct browser viewing)
    generate_html_output(eventos_ordenados)

    # 3. Output to Console (Improved version)
    display_events_console_melhorada(eventos_ordenados)

    # 4. Original Console Output (Keep if needed for comparison)
    # from __main__ import display_events # Assuming original function was named display_events
    # display_events(eventos_ordenados)

# Ensures that the main() function runs only when the script is executed directly
if __name__ == "__main__":
    main()
# --- End of Script ---
