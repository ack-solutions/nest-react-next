/**
 * Appends an item to a specified array in the content if it doesn't already exist.
 *
 * @param content - The file content as a string.
 * @param arrayRegex - The regular expression to find the target array.
 * @param arrayItemName - The name of the item to add to the array.
 * @param arrayName - The name of the array variable (for formatting).
 * @returns The updated content with the item added to the array.
 */
export function appendArrayItem(content: string, arrayName: string, arrayItemName: string): string {
    const arrayRegex = new RegExp(`${arrayName}\\s*=\\s*\\[\\s*([\\s\\S]*?)\\s*\\]`);

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    content = content.replace(arrayRegex, (match, arrayContent) => {
        // Parse existing items and remove empty entries or trailing commas
        const arrayItems = arrayContent
            .split(',')
            .map((item) => item.trim())
            .filter((item) => item && item !== ''); // Remove empty entries

        // Add the new item if not already in the list
        if (!arrayItems.includes(arrayItemName)) {
            arrayItems.push(arrayItemName);
        }

        // Return the formatted array
        return `${arrayName} = [\n    ${arrayItems.join(',\n    ')},\n]`;
    });

    return content;
}
