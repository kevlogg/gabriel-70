const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const dir = path.resolve(__dirname, '../capturas-mensajes-1080p');
const files = fs
  .readdirSync(dir)
  .filter((f) => f.endsWith('.png'))
  .sort();

console.log(`Encontradas ${files.length} imágenes PNG.`);

// Concat list for ffmpeg
// Duration: 9 seconds per card (estirado 3 segundos más respecto a los 6s previos)
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

const listFilePath = path.join(dir, 'concat_list.txt');
fs.writeFileSync(listFilePath, listLines.join('\n'), 'utf8');

const audioPath = path.resolve(__dirname, '../LosAngelesAzules-LaCumbiadelInfinito.mp3');
const outVideoPath = path.join(dir, 'video_mensajes_gabriel70.mp4');

const totalDuration = files.length * 9; // e.g. 53 * 9 = 477s (~7.95 min)

console.log(`Generando video de ${totalDuration} segundos (${(totalDuration / 60).toFixed(1)} minutos) a 9 segundos por mensaje...`);

const ffmpegCmd = `ffmpeg -y -f concat -safe 0 -i "${listFilePath}" -stream_loop -1 -i "${audioPath}" -c:v libx264 -pix_fmt yuv420p -r 30 -c:a aac -b:a 192k -t ${totalDuration} "${outVideoPath}"`;

try {
  execSync(ffmpegCmd, { stdio: 'inherit' });
  console.log(`\n✓ Video generado con éxito: ${outVideoPath}`);
  console.log(`Tamaño: ${(fs.statSync(outVideoPath).size / 1024 / 1024).toFixed(2)} MB`);
} catch (err) {
  console.error('Error al generar video:', err.message);
} finally {
  if (fs.existsSync(listFilePath)) {
    fs.unlinkSync(listFilePath);
  }
}
