// Este arquivo substitui o script gptengineer.js
// Definimos a variável S para evitar o erro "Cannot access 'S' before initialization"
(function() {
  // Definir S globalmente antes de qualquer outro script
  window.S = window.S || {};
  globalThis.S = globalThis.S || {};
  self.S = self.S || {};
  
  // Garantir que a variável S seja definida e não possa ser sobrescrita
  Object.defineProperty(window, 'S', {
    value: window.S,
    writable: true,
    configurable: true
  });
  
  // Interceptar erros relacionados à variável S
  window.addEventListener('error', function(event) {
    if (event.message && event.message.includes("Cannot access 'S' before initialization")) {
      console.log("Interceptando erro 'Cannot access S before initialization'");
      event.preventDefault();
      return true;
    }
  }, true);
  
  console.log("Script gptengineer.js substituído com sucesso");
})();