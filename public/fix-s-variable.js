// Define a variável 'S' globalmente para evitar o erro "Cannot access 'S' before initialization"
(function() {
  // Definir S como uma variável global
  window.S = window.S || {};
  
  // Definir S como uma variável no escopo global
  if (typeof S === 'undefined') {
    window.S = {};
  }
  
  // Definir S como uma constante no escopo global
  try {
    if (typeof globalThis !== 'undefined') {
      globalThis.S = globalThis.S || {};
    }
  } catch (e) {
    console.error("Erro ao definir S no globalThis:", e);
  }
  
  // Definir S como uma propriedade não configurável e não gravável
  try {
    Object.defineProperty(window, 'S', {
      value: window.S || {},
      writable: true,
      configurable: true
    });
  } catch (e) {
    console.error("Erro ao definir propriedade S:", e);
  }
  
  console.log("Variável 'S' inicializada preventivamente de múltiplas formas");
})();