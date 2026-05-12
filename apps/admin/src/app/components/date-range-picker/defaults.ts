import { Datetime } from '@libs/utils';
import { Dayjs } from 'dayjs';

import { DefinedRange } from './types';


export const getDefaultRanges = (): DefinedRange[] => {
    const now = Datetime.now();
    return [
        {
            label: 'Today',
            startDate: now.startOf('day'),
            endDate: now.endOf('day'),
        },
        {
            label: 'Yesterday',
            startDate: now.subtract(1, 'day').startOf('day'),
            endDate: now.subtract(1, 'day').endOf('day'),
        },
        {
            label: 'This Week',
            startDate: now.startOf('isoWeek'),
            endDate: now.endOf('isoWeek'),
        },
        {
            label: 'Last Week',
            startDate: now.subtract(1, 'week').startOf('isoWeek'),
            endDate: now.subtract(1, 'week').endOf('isoWeek'),
        },
        {
            label: 'This Month',
            startDate: now.startOf('month'),
            endDate: now.endOf('month'),
        },
        {
            label: 'Last Month',
            startDate: now.subtract(1, 'month').startOf('month'),
            endDate: now.subtract(1, 'month').endOf('month'),
        },
        {
            label: 'This Financial Year',
            ...getFinancialYearRange(Datetime.now()),
        },
        {
            label: 'Last Financial Year',
            ...getFinancialYearRange(Datetime.now().subtract(1, 'year')),
        },
    ];
};

function getFinancialYearRange(date: Dayjs) {
    const inputDate = date;
    const year = inputDate.year();
    const month = inputDate.month() + 1; // months are zero indexed

    let startYear;
    let endYear;

    if (month >= 4) {
        // April to December
        startYear = year;
        endYear = year + 1;
    } else {
        // January to March
        startYear = year - 1;
        endYear = year;
    }

    const startDate = Datetime.toDayjs(`${startYear}-04-01`)!;
    const endDate = Datetime.toDayjs(`${endYear}-03-31`)!;

    return {
        startDate: startDate,
        endDate: endDate,
    };
}
