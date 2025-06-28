import moment from 'moment';

import { DefinedRange } from './types';


export const getDefaultRanges = (): DefinedRange[] => {
    return [
        {
            label: 'Today',
            startDate: moment().startOf('day'),
            endDate: moment().endOf('day'),
        },
        {
            label: 'Yesterday',
            startDate: moment().subtract(1, 'day').startOf('day'),
            endDate: moment().subtract(1, 'day').endOf('day'),
        },
        {
            label: 'This Week',
            startDate: moment().startOf('isoWeek'),
            endDate: moment().endOf('isoWeek'),
        },
        {
            label: 'Last Week',
            startDate: moment().subtract(1, 'week').startOf('isoWeek'),
            endDate: moment().subtract(1, 'week').endOf('isoWeek'),
        },
        {
            label: 'This Month',
            startDate: moment().startOf('month'),
            endDate: moment().endOf('month'),
        },
        {
            label: 'Last Month',
            startDate: moment().subtract(1, 'month').startOf('month'),
            endDate: moment().subtract(1, 'month').endOf('month'),
        },
        {
            label: 'This Financial Year',
            ...getFinancialYearRange(moment()),
        },
        {
            label: 'Last Financial Year',
            ...getFinancialYearRange(moment().subtract(1, 'year')),
        },
    ];
};

function getFinancialYearRange(date) {
    const inputDate = moment(date);
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

    const startDate = moment(`${startYear}-04-01`);
    const endDate = moment(`${endYear}-03-31`);

    return {
        startDate: startDate,
        endDate: endDate,
    };
}
