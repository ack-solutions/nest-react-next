export function hexToRgbA(hex: string) {
    let c:any;
    if (/^#([A-Fa-f0-9]{3}){1,2}$/.test(hex)) {
        c = hex.substring(1).split('');
        if (c.length == 3) {
            c = [
                c[0],
                c[0],
                c[1],
                c[1],
                c[2],
                c[2],
            ];
        }
        c = '0x' + c.join('');
        return [
            (c >> 16) & 255,
            (c >> 8) & 255,
            c & 255,
        ];
    }
    throw new Error('Bad Hex');
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
