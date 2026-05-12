import { useFormContext, Controller } from 'react-hook-form';

import { Datetime } from '@libs/utils';

import { DatePicker, DatePickerProps } from '../fields/date-picker';
import { Dayjs } from 'dayjs';


export interface RHFDateFieldProps extends Omit<DatePickerProps, 'value' | 'onChange' | 'error'> {
    name: string;
    onChange?: (value: Dayjs | null) => void;
}

export function RHFDateField({
    name,
    onChange,
    ...other
}: RHFDateFieldProps) {
    const { control } = useFormContext();

    return (
        <Controller
            name={name}
            control={control}
            render={({ field, fieldState: { error } }) => (
                <DatePicker
                    {...field}
                    value={field.value ? Datetime.toDayjs(field.value) : null}
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
