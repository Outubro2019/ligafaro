# Instruções para Reverter para Versão Específica do Site

Este documento contém instruções para reverter o site para a versão específica `67fdaafd37578a0008b036ed` hospedada no Netlify.

## Opção 1: Usando o Script Automatizado

Foi criado um script automatizado para facilitar o processo de reversão. Para utilizá-lo:

1. Certifique-se de que você tem permissões de administrador no site do Netlify
2. Execute o script usando npm:

```bash
npm run revert
```

Ou diretamente:

```bash
./revert_to_specific_version.sh
```

O script irá:
- Verificar se o Netlify CLI está instalado
- Autenticar no Netlify (se necessário)
- Tentar publicar a versão específica como produção
- Verificar automaticamente se a reversão foi bem-sucedida

## Opção 2: Usando o Painel de Controle do Netlify

Se preferir fazer manualmente ou se o script não funcionar:

1. Acesse o painel de controle do Netlify: https://app.netlify.com/
2. Selecione o site `wonderful-cactus-daf97f`
3. Vá para a seção "Deploys"
4. Encontre o deploy com ID `67fdaafd37578a0008b036ed`
5. Clique em "Publish deploy" para torná-lo a versão de produção

## Opção 3: Usando Redirecionamentos

Foram configurados redirecionamentos para apontar para a versão específica:

1. O arquivo `_redirects` na raiz do projeto
2. O arquivo `dist/_redirects` na pasta de build
3. Configurações adicionais no `netlify.toml`

Após fazer o deploy do site com essas configurações, o site será automaticamente redirecionado para a versão específica.

## Opção 4: Usando a API do Netlify

Se você tem acesso à API do Netlify, pode usar o seguinte comando:

```bash
curl -X POST "https://api.netlify.com/api/v1/sites/wonderful-cactus-daf97f/deploys/67fdaafd37578a0008b036ed/restore" \
  -H "Authorization: Bearer $NETLIFY_AUTH_TOKEN"
```

Substitua `$NETLIFY_AUTH_TOKEN` pelo seu token de autenticação do Netlify.

## Verificação

Após a reversão, você pode verificar se o site está apontando para a versão correta de duas maneiras:

### Verificação Manual

Acesse o site principal e verifique se o conteúdo corresponde à versão específica:
- Site principal: https://wonderful-cactus-daf97f.netlify.app/
- Versão específica: https://67fdaafd37578a0008b036ed--wonderful-cactus-daf97f.netlify.app/

A URL principal deve redirecionar ou mostrar o conteúdo idêntico ao da versão específica `67fdaafd37578a0008b036ed`.

### Verificação Automatizada

Foi criado um script para verificar automaticamente se a reversão foi bem-sucedida:

```bash
npm run verify:reversion
```

Este script irá:
1. Acessar o site principal
2. Acessar a versão específica
3. Comparar os conteúdos para verificar se são idênticos
4. Mostrar o resultado da verificação

## Arquivos de Configuração

Foram criados os seguintes arquivos para facilitar a reversão:

- `netlify.toml`: Configuração principal do Netlify
- `netlify.deploy.toml`: Configuração específica para o deploy da versão específica
- `netlify.cli.json`: Configuração para o Netlify CLI
- `.env.netlify`: Variáveis de ambiente para configuração
- `_redirects`: Regras de redirecionamento
- `revert_to_specific_version.sh`: Script de reversão
- `verify_reversion.js`: Script de verificação

## Comandos Disponíveis

Foram adicionados os seguintes comandos ao `package.json`:

- `npm run deploy`: Faz o deploy para produção
- `npm run verify:reversion`: Verifica se a reversão foi bem-sucedida
- `npm run revert`: Executa o script de reversão e verifica o resultado
- `npm run revert:all`: Método alternativo que faz o deploy e verifica o resultado

## Notas Importantes

1. A reversão para uma versão específica do Netlify requer permissões de administrador no site.
2. O método mais confiável é usar o painel de controle do Netlify para publicar o deploy específico.
3. Os scripts e configurações criados são uma alternativa automatizada, mas podem requerer ajustes dependendo das configurações específicas do seu ambiente.
4. Após a reversão, sempre verifique se o site está funcionando corretamente.