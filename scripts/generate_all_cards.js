const { createClient } = require('@libsql/client');
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const { generateCardHtml, smartFormatMessage } = require('./card_template');

// Load env variables
const envPath = path.resolve(__dirname, '../.env.local');
const envContent = fs.readFileSync(envPath, 'utf8');
let databaseUrl = '';
let authToken = '';

envContent.split('\n').forEach((line) => {
  const trimmed = line.trim();
  if (trimmed.startsWith('DATABASE_URL=')) {
    databaseUrl = trimmed.replace('DATABASE_URL=', '').trim();
  }
  if (trimmed.startsWith('TURSO_AUTH_TOKEN=')) {
    authToken = trimmed.replace('TURSO_AUTH_TOKEN=', '').trim();
  }
});

if (!databaseUrl || !authToken) {
  console.error('Error: DATABASE_URL o TURSO_AUTH_TOKEN no encontrados en .env.local');
  process.exit(1);
}

const client = createClient({ url: databaseUrl, authToken });

function sanitizeFilename(name) {
  return name
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // remove accents for safe filenames
    .replace(/[^a-zA-Z0-9_-]/g, '_')
    .replace(/_+/g, '_')
    .slice(0, 40);
}

async function main() {
  console.log('1. Conectando a Turso y consultando mensajes...');
  const res = await client.execute(`
    SELECT id, name, attending, companionsCount, companionNames, message, createdAt
    FROM rsvps
    WHERE attending = 1 AND message IS NOT NULL
    ORDER BY createdAt ASC
  `);

  const rawRows = res.rows.filter(
    (r) => r.message && String(r.message).trim().length > 0
  );

  console.log(`Encontrados ${rawRows.length} registros con mensaje.`);

  // Clean and filter duplicates if identical
  const processed = [];
  const seenExact = new Set();

  rawRows.forEach((row) => {
    const name = String(row.name).trim();
    const message = String(row.message).trim();
    const signature = `${name.toLowerCase()}:::${message.toLowerCase()}`;

    if (seenExact.has(signature)) {
      console.log(`- Omitiendo mensaje duplicado exacto de: ${name}`);
      return;
    }
    seenExact.add(signature);

    let companions = [];
    if (row.companionNames) {
      try {
        companions = JSON.parse(String(row.companionNames));
      } catch {
        companions = [String(row.companionNames)];
      }
    }

    processed.push({
      id: String(row.id),
      name,
      message,
      companions: Array.isArray(companions) ? companions : [],
      createdAt: String(row.createdAt),
    });
  });

  console.log(`Total mensajes unicos a generar: ${processed.length}`);

  // Setup output directory
  const outDir = path.resolve(__dirname, '../capturas-mensajes-1080p');
  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
  }

  // 1. Export TXT
  const txtContent = processed
    .map(
      (item, idx) =>
        `#${String(idx + 1).padStart(2, '0')} - ${item.name}` +
        (item.companions.length > 0 ? ` (Acompañado por: ${item.companions.join(', ')})` : '') +
        `\n"${item.message}"\n` +
        `Fecha: ${item.createdAt}\n` +
        `--------------------------------------------------------------------------------`
    )
    .join('\n\n');

  fs.writeFileSync(path.join(outDir, 'mensajes.txt'), txtContent, 'utf8');
  console.log('✓ Archivo mensajes.txt creado.');

  // 2. Export JSON
  fs.writeFileSync(
    path.join(outDir, 'mensajes.json'),
    JSON.stringify(processed, null, 2),
    'utf8'
  );
  console.log('✓ Archivo mensajes.json creado.');

  // 3. Export Standalone Slideshow HTML (Zero dependencies, offline capable)
  const slideshowHtml = generateStandaloneSlideshowHtml(processed);
  fs.writeFileSync(path.join(outDir, 'slideshow_pantalla.html'), slideshowHtml, 'utf8');
  console.log('✓ Archivo interactivo slideshow_pantalla.html creado.');

  // 4. Generate all 1080p PNG images
  console.log('\n2. Generando capturas PNG en resolución 1920x1080 con Google Chrome...');
  const chromePath = '"C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe"';
  const tmpHtml = path.join(__dirname, 'tmp_card.html');

  for (let i = 0; i < processed.length; i++) {
    const item = processed[i];
    const num = String(i + 1).padStart(2, '0');
    const safeName = sanitizeFilename(item.name);
    const filename = `${num}_${safeName}.png`;
    const outPng = path.join(outDir, filename);

    const html = generateCardHtml({
      name: item.name,
      message: item.message,
      companions: item.companions,
      index: i + 1,
      total: processed.length,
    });

    fs.writeFileSync(tmpHtml, html, 'utf8');

    try {
      execSync(
        `${chromePath} --headless=new --disable-gpu --screenshot="${outPng}" --window-size=1920,1080 --virtual-time-budget=2000 --hide-scrollbars "file://${tmpHtml.replace(/\\/g, '/')}"`,
        { stdio: 'pipe' }
      );
      process.stdout.write(`\r[${i + 1}/${processed.length}] Generada: ${filename}`);
    } catch (err) {
      console.error(`\nError generando ${filename}:`, err.message);
    }
  }

  if (fs.existsSync(tmpHtml)) {
    fs.unlinkSync(tmpHtml);
  }

  console.log(`\n\n✓ ¡Completado con éxito! Todas las imágenes se guardaron en:\n  ${outDir}`);
}

function generateStandaloneSlideshowHtml(items) {
  const sealPath = path.resolve(__dirname, '../public/seal-70.png');
  const sealBase64 = fs.existsSync(sealPath)
    ? `data:image/png;base64,${fs.readFileSync(sealPath).toString('base64')}`
    : '';

  // Pre-process items with formatted HTML
  const itemsWithFormatting = items.map((item) => {
    const formatted = smartFormatMessage(item.message);
    return {
      ...item,
      formattedHtml: formatted.html,
      lineCount: formatted.lineCount,
      rawLength: formatted.rawLength,
    };
  });

  return `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="utf-8" />
  <title>Los 70 de Gabriel — Mensajes y Dedicatorias</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@600;700;800&family=Plus+Jakarta+Sans:wght@500;600;700;800&display=swap" rel="stylesheet">
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    html, body {
      width: 100vw;
      height: 100vh;
      overflow: hidden;
      background: #140E0A;
      font-family: 'Plus Jakarta Sans', system-ui, sans-serif;
      color: #FAF5EE;
      user-select: none;
    }
    .viewport {
      position: relative;
      width: 100%;
      height: 100%;
      background: radial-gradient(circle at 50% 25%, #352519 0%, #1c130c 60%, #0d0906 100%);
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 30px 40px;
    }
    .outer-border {
      position: absolute;
      inset: 20px;
      border: 1px solid rgba(197, 155, 39, 0.35);
      border-radius: 20px;
      pointer-events: none;
    }
    .corner {
      position: absolute;
      width: 20px;
      height: 20px;
      border-color: #C59B27;
      border-style: solid;
    }
    .corner-tl { top: 18px; left: 18px; border-width: 3px 0 0 3px; }
    .corner-tr { top: 18px; right: 18px; border-width: 3px 3px 0 0; }
    .corner-bl { bottom: 18px; left: 18px; border-width: 0 0 3px 3px; }
    .corner-br { bottom: 18px; right: 18px; border-width: 0 3px 3px 0; }

    .card {
      position: relative;
      width: 100%;
      max-width: 1500px;
      height: 88vh;
      background: linear-gradient(135deg, rgba(253, 251, 247, 0.06) 0%, rgba(253, 251, 247, 0.02) 100%);
      border: 1.5px solid rgba(197, 155, 39, 0.35);
      border-radius: 26px;
      box-shadow: 0 30px 100px rgba(0, 0, 0, 0.75), inset 0 1px 0 rgba(237, 217, 163, 0.2);
      padding: 24px 50px 20px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      align-items: center;
      text-align: center;
      transition: opacity 0.4s ease, transform 0.4s ease;
    }
    .seal-img {
      height: 75px;
      width: 75px;
      border-radius: 50%;
      object-fit: cover;
      box-shadow: 0 6px 18px rgba(0, 0, 0, 0.6), 0 0 0 1.5px rgba(197, 155, 39, 0.4);
    }
    .event-tag {
      font-size: 14px;
      font-weight: 800;
      letter-spacing: 5px;
      text-transform: uppercase;
      color: #C59B27;
      margin-top: 6px;
    }
    .quote-container {
      flex: 1;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      padding: 10px 15px;
      width: 100%;
      overflow: hidden;
    }
    .quote-icon {
      font-family: 'Cormorant Garamond', Georgia, serif;
      font-size: 70px;
      line-height: 1;
      color: #C59B27;
      opacity: 0.6;
      margin-bottom: -15px;
    }
    .quote-text {
      font-family: 'Cormorant Garamond', Georgia, serif;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 1.2px;
      color: #FAF5EE;
      text-shadow: 0 3px 14px rgba(0, 0, 0, 0.75);
      max-width: 1350px;
      width: 100%;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      text-align: center;
    }
    .quote-text div.sentence-line {
      width: 100%;
      text-align: center;
      word-wrap: break-word;
    }
    .quote-text .emoji-line {
      margin-top: 4px;
      text-align: center;
    }
    .gold-divider {
      width: 320px;
      height: 2px;
      background: linear-gradient(90deg, transparent, #C59B27 30%, #EDD9A3 50%, #C59B27 70%, transparent);
      margin-bottom: 6px;
    }
    .author-name {
      font-family: 'Cormorant Garamond', Georgia, serif;
      font-size: 42px;
      font-weight: 700;
      letter-spacing: 2px;
      color: #EDD9A3;
      text-transform: uppercase;
    }
    .companions {
      font-size: 18px;
      color: #D4A373;
      margin-top: 4px;
      font-weight: 600;
    }
    .companions span {
      color: #FAF5EE;
      font-weight: 700;
    }
    .controls {
      position: absolute;
      bottom: 12px;
      display: flex;
      align-items: center;
      gap: 15px;
      z-index: 10;
      opacity: 0.3;
      transition: opacity 0.3s;
    }
    .viewport:hover .controls { opacity: 1; }
    .btn {
      background: rgba(197, 155, 39, 0.2);
      border: 1px solid #C59B27;
      color: #FAF5EE;
      padding: 6px 14px;
      border-radius: 20px;
      cursor: pointer;
      font-size: 13px;
      font-weight: 600;
      transition: background 0.2s;
    }
    .btn:hover { background: rgba(197, 155, 39, 0.4); }
    .progress-bar-bg {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 4px;
      background: rgba(255, 255, 255, 0.1);
    }
    .progress-bar {
      height: 100%;
      background: linear-gradient(90deg, #C59B27, #EDD9A3);
      width: 0%;
      transition: width 0.1s linear;
    }
  </style>
</head>
<body>
  <div class="viewport" id="viewport">
    <div class="progress-bar-bg"><div class="progress-bar" id="progressBar"></div></div>
    <div class="outer-border"></div>
    <div class="corner corner-tl"></div>
    <div class="corner corner-tr"></div>
    <div class="corner corner-bl"></div>
    <div class="corner corner-br"></div>

    <div class="card" id="card">
      <div>
        ${sealBase64 ? `<img src="${sealBase64}" class="seal-img" alt="Sello 70" />` : ''}
        <div class="event-tag">✦ LOS 70 DE GABRIEL ✦</div>
      </div>
      <div class="quote-container">
        <div class="quote-icon">“</div>
        <div class="quote-text" id="quoteText"></div>
      </div>
      <div>
        <div class="gold-divider"></div>
        <div class="author-name" id="authorName"></div>
        <div class="companions" id="companions"></div>
      </div>
    </div>

    <div class="controls">
      <button class="btn" onclick="prev()">❮ Anterior</button>
      <button class="btn" id="playBtn" onclick="togglePlay()">⏸ Pausar</button>
      <button class="btn" onclick="next()">Siguiente ❯</button>
      <button class="btn" onclick="toggleFullscreen()">⛶ Pantalla Completa</button>
      <span style="font-size: 13px; color: #EDD9A3;" id="counter"></span>
    </div>
  </div>

  <script>
    const items = ${JSON.stringify(itemsWithFormatting)};
    let currentIndex = 0;
    let isPlaying = true;
    const slideDuration = 9000; // 9 segundos por tarjeta
    let progressInterval = null;
    let startTime = Date.now();

    function renderSlide(index) {
      const item = items[index];
      const card = document.getElementById('card');
      card.style.opacity = '0';
      card.style.transform = 'scale(0.98)';

      setTimeout(() => {
        const textEl = document.getElementById('quoteText');
        textEl.innerHTML = item.formattedHtml;
        const len = item.rawLength;
        const lines = item.lineCount;

        if (lines <= 2 && len <= 50) {
          textEl.style.fontSize = '68px';
          textEl.style.lineHeight = '1.25';
          textEl.style.gap = '12px';
        } else if (lines <= 3 && len <= 110) {
          textEl.style.fontSize = '58px';
          textEl.style.lineHeight = '1.28';
          textEl.style.gap = '10px';
        } else if (lines <= 4 && len <= 180) {
          textEl.style.fontSize = '48px';
          textEl.style.lineHeight = '1.30';
          textEl.style.gap = '8px';
        } else if (lines <= 6 && len <= 260) {
          textEl.style.fontSize = '40px';
          textEl.style.lineHeight = '1.32';
          textEl.style.gap = '6px';
        } else {
          textEl.style.fontSize = '32px';
          textEl.style.lineHeight = '1.35';
          textEl.style.gap = '5px';
        }

        document.getElementById('authorName').textContent = item.name;
        const compEl = document.getElementById('companions');
        if (item.companions && item.companions.length > 0) {
          compEl.innerHTML = 'Acompañado/a por: <span>' + item.companions.join(', ') + '</span>';
        } else {
          compEl.textContent = '';
        }

        document.getElementById('counter').textContent = (index + 1) + ' / ' + items.length;

        card.style.opacity = '1';
        card.style.transform = 'scale(1)';
        resetTimer();
      }, 300);
    }

    function resetTimer() {
      startTime = Date.now();
      clearInterval(progressInterval);
      if (!isPlaying) {
        document.getElementById('progressBar').style.width = '0%';
        return;
      }
      progressInterval = setInterval(() => {
        const elapsed = Date.now() - startTime;
        const pct = Math.min(100, (elapsed / slideDuration) * 100);
        document.getElementById('progressBar').style.width = pct + '%';
        if (elapsed >= slideDuration) {
          next();
        }
      }, 50);
    }

    function next() {
      currentIndex = (currentIndex + 1) % items.length;
      renderSlide(currentIndex);
    }

    function prev() {
      currentIndex = (currentIndex - 1 + items.length) % items.length;
      renderSlide(currentIndex);
    }

    function togglePlay() {
      isPlaying = !isPlaying;
      document.getElementById('playBtn').textContent = isPlaying ? '⏸ Pausar' : '▶ Reproducir';
      resetTimer();
    }

    function toggleFullscreen() {
      if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen();
      } else {
        document.exitFullscreen();
      }
    }

    document.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowRight' || e.key === ' ') next();
      if (e.key === 'ArrowLeft') prev();
      if (e.key === 'f' || e.key === 'F') toggleFullscreen();
    });

    renderSlide(0);
  </script>
</body>
</html>`;
}

main().catch(console.error);
