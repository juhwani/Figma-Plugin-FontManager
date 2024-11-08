// code.ts (main plugin code)
figma.showUI(__html__, { width: 300, height: 400 });

// Define available fonts with their proper configurations
const FONTS = {
    'Inter': { family: 'Inter', style: 'Regular' },
    'Arial': { family: 'Arial', style: 'Regular' },
    'Roboto': { family: 'Roboto', style: 'Regular' },
    'Noto Sans KR': { family: 'Noto Sans KR', style: 'Regular' },
    'Nanum Gothic': { family: 'Nanum Gothic', style: 'Regular' },
    'Optima LT Std': { family: 'Optima LT Std', style: 'Roman' },
    'Optima LT Bold': { family: 'Optima LT Std', style: 'Bold' },
    'Optima LT Medium': { family: 'Optima LT Std', style: 'Medium' },
    'Optima LT Demi': { family: 'Optima LT Std', style: 'Demi' },
    'Times New Roman': { family: 'Times New Roman', style: 'Regular' } 
};

figma.ui.onmessage = async (msg) => {
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
      const fontConfig = FONTS[msg.fontFamily];
      if (!fontConfig) {
        figma.notify('Invalid font selected');
        return;
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
      await Promise.all(
        Array.from(uniqueFonts).map(fontStr => {
          const font = JSON.parse(fontStr);
          return figma.loadFontAsync(font);
        })
      );

      // Load the new font we want to apply
      await figma.loadFontAsync(fontConfig);
      
      // Get the text content
      const text = textNode.characters;
      
      // Create regex patterns for each text type
      const patterns = {
        english: /[a-zA-Z]+/g,
        korean: /[\u3131-\u318E\uAC00-\uD7A3]+/g,
        numerical: /[0-9]+/g
      };

      // If the selected text type matches parts of the text, change their font
      const pattern = patterns[msg.textType];
      let match;

      while ((match = pattern.exec(text)) !== null) {
        textNode.setRangeFontName(match.index, match.index + match[0].length, fontConfig);
      }

      figma.notify(`Updated ${msg.textType} text to ${msg.fontFamily}`);
    } catch (error) {
      figma.notify('Error updating font: ' + error.message);
      console.error(error);
    }
  }
};

// ui.html (plugin interface)


// manifest.json
