# Scripts e Utilitários - LigaFaro

Documentação dos scripts Python e JavaScript para processamento de dados do projeto LigaFaro.

## 📂 Estrutura de Scripts

### Python Scripts

#### 1. **gerar_noticias_json.py**
Gera arquivo JSON com notícias agregadas de múltiplas fontes.

```bash
python scripts/gerar_noticias_json.py
```

**Funcionalidades:**
- Scraping de notícias
- Formatação JSON
- Validação de dados

#### 2. **noticias_faro.py**
Script especializado em notícias de Faro.

```bash
python scripts/noticias_faro.py
```

#### 3. **fix_json.py**
Corretor de erros em arquivos JSON.

```bash
python scripts/fix_json.py <arquivo.json>
```

#### 4. **count_entities.py**
Contador e analisador de entidades.

```bash
python scripts/count_entities.py
```

#### 5. **update_requirements.py**
Atualiza arquivo requirements.txt com versões atuais.

```bash
python scripts/update_requirements.py
```

#### 6. **Noticias.py & Noticias_completas.py**
Processadores avançados de notícias.

```bash
python scripts/Noticias.py
python scripts/Noticias_completas.py
```

### JavaScript/Node Scripts

#### 1. **update_coordinates.js**
Atualiza coordenadas geográficas de endereços.

```bash
node scripts/update_coordinates.js
```

#### 2. **verify_coordinates.js**
Verifica validade de coordenadas.

```bash
node scripts/verify_coordinates.js
```

#### 3. **update_missing.js**
Preenche dados faltantes.

```bash
node scripts/update_missing.js
```

#### 4. **find_similar.js**
Encontra registros similares em datasets.

```bash
node scripts/find_similar.js
```

### Shell Scripts

#### 1. **gerir_dados.sh**
Script principal de gestão de dados.

```bash
sh scripts/gerir_dados.sh
```

#### 2. **prebuild.sh**
Preparação pré-build do projeto.

```bash
sh scripts/prebuild.sh
```

## 🛠️ Configuração do Ambiente

### Dependências Python

```bash
pip install -r requirements.txt
```

**Dependências necessárias:**
- gnews==0.1.3
- requests==2.31.0
- beautifulsoup4==4.12.2
- pandas (recomendado)
- numpy (recomendado)

### Instalação

```bash
# 1. Clone o repositório
git clone https://github.com/Outubro2019/ligafaro.git
cd ligafaro

# 2. Crie ambiente virtual
python -m venv venv

# 3. Ative ambiente virtual
# MacOS/Linux:
source venv/bin/activate
# Windows:
venv\Scripts\activate

# 4. Instale dependências
pip install -r requirements.txt
```

## 📊 Fluxo de Processamento de Dados

```
┌─────────────────────────────────────────────┐
│     APIs Externas (GNews, NewsAPI, etc)    │
└────────────────┬────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────┐
│  Scraping & Coleta (gerar_noticias_json.py)│
└────────────────┬────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────┐
│  Processamento (Noticias.py, fix_json.py)  │
└────────────────┬────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────┐
│  Validação (verify_coordinates.js)          │
└────────────────┬────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────┐
│  Armazenamento (JSON files em /public)      │
└──────────────────────────────────────────────┘
```

## 🎯 Casos de Uso Comuns

### Atualizar Notícias
```bash
python scripts/gerar_noticias_json.py && \
node scripts/verify_coordinates.js && \
python scripts/fix_json.py public/noticias_faro.json
```

### Validar e Limpar Dados
```bash
python scripts/fix_json.py public/entidades_faro.json
node scripts/verify_coordinates.js
python scripts/count_entities.py
```

### Atualizar Coordenadas
```bash
node scripts/update_coordinates.js
node scripts/verify_coordinates.js
```

## 📈 Monitoramento e Logs

Os scripts geram logs em:
- Stdout (console)
- Arquivos de log (quando disponível)

## 🔍 Troubleshooting

### Erro: "ModuleNotFoundError: No module named 'gnews'"
```bash
pip install gnews==0.1.3
```

### Erro: "Cannot find module 'axios'"
```bash
npm install axios
```

### JSON Inválido
```bash
python scripts/fix_json.py <arquivo.json>
```

## 📝 Adicionando Novos Scripts

Padrão recomendado:

```python
#!/usr/bin/env python3
"""
Script: Descrição do script
Uso: python script_name.py
Dependências: lib1, lib2
"""

import json
import sys

def main():
    """Função principal"""
    pass

if __name__ == "__main__":
    main()
```

## 🤝 Contribuições

Para adicionar novos scripts:
1. Coloque em `/scripts`
2. Adicione documentação em README_SCRIPTS.md
3. Atualize requirements.txt se necessário
4. Teste localmente
5. Faça commit com mensagem descritiva

## 📚 Referências

- [GNews Python Docs](https://github.com/riencosmetics/gnews)
- [BeautifulSoup Docs](https://www.crummy.com/software/BeautifulSoup/)
- [Requests Library](https://requests.readthedocs.io/)

---

**Última atualização:** 27 de Outubro de 2025
