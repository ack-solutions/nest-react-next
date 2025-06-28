import { FormControl } from '@mui/material';
import { TimePicker as MuiTimePicker, TimePickerProps as MuiTimePickerProps } from '@mui/x-date-pickers/TimePicker';


export interface TimePickerProps extends Omit<MuiTimePickerProps, 'error'> {
    fullWidth?: boolean;
    disabled?: boolean;
    error?: boolean | { message?: string };
    helperText?: string;
    size?: any;
    label?: string;
}

export function TimePicker({
    fullWidth,
    disabled,
    sx,
    error,
    helperText,
    size,
    label,
    ...other
}: TimePickerProps) {
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
            <MuiTimePicker
                readOnly={disabled || false}
                sx={{ ...sx }}
                label={label}
                format={'hh:mm A'}
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

export default TimePicker;
