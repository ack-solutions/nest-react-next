const fs = require('fs');
const path = require('path');


(async () => {
    const inputDir = path.join(__dirname, '..', 'icons');
    const outputDirs = [path.join(__dirname, '..', 'apps/admin/src/app/components/icons')];

    // Validate input directory
    if (!fs.existsSync(inputDir)) {
        console.error('Input directory does not exist:', inputDir);
        process.exit(1);
    }

    const svgFiles = fs.readdirSync(inputDir).filter(file => path.extname(file) === '.svg');
    if (svgFiles.length === 0) {
        console.error('No SVG files found in input directory:', inputDir);
        process.exit(1);
    }

    // Generate glyphMap
    const glyphMap = {};
    svgFiles.forEach((file, index) => {
        const iconName = path.basename(file, '.svg');
        const unicode = (0xe900 + index).toString(16);
        glyphMap[iconName] = unicode;
    });

    // Prepare selection.json data
    const selection = [];
    for (const [iconName, unicode] of Object.entries(glyphMap)) {
        const svgFilePath = path.join(inputDir, `${iconName}.svg`);
        if (!fs.existsSync(svgFilePath)) {
            console.warn(`SVG file not found for icon: ${iconName}`);
            continue;
        }

        // Read SVG content
        const svgContent = fs.readFileSync(svgFilePath, 'utf8');

        // Extract viewBox and inner content
        const svgMatch = svgContent.match(/<svg[^>]*viewBox="([^"]*)"[^>]*>(.*?)<\/svg>/s);
        if (!svgMatch) {
            console.warn(`Could not parse SVG for icon: ${iconName}`);
            continue;
        }

        const originalViewBox = svgMatch[1];
        let innerSvg = svgMatch[2].trim();

        // Parse original viewBox
        const viewBoxParts = originalViewBox.split(/\s+/).map(Number);
        const [
            _origX,
            _origY,
            origWidth,
            origHeight,
        ] = viewBoxParts;

        // Calculate scale factor to fit into 24x24
        const scale = 24 / Math.max(origWidth, origHeight);

        // Calculate offset to center the icon
        const offsetX = (24 - origWidth * scale) / 2;
        const offsetY = (24 - origHeight * scale) / 2;

        // Transform the SVG content to fit 24x24 viewBox
        if (scale !== 1 || offsetX !== 0 || offsetY !== 0) {
            innerSvg = `<g transform="translate(${offsetX}, ${offsetY}) scale(${scale})">${innerSvg}</g>`;
        }

        // Remove any existing fill attributes
        innerSvg = innerSvg.replace(/fill="[^"]*"/g, '');
        innerSvg = innerSvg.replace(/fill='[^']*'/g, '');

        // Add fill="none" to all SVG elements to ensure stroke-only rendering
        innerSvg = innerSvg.replace(/<(path|circle|rect|ellipse|line|polyline|polygon)([^>]*?)\s*\/?>/g, '<$1$2 fill="none"/>');

        // Clean up any double spaces
        innerSvg = innerSvg.replace(/\s+/g, ' ').trim();

        // Fix any double fill attributes
        innerSvg = innerSvg.replace(/fill="none"\s+fill="none"/g, 'fill="none"');

        selection.push({
            icon: {
                content: innerSvg,
                attrs: [],
                isMulticolor: false,
                isMulticolor2: false,
                tags: [iconName],
                grid: 0,
            },
            properties: {
                name: iconName,
                code: parseInt(unicode, 16),
            },
        });
    }

    function formatKey(value) {
        return value
            .replace(/[-\s]+(.)/g, (_, char) => char.toUpperCase()) // convert kebab-case to camelCase
            .replace(/[^a-zA-Z0-9]/g, '') // remove any invalid characters
            .replace(/^./, char => char.toUpperCase()); // capitalize first letter for enum
    }

    const enumLines = Object.keys(glyphMap)
        .map(value => `    ${formatKey(value)} = '${value}',`)
        .join('\n');

    const tsContent = `export enum IconEnum {\n${enumLines}\n}\n`;

    function generateStandaloneViewer(iconsData) {
        const templatePath = path.join(__dirname, 'icons-viewer-template.html');
        const outputPath = path.join(__dirname, '..', 'icons-viewer.html');

        // Check if template exists
        if (!fs.existsSync(templatePath)) {
            console.error('Template file not found:', templatePath);
            return;
        }

        // Read the template
        const templateContent = fs.readFileSync(templatePath, 'utf8');

        // Replace placeholders
        const finalContent = templateContent
            .replace(/{{ICONS_DATA}}/g, JSON.stringify(iconsData))
            .replace(/{{TOTAL_ICONS}}/g, iconsData.icons.length);

        // Write the final HTML file
        fs.writeFileSync(outputPath, finalContent);
        console.info(`Icons viewer HTML generated at: ${outputPath}`);
    }

    // Write files to all output directories
    outputDirs.forEach(outputDir => {
        // Write selection.json
        const selectionPath = path.join(outputDir, 'selection.json');
        fs.writeFileSync(selectionPath, JSON.stringify({ icons: selection }, null, 2));
        console.info(`selection.json generated at: ${selectionPath}`);

        // Write icons.ts
        const tsPath = path.join(outputDir, 'icons.ts');
        fs.writeFileSync(tsPath, tsContent);
        console.info(`TypeScript enum generated at: ${tsPath}`);
    });

    // Generate standalone HTML viewer
    generateStandaloneViewer({ icons: selection });
})();
