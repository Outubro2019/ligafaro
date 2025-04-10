#!/bin/bash

# Executar o script Python para gerar o arquivo JSON
echo "Executando script Python para gerar notícias..."
python3 gerar_noticias_json.py

# Verificar se o script Python foi executado com sucesso
if [ $? -eq 0 ]; then
    echo "Script Python executado com sucesso!"
    
    # Copiar o arquivo JSON para a pasta public
    echo "Copiando arquivo de notícias para a pasta public..."
    mkdir -p public
    cp noticias_faro.json public/
    echo "Arquivo copiado com sucesso!"
    
    # Abrir a página HTML no navegador padrão
    echo "Abrindo a página de notícias no navegador..."
    
    # Detectar o sistema operacional e abrir o navegador de acordo
    if [[ "$OSTYPE" == "darwin"* ]]; then
        # macOS
        open http://localhost:3001/noticias_faro.html
    elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
        # Linux
        xdg-open http://localhost:3001/noticias_faro.html
    elif [[ "$OSTYPE" == "msys" || "$OSTYPE" == "win32" ]]; then
        # Windows
        start http://localhost:3001/noticias_faro.html
    else
        echo "Sistema operacional não reconhecido. Por favor, abra manualmente a URL: http://localhost:3001/noticias_faro.html"
    fi
else
    echo "Erro ao executar o script Python. Por favor, verifique os erros acima."
    exit 1
fi