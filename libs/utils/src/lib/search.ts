export function arraySearch(array: any[], text = '', renderKey?: string | string[]) {
    if (text) {
        const findText = text.toString().toLowerCase();
        let results: any[] = [];
        try {
            results = array?.filter(item => {
                if (typeof item === 'string') {
                    return (item?.toString()?.toLowerCase()?.indexOf(findText) > -1);
                } if (renderKey && typeof renderKey !== 'string' && typeof item !== 'string') {
                    for (let index = 0; index < renderKey?.length; index++) {
                        const key = renderKey[index];
                        if (eval(`item.${key}`)?.toLowerCase()?.indexOf(findText) > -1) {
                            return true;
                        }

                        continue;
                    }
                } else if (renderKey && typeof renderKey === 'string') {
                    return (item[renderKey].toString()?.toLowerCase()?.indexOf(findText) > -1);
                }
                return false;
            });
        } catch (error) {
            console.log(error);
            results = [];
        }
        return results;
    }

    return array;
}
