import json
import re
import sys
import os

def extract_words_from_json(json_filepath):
    """
    Extrai uma lista de palavras de um arquivo JSON.
    Retorna um conjunto de strings (palavras).
    """
    words = set()
    try:
        with open(json_filepath, 'r', encoding='utf-8') as f:
            data_json = json.load(f)

        for letter_list in data_json.values():
            if isinstance(letter_list, list):
                for word in letter_list:
                    words.add(word)

        print(f"Encontradas {len(words)} palavras únicas no arquivo JSON.")
        return words

    except FileNotFoundError:
        print(f"Erro: O arquivo JSON '{json_filepath}' não foi encontrado.")
        sys.exit(1)
    except json.JSONDecodeError:
        print(f"Erro: O arquivo JSON '{json_filepath}' não contém JSON válido.")
        sys.exit(1)
    except Exception as e:
        print(f"Ocorreu um erro ao ler ou processar o arquivo JSON '{json_filepath}': {e}")
        sys.exit(1)

def extract_words_from_js(js_filepath):
    """
    Extrai uma lista de palavras de um arquivo JavaScript.
    Retorna um conjunto de strings (palavras).
    """
    words = set()
    try:
        with open(js_filepath, 'r', encoding='utf-8') as f:
            content = f.read()

        # Regex para encontrar arrays de strings no JS.
        # Modificada para capturar o formato específico do arquivo palavras.js
        match = re.search(r'const palavras = \[\s*(.*?)\s*\];', content, re.DOTALL)

        if match:
            # Extrai o conteúdo entre os colchetes/parentesis retos
            array_content = match.group(1)
            # Encontra todas as strings dentro do conteúdo extraído
            # Modificado para capturar o formato específico do arquivo palavras.js
            words = re.findall(r'[\"\']([^\"\']+)[\"\']', array_content)
            
            # Limpa as palavras (remove comentários e espaços em branco)
            cleaned_words = []
            for word in words:
                # Ignora linhas que parecem ser comentários
                if not word.strip().startswith('//') and len(word.strip()) == 5:
                    cleaned_words.append(word.strip().lower())
            
            print(f"Encontradas {len(cleaned_words)} palavras potenciais no ficheiro JS.")
            return set(cleaned_words)
        else:
            print(f"Aviso: Não foi possível encontrar um array de palavras reconhecível em '{js_filepath}' usando regex.")
            return set()

    except FileNotFoundError:
        print(f"Erro: O ficheiro JavaScript '{js_filepath}' não foi encontrado.")
        sys.exit(1)
    except Exception as e:
        print(f"Ocorreu um erro ao ler ou processar o ficheiro JS '{js_filepath}': {e}")
        sys.exit(1)

def update_js_file(js_filepath, json_filepath, output_filepath):
    """
    Atualiza o arquivo JavaScript com palavras do arquivo JSON e salva em um novo arquivo JavaScript.
    """
    # 1. Extrair palavras do arquivo JSON
    words_from_json = extract_words_from_json(json_filepath)
    if not words_from_json:
        print("Nenhuma palavra extraída do JSON. Saindo.")
        return

    # 2. Extrair palavras do arquivo JavaScript existente
    existing_words_set = extract_words_from_js(js_filepath)

    # 3. Adicionar novas palavras do JSON ao conjunto de palavras existentes no JS
    newly_added_count = 0
    words_added_report = []

    for json_word in words_from_json:
        if json_word not in existing_words_set:
            existing_words_set.add(json_word)
            words_added_report.append(json_word)
            newly_added_count += 1

    # 4. Organizar as palavras alfabeticamente
    sorted_words = sorted(existing_words_set)

    # 5. Criar o novo conteúdo do array JS
    updated_array_content = "    " + ",\n    ".join(f"'{word}'" for word in sorted_words)

    # 6. Criar o conteúdo final do arquivo JS com o cabeçalho
    header = "// Lista de palavras de 5 letras em português\nconst palavras = [\n"
    footer = f"\n    // Total: {len(sorted_words)} palavras organizadas em ordem alfabética\n];"
    updated_content = header + updated_array_content + footer

    # 7. Salvar o conteúdo atualizado no novo arquivo JS
    try:
        with open(output_filepath, 'w', encoding='utf-8') as f_out:
            f_out.write(updated_content)

        print("-" * 30)
        print(f"Total de palavras no novo arquivo JS: {len(sorted_words)}")
        if newly_added_count > 0:
            print(f"Foram adicionadas {newly_added_count} novas palavras ao arquivo JS.")
            # print("Palavras adicionadas:", ", ".join(words_added_report)) # Descomente para ver as palavras exatas
        else:
            print("Nenhuma palavra nova foi adicionada ao arquivo JS.")

        print(f"Arquivo JS atualizado e salvo em '{output_filepath}'")

    except Exception as e:
        print(f"Ocorreu um erro ao escrever o arquivo de saída '{output_filepath}': {e}")
        sys.exit(1)

# --- Configuração e Execução ---
if __name__ == "__main__":
    # --- DEFINA OS NOMES DOS SEUS ARQUIVOS AQUI ---
    javascript_file = 'palavras.js'  # O SEU ARQUIVO JS COM A LISTA
    base_json_file = 'palavras_5_letras_final.json' # O SEU JSON ORGANIZADO EXISTENTE
    updated_js_file = 'wordle_list_atualizado.js' # NOME DO NOVO ARQUIVO JS A SER CRIADO

    # Verifica se o arquivo JS existe antes de tentar
    if not os.path.exists(javascript_file):
        print(f"Erro Crítico: O arquivo JavaScript '{javascript_file}' não foi encontrado.")
        print("Por favor, verifique o nome e a localização do arquivo.")
    # Verifica se o arquivo JSON base existe
    elif not os.path.exists(base_json_file):
        print(f"Erro Crítico: O arquivo JSON base '{base_json_file}' não foi encontrado.")
        print("Este script precisa do arquivo JSON existente para comparar.")
        sys.exit(1)
    else:
        update_js_file(javascript_file, base_json_file, updated_js_file)
