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

export function convertMsToTime(
    duration: number,
    type: 'milliseconds' | 'seconds' = 'milliseconds',
) {
    const padTo2Digits = (num: number) => num.toString().padStart(2, '0');
    let seconds = 0;
    let minutes = 0;
    let hours = 0;
    if (type === 'milliseconds') {
        seconds = Math.floor(duration / 1000);
    }
    if (type === 'seconds') {
        seconds = duration;
    }

    minutes = Math.floor(seconds / 60);
    hours = Math.floor(minutes / 60);

    seconds %= 60;
    minutes %= 60;

    return `${padTo2Digits(hours)}:${padTo2Digits(minutes)}:${padTo2Digits(
        seconds,
    )}`;
}
