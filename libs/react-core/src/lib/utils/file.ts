const config = {
  apiUrl: 'http://localhost:3333'
};

export function fileUrl(path?: string) {
  if (typeof path !== 'string') {
    return null
  }
  if (path?.startsWith('http')) {
    return path;
  }
  return `${config.apiUrl}/${path.replace(/^\//, '')}`
}

export function fileSize(size: number) {
  return (size / (1024 * 1024)).toFixed(2) + ' MB';
}