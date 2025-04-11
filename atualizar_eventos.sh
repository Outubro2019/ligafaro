#!/bin/bash

# Executar o script Python para gerar o arquivo JSON
echo "Executando script Python para gerar eventos..."
echo "Buscando eventos da Câmara Municipal de Faro e da Viralagenda..."
python3 src/services/python/fetch_events.py

# Verificar se o script Python foi executado com sucesso
if [ $? -eq 0 ]; then
    echo "Script Python executado com sucesso!"
    
    # Copiar o arquivo JSON para a pasta public
    echo "Copiando arquivo de eventos para a pasta public..."
    mkdir -p public
    cp src/services/python/events_data.json public/
    echo "Arquivo copiado com sucesso!"
    
    # Abrir a página de eventos no navegador
    echo "Abrindo a página de eventos no navegador..."
    
    # Detectar o sistema operacional e abrir o navegador de acordo
    if [[ "$OSTYPE" == "darwin"* ]]; then
        # macOS
        open http://localhost:3000/events
    elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
        # Linux
        xdg-open http://localhost:3000/events
    elif [[ "$OSTYPE" == "msys" || "$OSTYPE" == "win32" ]]; then
        # Windows
        start http://localhost:3000/events
    else
        echo "Sistema operacional não reconhecido. Por favor, abra manualmente a URL: http://localhost:3000/events"
    fi
else
    echo "Erro ao executar o script Python. Por favor, verifique os erros acima."
    exit 1
fi