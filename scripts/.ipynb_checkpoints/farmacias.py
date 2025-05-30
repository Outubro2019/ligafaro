import requests
from bs4 import BeautifulSoup
from datetime import datetime, time
from tabulate import tabulate
import random
import re
import json
import os
from datetime import date

# Lista de headers para simular diferentes navegadores
headers_list = [
    {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.5",
        "Connection": "keep-alive"
    },
    {
        "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0.3 Safari/605.1.15",
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        "Accept-Language": "pt-PT,pt;q=0.9,en;q=0.8",
        "Connection": "keep-alive"
    },
    {
        "User-Agent": "Mozilla/5.0 (X11; Linux x86_64; rv:89.0) Gecko/20100101 Firefox/89.0",
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.5",
        "Connection": "keep-alive"
    }
]

# URL do site
url = "https://www.farmaciasdeservico.net/localidade/faro/faro"

# Função para verificar se a farmácia está aberta às 01:15 PM
def esta_aberta(horarios, hora_atual=time(13, 15)):
    for horario in horarios:
        try:
            inicio, fim = horario.strip().split(' às ')
            inicio_h, inicio_m = map(int, inicio.split(':'))
            # Tratar o caso especial de "24:00"
            if fim == "24:00":
                fim_h, fim_m = 23, 59
            else:
                fim_h, fim_m = map(int, fim.split(':'))
            inicio_t = time(inicio_h, inicio_m)
            fim_t = time(fim_h, fim_m)
            if inicio_t <= hora_atual <= fim_t:
                return True
        except ValueError as e:
            print(f"Erro ao processar horário '{horario}': {e}")
            continue
    return False

# Função para validar e formatar coordenadas
def validar_coordenadas(coord_str):
    """
    Valida e formata uma string de coordenadas.
    Retorna as coordenadas no formato 'lat,lng' ou 'N/A' se inválidas.
    """
    if not coord_str or coord_str == 'N/A':
        return 'N/A'
    
    # Remover espaços e caracteres especiais desnecessários
    coord_str = coord_str.strip().replace(' ', '')
    
    # Padrões para diferentes formatos de coordenadas
    patterns = [
        r'^(-?\d+\.?\d*),(-?\d+\.?\d*)$',  # lat,lng
        r'^(-?\d+\.?\d*);(-?\d+\.?\d*)$',  # lat;lng
        r'^(-?\d+\.?\d*)\s+(-?\d+\.?\d*)$',  # lat lng
    ]
    
    for pattern in patterns:
        match = re.match(pattern, coord_str)
        if match:
            lat, lng = match.groups()
            try:
                lat_float = float(lat)
                lng_float = float(lng)
                
                # Validar se as coordenadas estão dentro de limites razoáveis
                # Para Portugal: lat entre 36-42, lng entre -10 a -6
                if 36 <= lat_float <= 42 and -10 <= lng_float <= -6:
                    return f"{lat_float},{lng_float}"
            except ValueError:
                continue
    
    return 'N/A'

# Função para tentar obter coordenadas de um mapa específico
def obter_coordenadas_mapa(mapa_id, base_url="https://www.farmaciasdeservico.net"):
    """
    Tenta obter coordenadas fazendo uma requisição para o mapa específico.
    """
    try:
        if not mapa_id or mapa_id == 'N/A':
            return 'N/A'
        
        # Construir URL do mapa
        if mapa_id.startswith('mapa/'):
            mapa_url = f"{base_url}/{mapa_id}"
        else:
            mapa_url = f"{base_url}/mapa/{mapa_id}"
        
        # Fazer requisição para a página do mapa
        headers = random.choice(headers_list)
        response = requests.get(mapa_url, headers=headers, timeout=5)
        
        if response.status_code == 200:
            # Procurar por coordenadas no conteúdo da página
            content = response.text
            
            # Padrões para encontrar coordenadas no JavaScript ou HTML
            coord_patterns = [
                r'lat["\']?\s*:\s*([^,\s}]+).*?lng["\']?\s*:\s*([^,\s}]+)',
                r'latitude["\']?\s*:\s*([^,\s}]+).*?longitude["\']?\s*:\s*([^,\s}]+)',
                r'center\s*:\s*\[\s*([^,\s]+)\s*,\s*([^,\s\]]+)',
                r'LatLng\s*\(\s*([^,\s]+)\s*,\s*([^,\s)]+)',
                r'coords\s*=\s*\[\s*([^,\s]+)\s*,\s*([^,\s\]]+)',
                r'position\s*:\s*\{\s*lat\s*:\s*([^,\s}]+).*?lng\s*:\s*([^,\s}]+)'
            ]
            
            for pattern in coord_patterns:
                match = re.search(pattern, content, re.IGNORECASE | re.DOTALL)
                if match:
                    lat, lng = match.groups()
                    # Limpar e validar coordenadas
                    lat = lat.strip().strip('"\'')
                    lng = lng.strip().strip('"\'')
                    try:
                        lat_float = float(lat)
                        lng_float = float(lng)
                        if 36 <= lat_float <= 42 and -10 <= lng_float <= -6:
                            return f"{lat_float},{lng_float}"
                    except ValueError:
                        continue
        
    except Exception:
        pass
    
    return 'N/A'

# Função para converter farmácia para formato JSON
def farmacia_para_json(farmacia, index):
    """
    Converte os dados de uma farmácia para o formato JSON esperado.
    """
    # Gerar ID único baseado no nome
    nome_id = farmacia['nome'].lower()
    nome_id = nome_id.replace('ç', 'c').replace('ã', 'a').replace('á', 'a').replace('é', 'e').replace('í', 'i').replace('ó', 'o').replace('ú', 'u')
    nome_id = nome_id.replace(' ', '-')
    nome_id = re.sub(r'[^a-z0-9\-]', '', nome_id)
    
    # Extrair coordenadas
    lat, lng = None, None
    if farmacia['coordenadas'] != 'N/A':
        try:
            coords = farmacia['coordenadas'].split(',')
            lat = float(coords[0])
            lng = float(coords[1])
        except (ValueError, IndexError):
            lat, lng = None, None
    
    # Construir endereço completo
    endereco = farmacia['morada']
    if farmacia['freguesia'] != 'N/A':
        endereco += f", {farmacia['freguesia']}"
    
    # Determinar se está de serviço (permanente ou aberta às 13:15)
    is_on_duty = farmacia['tipo'] == 'Permanente' or farmacia['aberta_13_15'] == 'Sim'
    
    # Processar serviços
    servicos = []
    if farmacia['servicos']:
        servicos = [s.strip() for s in farmacia['servicos'] if s.strip()]
    if not servicos:
        servicos = ["Medicamentos"]
    
    farmacia_json = {
        "id": nome_id,
        "name": farmacia['nome'],
        "address": endereco,
        "phone": farmacia['telefone'] if farmacia['telefone'] != 'N/A' else None,
        "isOnDuty": is_on_duty,
        "services": servicos
    }
    
    # Adicionar coordenadas se disponíveis
    if lat is not None and lng is not None:
        farmacia_json["coordinates"] = {
            "lat": lat,
            "lng": lng
        }
    
    # Adicionar website se disponível
    if farmacia['website'] != 'N/A':
        farmacia_json["website"] = farmacia['website']
    
    # Adicionar horários se disponível
    if farmacia['horarios']:
        horarios_str = ', '.join(farmacia['horarios'])
        farmacia_json["schedule"] = horarios_str
    
    # Adicionar informações de serviço se for permanente
    if farmacia['tipo'] == 'Permanente':
        farmacia_json["dutySchedule"] = {
            "date": date.today().strftime('%Y-%m-%d'),
            "startTime": "00:00",
            "endTime": "24:00"
        }
    
    return farmacia_json

# Função para salvar dados no JSON
def salvar_farmacias_json(farmacias, caminho_arquivo):
    """
    Salva todas as farmácias no formato JSON.
    """
    # Converter todas as farmácias para o formato JSON
    farmacias_json = []
    farmacias_de_servico = []
    
    for i, farmacia in enumerate(farmacias):
        farmacia_json = farmacia_para_json(farmacia, i)
        farmacias_json.append(farmacia_json)
        
        # Coletar farmácias de serviço
        if farmacia_json["isOnDuty"]:
            farmacias_de_servico.append(farmacia_json["id"])
    
    # Criar escala de serviço agrupada
    escalas_servico = []
    if farmacias_de_servico:
        escalas_servico.append({
            "date": date.today().strftime('%Y-%m-%d'),
            "pharmacies": farmacias_de_servico
        })
    
    # Estrutura final do JSON
    dados_json = {
        "farmacias": farmacias_json,
        "escalas_servico": escalas_servico
    }
    
    # Salvar no arquivo
    try:
        with open(caminho_arquivo, 'w', encoding='utf-8') as f:
            json.dump(dados_json, f, ensure_ascii=False, indent=2)
        print(f"\nDados salvos com sucesso em: {caminho_arquivo}")
        print(f"Total de farmácias salvas: {len(farmacias_json)}")
        print(f"Farmácias de serviço hoje: {len(farmacias_de_servico)}")
    except Exception as e:
        print(f"Erro ao salvar arquivo JSON: {e}")

# Função para extrair horários
def extrair_horario(horario_div):
    horarios = []
    for linha in horario_div.find_all('div', class_='linha'):
        try:
            inicio = linha.find_all('strong')[0].text.strip()
            fim = linha.find_all('strong')[1].text.strip()
            horarios.append(f"{inicio} às {fim}")
        except:
            continue
    return horarios

# Função para extrair serviços
def extrair_servicos(servicos_div):
    if servicos_div:
        return [li.text.strip() for li in servicos_div.find('ul').find_all('li') if li.text.strip() != '…']
    return []

# Fazer a requisição HTTP
try:
    headers = random.choice(headers_list)
    response = requests.get(url, headers=headers, timeout=10)
    response.raise_for_status()
except requests.RequestException as e:
    print(f"Erro ao acessar o site: {e}")
    exit()

# Criar o objeto BeautifulSoup
soup = BeautifulSoup(response.text, 'html.parser')

# Localizar o elemento com id="conteudoFarmacias"
conteudo_farmacias = soup.find(id='conteudoFarmacias')
if not conteudo_farmacias:
    print("Elemento com id='conteudoFarmacias' não encontrado.")
    exit()

# Lista para armazenar os dados das farmácias
farmacias = []

# Iterar sobre as seções (Permanente, Horário alargado, Disponibilidade)
for secao in conteudo_farmacias.find_all('section', class_='blocoFarm'):
    tipo = secao.find('h2', class_='separadorTipo').find('strong').text.strip()
    
    # Iterar sobre as farmácias na seção
    for idx, farmacia in enumerate(secao.find_all('div', class_=['farmacia destaque', 'farmacia normal']), 1):
        dados = farmacia.find('div', class_='dados')
        nome_morada = dados.find('div', class_='nomeMorada')
        
        # Extrair informações
        nome = nome_morada.find('h3').find('a').text.strip()
        link_farmacia = nome_morada.find('h3').find('a')['href']
        
        # Extrair morada e freguesia, tratando quebras de linha
        morada_elem = nome_morada.find('p', class_='morada')
        
        # Obter o texto completo preservando quebras de linha
        morada_text = morada_elem.get_text(separator='\n').strip()
        morada_lines = [line.strip() for line in morada_text.split('\n') if line.strip()]
        
        # Separar morada (primeira linha) e freguesia (segunda linha, se existir)
        if len(morada_lines) >= 2:
            morada = morada_lines[0]
            freguesia = morada_lines[1]
        elif len(morada_lines) == 1:
            # Se só há uma linha, tentar separar por vírgula ou outros delimitadores
            full_text = morada_lines[0]
            # Procurar por padrões comuns de separação
            if ' - ' in full_text:
                parts = full_text.split(' - ', 1)
                morada = parts[0].strip()
                freguesia = parts[1].strip()
            elif full_text.count(' ') > 5:  # Se há muitas palavras, tentar dividir
                words = full_text.split()
                # Procurar por palavras que indicam freguesia (Sé, São Pedro, etc.)
                freguesia_indicators = ['Sé', 'São', 'Santa', 'Santo', 'União', 'freguesias', 'Montenegro', 'Conceição']
                split_point = None
                for i, word in enumerate(words):
                    if word in freguesia_indicators:
                        split_point = i
                        break
                
                if split_point:
                    morada = ' '.join(words[:split_point]).strip()
                    freguesia = ' '.join(words[split_point:]).strip()
                else:
                    morada = full_text
                    freguesia = 'N/A'
            else:
                morada = full_text
                freguesia = 'N/A'
        else:
            morada = 'N/A'
            freguesia = 'N/A'
        
        # Extrair telefone
        telefone = 'N/A'
        telefone_elem = farmacia.find('a', class_='botao icone telefone')
        if telefone_elem and telefone_elem.find('span'):
            telefone = telefone_elem.find('span').text.strip()
        
        # Extrair horário
        horario_div = dados.find('div', class_='horario')
        horarios = extrair_horario(horario_div) if horario_div else []
        
        # Extrair serviços
        servicos_div = dados.find('div', class_='servicos')
        servicos = extrair_servicos(servicos_div)
        
        # Extrair website
        website = farmacia.find('a', class_='botao icone website')
        website = website['href'] if website else 'N/A'
        
        # Extrair link do mapa
        mapa = farmacia.find('a', class_='mapa')
        link_mapa = mapa['href'] if mapa else 'N/A'
        
        # Extrair coordenadas
        coordenadas = 'N/A'
        
        # Função auxiliar para extrair coordenadas do estilo da imagem
        def extrair_coordenadas_do_estilo(style_text):
            if not style_text:
                return 'N/A'
            
            # Procurar pelo padrão específico: url('imgs/mapa/lat/lng/...)
            pattern = r"url\(['\"]?imgs/mapa/([^/]+)/([^/]+)/"
            match = re.search(pattern, style_text)
            
            if match:
                lat, lng = match.groups()
                try:
                    # Validar se são números válidos
                    lat_float = float(lat)
                    lng_float = float(lng)
                    return f"{lat_float},{lng_float}"
                except ValueError:
                    pass
            
            return 'N/A'
        
        # Tentar extrair coordenadas do elemento de mapa atual
        if mapa:
            # Primeiro, tentar extrair do href do link do mapa
            if 'href' in mapa.attrs and mapa['href'] != '#':
                href = mapa['href']
                # Se o href contém coordenadas diretamente
                if ',' in href and any(char.isdigit() for char in href):
                    # Extrair números que parecem coordenadas
                    coord_match = re.search(r'(-?\d+\.?\d*),(-?\d+\.?\d*)', href)
                    if coord_match:
                        coordenadas = f"{coord_match.group(1)},{coord_match.group(2)}"
                # Se o href é um ID de mapa, tentar extrair do atributo data-coords ou similar
                elif href.startswith('mapa/'):
                    mapa_id = href.replace('mapa/', '')
                    # Procurar por atributos de dados no elemento mapa
                    for attr in mapa.attrs:
                        if 'coord' in attr.lower() or 'lat' in attr.lower() or 'lng' in attr.lower():
                            coordenadas = mapa[attr]
                            break
            
            # Se ainda não encontrou, tentar na imagem do mapa
            if coordenadas == 'N/A' and mapa.find('img'):
                img_elem = mapa.find('img')
                if 'style' in img_elem.attrs:
                    coordenadas = extrair_coordenadas_do_estilo(img_elem['style'])
                
                # Se não encontrou no style, tentar em outros atributos da imagem
                if coordenadas == 'N/A':
                    for attr in ['data-coords', 'data-coordinates', 'data-lat-lng', 'alt', 'title']:
                        if attr in img_elem.attrs and ',' in str(img_elem[attr]):
                            coord_match = re.search(r'(-?\d+\.?\d*),(-?\d+\.?\d*)', str(img_elem[attr]))
                            if coord_match:
                                coordenadas = f"{coord_match.group(1)},{coord_match.group(2)}"
                                break
        
        # Se ainda não encontrou, tentar extrair do link do mapa completo
        if coordenadas == 'N/A' and link_mapa != 'N/A':
            # Procurar por coordenadas no URL do mapa
            coord_patterns = [
                r'lat=([^&]+)&lng=([^&]+)',
                r'lat=([^&]+)&lon=([^&]+)',
                r'q=([^&,]+),([^&]+)',
                r'center=([^&,]+),([^&]+)',
                r'@([^,]+),([^,]+)',
                r'(-?\d+\.?\d*),(-?\d+\.?\d*)'
            ]
            
            for pattern in coord_patterns:
                match = re.search(pattern, link_mapa)
                if match:
                    if len(match.groups()) == 2:
                        lat, lng = match.groups()
                        coordenadas = f"{lat},{lng}"
                        break
        
        # Se ainda não encontrou coordenadas, tentar obter do mapa específico
        if coordenadas == 'N/A' and link_mapa != 'N/A':
            coordenadas = obter_coordenadas_mapa(link_mapa)
        
        # Validar e formatar as coordenadas extraídas
        coordenadas = validar_coordenadas(coordenadas)
        
        # Extrair timestamps
        data_horario = farmacia.get('data-horario', 'N/A')
        inicio_dt = fim_dt = 'N/A'
        if data_horario != 'N/A':
            try:
                inicio_ts, fim_ts = map(int, data_horario.split('-'))
                inicio_dt = datetime.fromtimestamp(inicio_ts / 1000).strftime('%Y-%m-%d %H:%M:%S')
                fim_dt = datetime.fromtimestamp(fim_ts / 1000).strftime('%Y-%m-%d %H:%M:%S')
            except ValueError:
                inicio_dt = fim_dt = 'N/A'
        
        # Verificar se está aberta às 01:15 PM
        aberta = esta_aberta(horarios)
        
        # Armazenar os dados
        farmacias.append({
            'nome': nome,
            'tipo': tipo,
            'morada': morada,
            'freguesia': freguesia,
            'telefone': telefone,
            'horarios': horarios,
            'servicos': servicos,
            'website': website,
            'link_mapa': link_mapa,
            'coordenadas': coordenadas,
            'timestamp_inicio': inicio_dt,
            'timestamp_fim': fim_dt,
            'aberta_13_15': 'Sim' if aberta else 'Não'
        })

# Filtrar farmácias abertas às 01:15 PM
farmacias_abertas = [f for f in farmacias if f['aberta_13_15'] == 'Sim']

# Preparar dados para a tabela
tabela = []
for f in farmacias_abertas:
    tabela.append([
        f['nome'],
        f['tipo'],
        f['morada'],
        f['freguesia'],
        f['telefone'],
        ', '.join(f['horarios']),
        ', '.join(f['servicos']) if f['servicos'] else 'N/A',
        f['website'],
        f['coordenadas']
    ])

# Definir cabeçalhos da tabela
headers = ['Nome', 'Tipo', 'Morada', 'Freguesia', 'Telefone', 'Horários', 'Serviços', 'Website', 'Coordenadas']

# Exibir a tabela com tabulate
print("\nFarmácias abertas às 01:15 PM WEST (30/05/2025):")
print(tabulate(tabela, headers=headers, tablefmt='grid'))

# Informar o número de farmácias encontradas
print(f"\nTotal de farmácias abertas: {len(farmacias_abertas)}")

# Salvar todas as farmácias no arquivo JSON
caminho_json = "../../public/farmacias_faro.json"
salvar_farmacias_json(farmacias, caminho_json)