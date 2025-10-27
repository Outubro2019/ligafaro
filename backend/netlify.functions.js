// Configuração para as funções Netlify
module.exports = {
  // Configurar as funções para usar ESM
  nodeModuleFormat: "esm",
  
  // Configurar o ambiente de execução
  node_bundler: "esbuild",
  
  // Configurar o tempo limite das funções (em segundos)
  timeout: 30
};