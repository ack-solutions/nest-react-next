import React, { forwardRef, useState } from 'react';
import { useController, Control } from 'react-hook-form';
import { AppInput, AppInputProps } from '../../components/AppInput';

export type RHFPasswordProps = AppInputProps & {
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
            <AppInput
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
