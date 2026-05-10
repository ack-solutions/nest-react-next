import moment from 'moment';


export function toDisplayDate(date?: string | Date, format?: string) {
    const formatValue = format || 'DD MMM, YYYY';
    return date ? moment(date).format(formatValue) : '';
}

export function toDisplayTime(date?: string | Date, format?: string) {
    const formatValue = format || 'hh:mm A';
    return date ? moment(date).format(formatValue) : '';
}

export function toDisplayDateTime(
    date?: string | Date,
    format?: string,
) {
    const formatValue = format || 'DD MMM, YYYY hh:mm A';
    return date ? moment(date).format(formatValue) : '';
}

export function toDisplayDateRange(
    startDate: string | Date,
    endDate: string | Date,
    initial?: boolean,
) {
    const isValid = moment(startDate).isValid() && moment(endDate).isValid();

    const isAfter = moment(startDate).isAfter(moment(endDate));

    if (!isValid || isAfter) {
        return 'Invalid time value';
    }

    let label = `${toDisplayDate(startDate)} - ${toDisplayDate(endDate)}`;

    if (initial) {
        return label;
    }

    const isSameYear = moment(startDate).isSame(moment(endDate), 'year');
    const isSameMonth = moment(startDate).isSame(moment(endDate), 'month');
    const isSameDay = moment(startDate).isSame(moment(endDate), 'day');

    if (isSameYear && !isSameMonth) {
        label = `${toDisplayDate(startDate, 'DD MMM')} - ${toDisplayDate(endDate)}`;
    } else if (isSameYear && isSameMonth && !isSameDay) {
        label = `${toDisplayDate(startDate, 'DD')} - ${toDisplayDate(endDate)}`;
    } else if (isSameYear && isSameMonth && isSameDay) {
        label = `${toDisplayDate(endDate)}`;
    }

    return label;
}
