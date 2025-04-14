#!/bin/bash

# Script consolidado para gerir notícias e eventos
# Uso: ./gerir_dados.sh [noticias|eventos]

# Função para exibir ajuda
mostrar_ajuda() {
  echo "Uso: $0 [noticias|eventos]"
  echo ""
  echo "Opções:"
  echo "  noticias    Gera e abre o ficheiro de notícias"
  echo "  eventos     Atualiza e abre o ficheiro de eventos"
  echo "  ajuda       Exibe esta mensagem de ajuda"
  echo ""
  exit 0
}

# Função para gerar e abrir notícias
gerir_noticias() {
  # Executar o script Python para gerar o ficheiro JSON
  echo "A executar script Python para gerar notícias..."
  python3 gerar_noticias_json.py
  
  # Verificar se o script Python foi executado com sucesso
  if [ $? -eq 0 ]; then
    echo "Script Python executado com sucesso!"
    
    # Copiar o ficheiro JSON para a pasta public
    echo "A copiar ficheiro de notícias para a pasta public..."
    mkdir -p public
    cp noticias_faro.json public/
    echo "Ficheiro copiado com sucesso!"
    
    # Abrir a página HTML no navegador padrão
    echo "A abrir a página de notícias no navegador..."
    
    # Detetar o sistema operativo e abrir o navegador de acordo
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
      echo "Sistema operativo não reconhecido. Por favor, abra manualmente o URL: http://localhost:3001/noticias_faro.html"
    fi
  else
    echo "Erro ao executar o script Python. Por favor, verifique os erros acima."
    exit 1
  fi
}

# Função para atualizar e abrir eventos
gerir_eventos() {
  # Executar o script Python para gerar o ficheiro JSON
  echo "A executar script Python para gerar eventos..."
  echo "A procurar eventos da Câmara Municipal de Faro e da Viralagenda..."
  python3 src/services/python/fetch_events.py
  
  # Verificar se o script Python foi executado com sucesso
  if [ $? -eq 0 ]; then
    echo "Script Python executado com sucesso!"
    
    # Copiar o ficheiro JSON para a pasta public
    echo "A copiar ficheiro de eventos para a pasta public..."
    mkdir -p public
    cp src/services/python/events_data.json public/
    echo "Ficheiro copiado com sucesso!"
    
    # Abrir a página de eventos no navegador
    echo "A abrir a página de eventos no navegador..."
    
    # Detetar o sistema operativo e abrir o navegador de acordo
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
      echo "Sistema operativo não reconhecido. Por favor, abra manualmente o URL: http://localhost:3000/events"
    fi
  else
    echo "Erro ao executar o script Python. Por favor, verifique os erros acima."
    exit 1
  fi
}

# Verificar argumentos
if [ $# -eq 0 ]; then
  mostrar_ajuda
fi

# Processar o argumento
case "$1" in
  noticias)
    gerir_noticias
    ;;
  eventos)
    gerir_eventos
    ;;
  ajuda|help|-h|--help)
    mostrar_ajuda
    ;;
  *)
    echo "Opção desconhecida: $1"
    mostrar_ajuda
    ;;
esac

exit 0