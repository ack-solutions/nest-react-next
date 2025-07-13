# Icons System

A clean and organized system to manage and browse your SVG icons.

## Quick Start

1. **Generate Icons and Viewer**:
   ```bash
   yarn icons
   ```

2. **Open in Browser**:
   Double-click `icons-viewer.html` to view your icons

## What Gets Generated

The `yarn icons` command creates:

- **`icons-viewer.html`** - Standalone HTML viewer (no server needed)
- **`selection.json`** - Icon data for your React app
- **`icons.ts`** - TypeScript enum for icon names

## Project Structure

```
├── icons/                          # Your SVG files go here
├── scripts/                        # Build scripts and templates
│   ├── generate-icons.js           # Main generation script
│   ├── icons-viewer-template.html  # HTML template
│   └── README.md                   # Scripts documentation
├── icons-viewer.html               # Generated HTML viewer
└── apps/admin/src/app/components/icons/
    ├── selection.json              # Generated icon data
    └── icons.ts                    # Generated TypeScript enum
```

## Adding New Icons

1. Add SVG files to the `icons/` directory
2. Run `yarn icons` to regenerate everything
3. Refresh the HTML viewer to see new icons

## Using Icons in Your App

1. Browse icons in the HTML viewer
2. Click any icon to copy its name
3. Use in your React components:

```tsx
import { Icon } from './components/icons/icon';
import { IconEnum } from './components/icons/icons';

<Icon icon={IconEnum.HEART} />
```

## Features

- 🎨 **Visual Browser**: Clean grid layout of all icons
- 🔍 **Search**: Real-time filtering by icon name
- 📋 **Copy Names**: One-click copy to clipboard
- 📱 **Responsive**: Works on desktop and mobile
- ⚡ **No Server**: Standalone HTML file
- 🔧 **Organized**: Clean separation of scripts and templates

## Benefits of This Structure

- **Maintainable**: Scripts are organized in their own directory
- **Reusable**: HTML template can be easily modified
- **Simple**: Single command generates everything
- **Clean**: No server dependencies or complex setup
