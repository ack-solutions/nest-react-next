export function getRouteUrl(path: string, params: any = {}) {
    return path.replace(/:[a-zA-Z?]+/g, (match) => {
        return params[match] !== undefined ? params[match] : match;
    });
}

export function downloadURI(uri: string, name: string) {
    const link = document.createElement('a');
    link.download = name;
    link.href = uri;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}
