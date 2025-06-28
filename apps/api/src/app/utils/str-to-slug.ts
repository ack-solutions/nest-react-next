export function strToSlug(str: string) {
    // replace all special characters | symbols with a space
    str = str
        .replace(/[`~!@#$%^&*()_\-+=\\[\]{};:'"\\|\\/,.<>?\s]/g, ' ')
        .toLowerCase();

    // trim spaces at start and end of string
    str = str.replace(/^\s+|\s+$/gm, '');

    // replace space with dash/hyphen
    str = str.replace(/\s+/g, '-');

    return str;
}

export async function generateSlug(
    str: string,
    databaseCheck: (str: string) => Promise<boolean> | boolean = () => false,
) {
    let index = 1;
    let found: any;
    let slug: string;
    do {
        slug = strToSlug(str + (index > 1 ? ' ' + index : ''));
        found = await databaseCheck(slug);
        index++;
    } while (found);

    return slug;
}

export function strToArray(tags: any): string[] {
    // Map through each string and split into words, then flatten the result
    return tags
        .map((str: any) => {
            // Remove special characters and convert to lowercase
            const cleanStr = str
                .replace(/[`~!@#$%^&*()_\-+=\\[\]{};:'"\\|\\/,.<>?]/g, '')
                .toLowerCase();

            // Split by spaces and filter empty strings
            return cleanStr.split(/\s+/).filter((word: any) => word.length > 0);
        })
        .flat(); // Flatten the array of arrays into a single array
}
