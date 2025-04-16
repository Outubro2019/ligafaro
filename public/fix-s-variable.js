// Script para prevenir o erro "Cannot access 'S' before initialization"
(function() {
  // 1. Definir S como uma variável global
  window.S = window.S || {};
  
  // 2. Interceptar Object.defineProperty para evitar problemas com a variável S
  const originalDefineProperty = Object.defineProperty;
  Object.defineProperty = function(obj, prop, descriptor) {
    // Se alguém tentar definir a propriedade 'S' no objeto global
    if ((obj === window || obj === globalThis) && prop === 'S') {
      console.log("Interceptada tentativa de definir 'S' via Object.defineProperty");
      
      // Se a propriedade S já existir, não faça nada
      if (window.S) {
        return obj;
      }
      
      // Caso contrário, defina S como um objeto vazio
      window.S = {};
      return obj;
    }
    
    // Para todas as outras propriedades, use o comportamento original
    return originalDefineProperty.call(this, obj, prop, descriptor);
  };
  
  // 3. Interceptar Reflect.defineProperty também
  if (typeof Reflect !== 'undefined' && Reflect.defineProperty) {
    const originalReflectDefineProperty = Reflect.defineProperty;
    Reflect.defineProperty = function(obj, prop, descriptor) {
      // Se alguém tentar definir a propriedade 'S' no objeto global
      if ((obj === window || obj === globalThis) && prop === 'S') {
        console.log("Interceptada tentativa de definir 'S' via Reflect.defineProperty");
        
        // Se a propriedade S já existir, não faça nada
        if (window.S) {
          return true;
        }
        
        // Caso contrário, defina S como um objeto vazio
        window.S = {};
        return true;
      }
      
      // Para todas as outras propriedades, use o comportamento original
      return originalReflectDefineProperty.call(this, obj, prop, descriptor);
    };
  }
  
  // 4. Definir S como uma variável no escopo global
  if (typeof S === 'undefined') {
    window.S = {};
  }
  
  // 5. Definir S como uma constante no escopo global
  try {
    if (typeof globalThis !== 'undefined') {
      globalThis.S = globalThis.S || {};
    }
  } catch (e) {
    console.error("Erro ao definir S no globalThis:", e);
  }
  
  console.log("Proteção contra erro 'Cannot access S before initialization' ativada");
})();