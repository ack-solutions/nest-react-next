import moment, { Moment } from 'moment';
import { useFormContext, Controller } from 'react-hook-form';

import { DateTimePicker, DateTimePickerProps } from '../fields/date-time-picker';


export interface RHFDateTimeFieldProps extends Omit<DateTimePickerProps, 'value' | 'onChange' | 'error'> {
    name: string;
    onChange?: (value: Moment | null) => void;
}

export function RHFDateTimeField({
    name,
    onChange,
    ...other
}: RHFDateTimeFieldProps) {
    const { control } = useFormContext();

    return (
        <Controller
            name={name}
            control={control}
            render={({ field, fieldState: { error } }) => (
                <DateTimePicker
                    {...field}
                    value={field.value ? moment(field.value) : null}
                    onChange={(newValue) => {
                        field.onChange(newValue);
                        if (onChange) {
                            onChange(newValue);
                        }
                    }}
                    error={error}
                    {...other}
                />
            )}
        />
    );
}
