import React, { forwardRef } from 'react';
import { useController, Control } from 'react-hook-form';
import { FormInput, FormInputProps } from '../FormInput';

export type RHFPasswordProps = FormInputProps & {
    name: string;
    control?: Control<any>;
};

export const RHFPassword = forwardRef<any, RHFPasswordProps>(
    ({ name, control, ...other }, ref) => {
        const {
            field: { value, onChange, onBlur, ref: fieldRef },
            fieldState: { error },
        } = useController({ name, control });

        return (
            <FormInput
                ref={ref || fieldRef}
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                error={error?.message}
                secureTextEntry
                {...other}
            />
        );
    }
);
