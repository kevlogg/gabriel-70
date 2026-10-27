const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const dir = path.resolve(__dirname, '../capturas-mensajes-vertical');
const files = fs
  .readdirSync(dir)
  .filter((f) => f.endsWith('.png') && !f.includes('test'))
  .sort();

console.log(`Encontradas ${files.length} imágenes PNG verticales.`);

if (files.length === 0) {
  console.error('No se encontraron imágenes en:', dir);
  process.exit(1);
}

// Concat list for ffmpeg
// Duration: 9 seconds per card (exactamente igual al video horizontal)
const listLines = [];
for (const file of files) {
  const fullPath = path.join(dir, file).replace(/\\/g, '/');
  listLines.push(`file '${fullPath}'`);
  listLines.push('duration 9');
}
// Repeat last file as required by ffmpeg concat demuxer
if (files.length > 0) {
  const lastPath = path.join(dir, files[files.length - 1]).replace(/\\/g, '/');
  listLines.push(`file '${lastPath}'`);
}

const listFilePath = path.join(dir, 'concat_list_vertical.txt');
fs.writeFileSync(listFilePath, listLines.join('\n'), 'utf8');

const audioPath = path.resolve(__dirname, '../LosAngelesAzules-LaCumbiadelInfinito.mp3');
const outVideoPath = path.join(dir, 'video_mensajes_gabriel70_vertical.mp4');

const totalDuration = files.length * 9; // e.g. 53 * 9 = 477s (~7.95 min)

console.log(`Generando video VERTICAL de ${totalDuration} segundos (${(totalDuration / 60).toFixed(1)} minutos) a 9 segundos por mensaje...`);
console.log(`Resolución: 1080x1920 (Full HD Vertical / 9:16) con audio: Los Ángeles Azules...`);

const ffmpegCmd = `ffmpeg -y -f concat -safe 0 -i "${listFilePath}" -stream_loop -1 -i "${audioPath}" -vf "scale=1080:1920" -c:v libx264 -pix_fmt yuv420p -r 30 -c:a aac -b:a 192k -t ${totalDuration} "${outVideoPath}"`;

try {
  execSync(ffmpegCmd, { stdio: 'inherit' });
  console.log(`\n✓ Video vertical generado con éxito: ${outVideoPath}`);
  console.log(`Tamaño: ${(fs.statSync(outVideoPath).size / 1024 / 1024).toFixed(2)} MB`);
} catch (err) {
  console.error('Error al generar video vertical:', err.message);
} finally {
  if (fs.existsSync(listFilePath)) {
    fs.unlinkSync(listFilePath);
  }
}
