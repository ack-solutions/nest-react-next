import { toDisplayDate, toDisplayDateTime, toDisplayPhone, toDisplayTime } from '@libs/utils';
import { get, isNil, startCase, trim } from 'lodash';


export const templateFilters = {
    date: toDisplayDate,
    time: toDisplayTime,
    dateTime: toDisplayDateTime,
    phone: toDisplayPhone,
    startCase: startCase,
    get: get,
    default: (value: any, defaultValue: any) => isNil(value) || trim(value) === '' ? defaultValue : value,
};
