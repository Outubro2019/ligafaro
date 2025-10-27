// Arquivo de configuração para desenvolvimento local do Netlify
import { createServer } from 'http';
import { handler } from './functions/server.js';

// Porta para o servidor local
const PORT = process.env.PORT || 9000;

// Criar um servidor HTTP simples
const server = createServer(async (req, res) => {
  // Configurar cabeçalhos CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  // Lidar com requisições OPTIONS (preflight CORS)
  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }
  
  // Extrair o caminho da URL
  const url = new URL(req.url, `http://${req.headers.host}`);
  const path = url.pathname.replace(/^\/\.netlify\/functions\/server/, '');
  
  // Criar um objeto de evento no formato que o handler espera
  const event = {
    path,
    httpMethod: req.method,
    headers: req.headers,
    queryStringParameters: Object.fromEntries(url.searchParams),
    body: '',
  };
  
  // Coletar o corpo da requisição, se houver
  if (req.method === 'POST') {
    const chunks = [];
    req.on('data', (chunk) => chunks.push(chunk));
    await new Promise((resolve) => req.on('end', resolve));
    event.body = Buffer.concat(chunks).toString();
  }
  
  try {
    // Chamar o handler da função Netlify
    const response = await handler(event);
    
    // Enviar a resposta
    res.writeHead(response.statusCode, response.headers);
    res.end(response.body);
  } catch (error) {
    console.error('Erro ao processar requisição:', error);
    res.writeHead(500, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Erro interno do servidor' }));
  }
});

// Iniciar o servidor
server.listen(PORT, () => {
  console.log(`Servidor de funções Netlify rodando em http://localhost:${PORT}`);
  console.log(`Acesse /.netlify/functions/server para testar as funções`);
});