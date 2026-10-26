const { execSync } = require('child_process');
const path = require('path');

console.log('=== 1/2 Regenerando imágenes 1080p en MAYÚSCULAS, más grandes y con saltos por punto ===');
execSync('node scripts/generate_all_cards.js', { stdio: 'inherit', cwd: path.resolve(__dirname, '..') });

console.log('\n=== 2/2 Recompilando video MP4 Full HD con música (9 segundos por mensaje) ===');
execSync('node scripts/make_video.js', { stdio: 'inherit', cwd: path.resolve(__dirname, '..') });

console.log('\n=== ¡TODO LISTO Y ACTUALIZADO! ===');
