import { Datetime } from '@libs/utils';
import { Dayjs } from 'dayjs';

import { DateRange } from './types';


export const identity = <T>(x: T) => x;

export const chunks = <T>(array: ReadonlyArray<T>, size: number): T[][] => {
    return Array.from({ length: Math.ceil(array.length / size) }, (_v, i) => array.slice(i * size, i * size + size));
};

// Date
export const getDaysInMonth = (date: Dayjs, _locale?: string): Dayjs[] => {
    const startWeek = date.startOf('month').startOf('week');
    const endWeek = date.endOf('month').endOf('week');
    const days: Dayjs[] = [];

    // Day.js is immutable, so advance `curr` via assignment.
    for (let curr = startWeek; curr.isBefore(endWeek, 'day'); curr = curr.add(1, 'day')) {
        days.push(curr);
    }
    return days;
};

export const isStartOfRange = ({ startDate }: DateRange, day: Dayjs) => startDate && day.isSame(startDate, 'day');

export const isEndOfRange = ({ endDate }: DateRange, day: Dayjs) => endDate && day.isSame(endDate, 'day');

export const inDateRange = ({ startDate, endDate }: DateRange, day: Dayjs) => {
    if (!startDate || !endDate) return false;

    const d = day.startOf('day');
    const start = startDate.startOf('day');
    const end = endDate.startOf('day');

    // Moment used `isBetween(..., 'day', '[]')` (inclusive). Mirror with explicit checks.
    return (
        d.isSame(start, 'day') ||
        d.isSame(end, 'day') ||
        (d.isAfter(start) && d.isBefore(end))
    );
};

export const isRangeSameDay = ({ startDate, endDate }: DateRange) => {
    return startDate && endDate ? startDate.isSame(endDate, 'day') : false;
};

type Falsy = false | null | undefined | 0 | '';

export const parseOptionalDate = (
    date: Dayjs | string | Falsy,
    defaultValue: Dayjs,
) => {
    if (date) {
        const parsed = Datetime.toDayjs(date);
        if (parsed && parsed.isValid()) return parsed;
    }
    return defaultValue;
};

export const getValidatedMonths = (
    range: DateRange,
    minDate: Dayjs,
    maxDate: Dayjs,
) => {
    const { startDate, endDate } = range;
    if (startDate && endDate) {
        const newStart = startDate.isAfter(minDate) ? startDate : minDate;
        const newEnd = endDate.isBefore(maxDate) ? endDate : maxDate;
        return [newStart, newStart.isSame(newEnd, 'month') ? newStart.add(1, 'month') : newEnd];
    }
    return [startDate, endDate];
};
