// Add the import statement if not already present
export function addExportStatement(tree, filePath: string, newExportLine: string) {
    // Check if index.ts exists
    if (!tree.exists(filePath)) {
        console.warn(`File not found at ${filePath}, skipping export statement`);
        return;
    }

    // Read the current content of index.ts
    const currentContent = tree.read(filePath, 'utf-8').trim();

    if (!currentContent.includes(newExportLine)) {
        const updatedContent = `${currentContent}\n${newExportLine}\n`;
        tree.write(filePath, updatedContent);
    }
}
