const { execSync } = require('child_process');
const path = require('path');

console.log('=== 1/2 Generando 53 tarjetas verticales en 1080x1920 (Formato Celular 9:16) ===');
execSync('node scripts/generate_all_cards_vertical.js', { stdio: 'inherit', cwd: path.resolve(__dirname, '..') });

console.log('\n=== 2/2 Compilando video MP4 VERTICAL con música (9 segundos por mensaje) ===');
execSync('node scripts/make_video_vertical.js', { stdio: 'inherit', cwd: path.resolve(__dirname, '..') });

console.log('\n=== ¡VIDEO VERTICAL PARA CELULAR COMPLETADO CON ÉXITO! ===');
