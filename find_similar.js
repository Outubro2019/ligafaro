import fs from 'fs';

// Ler os arquivos JSON
const entidades = JSON.parse(fs.readFileSync('./src/entidades_faro.json', 'utf8'));
const moradas = JSON.parse(fs.readFileSync('./src/moradas_com_coordenadas.json', 'utf8'));

// Entidades que não encontramos
const missingEntities = [
  "APPIA- Associação Pró-Partilha e Inserção do Algarve, IPSS (Banco Alimentar Contra  Fome do Algarve)",
  "Associação Adversários do Mar"
];

// Procurar por nomes semelhantes
missingEntities.forEach(missing => {
  console.log(`\nProcurando correspondências para: "${missing}"`);
  
  // Extrair palavras-chave
  const keywords = missing.split(/\s+/).filter(word => word.length > 3);
  
  // Procurar por moradas que contenham pelo menos uma das palavras-chave
  const potentialMatches = moradas.filter(morada => {
    return keywords.some(keyword => 
      morada.nome.toLowerCase().includes(keyword.toLowerCase())
    );
  });
  
  if (potentialMatches.length > 0) {
    console.log("Possíveis correspondências:");
    potentialMatches.forEach(match => {
      console.log(`- "${match.nome}" (Similaridade: ${calculateSimilarity(missing, match.nome)})`);
    });
  } else {
    console.log("Nenhuma correspondência encontrada.");
  }
});

// Função simples para calcular similaridade entre strings
function calculateSimilarity(str1, str2) {
  const s1 = str1.toLowerCase();
  const s2 = str2.toLowerCase();
  
  // Contar palavras em comum
  const words1 = s1.split(/\s+/);
  const words2 = s2.split(/\s+/);
  
  let commonWords = 0;
  words1.forEach(word => {
    if (words2.some(w => w.includes(word) || word.includes(w))) {
      commonWords++;
    }
  });
  
  // Calcular similaridade como proporção de palavras em comum
  return (commonWords / Math.max(words1.length, words2.length)).toFixed(2);
}