import json

try:
    with open('src/entidades_faro.json', 'r', encoding='utf-8') as f:
        data = json.load(f)
    print(f'O arquivo JSON contém {len(data)} entidades')
except json.JSONDecodeError as e:
    print(f'Erro ao decodificar JSON: {e}')