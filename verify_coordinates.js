import fs from 'fs';

// Ler o arquivo JSON
const entidades = JSON.parse(fs.readFileSync('./src/entidades_faro.json', 'utf8'));

// Verificar se todas as entidades têm coordenadas
const semCoordenadas = entidades.filter(e => !e.coordenadas);

if (semCoordenadas.length === 0) {
  console.log('Todas as entidades possuem coordenadas! ✅');
} else {
  console.log(`Ainda existem ${semCoordenadas.length} entidades sem coordenadas:`);
  semCoordenadas.forEach(e => console.log(`- ${e.nome}`));
}

// Estatísticas
console.log(`\nEstatísticas:`);
console.log(`- Total de entidades: ${entidades.length}`);
console.log(`- Entidades com coordenadas: ${entidades.length - semCoordenadas.length}`);