# Font Manager Plugin for Figma

A Figma plugin that allows you to easily manage and change fonts for different text types (English, Korean, and numerical) within a selected text layer.

## Features

- Selectively change fonts for specific text types:
  - English text
  - Korean text
  - Numerical values
- Support for mixed text within the same text box
- Multiple font options including:
  - Optima LT Std
  - Times New Roman
  - Inter
  - Arial
  - Roboto
  - Noto Sans KR
  - Nanum Gothic
  - Consolas

## Installation

### Local Development Installation
1. Download all the plugin files from the repository
2. Open Figma
3. Go to `Plugins` in the menu
4. Click on `Development`
5. Select `Import plugin from manifest...`
6. Navigate to the downloaded plugin folder and select the `manifest.json` file
7. ALSO you need to create your own manifest.json file. I'll provide example manifest.json and what it would look like.

## Usage

1. Select a text layer in your Figma document
2. Open the plugin
3. Choose the text type you want to modify (English, Korean, or Numerical)
4. Select the desired font from the dropdown menu
5. Click "Apply Font"

The plugin will automatically change the font for all instances of the selected text type within your text layer.

## File Structure

```
font-manager-plugin/
├── code.ts          # Main plugin logic
├── ui.html          # Plugin UI interface
└── manifest.json    # Plugin configuration
```

## Development

### Prerequisites
- Figma Desktop App
- Basic knowledge of TypeScript
- Text editor of your choice

### Local Development
1. Clone the repository
2. Make your changes to the code
3. Import the plugin into Figma using the steps in the Installation section
4. The plugin will automatically update when you make changes to the code

## Troubleshooting

If you encounter any issues:
1. Make sure all required fonts are installed in Figma
2. Check that you have selected a text layer before running the plugin
3. Verify that the text contains the type of text you're trying to modify

## Note

This plugin currently supports basic font changes. Font styles (bold, italic, etc.) are not supported in the current version.