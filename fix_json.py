import re
import json

# Ler o conteúdo do arquivo original
with open('public/entidades_faro.json', 'r', encoding='utf-8') as f:
    content = f.read()

# Padrão para encontrar objetos JSON
pattern = r'{\s*"cmf_url":[^}]*"has_more_categories":\s*(true|false)\s*}'

# Encontrar todos os objetos JSON
matches = re.findall(pattern, content)

# Contar o número de entidades encontradas
print(f"Encontradas {len(matches)} entidades")

# Extrair manualmente as entidades
entities = []
start_pos = 0
entity_count = 0

while True:
    # Encontrar o início de uma entidade
    start_entity = content.find('{"cmf_url":', start_pos)
    if start_entity == -1:
        break
    
    # Encontrar o fim da entidade
    end_entity = content.find('  }', start_entity)
    if end_entity == -1:
        break
    
    # Extrair a entidade
    entity_str = content[start_entity:end_entity+3]
    
    try:
        # Tentar analisar a entidade como JSON
        entity = json.loads(entity_str)
        entities.append(entity)
        entity_count += 1
        print(f"Entidade {entity_count} extraída com sucesso")
    except json.JSONDecodeError as e:
        print(f"Erro ao analisar entidade {entity_count+1}: {e}")
    
    # Avançar para a próxima entidade
    start_pos = end_entity + 3

print(f"Total de {len(entities)} entidades extraídas com sucesso")

# Salvar as entidades em um novo arquivo JSON
with open('src/entidades_faro.json', 'w', encoding='utf-8') as f:
    json.dump(entities, f, ensure_ascii=False, indent=2)

print("Arquivo corrigido salvo em src/entidades_faro.json")