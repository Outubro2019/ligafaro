// Solução radical para o erro "Cannot access 'S' before initialization"
(function() {
  // Definir S globalmente antes de qualquer outro script
  window.S = {};
  globalThis.S = {};
  self.S = {};
  
  // Criar uma variável S no escopo global
  try {
    eval('var S = window.S;');
  } catch (e) {
    console.error("Erro ao definir var S:", e);
  }
  
  // Interceptar e modificar scripts que tentam declarar 'S'
  const originalCreateElement = document.createElement;
  document.createElement = function(tagName) {
    const element = originalCreateElement.call(document, tagName);
    
    if (tagName.toLowerCase() === 'script') {
      const originalSetAttribute = element.setAttribute;
      element.setAttribute = function(name, value) {
        if (name === 'src' && value.includes('gptengineer')) {
          console.log("Bloqueando script gptengineer:", value);
          // Não carrega o script problemático
          return element;
        }
        return originalSetAttribute.call(this, name, value);
      };
      
      // Interceptar conteúdo inline do script
      const originalAppendChild = element.appendChild;
      element.appendChild = function(child) {
        if (child && child.nodeType === Node.TEXT_NODE) {
          // Substituir declarações de 'S' problemáticas
          let content = child.textContent || '';
          if (content.includes('const S =') || content.includes('let S =')) {
            console.log("Modificando declaração de 'S' em script inline");
            content = content.replace(/const\s+S\s*=/, 'const S_renamed =')
                             .replace(/let\s+S\s*=/, 'let S_renamed =');
            child.textContent = content;
          }
        }
        return originalAppendChild.call(this, child);
      };
    }
    
    return element;
  };
  
  // Interceptar carregamento de scripts
  const observer = new MutationObserver(mutations => {
    mutations.forEach(mutation => {
      mutation.addedNodes.forEach(node => {
        if (node.tagName === 'SCRIPT') {
          const src = node.getAttribute('src');
          if (src && src.includes('gptengineer')) {
            console.log("Removendo script problemático:", src);
            node.parentNode.removeChild(node);
          }
        }
      });
    });
  });
  
  // Observar mudanças no DOM
  observer.observe(document.documentElement, {
    childList: true,
    subtree: true
  });
  
  console.log("Proteção avançada contra erro 'Cannot access S before initialization' ativada");
})();