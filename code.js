// code.ts (main plugin code)
figma.showUI(__html__, { width: 300, height: 400 });


async function getFontList() {
  const fonts = await figma.listAvailableFontsAsync();
  // Group fonts by family
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
      // Get the font configuration
      // const fontConfig = FONTS[msg.fontFamily];
      // if (!fontConfig) {
      //   figma.notify('Invalid font selected');
      //   return;
      // }
      const fontConfig = { 
        family: msg.selectedFont, 
        style: msg.selectedStyle 
      }

      // First, load all existing fonts in the text node
      const uniqueFonts = new Set();
      for (let i = 0; i < textNode.characters.length; i++) {
        const font = textNode.getRangeFontName(i, i + 1);
        if (font && typeof font !== 'symbol') {
          uniqueFonts.add(JSON.stringify(font));
        }
      }

      // Load all existing fonts
      try {
      await Promise.all(
        Array.from(uniqueFonts).map(fontStr => {
          const font = JSON.parse(fontStr);
          return figma.loadFontAsync(font);
        })
      )} catch(error) {
        figma.notify('failed to promise: ' + error.message);
        return;
      }

      // Load the new font we want to apply
      try {
        await figma.loadFontAsync(fontConfig);
    } catch (error) {
        figma.notify('Failed to load font: ' + error.message);
        return;
    }
      
      // Get the text content
      const text = textNode.characters;
      
      // Create regex patterns for each text type
      const patterns = {
        English: /[a-zA-Z]+/g,
        Korean: /[\u3131-\u318E\uAC00-\uD7A3]+/g,
        Numerical: /[0-9]+/g
      };

      // If the selected text type matches parts of the text, change their font
      const pattern = patterns[msg.textType];
      let match;

      while ((match = pattern.exec(text)) !== null) {
        textNode.setRangeFontName(match.index, match.index + match[0].length, fontConfig);
      }

      figma.notify(`Updated ${msg.textType} text to ${msg.selectedFont} with ${msg.selectedStyle} style`);
    } catch (error) {
      figma.notify('Error updating font: ' + error.message);
      console.error(error);
    }
  }
};

// ui.html (plugin interface)


// manifest.json
