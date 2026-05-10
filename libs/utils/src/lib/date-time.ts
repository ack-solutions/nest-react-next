import dayjsBase from 'dayjs';
import type { Dayjs, OpUnitType, ManipulateType } from 'dayjs';

import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import localizedFormat from 'dayjs/plugin/localizedFormat';
import relativeTime from 'dayjs/plugin/relativeTime';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import advancedFormat from 'dayjs/plugin/advancedFormat';
import weekday from 'dayjs/plugin/weekday';
import localeData from 'dayjs/plugin/localeData';
import isoWeek from 'dayjs/plugin/isoWeek';
import minMax from 'dayjs/plugin/minMax';

// Centralized Day.js configuration.
// Only `@libs/utils` should import raw `dayjs`; app/shared code should prefer helpers / `Datetime`.
dayjsBase.extend(utc);
dayjsBase.extend(timezone);
dayjsBase.extend(customParseFormat);
dayjsBase.extend(localizedFormat);
dayjsBase.extend(relativeTime);
dayjsBase.extend(isSameOrBefore);
dayjsBase.extend(isSameOrAfter);
dayjsBase.extend(advancedFormat);
dayjsBase.extend(weekday);
dayjsBase.extend(localeData);
dayjsBase.extend(isoWeek);
dayjsBase.extend(minMax);

/**
 * Export the configured Day.js instance (escape hatch).
 * Prefer `Datetime.*` methods in app/shared code.
 */
export const dayjs = dayjsBase;

export const isDayjs = (value: unknown): value is Dayjs => dayjs.isDayjs(value);

export function getDefaultTimezone(): string {
    try {
        if (typeof Intl !== 'undefined' && Intl.DateTimeFormat) {
            return Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC';
        }
    } catch {
        // ignore
    }
    return 'UTC';
}

export function setDefaultTimezone(timezoneId: string | null | undefined) {
    // `tz.setDefault` is global and may behave differently across environments.
    // Prefer explicit timezone helpers when possible.
    const id = timezoneId || getDefaultTimezone();
    dayjs.tz.setDefault(id);
}

export type DateInput = string | number | Date | Dayjs | null | undefined;

export class Datetime {
    static toDayjs(value?: DateInput): Dayjs | null {
        if (value === null || value === undefined || value === '') return null;
        if (isDayjs(value)) return value;
        return dayjs(value);
    }

    static parseDate(value: DateInput): Dayjs | null {
        const d = this.toDayjs(value);
        if (!d) return null;
        return d.isValid() ? d : null;
    }

    static parseUtcDate(value: DateInput): Dayjs | null {
        const d = this.toDayjs(value);
        if (!d) return null;
        const utcValue = d.utc();
        return utcValue.isValid() ? utcValue : null;
    }

    static parseTzDate(value: DateInput, timezoneId?: string | null): Dayjs | null {
        const d = this.toDayjs(value);
        if (!d) return null;
        const tz = timezoneId ?? getDefaultTimezone();
        const zoned = d.tz(tz);
        return zoned.isValid() ? zoned : null;
    }

    static formatDate(value: DateInput, format?: string): string {
        const d = this.parseDate(value);
        if (!d) return '';
        const formatValue = format || 'DD MMM, YYYY';
        return d.format(formatValue);
    }

    static formatDateTime(value: DateInput, format?: string): string {
        return this.formatDate(value, format || 'DD MMM, YYYY hh:mm A');
    }

    static formatTime(value: DateInput, format?: string): string {
        const d = this.parseDate(value);
        if (!d) return '';
        return d.format(format || 'hh:mm A');
    }

    static formatDateOrPlaceholder(date?: DateInput, format?: string): string {
        if (date == null || date === '') return '—';
        return this.toDisplayDate(date, format);
    }

    static toDisplayDate(date?: DateInput, format?: string): string {
        const formatValue = format || 'DD MMM, YYYY';
        if (!date) return '';
        return dayjs(date).format(formatValue);
    }

    static toDisplayTime(date?: DateInput, format?: string): string {
        const formatValue = format || 'hh:mm A';
        if (!date) return '';
        return dayjs(date).format(formatValue);
    }

    static toDisplayDateTime(date?: DateInput, format?: string): string {
        const formatValue = format || 'DD MMM, YYYY hh:mm A';
        if (!date) return '';
        return dayjs(date).format(formatValue);
    }

    static toDisplayDateRange(startDate: DateInput, endDate: DateInput, initial?: boolean): string {
        const start = this.parseDate(startDate);
        const end = this.parseDate(endDate);

        if (!start || !end || start.isAfter(end)) {
            return 'Invalid time value';
        }

        let label = `${this.toDisplayDate(startDate)} - ${this.toDisplayDate(endDate)}`;

        if (initial) return label;

        const isSameYear = start.isSame(end, 'year');
        const isSameMonth = start.isSame(end, 'month');
        const isSameDay = start.isSame(end, 'day');

        if (isSameYear && !isSameMonth) {
            label = `${this.toDisplayDate(startDate, 'DD MMM')} - ${this.toDisplayDate(endDate)}`;
        } else if (isSameYear && isSameMonth && !isSameDay) {
            label = `${this.toDisplayDate(startDate, 'DD')} - ${this.toDisplayDate(endDate)}`;
        } else if (isSameYear && isSameMonth && isSameDay) {
            label = `${this.toDisplayDate(endDate)}`;
        }

        return label;
    }

    static now(): Dayjs {
        return dayjs();
    }

    static today(): Dayjs {
        return dayjs().startOf('day');
    }

    static isBefore(a: DateInput, b: DateInput, unit?: OpUnitType): boolean {
        const da = this.parseDate(a);
        const db = this.parseDate(b);
        if (!da || !db) return false;
        return unit ? da.isBefore(db, unit) : da.isBefore(db);
    }

    static isAfter(a: DateInput, b: DateInput, unit?: OpUnitType): boolean {
        const da = this.parseDate(a);
        const db = this.parseDate(b);
        if (!da || !db) return false;
        return unit ? da.isAfter(db, unit) : da.isAfter(db);
    }

    static isSame(a: DateInput, b: DateInput, unit?: OpUnitType): boolean {
        const da = this.parseDate(a);
        const db = this.parseDate(b);
        if (!da || !db) return false;
        return unit ? da.isSame(db, unit) : da.isSame(db);
    }

    static add(value: DateInput, amount: number, unit: ManipulateType): Dayjs | null {
        const d = this.parseDate(value);
        if (!d) return null;
        return d.add(amount, unit);
    }

    static subtract(value: DateInput, amount: number, unit: ManipulateType): Dayjs | null {
        const d = this.parseDate(value);
        if (!d) return null;
        return d.subtract(amount, unit);
    }

    static startOf(value: DateInput, unit: OpUnitType): Dayjs | null {
        const d = this.parseDate(value);
        if (!d) return null;
        return d.startOf(unit);
    }

    static endOf(value: DateInput, unit: OpUnitType): Dayjs | null {
        const d = this.parseDate(value);
        if (!d) return null;
        return d.endOf(unit);
    }

    static diff(a: DateInput, b: DateInput, unit?: OpUnitType, float?: boolean): number {
        const da = this.parseDate(a);
        const db = this.parseDate(b);
        if (!da || !db) return NaN;
        return unit ? da.diff(db, unit, float) : da.diff(db);
    }

    static toDate(value: DateInput): Date | null {
        const d = this.parseDate(value);
        return d ? d.toDate() : null;
    }

    static toISOString(value: DateInput): string | null {
        const d = this.parseDate(value);
        return d ? d.toISOString() : null;
    }

    static unix(value?: DateInput): number {
        if (value === undefined || value === null || value === '') return Math.floor(Date.now() / 1000);
        const d = this.parseDate(value);
        return d ? d.unix() : NaN;
    }

    static fromNow(value: DateInput): string {
        const d = this.parseDate(value);
        if (!d) return '';
        return d.fromNow();
    }

    static toUtc(value: DateInput): Dayjs | null {
        return this.parseUtcDate(value);
    }

    static toTimezone(value: DateInput, timezoneId?: string | null): Dayjs | null {
        return this.parseTzDate(value, timezoneId);
    }

    static getDefaultTimezone(): string {
        return getDefaultTimezone();
    }

    static setDefaultTimezone(timezoneId: string | null | undefined) {
        setDefaultTimezone(timezoneId);
    }
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

    return `${padTo2Digits(hours)}:${padTo2Digits(minutes)}:${padTo2Digits(seconds)}`;
}
