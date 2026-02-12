import { toDisplayDate, toDisplayDateTime, toDisplayTime, toFormattedPhone } from '@libs/utils';
import { get, isNil, startCase, trim } from 'lodash';


export const templateFilters = {
    date: toDisplayDate,
    time: toDisplayTime,
    dateTime: toDisplayDateTime,
    phone: toFormattedPhone,
    startCase: startCase,
    get: get,
    default: (value: any, defaultValue: any) => isNil(value) || trim(value) === '' ? defaultValue : value,
};
