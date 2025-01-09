export function toTitleCase(input: string) {
    return input
        .replace(/[_\-\s]+/g, ' ') // Replace underscores, dashes, and multiple spaces with a single space
        .replace(/([a-z])([A-Z])/g, '$1 $2') // Add a space between camelCase words
        .toLowerCase() // Convert everything to lowercase
        .trim() // Remove extra spaces from the start and end
        .split(' ') // Split into words
        .map(word => word.charAt(0).toUpperCase() + word.slice(1)) // Capitalize the first letter of each word
        .join(' '); // Join the words with a single space
}
