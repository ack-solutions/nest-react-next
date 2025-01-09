import get from 'lodash/get';

const checkResource = (resources:any, role: string, id?:any) => {
    // TODO: This assumes the role is in the form of <entityType>:<action> which wont always be the case...
    const entity = role.split(':')[0];

    return !!get(resources, [entity, id]);
};

const checkItem = (items: string[], role: string) => {
    return items.indexOf(role) >= 0;
};

export const hasItem = (items: string[] = [], resources: any, checkItems: string[] | string = [], additional: any) => {
    const isArrayOfItems = Array.isArray(checkItems);

    if (additional.resource) {
        const hasResourceAccess = !isArrayOfItems
            ? checkResource(resources, checkItems, additional.resource)
            : checkItems.every(role => checkResource(resources, role, additional.resource));

        if (!hasResourceAccess) {
            return false;
        }
    }

    const isAllowed = !isArrayOfItems
        ? checkItem(items, checkItems)
        : checkItems.every(role => checkItem(items, role));

    return isAllowed;
};

export const hasAnyItem = (items: string[] = [], resources: any, checkItems: string[] | string = [], additional: any) => {
    const isArrayOfItems = Array.isArray(checkItems);


    if (additional.resource) {
        const hasResourceAccess = !isArrayOfItems
            ? checkResource(resources, checkItems, additional.resource)
            : checkItems.filter(role => checkResource(resources, role, additional.resource)).length > 0;

        if (!hasResourceAccess) {
            return false;
        }
    }

    const isAllowed = !isArrayOfItems
        ? checkItem(items, checkItems)
        : checkItems.filter(role => checkItem(items, role)).length > 0;

    return isAllowed;
};

