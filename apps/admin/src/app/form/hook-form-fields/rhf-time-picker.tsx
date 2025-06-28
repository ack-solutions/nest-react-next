import moment, { Moment } from 'moment';
import { useFormContext, Controller } from 'react-hook-form';

import { TimePicker, TimePickerProps } from '../fields/time-picker';


export interface RHFTimeFieldProps extends Omit<TimePickerProps, 'value' | 'onChange' | 'error'> {
    name: string;
    onChange?: (value: Moment | null) => void;
}

export function RHFTimeField({
    name,
    onChange,
    ...other
}: RHFTimeFieldProps) {
    const { control } = useFormContext();

    return (
        <Controller
            name={name}
            control={control}
            render={({ field, fieldState: { error } }) => (
                <TimePicker
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
