import { toDisplayDate } from '@libs/utils';
import {
    IconButton,
    TextField,
    TextFieldProps,
} from '@mui/material';
import { Moment } from 'moment';
import { useCallback, useMemo } from 'react';

import DateRangePicker, {
    DateRangePickerProps,
} from './components/date-range-picker';
import { getDefaultRanges } from './defaults';
import { Icon } from '../icons/icon';
import { IconEnum } from '../icons/icons';
import { MenuDropdown } from '../menu-dropdown/menu-drop-down';


export interface IDateRange {
    startDate?: Moment;
    endDate?: Moment;
}

export interface DateRangePickerDialogProps extends DateRangePickerProps {
    range?: IDateRange;
    limitOfLabels?: number;
    onChange?: (range: IDateRange) => void;
    showCloseButton?: boolean;
    label?: string;
    textFiledProps?: TextFieldProps;
}

function DateRangePickerDialog({
    range = {},
    onChange,
    label,
    limitOfLabels = 0,
    showCloseButton: _showCloseButton = false,
    textFiledProps,
    ...props
}: DateRangePickerDialogProps) {
    const newRanges = useMemo(() => {
        if (limitOfLabels > 0) {
            return getDefaultRanges().slice(0, limitOfLabels);
        }
        return null;
    }, [limitOfLabels]);

    const handleChange = useCallback((range: IDateRange) => {
        onChange?.(range);
    }, [onChange]);

    const handleClearDateRange = useCallback((event: React.MouseEvent) => {
        event.preventDefault();
        event.stopPropagation();
        onChange?.({});
    }, [onChange]);

    const displayValue = useMemo(() => {
        if (range?.startDate && range?.endDate) {
            return `${toDisplayDate(range.startDate.toDate())} - ${toDisplayDate(range.endDate.toDate())}`;
        }
        return '';
    }, [range?.startDate, range?.endDate]);

    return (
        <MenuDropdown
            anchor={(
                <TextField
                    {...textFiledProps}
                    value={displayValue}
                    {...label && {
                        label: label,
                    }}
                    placeholder="Select date range"
                    sx={{
                        cursor: 'pointer',
                        minWidth: 300,
                        ...textFiledProps?.sx,
                    }}
                    slotProps={{
                        input: {
                            readOnly: true,
                            sx: {
                                cursor: 'pointer',
                            },
                            endAdornment: (
                                <>
                                    {range?.endDate && range?.startDate ? (
                                        <IconButton
                                            size="small"
                                            color="inherit"
                                            onClick={handleClearDateRange}
                                            sx={{
                                                mr: 1,
                                            }}
                                        >
                                            <Icon
                                                size="x-small"
                                                icon={IconEnum.X}
                                            />
                                        </IconButton>
                                    ) : null}
                                    <Icon
                                        icon={IconEnum.Calendar}
                                        sx={{
                                            cursor: 'pointer',
                                        }}
                                    />
                                </>
                            ),
                        },
                    }}
                />
            )}
        >
            {({ handleClose }) => (
                <DateRangePicker
                    open
                    initialDateRange={range}
                    onChange={(range) => {
                        handleChange(range);
                        handleClose();
                    }}
                    {...(newRanges ? { definedRanges: newRanges } : {})}
                    {...props}
                />
            )}
        </MenuDropdown>
    );
}

export default DateRangePickerDialog;
