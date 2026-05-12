import { Datetime, toFormattedPhone } from '@libs/utils';
import { get, isNil, startCase, trim } from 'lodash';


export const templateFilters = {
    date: Datetime.toDisplayDate,
    time: Datetime.toDisplayTime,
    dateTime: Datetime.toDisplayDateTime,
    phone: toFormattedPhone,
    startCase: startCase,
    get: get,
    default: (value: any, defaultValue: any) => isNil(value) || trim(value) === '' ? defaultValue : value,
};
