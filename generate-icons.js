const fs = require('fs');
const path = require('path');
const svgson = require('svgson');


(async () => {
    const inputDir = path.join(__dirname, 'icons');
    const outputDirs = [path.join(__dirname, 'apps/portal/src/app/plugins/core/components/icons'), path.join(__dirname, 'apps/admin/src/app/components/icons')];

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

        const svgContent = fs.readFileSync(svgFilePath, 'utf8');
        const parsedSvg = await svgson.parse(svgContent);
        const pathData = parsedSvg.children
            .filter(child => child.name === 'path' && child.attributes.d)
            .map(child => child.attributes.d);

        selection.push({
            icon: {
                paths: pathData,
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
            .replace(/[-\s]+/g, '_') // replace space and hyphen with underscore
            .replace(/[^a-zA-Z0-9_]/g, '') // remove any invalid characters
            .toUpperCase();
    }

    const enumLines = Object.keys(glyphMap)
        .map(value => `    ${formatKey(value)} = '${value}',`)
        .join('\n');

    const tsContent = `export enum IconEnum {\n${enumLines}\n}\n`;
    // Write files to all output directories
    outputDirs.forEach(outputDir => { // Changed from outputDirs?.forEach
        // Write selection.json
        const selectionPath = path.join(outputDir, 'selection.json');
        fs.writeFileSync(selectionPath, JSON.stringify({ icons: selection }, null, 2));
        console.info(`selection.json generated at: ${selectionPath}`);

        // Write icons.ts
        const tsPath = path.join(outputDir, 'icons.ts');
        fs.writeFileSync(tsPath, tsContent);
        console.info(`TypeScript enum generated at: ${tsPath}`);
    });
})();
