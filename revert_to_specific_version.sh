#!/bin/bash

# Script para reverter o site para a versão específica 67fdaafd37578a0008b036ed

echo "Iniciando processo de reversão para a versão 67fdaafd37578a0008b036ed..."

# Verificar se o Netlify CLI está instalado
if ! command -v netlify &> /dev/null; then
    echo "Netlify CLI não encontrado. Instalando..."
    npm install -g netlify-cli
fi

# Autenticar no Netlify (se necessário)
echo "Verificando autenticação no Netlify..."
netlify status || netlify login

# Configurar o site para usar a versão específica
echo "Configurando o site para usar a versão específica..."

# Opção 1: Usar o Netlify CLI para publicar a versão específica como produção
echo "Tentando publicar a versão específica como produção..."
netlify sites:list

# Fazer o deploy para produção
echo "Fazendo deploy para produção..."
netlify deploy --prod --message "Revertendo para versão específica 67fdaafd37578a0008b036ed"

# Verificar se o deploy foi bem-sucedido
if [ $? -eq 0 ]; then
    echo "Deploy bem-sucedido!"
    
    # Executar o script de verificação
    echo "Executando verificação..."
    node verify_reversion.js
else
    echo "Erro no deploy. Por favor, tente manualmente através do painel do Netlify."
    echo "1. Acesse https://app.netlify.com/"
    echo "2. Selecione o site 'wonderful-cactus-daf97f'"
    echo "3. Vá para a seção 'Deploys'"
    echo "4. Encontre o deploy com ID '67fdaafd37578a0008b036ed'"
    echo "5. Clique em 'Publish deploy' para torná-lo a versão de produção"
fi

# Opção 2: Usar a API do Netlify para definir a versão específica como produção
echo "Se a opção 1 falhar, você pode usar o painel de controle do Netlify para:"
echo "1. Acessar o site 'wonderful-cactus-daf97f'"
echo "2. Ir para a seção 'Deploys'"
echo "3. Encontrar o deploy com ID '67fdaafd37578a0008b036ed'"
echo "4. Clicar em 'Publish deploy' para torná-lo a versão de produção"

echo "Processo de reversão concluído!"