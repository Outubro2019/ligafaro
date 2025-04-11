# Guia de Deploy - Faro Vibe Network

Este documento contém instruções para configurar e fazer o deploy do projeto Faro Vibe Network no Netlify.

## Pré-requisitos

- Conta no [Netlify](https://www.netlify.com/)
- Git instalado
- Node.js (versão 18 ou superior)
- Python 3 (para scripts de geração de dados)

## Configuração do Ambiente

### 1. Variáveis de Ambiente

O projeto requer as seguintes variáveis de ambiente:

- `OPENAI_API_KEY`: Chave da API OpenAI para o chatbot
- `WEATHER_API_KEY`: Chave da API de previsão do tempo
- `NEWS_API_KEY`: Chave da API de notícias

Você pode configurar estas variáveis no painel de controle do Netlify:

1. Acesse o painel do seu site no Netlify
2. Vá para **Site settings** > **Build & deploy** > **Environment**
3. Adicione cada variável de ambiente com seu respectivo valor

### 2. Dependências do Python

O projeto utiliza scripts Python para gerar dados de notícias e eventos. As dependências Python estão listadas no arquivo `requirements.txt`.

## Deploy no Netlify

### Opção 1: Deploy Automático via GitHub

1. Faça o fork ou clone deste repositório para sua conta GitHub
2. No Netlify, clique em **New site from Git**
3. Selecione GitHub como provedor e autorize o Netlify
4. Selecione o repositório
5. Configure as opções de build:
   - **Build command**: `./scripts/prebuild.sh && npm run build`
   - **Publish directory**: `dist`
6. Clique em **Deploy site**

### Opção 2: Deploy Manual

1. Clone o repositório:
   ```
   git clone <url-do-repositorio>
   cd faro-vibe-network
   ```

2. Instale as dependências:
   ```
   npm install
   ```

3. Construa o projeto:
   ```
   ./scripts/prebuild.sh && npm run build
   ```

4. Faça o deploy usando a CLI do Netlify:
   ```
   npx netlify-cli deploy --prod
   ```

## Solução de Problemas

### Servidor Node não carrega no deploy

Se o servidor Node não estiver carregando no ambiente de deploy, verifique:

1. **Variáveis de ambiente**: Certifique-se de que todas as variáveis de ambiente necessárias estão configuradas no Netlify.

2. **Funções Netlify**: Verifique se as funções Netlify estão configuradas corretamente:
   - O diretório `functions/` deve conter o arquivo `server.js`
   - O arquivo `netlify.toml` deve ter a configuração correta para as funções

3. **Logs de build**: Verifique os logs de build no painel do Netlify para identificar possíveis erros durante o processo de build.

4. **Redirecionamentos**: Verifique se os redirecionamentos estão configurados corretamente no arquivo `_redirects` ou `netlify.toml`.

### Testando Localmente

Para testar o ambiente de funções Netlify localmente:

```
npm run netlify:serve
```

Este comando inicia o servidor de desenvolvimento Vite e o servidor de funções Netlify simultaneamente.

## Estrutura do Projeto

- `functions/`: Contém as funções serverless do Netlify
- `public/`: Arquivos estáticos servidos diretamente
- `src/`: Código-fonte do frontend
- `scripts/`: Scripts de automação, incluindo o script de pré-build

## Recursos Adicionais

- [Documentação do Netlify Functions](https://docs.netlify.com/functions/overview/)
- [Guia de Deploy do Netlify](https://docs.netlify.com/site-deploys/overview/)
- [Configuração de Variáveis de Ambiente no Netlify](https://docs.netlify.com/configure-builds/environment-variables/)