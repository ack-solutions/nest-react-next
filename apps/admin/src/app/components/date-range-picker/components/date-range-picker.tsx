import moment, { Moment } from 'moment';
import { useCallback, useState } from 'react';

import { getDefaultRanges } from '../defaults';
import { DateRange, DefinedRange } from '../types';
import { parseOptionalDate } from '../utils';
import Menu from './menu';


export interface DateRangePickerProps {
    open?: boolean;
    initialDateRange?: DateRange;
    definedRanges?: DefinedRange[];
    minDate?: Moment | string;
    maxDate?: Moment | string;
    onChange?: (dateRange: DateRange) => void;
}

function DateRangePicker({
    open,
    onChange,
    initialDateRange,
    minDate,
    maxDate,
    definedRanges = getDefaultRanges(),
}: DateRangePickerProps) {
    const today = moment();

    const minDateValid = parseOptionalDate(minDate, today.clone().subtract(10, 'years'));
    const maxDateValid = parseOptionalDate(maxDate, today.clone().add(10, 'years'));
    const [dateRange, setDateRange] = useState<DateRange>({
        ...initialDateRange,
    });

    const handleDateRangeValidated = useCallback(
        (range: DateRange) => {
            if (range.startDate || range.endDate) {
                setDateRange(range);
                if (range.startDate && range.endDate) {
                    onChange(range);
                }
            } else {
                const emptyRange = {};
                onChange(emptyRange);
            }
        },
        [onChange],
    );

    return open ? (
        <Menu
            value={dateRange}
            minDate={minDateValid}
            maxDate={maxDateValid}
            ranges={definedRanges}
            onChange={handleDateRangeValidated}
        />
    ) : null;
}

export default DateRangePicker;
