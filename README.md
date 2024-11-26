# Font Manager Plugin for Figma

A Figma plugin that allows you to easily manage and change fonts for different script types (multilingual support) within a selected text layer.

## Features
- Selectively change fonts for specific script types:
  - English text
  - Korean text
  - Chinese text (Traditional & Simplified)
  - Japanese text (Hiragana, Katakana, Kanji)
  - Hindi text (Devanagari)
  - Special symbols (@#$&* etc.)
  - Numerical values
- Enhanced script detection for mixed-language text
- Support for mixed scripts within the same text box
- All fonts available in Figma

## Installation

### Local Development Installation
1. Download all the plugin files from the repository
2. Open Figma
3. Go to `Plugins` in the menu
4. Click on `Development`
5. Select `Import plugin from manifest...`
6. Navigate to the downloaded plugin folder and select the `manifest.json` file
7. ALSO you need to create your own manifest.json file. I'll provide example manifest.json and what it would look like.

## Example manifest.json
```json
{
  "name": "Font Manager",
  "id": "font-manager-plugin",
  "api": "1.0.0",
  "main": "code.js",
  "ui": "ui.html",
  "editorType": ["figma"],
  "networkAccess": {
    "allowedDomains": ["none"]
  }
}
```

## Usage
1. Select a text layer in your Figma document
2. Open the plugin
3. Choose the script type you want to modify (English, Korean, Chinese, Japanese, Hindi, Symbols, or Numerical)
4. Select the desired font from the dropdown menu
5. Click "Apply Font"

The plugin will automatically change the font for all instances of the selected script type within your text layer, with improved accuracy for mixed-language text.

## File Structure
```
font-manager-plugin/
├── code.ts # Main plugin logic with Unicode-based script detection
├── ui.html # Plugin UI interface
└── manifest.json # Plugin configuration
```

## Development

### Prerequisites
- Figma Desktop App
- Basic knowledge of TypeScript/JavaScript
- Text editor of your choice

### Local Development
1. Clone the repository
2. Make your changes to the code
3. Import the plugin into Figma using the steps in the Installation section
4. The plugin will automatically update when you make changes to the code

## Technical Details
- Uses Unicode range-based script detection for accurate language identification
- Single-pass text processing for improved performance
- Efficient handling of continuous text ranges
- Precise separation between numbers and special characters

## Troubleshooting
If you encounter any issues:
1. Make sure all required fonts are installed in Figma
2. Check that you have selected a text layer before running the plugin
3. Verify that the text contains the type of script you're trying to modify
4. Ensure the selected font supports the script type you're trying to change

## Note
- This plugin supports basic font changes for multiple scripts
- For optimal results with CJK (Chinese, Japanese, Korean) text, use fonts that fully support these scripts