function cleanText(text) {
  return text
    // Fix spaces before punctuation: "hola ." -> "hola."
    .replace(/\s+([.,!?:;])/g, '$1')
    // Fix missing spaces after punctuation: "vos.Te" -> "vos. Te", "bien!Gracias" -> "bien! Gracias"
    .replace(/([.,!?:;])([A-Za-zÁ-ÿ])/g, '$1 $2')
    // Normalize multiple spaces
    .replace(/[ \t]+/g, ' ')
    .trim();
}

function formatSmartBreaks(text, fontSizePx) {
  let cleaned = cleanText(text);

  // Group trailing emojis together with white-space: nowrap so they don't break across lines
  // Match emojis at the end of the string
  const emojiRegex = /([\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{1FA70}-\u{1FAFF}\s]+)$/u;
  const match = cleaned.match(emojiRegex);
  
  if (match && match[0].trim().length > 0) {
    const textPart = cleaned.slice(0, match.index).trim();
    const emojiPart = match[0].trim();
    cleaned = `${textPart} <span style="white-space: nowrap; display: inline-block;">${emojiPart}</span>`;
  }

  return cleaned;
}

module.exports = { cleanText, formatSmartBreaks };
