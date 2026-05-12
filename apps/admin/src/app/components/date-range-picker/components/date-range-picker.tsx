import { useCallback, useState } from 'react';

import { Datetime } from '@libs/utils';
import { Dayjs } from 'dayjs';

import { getDefaultRanges } from '../defaults';
import { DateRange, DefinedRange } from '../types';
import { parseOptionalDate } from '../utils';
import Menu from './menu';


export interface DateRangePickerProps {
    open?: boolean;
    initialDateRange?: DateRange;
    definedRanges?: DefinedRange[];
    minDate?: Dayjs | string;
    maxDate?: Dayjs | string;
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
    const today = Datetime.now();

    const minDateValid = parseOptionalDate(minDate, Datetime.subtract(today, 10, 'years') ?? today);
    const maxDateValid = parseOptionalDate(maxDate, Datetime.add(today, 10, 'years') ?? today);
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
