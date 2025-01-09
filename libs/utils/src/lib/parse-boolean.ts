export function parseBoolean(value:string | number | boolean) {
    switch (value) {
        case true:
        case 'true':
        case 1:
        case '1':
        case 'on':
        case 'yes':
        case 'YES':
        case 'Yes':
            return true;
        default:
            return false;
    }
}
