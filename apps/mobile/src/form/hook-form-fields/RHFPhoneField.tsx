import React, { forwardRef } from 'react';
import { useController, Control } from 'react-hook-form';
import { FormInput, FormInputProps } from '../FormInput';

export type RHFPhoneFieldProps = FormInputProps & {
    name: string;
    control?: Control<any>;
};

export const RHFPhoneField = forwardRef<any, RHFPhoneFieldProps>(
    ({ name, control, ...other }, ref) => {
        const {
            field: { value, onChange, onBlur, ref: fieldRef },
            fieldState: { error },
        } = useController({ name, control });

        return (
            <FormInput
                ref={ref || fieldRef}
                value={value}
                onChangeText={(text) => {
                    // Only allow numeric input
                    const numericValue = text.replace(/[^0-9]/g, '');
                    onChange(numericValue);
                }}
                onBlur={onBlur}
                error={error?.message}
                keyboardType="phone-pad"
                maxLength={10}
                {...other}
            />
        );
    }
);
