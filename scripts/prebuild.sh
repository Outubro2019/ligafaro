#!/bin/bash
set -e

# Verificar se Python está disponível
if ! command -v python3 &> /dev/null
then
    echo "Python 3 não encontrado. Tentando usar python..."
    if ! command -v python &> /dev/null
    then
        echo "Python não encontrado. Pulando etapas que requerem Python."
        exit 0
    else
        # Criar um alias para python3
        alias python3=python
    fi
fi

# Instalar dependências do Python
# Instalar dependências do Python com pip
echo "Instalando dependências Python..."
if command -v pip3 &> /dev/null; then
    pip3 install -r requirements.txt --no-cache-dir
elif command -v pip &> /dev/null; then
    pip install -r requirements.txt --no-cache-dir
else
    echo "Pip não encontrado. Pulando instalação de dependências Python."
fi

# Verificar se o script de geração de notícias está presente
if [ ! -f gerar_noticias_json.py ]; then
    echo "Erro: Script gerar_noticias_json.py não encontrado!"
    exit 1
fi

# Executar script de geração de notícias
python3 gerar_noticias_json.py

# Verificar se o arquivo JSON de notícias foi gerado
if [ -f noticias_faro.json ]; then
    echo "Copiando arquivo de notícias para a pasta public..."
    mkdir -p public
    cp noticias_faro.json public/
else
    echo "Aviso: Arquivo noticias_faro.json não foi gerado!"
fi

# Verificar se o script de geração de eventos está presente
if [ -f src/services/python/fetch_events.py ]; then
    echo "Executando script de geração de eventos..."
    python3 src/services/python/fetch_events.py
    
    # Verificar se o arquivo JSON foi gerado
    if [ -f src/services/python/events_data.json ]; then
        echo "Copiando arquivo de eventos para a pasta public..."
        mkdir -p public
        cp src/services/python/events_data.json public/
    else
        echo "Aviso: Arquivo events_data.json não foi gerado!"
    fi
else
    echo "Aviso: Script fetch_events.py não encontrado!"
fi

echo "Preparação concluída com sucesso!"