export function localStorageAvailable() {
    try {
        const key = '23052022';
        window.localStorage.setItem(key, key);
        window.localStorage.removeItem(key);
        return true;
    } catch (_error) {
        return false;
    }
}

export function localStorageGetItem(key: string, defaultValue = '') {
    const storageAvailable = localStorageAvailable();

    let value;

    if (storageAvailable) {
        value = localStorage.getItem(key) || defaultValue;
    }

    return value;
}
