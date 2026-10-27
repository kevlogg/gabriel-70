const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const { generateVerticalCardHtml } = require('./card_template_vertical');

function sanitizeFilename(name) {
  return name
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-zA-Z0-9_-]/g, '_')
    .replace(/_+/g, '_')
    .slice(0, 40);
}

async function main() {
  const jsonPath = path.resolve(__dirname, '../capturas-mensajes-1080p/mensajes.json');
  if (!fs.existsSync(jsonPath)) {
    console.error('Error: no se encontró capturas-mensajes-1080p/mensajes.json');
    process.exit(1);
  }

  const items = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
  console.log(`Cargados ${items.length} mensajes para generar en formato vertical (1080x1920)...`);

  const outDir = path.resolve(__dirname, '../capturas-mensajes-vertical');
  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
  }

  // Remove existing test files
  const testPng = path.join(outDir, '01_test.png');
  if (fs.existsSync(testPng)) {
    fs.unlinkSync(testPng);
  }

  const chromePath = '"C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe"';
  const tmpHtml = path.join(__dirname, 'tmp_vertical_card.html');

  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    const num = String(i + 1).padStart(2, '0');
    const safeName = sanitizeFilename(item.name);
    const filename = `${num}_${safeName}.png`;
    const outPng = path.join(outDir, filename);

    const html = generateVerticalCardHtml({
      name: item.name,
      message: item.message,
      companions: item.companions,
      index: i + 1,
      total: items.length,
    });

    fs.writeFileSync(tmpHtml, html, 'utf8');

    try {
      execSync(
        `${chromePath} --headless=new --disable-gpu --screenshot="${outPng}" --window-size=1080,1920 --virtual-time-budget=2000 --hide-scrollbars "file://${tmpHtml.replace(/\\/g, '/')}"`,
        { stdio: 'pipe' }
      );
      process.stdout.write(`\r[${i + 1}/${items.length}] Tarjeta vertical generada: ${filename}`);
    } catch (err) {
      console.error(`\nError generando ${filename}:`, err.message);
    }
  }

  if (fs.existsSync(tmpHtml)) {
    fs.unlinkSync(tmpHtml);
  }

  console.log(`\n\n✓ ¡Completado! Las ${items.length} tarjetas verticales se guardaron en:\n  ${outDir}`);
}

main();
