import { Divider, Paper, Stack } from '@mui/material';
import { useCallback } from 'react';

import DefinedRanges from './defined-ranges';
import { DateRange, DefinedRange } from '../types';
import CustomStaticDateRangePicker from './static-date-range-picker';

import { Dayjs } from 'dayjs';


interface MenuProps {
    value: DateRange;
    onChange: (value: DateRange) => void;
    minDate: Dayjs;
    maxDate: Dayjs;
    ranges?: DefinedRange[];
}

function Menu(props: MenuProps) {
    const { value, onChange, minDate, maxDate, ranges } = props;

    const handleDateRangeChange = useCallback(
        (value: DateRange) => {
            onChange(value);
        },
        [onChange],
    );

    return (
        <Paper
            elevation={5}
            square
            sx={{ overflow: 'auto' }}
        >
            <Stack
                direction="row"
                divider={(
                    <Divider
                        orientation="vertical"
                        flexItem
                    />
                )}
            >
                <DefinedRanges
                    selectedRange={value}
                    ranges={ranges}
                    setRange={handleDateRangeChange}
                />
                <CustomStaticDateRangePicker
                    value={value}
                    onChange={handleDateRangeChange}
                    minDate={minDate}
                    maxDate={maxDate}
                />
            </Stack>
        </Paper>
    );
}

export default Menu;
