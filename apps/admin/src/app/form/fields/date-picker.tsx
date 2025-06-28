import { FormControl } from '@mui/material';
import { DatePicker as MuiDatePicker, DatePickerProps as MuiDatePickerProps } from '@mui/x-date-pickers/DatePicker';


export interface DatePickerProps extends Omit<MuiDatePickerProps, 'error'> {
    fullWidth?: boolean;
    disabled?: boolean;
    error?: boolean | { message?: string };
    helperText?: string;
    size?: any;
    label?: string;
}

export function DatePicker({
    fullWidth,
    disabled,
    sx,
    error,
    helperText,
    size,
    label,
    ...other
}: DatePickerProps) {
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
            <MuiDatePicker
                readOnly={disabled || false}
                sx={{ ...sx }}
                label={label}
                format={'YYYY-MM-DD'}
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

export default DatePicker;
