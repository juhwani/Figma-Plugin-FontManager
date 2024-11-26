// Helper functions for script detection
function isInRange(char, ranges) {
  const code = char.charCodeAt(0);
  return ranges.some(([start, end]) => code >= start && code <= end);
}

const unicodeRanges = {
  Japanese: [
    [0x3040, 0x309F], // Hiragana
    [0x30A0, 0x30FF], // Katakana
    [0x31F0, 0x31FF]  // Katakana Phonetic Extensions
  ],
  Chinese: [
    [0x4E00, 0x9FFF], // CJK Unified Ideographs
    [0x3400, 0x4DBF]  // CJK Unified Ideographs Extension A
  ],
  Korean: [
    [0x1100, 0x11FF], // Hangul Jamo
    [0x3130, 0x318F], // Hangul Compatibility Jamo
    [0xAC00, 0xD7AF]  // Hangul Syllables
  ],
  Hindi: [
    [0x0900, 0x097F]  // Devanagari
  ],
  English: [
    [0x0041, 0x005A], // Uppercase Latin
    [0x0061, 0x007A]  // Lowercase Latin
  ],
  Numerical: [
    [0x0030, 0x0039]  // Basic digits
  ],
  BasicSymbols: [
    [0x0021, 0x002F], // ! through /
    [0x003A, 0x0040], // : through @
    [0x005B, 0x0060], // [ through `
    [0x007B, 0x007E]  // { through ~
  ]
};

function identifyScript(text, start, end) {
  const segment = text.slice(start, end);
  const char = segment[0]; // We're processing one character at a time
  
  // Check for numerical first
  if (isInRange(char, unicodeRanges.Numerical)) {
    return 'Numerical';
  }
  
  // Then check for symbols
  if (isInRange(char, unicodeRanges.BasicSymbols)) {
    return 'BasicSymbols';
  }
  
  // Then check for other scripts
  for (const script of ['Japanese', 'Chinese', 'Korean', 'Hindi', 'English']) {
    if (isInRange(char, unicodeRanges[script])) {
      return script;
    }
  }
  
  // If no match found, consider it a symbol
  return 'BasicSymbols';
}

function processText(text) {
  const ranges = [];
  let currentStart = 0;
  let currentType = identifyScript(text, 0, 1);

  for (let i = 1; i <= text.length; i++) {
    if (i === text.length || identifyScript(text, i, i + 1) !== currentType) {
      ranges.push({
        start: currentStart,
        end: i,
        type: currentType
      });

      if (i < text.length) {
        currentStart = i;
        currentType = identifyScript(text, i, i + 1);
      }
    }
  }

  return ranges;
}

// Main plugin code (rest remains the same)
figma.showUI(__html__, { width: 300, height: 400 });

async function getFontList() {
  const fonts = await figma.listAvailableFontsAsync();
  const fontFamilies = fonts.reduce((acc, font) => {
    const family = font.fontName.family;
    if (!acc[family]) {
      acc[family] = [];
    }
    acc[family].push(font.fontName.style);
    return acc;
  }, {});
  
  figma.ui.postMessage({
    type: 'font-list',
    fontFamilies: fontFamilies
  });
}

figma.ui.onmessage = async (msg) => {
  if (msg.type === 'ui-ready') {
    await getFontList();
  }
  
  if (msg.type === 'change-font') {
    const selection = figma.currentPage.selection;
    if (selection.length === 0) {
      figma.notify('Please select a text layer');
      return;
    }
    
    const textNode = selection[0];
    if (textNode.type !== 'TEXT') {
      figma.notify('Please select a text layer');
      return;
    }

    try {
      const fontConfig = {
        family: msg.selectedFont,
        style: msg.selectedStyle
      };

      // Load existing fonts
      const uniqueFonts = new Set();
      for (let i = 0; i < textNode.characters.length; i++) {
        const font = textNode.getRangeFontName(i, i + 1);
        if (font && typeof font !== 'symbol') {
          uniqueFonts.add(JSON.stringify(font));
        }
      }

      try {
        await Promise.all(
          Array.from(uniqueFonts).map(fontStr => {
            const font = JSON.parse(fontStr);
            return figma.loadFontAsync(font);
          })
        );
      } catch(error) {
        figma.notify('Failed to load existing fonts: ' + error.message);
        return;
      }

      // Load the new font
      try {
        await figma.loadFontAsync(fontConfig);
      } catch (error) {
        figma.notify('Failed to load new font: ' + error.message);
        return;
      }

      // Process text using new algorithm
      const text = textNode.characters;
      const ranges = processText(text);
      
      // Apply fonts to matching ranges
      for (const range of ranges) {
        if (range.type === msg.textType) {
          textNode.setRangeFontName(range.start, range.end, fontConfig);
        }
      }

      figma.notify(`Updated ${msg.textType} text to ${msg.selectedFont} with ${msg.selectedStyle} style`);
    } catch (error) {
      figma.notify('Error updating font: ' + error.message);
      console.error(error);
    }
  }
};