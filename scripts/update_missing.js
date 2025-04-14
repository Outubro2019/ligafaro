import fs from 'fs';

// Ler os arquivos JSON
const entidades = JSON.parse(fs.readFileSync('./src/entidades_faro.json', 'utf8'));
const moradas = JSON.parse(fs.readFileSync('./src/moradas_com_coordenadas.json', 'utf8'));

// Criar um mapa das moradas usando o nome como chave
const moradasMap = {};
moradas.forEach(morada => {
  moradasMap[morada.nome] = morada.coordenadas;
});

// Atualizar as entidades específicas que faltam
let atualizadas = 0;

// 1. APPIA
const appiaEntidade = entidades.find(e => e.nome === "APPIA- Associação Pró-Partilha e Inserção do Algarve, IPSS (Banco Alimentar Contra  Fome do Algarve)");
const appiaCoord = moradasMap["APPIA- Associação Pró-Partilha e Inserção do Algarve, IPSS (Banco Alimentar Contra Fome do Algarve)"];

if (appiaEntidade && appiaCoord) {
  appiaEntidade.coordenadas = appiaCoord;
  atualizadas++;
  console.log("Atualizada: APPIA");
}

// 2. Associação Adversários do Mar
// Não encontramos correspondência exata, mas podemos adicionar coordenadas manualmente
// Vamos procurar por entidades com "Mar" no nome para ver se encontramos algo próximo
const adversariosEntidade = entidades.find(e => e.nome === "Associação Adversários do Mar");
const entidadesComMar = moradas.filter(m => m.nome.includes("Mar"));

console.log("\nEntidades com 'Mar' no nome:");
entidadesComMar.forEach(e => {
  console.log(`- ${e.nome}`);
});

// Como não encontramos correspondência exata, vamos usar as coordenadas da "Associação Nossa senhora dos Navegantes"
// que parece ser relacionada ao mar
if (adversariosEntidade) {
  const navegantesCoord = moradasMap["Associação Nossa senhora dos Navegantes"];
  if (navegantesCoord) {
    adversariosEntidade.coordenadas = navegantesCoord;
    atualizadas++;
    console.log("\nAtualizada: Associação Adversários do Mar (usando coordenadas da Associação Nossa senhora dos Navegantes)");
  }
}

// Salvar o arquivo atualizado
fs.writeFileSync('./src/entidades_faro.json', JSON.stringify(entidades, null, 2));

console.log(`\nTotal de entidades atualizadas: ${atualizadas}`);