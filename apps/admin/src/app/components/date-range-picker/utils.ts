import moment from 'moment';

import { DateRange } from './types';


export const identity = <T>(x: T) => x;

export const chunks = <T>(array: ReadonlyArray<T>, size: number): T[][] => {
    return Array.from({ length: Math.ceil(array.length / size) }, (_v, i) => array.slice(i * size, i * size + size));
};

// Date
export const getDaysInMonth = (date: moment.Moment, _locale?: string) => {
    const startWeek = moment(date).startOf('month').startOf('week');
    const endWeek = moment(date).endOf('month').endOf('week');
    const days = [];
    for (let curr = startWeek.clone(); curr.isBefore(endWeek, 'day'); curr.add(1, 'day')) {
        days.push(curr.clone());
    }
    return days;
};

export const isStartOfRange = ({ startDate }: DateRange, day: moment.Moment) => startDate && day.isSame(startDate, 'day');

export const isEndOfRange = ({ endDate }: DateRange, day: moment.Moment) => endDate && day.isSame(endDate, 'day');

export const inDateRange = ({ startDate, endDate }: DateRange, day: moment.Moment) => {
    return startDate &&
        endDate &&
        (day.isBetween(startDate, endDate, 'day', '[]') ||
            day.isSame(startDate, 'day') ||
            day.isSame(endDate, 'day'));
};

export const isRangeSameDay = ({ startDate, endDate }: DateRange) => {
    return startDate && endDate ? startDate.isSame(endDate, 'day') : false;
};

type Falsy = false | null | undefined | 0 | '';

export const parseOptionalDate = (
    date: moment.Moment | string | Falsy,
    defaultValue: moment.Moment,
) => {
    if (date) {
        const parsed = moment.isMoment(date) ? date : moment(date);
        if (parsed.isValid()) return parsed;
    }
    return defaultValue;
};

export const getValidatedMonths = (
    range: DateRange,
    minDate: moment.Moment,
    maxDate: moment.Moment,
) => {
    const { startDate, endDate } = range;
    if (startDate && endDate) {
        const newStart = moment.max(startDate, minDate);
        const newEnd = moment.min(endDate, maxDate);
        return [newStart, newStart.isSame(newEnd, 'month') ? newStart.clone().add(1, 'month') : newEnd];
    }
    return [startDate, endDate];
};
