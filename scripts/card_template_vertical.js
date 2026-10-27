const fs = require('fs');
const path = require('path');

const sealPath = path.resolve(__dirname, '../public/seal-70.png');
const sealBase64 = fs.existsSync(sealPath)
  ? `data:image/png;base64,${fs.readFileSync(sealPath).toString('base64')}`
  : '';

// Reuse smartFormatMessage logic
function smartFormatMessage(rawText) {
  if (!rawText) return { html: '', lineCount: 0, rawLength: 0 };

  let text = rawText.trim();

  // 1. Correct common mobile keyboard typos
  text = text.replace(/\bEl\.tio\b/gi, 'El tío');
  text = text.replace(/70\.S\^e/gi, '70. Sé');

  // 2. Normalize spaces around punctuation
  text = text.replace(/\s+([.,!?:;])/g, '$1');
  text = text.replace(/([.,!?:;])([A-Za-zÁ-ÿ])/g, '$1 $2');

  // 3. Normalize multiple dots (".... ...", "....") to standard ellipsis "..."
  text = text.replace(/\.{2,}\s+\.{2,}/g, '... ');
  text = text.replace(/\.{4,}/g, '...');

  // 4. Trailing emojis grouping
  const emojiRegex = /([\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{1FA70}-\u{1FAFF}\s]+)$/u;
  const match = text.match(emojiRegex);
  let emojiPart = '';
  if (match && match[0].trim().length > 0) {
    emojiPart = `<span class="emoji-block" style="white-space: nowrap; display: inline-block;">${match[0].trim()}</span>`;
    text = text.slice(0, match.index).trim();
  }

  // If text was only emojis (e.g. 🍆)
  if (!text && emojiPart) {
    return {
      html: `<div class="emoji-only" style="font-size: 130px; margin: 20px 0;">${emojiPart}</div>`,
      lineCount: 1,
      rawLength: 5,
    };
  }

  // 5. Line breaking after periods (punto seguido / punto aparte) or newlines
  text = text.replace(/\r?\n+/g, ' <SPLIT> ');
  text = text.replace(/(\.{1,3}|…)\s+(?=\S)/g, '$1 <SPLIT> ');
  text = text.replace(/([!?]+)\s+(?=[A-ZÁÉÍÓÚÑ¿¡])/g, '$1 <SPLIT> ');

  const parts = text
    .split('<SPLIT>')
    .map(p => p.trim())
    .filter(p => p.length > 0);

  let formatted = parts.map(p => `<div class="sentence-line">${p}</div>`).join('');

  if (emojiPart) {
    formatted += `<div class="emoji-line">${emojiPart}</div>`;
  }

  return {
    html: formatted,
    lineCount: parts.length + (emojiPart ? 1 : 0),
    rawLength: text.length,
  };
}

function getFontSizeAndLineHeightVertical(charCount, lineCount) {
  // Calibrated for 1080x1920 (9:16 vertical smartphone format)
  if (lineCount <= 2 && charCount <= 50) {
    return { fontSize: '66px', lineHeight: '1.34', gap: '18px' };
  } else if (lineCount <= 3 && charCount <= 110) {
    return { fontSize: '56px', lineHeight: '1.36', gap: '16px' };
  } else if (lineCount <= 4 && charCount <= 180) {
    return { fontSize: '48px', lineHeight: '1.38', gap: '14px' };
  } else if (lineCount <= 6 && charCount <= 260) {
    return { fontSize: '42px', lineHeight: '1.40', gap: '12px' };
  } else {
    // Very long messages
    return { fontSize: '36px', lineHeight: '1.42', gap: '10px' };
  }
}

function generateVerticalCardHtml({ name, message, companions, index, total }) {
  const { html: formattedMessage, lineCount, rawLength } = smartFormatMessage(message);
  const { fontSize, lineHeight, gap } = getFontSizeAndLineHeightVertical(rawLength, lineCount);

  const companionsHtml = companions && companions.length > 0
    ? `<div class="companions">Acompañado/a por: <span>${companions.join(', ')}</span></div>`
    : '';

  return `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="utf-8" />
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@600;700;800&family=Plus+Jakarta+Sans:wght@500;600;700;800&display=swap" rel="stylesheet">
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    html, body {
      width: 1080px;
      height: 1920px;
      overflow: hidden;
      background: #120C08;
      font-family: 'Plus Jakarta Sans', system-ui, sans-serif;
    }

    .canvas-bg {
      position: relative;
      width: 1080px;
      height: 1920px;
      background: radial-gradient(circle at 50% 18%, #3a281b 0%, #1a120c 55%, #0c0805 100%);
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 60px 48px;
    }

    .canvas-bg::before {
      content: '';
      position: absolute;
      top: -100px;
      left: 50%;
      transform: translateX(-50%);
      width: 900px;
      height: 700px;
      background: radial-gradient(circle, rgba(197, 155, 39, 0.24) 0%, transparent 70%);
      pointer-events: none;
    }

    /* Outer gold borders */
    .outer-border {
      position: absolute;
      inset: 22px;
      border: 1.5px solid rgba(197, 155, 39, 0.45);
      border-radius: 32px;
      pointer-events: none;
    }
    .inner-border {
      position: absolute;
      inset: 32px;
      border: 1px solid rgba(237, 217, 163, 0.2);
      border-radius: 24px;
      pointer-events: none;
    }

    .corner {
      position: absolute;
      width: 32px;
      height: 32px;
      border-color: #C59B27;
      border-style: solid;
    }
    .corner-tl { top: 18px; left: 18px; border-width: 3px 0 0 3px; }
    .corner-tr { top: 18px; right: 18px; border-width: 3px 3px 0 0; }
    .corner-bl { bottom: 18px; left: 18px; border-width: 0 0 3px 3px; }
    .corner-br { bottom: 18px; right: 18px; border-width: 0 3px 3px 0; }

    /* Main Card */
    .card {
      position: relative;
      width: 100%;
      max-width: 984px;
      height: 1800px;
      background: linear-gradient(135deg, rgba(253, 251, 247, 0.07) 0%, rgba(253, 251, 247, 0.02) 100%);
      border: 1.5px solid rgba(197, 155, 39, 0.4);
      border-radius: 36px;
      box-shadow: 0 40px 140px rgba(0, 0, 0, 0.9), inset 0 1px 0 rgba(237, 217, 163, 0.3);
      padding: 60px 48px 50px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      align-items: center;
      text-align: center;
    }

    /* Header */
    .header {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 12px;
      flex-shrink: 0;
    }
    .seal-img {
      height: 120px;
      width: 120px;
      border-radius: 50%;
      object-fit: cover;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.8), 0 0 0 2px rgba(197, 155, 39, 0.6);
    }
    .event-tag {
      font-size: 19px;
      font-weight: 800;
      letter-spacing: 7px;
      text-transform: uppercase;
      color: #C59B27;
      display: flex;
      align-items: center;
      gap: 12px;
      margin-top: 4px;
    }
    .event-tag .bullet {
      color: #EDD9A3;
      font-size: 14px;
    }

    /* Message Body */
    .quote-container {
      flex: 1;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      padding: 20px 15px;
      position: relative;
      width: 100%;
      text-align: center;
      overflow: hidden;
    }
    .quote-icon {
      font-family: 'Cormorant Garamond', Georgia, serif;
      font-size: 96px;
      line-height: 1;
      color: #C59B27;
      opacity: 0.75;
      margin-bottom: 0px;
      flex-shrink: 0;
    }
    .quote-text {
      font-family: 'Cormorant Garamond', Georgia, serif;
      font-size: ${fontSize};
      line-height: ${lineHeight};
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 1.2px;
      color: #FAF5EE;
      text-shadow: 0 4px 24px rgba(0, 0, 0, 0.95);
      max-width: 880px;
      width: 100%;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: ${gap};
      text-align: center;
    }
    .quote-text div.sentence-line {
      width: 100%;
      text-align: center;
      word-wrap: break-word;
    }
    .quote-text .emoji-line {
      margin-top: 10px;
      text-align: center;
      width: 100%;
      font-size: 58px;
    }

    /* Footer */
    .footer {
      width: 100%;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 12px;
      flex-shrink: 0;
    }
    .gold-divider {
      width: 380px;
      height: 2px;
      background: linear-gradient(90deg, transparent, #C59B27 30%, #EDD9A3 50%, #C59B27 70%, transparent);
      margin-bottom: 4px;
    }
    .author-name {
      font-family: 'Cormorant Garamond', Georgia, serif;
      font-size: 54px;
      font-weight: 700;
      letter-spacing: 2px;
      color: #EDD9A3;
      text-shadow: 0 3px 16px rgba(0, 0, 0, 0.8);
      text-transform: uppercase;
      line-height: 1.15;
    }
    .companions {
      font-size: 24px;
      color: #D4A373;
      font-weight: 600;
      line-height: 1.3;
    }
    .companions span {
      color: #FAF5EE;
      font-weight: 700;
    }
    .badge-bar {
      font-size: 15px;
      letter-spacing: 3.5px;
      color: rgba(237, 217, 163, 0.75);
      text-transform: uppercase;
      font-weight: 700;
      margin-top: 4px;
    }
  </style>
</head>
<body>
  <div class="canvas-bg">
    <div class="outer-border"></div>
    <div class="inner-border"></div>
    <div class="corner corner-tl"></div>
    <div class="corner corner-tr"></div>
    <div class="corner corner-bl"></div>
    <div class="corner corner-br"></div>

    <div class="card">
      <div class="header">
        ${sealBase64 ? `<img src="${sealBase64}" class="seal-img" alt="Sello 70" />` : ''}
        <div class="event-tag">
          <span class="bullet">✦</span>
          LOS 70 DE GABRIEL
          <span class="bullet">✦</span>
        </div>
      </div>

      <div class="quote-container">
        <div class="quote-icon">“</div>
        <div class="quote-text">${formattedMessage}</div>
      </div>

      <div class="footer">
        <div class="gold-divider"></div>
        <div class="author-name">${name}</div>
        ${companionsHtml}
        <div class="badge-bar">7 DE NOVIEMBRE DE 2026 • FINCA EL REENCUENTRO</div>
      </div>
    </div>
  </div>
</body>
</html>`;
}

module.exports = { generateVerticalCardHtml, smartFormatMessage };
