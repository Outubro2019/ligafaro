#!/bin/bash

# Script para executar o jogo "Desafia Faro!" sem problemas de CORS
# Criado em: 22/04/2025

echo "=== Iniciando o Jogo Desafia Faro! ==="

# Função para limpar ao sair
cleanup() {
    echo ""
    echo "Encerrando o servidor..."
    # Mata qualquer processo Python que esteja rodando na porta 8000
    # Apenas se o servidor foi iniciado por este script
    if [ ! -z "$SERVER_PID" ]; then
        kill $SERVER_PID 2>/dev/null || true
        echo "Servidor encerrado."
    fi
    echo "Obrigado por jogar!"
    exit 0
}

# Captura Ctrl+C para encerrar corretamente
trap cleanup INT

# Verifica se o Python 3 está instalado
if ! command -v python3 &> /dev/null; then
    echo "Erro: Python 3 não encontrado. Por favor, instale o Python 3."
    exit 1
fi

# Verifica se a porta 8000 já está em uso
if lsof -Pi :8000 -sTCP:LISTEN -t >/dev/null ; then
    echo "Detectado: Um servidor já está rodando na porta 8000."
    echo "Usando o servidor existente..."
    SERVER_STARTED_BY_SCRIPT=false
else
    echo "Iniciando servidor HTTP local na porta 8000..."
    # Inicia o servidor em segundo plano
    python3 -m http.server 8000 &
    SERVER_PID=$!
    SERVER_STARTED_BY_SCRIPT=true
    
    # Aguarda o servidor iniciar
    sleep 1
    echo "Servidor iniciado com sucesso!"
fi

echo "Abrindo o jogo no navegador..."

# Abre o navegador padrão (funciona em macOS, Linux e Windows com WSL)
if [[ "$OSTYPE" == "darwin"* ]]; then
    # macOS
    open "http://localhost:8000/index.html"
elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
    # Linux
    xdg-open "http://localhost:8000/index.html" || sensible-browser "http://localhost:8000/index.html" || x-www-browser "http://localhost:8000/index.html" || gnome-open "http://localhost:8000/index.html"
else
    # Windows ou outro
    echo "Por favor, abra manualmente o seguinte URL no seu navegador:"
    echo "http://localhost:8000/index.html"
fi

echo ""
echo "O jogo está rodando!"

if [ "$SERVER_STARTED_BY_SCRIPT" = true ]; then
    echo "Pressione Ctrl+C para encerrar o servidor quando terminar de jogar."
    # Mantém o script rodando até que seja interrompido
    wait $SERVER_PID
else
    echo "Usando um servidor existente. Este script não encerrará o servidor ao sair."
    echo "Para encerrar o servidor manualmente, use: kill \$(lsof -t -i:8000)"
fi