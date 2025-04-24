import json
import sys

def filtrar_palavras_5_letras_por_chave(ficheiro_entrada, ficheiro_saida):
    """
    Lê um ficheiro JSON estruturado por letras (A, B, C...) e filtra as listas
    para conter apenas palavras de 5 letras.

    Args:
        ficheiro_entrada (str): Caminho para o ficheiro JSON de entrada.
                                (Ex: 'saida_organizada.json')
        ficheiro_saida (str): Caminho para o ficheiro JSON de saída.
                              (Ex: 'palavras_5_letras_final.json')
    """
    try:
        # Abre e lê o ficheiro JSON de entrada
        with open(ficheiro_entrada, 'r', encoding='utf-8') as f_in:
            dados_entrada = json.load(f_in)
    except FileNotFoundError:
        print(f"Erro: O ficheiro de entrada '{ficheiro_entrada}' não foi encontrado.")
        sys.exit(1)
    except json.JSONDecodeError:
        print(f"Erro: O ficheiro '{ficheiro_entrada}' não contém JSON válido.")
        sys.exit(1)
    except Exception as e:
        print(f"Ocorreu um erro inesperado ao ler o ficheiro '{ficheiro_entrada}': {e}")
        sys.exit(1)

    # Dicionário para guardar os resultados filtrados
    dados_filtrados = {}
    contador_total_palavras = 0

    # Itera sobre as chaves (letras) ordenadas do dicionário de entrada
    for chave in sorted(dados_entrada.keys()):
        # Verifica se o valor associado à chave é realmente uma lista
        if isinstance(dados_entrada[chave], list):
            lista_palavras_original = dados_entrada[chave]
            lista_filtrada_5_letras = []

            # Filtra as palavras da lista atual
            for palavra in lista_palavras_original:
                # Garante que é uma string e tem 5 letras
                if isinstance(palavra, str) and len(palavra) == 5:
                    lista_filtrada_5_letras.append(palavra)

            # Adiciona ao dicionário de saída APENAS se encontrou palavras de 5 letras para essa chave
            if lista_filtrada_5_letras:
                dados_filtrados[chave] = lista_filtrada_5_letras
                contador_total_palavras += len(lista_filtrada_5_letras)
        else:
             print(f"Aviso: Chave '{chave}' no ficheiro de entrada não contém uma lista. Ignorando.")


    # Verifica se alguma palavra foi encontrada
    if not dados_filtrados:
        print("Nenhuma palavra de 5 letras foi encontrada no ficheiro de entrada.")
        return # Pode sair ou criar um ficheiro vazio, aqui optamos por sair

    try:
        # Abre e escreve o ficheiro JSON de saída
        with open(ficheiro_saida, 'w', encoding='utf-8') as f_out:
            # ensure_ascii=False para caracteres acentuados
            # indent=2 para formatação legível
            json.dump(dados_filtrados, f_out, ensure_ascii=False, indent=2)

        print(f"Foram encontradas {contador_total_palavras} palavras de 5 letras.")
        print(f"As palavras filtradas foram salvas em '{ficheiro_saida}'.")

    except Exception as e:
        print(f"Ocorreu um erro ao escrever o ficheiro de saída '{ficheiro_saida}': {e}")
        sys.exit(1)

# --- Execução do Script ---
if __name__ == "__main__":
    # Define os nomes dos ficheiros
    # Assumindo que o ficheiro organizado da etapa anterior é a entrada
    arquivo_json_entrada = 'public/jogo-wordle/saida_organizada.json'
    # Nome do ficheiro final com apenas as palavras de 5 letras
    arquivo_json_saida = 'public/jogo-wordle/palavras_5_letras_final.json'

    # Chama a função principal para realizar a filtragem
    filtrar_palavras_5_letras_por_chave(arquivo_json_entrada, arquivo_json_saida)