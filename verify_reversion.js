/**
 * Script para verificar se a reversão para a versão específica foi bem-sucedida
 */

const https = require('https');
const url = require('url');

// URL da versão específica que queremos verificar
const specificVersionUrl = 'https://67fdaafd37578a0008b036ed--wonderful-cactus-daf97f.netlify.app/';
// URL do site principal
const mainSiteUrl = 'https://wonderful-cactus-daf97f.netlify.app/';

/**
 * Função para fazer uma requisição HTTP e obter o conteúdo da página
 */
function fetchUrl(urlToFetch) {
  return new Promise((resolve, reject) => {
    const parsedUrl = url.parse(urlToFetch);
    
    const options = {
      hostname: parsedUrl.hostname,
      path: parsedUrl.path,
      method: 'GET',
      headers: {
        'User-Agent': 'Verification-Script/1.0'
      }
    };

    const req = https.request(options, (res) => {
      // Verificar se houve redirecionamento
      if (res.statusCode >= 300 && res.statusCode < 400) {
        console.log(`Redirecionamento detectado: ${res.statusCode} -> ${res.headers.location}`);
        return resolve({
          statusCode: res.statusCode,
          redirectUrl: res.headers.location,
          body: null
        });
      }

      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        resolve({
          statusCode: res.statusCode,
          headers: res.headers,
          body: data
        });
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    req.end();
  });
}

/**
 * Função principal para verificar a reversão
 */
async function verifyReversion() {
  console.log('Iniciando verificação da reversão...');
  
  try {
    // Verificar a versão específica
    console.log(`\nVerificando a versão específica: ${specificVersionUrl}`);
    const specificVersionResponse = await fetchUrl(specificVersionUrl);
    
    console.log(`Status code: ${specificVersionResponse.statusCode}`);
    if (specificVersionResponse.redirectUrl) {
      console.log(`Redirecionado para: ${specificVersionResponse.redirectUrl}`);
    }
    
    // Verificar o site principal
    console.log(`\nVerificando o site principal: ${mainSiteUrl}`);
    const mainSiteResponse = await fetchUrl(mainSiteUrl);
    
    console.log(`Status code: ${mainSiteResponse.statusCode}`);
    if (mainSiteResponse.redirectUrl) {
      console.log(`Redirecionado para: ${mainSiteResponse.redirectUrl}`);
    }
    
    // Comparar os conteúdos para verificar se são iguais
    if (mainSiteResponse.body && specificVersionResponse.body) {
      const mainSiteHash = hashString(mainSiteResponse.body);
      const specificVersionHash = hashString(specificVersionResponse.body);
      
      console.log(`\nHash do site principal: ${mainSiteHash}`);
      console.log(`Hash da versão específica: ${specificVersionHash}`);
      
      if (mainSiteHash === specificVersionHash) {
        console.log('\n✅ SUCESSO: O site principal está usando a versão específica!');
      } else {
        console.log('\n❌ FALHA: O site principal NÃO está usando a versão específica!');
      }
    } else {
      console.log('\n⚠️ AVISO: Não foi possível comparar os conteúdos das páginas.');
    }
    
    console.log('\nVerificação concluída!');
  } catch (error) {
    console.error('Erro durante a verificação:', error);
  }
}

/**
 * Função simples para gerar um hash de uma string
 */
function hashString(str) {
  let hash = 0;
  if (str.length === 0) return hash;
  
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Converter para inteiro de 32 bits
  }
  
  return hash.toString(16);
}

// Executar a verificação
verifyReversion();