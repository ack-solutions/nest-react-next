import * as moment from "moment"


export function toDisplayDate(date?: string | Date, format = 'DD MMM, YYYY') {
    return date ? moment(date).format(format) : ''
}

export function toDisplayTime(date?: string | Date, format = 'hh:mm A') {
    return date ? moment(date).format(format) : ''
}

export function toDisplayDateTime(date?: string | Date, format = 'DD MMM, YYYY hh:mm A') {
    return date ? moment(date).format(format) : ''
}

export function padTo2Digits(num:any) {
    return num.toString().padStart(2, '0');
}

export function toDisplayMinutesFormatted(seconds:any) {
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);

    if (hours > 0) {
        const divisor_for_minutes = minutes % 60;
        const new_minutes = Math.floor(divisor_for_minutes);

        return new_minutes ? `${hours}h ${new_minutes}m` : `${hours}h`;

    } else {
        return `${minutes}m`;
    }
}

export function convertMsToTime(duration:any, type: 'milliseconds' | 'seconds' = 'milliseconds') {
    let seconds = 0
    let minutes = 0
    let hours = 0
    if (type === 'milliseconds') {
        seconds = Math.floor(duration / 1000);
    }
    if (type === 'seconds') {
        seconds = duration
    }

    minutes = Math.floor(seconds / 60);
    hours = Math.floor(minutes / 60);

    seconds = seconds % 60;
    minutes = minutes % 60;

    return `${padTo2Digits(hours)}:${padTo2Digits(minutes)}:${padTo2Digits(
        seconds,
    )}`;
}

