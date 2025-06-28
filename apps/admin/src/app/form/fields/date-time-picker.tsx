import { FormControl } from '@mui/material';
import { DateTimePicker as MuiDateTimePicker, DateTimePickerProps as MuiDateTimePickerProps } from '@mui/x-date-pickers/DateTimePicker';


export interface DateTimePickerProps extends Omit<MuiDateTimePickerProps, 'error'> {
    fullWidth?: boolean;
    disabled?: boolean;
    error?: boolean | { message?: string };
    helperText?: string;
    size?: any;
    label?: string;
}

export function DateTimePicker({
    fullWidth,
    disabled,
    sx,
    error,
    helperText,
    size,
    label,
    ...other
}: DateTimePickerProps) {
    const getHelperText = () => {
        if (error && typeof error === 'object' && error.message) {
            return error.message;
        }
        return helperText;
    };

    return (
        <FormControl
            component="fieldset"
            fullWidth={fullWidth}
        >
            <MuiDateTimePicker
                readOnly={disabled || false}
                sx={{ ...sx }}
                label={label}
                format={'YYYY-MM-DD hh:mm A'}
                slotProps={{
                    textField: {
                        helperText: getHelperText(),
                        error: !!error,
                        ...(size && { size }),
                        ...(disabled && { disabled }),
                    },
                }}
                {...other}
            />
        </FormControl>
    );
}

export default DateTimePicker;
