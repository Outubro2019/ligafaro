import fs from 'fs';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Ler os arquivos JSON
const entidades = JSON.parse(fs.readFileSync('./src/entidades_faro.json', 'utf8'));
const moradas = JSON.parse(fs.readFileSync('./src/moradas_com_coordenadas.json', 'utf8'));

// Criar um mapa das moradas usando o nome como chave
const moradasMap = {};
moradas.forEach(morada => {
  moradasMap[morada.nome] = morada.coordenadas;
});

// Contador para estatísticas
let encontrados = 0;
let naoEncontrados = 0;
const naoEncontradosList = [];

// Atualizar as entidades com as coordenadas
entidades.forEach(entidade => {
  if (moradasMap[entidade.nome]) {
    entidade.coordenadas = moradasMap[entidade.nome];
    encontrados++;
  } else {
    naoEncontrados++;
    naoEncontradosList.push(entidade.nome);
  }
});

// Salvar o arquivo atualizado
fs.writeFileSync('./src/entidades_faro.json', JSON.stringify(entidades, null, 2));

console.log(`\nEstatísticas:`);
console.log(`- Total de entidades: ${entidades.length}`);
console.log(`- Entidades com coordenadas encontradas: ${encontrados}`);
console.log(`- Entidades sem coordenadas: ${naoEncontrados}`);

if (naoEncontradosList.length > 0) {
  console.log("\nEntidades sem coordenadas:");
  naoEncontradosList.forEach(nome => {
    console.log(`- ${nome}`);
  });
}