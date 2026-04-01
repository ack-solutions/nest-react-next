export function hexToRgbA(hex: string): number[] {
    if (!/^#([A-Fa-f0-9]{3}){1,2}$/.test(hex)) {
        throw new Error('Bad Hex');
    }

    let c = hex.substring(1);
    if (c.length === 3) {
        c = c[0] + c[0] + c[1] + c[1] + c[2] + c[2];
    }

    const red = parseInt(c.slice(0, 2), 16);
    const green = parseInt(c.slice(2, 4), 16);
    const blue = parseInt(c.slice(4, 6), 16);

    return [
        red,
        green,
        blue,
    ];
}

export function getRandomHexColor() {
    // Generate random values for red, green, and blue components
    const r = Math.floor(Math.random() * 256); // 0-255
    const g = Math.floor(Math.random() * 256); // 0-255
    const b = Math.floor(Math.random() * 256); // 0-255

    // Convert RGB to hex format
    const hexColor = `#${r.toString(16)}${g.toString(16)}${b.toString(16)}`;

    return hexColor;
}

