
// Add the import statement if not already present
export function addImportStatement(content: string, importStatement: string): string {
    if (!content.includes(importStatement)) {
        // Match all import statements
        const importSection = content.match(/^import\s+.*;/gm);
        if (importSection) {
            const lastImportIndex = content.lastIndexOf(importSection[importSection.length - 1]);

            // Insert the new import after the last import, preserving newlines
            content =
                content.slice(0, lastImportIndex + importSection[importSection.length - 1].length) +
                `\n${importStatement}\n` +
                content.slice(lastImportIndex + importSection[importSection.length - 1].length);
        } else {
            // No existing imports, place the new import at the top
            content = `${importStatement}\n\n${content}`;
        }
    }
    return content;
}
