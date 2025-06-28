import { StaticDatePicker, StaticDatePickerProps } from '@mui/x-date-pickers';
import { useCallback, useState } from 'react';

import { CustomDatePickerToolbar } from './custom-date-picker-toolbar';
import { CustomDay } from './custom-day';
import { DateRange } from '../types';


export interface StaticDateRangePickerProps extends Omit<StaticDatePickerProps, 'value' | 'onChange'> {
    value?: DateRange;
    onChange?: (value?: DateRange) => void;
}

function StaticDateRangePicker({
    value,
    onChange,
    ...props
}: StaticDateRangePickerProps) {
    const [hoverDay, setHoverDay] = useState(null);

    const handleDateChange = useCallback(
        (date) => {
            const newValue: DateRange = {};

            if (!value?.startDate || (value?.startDate && value?.endDate)) {
                newValue.startDate = date;
                newValue.endDate = null;
            } else if (date < value?.startDate) {
                newValue.startDate = date;
                newValue.endDate = value?.startDate;
            } else {
                newValue.startDate = value?.startDate;
                newValue.endDate = date;
            }
            onChange(newValue);
        },
        [onChange, value],
    );

    const handleHoverIn = useCallback((day) => {
        setHoverDay(day);
    }, []);

    const handleHoverOut = useCallback((_day) => {
        setHoverDay(null);
    }, []);

    return (
        <StaticDatePicker
            {...props}
            sx={{
                ...(props.sx || {}),
                '&.MuiPickersLayout-root': {
                    minWidth: 300,
                },
                '& .MuiDateCalendar-root': {
                    width: 300,
                    height: 324,
                },
                '& .MuiDayCalendar-slideTransition': {
                    minHeight: 234,
                },
                '& .MuiDayCalendar-weekDayLabel': {
                    height: 32,
                    width: 32,
                },
                '& .MuiPickersDay-root': {
                    height: 32,
                    width: 32,
                },
            }}
            defaultValue={value?.startDate}
            slots={{
                toolbar: CustomDatePickerToolbar,
                day: CustomDay as any,
            }}
            slotProps={{
                actionBar: {
                    actions: [],
                },
                toolbar: {
                    selectedDates: [value?.startDate, value?.endDate],
                } as any,
                day: {
                    hoverDay,
                    selectedDates: [value?.startDate, value?.endDate],
                    onClick: handleDateChange,
                    onMouseEnter: handleHoverIn,
                    onMouseOut: handleHoverOut,
                } as any,
            }}
        />
    );
}

export default StaticDateRangePicker;
