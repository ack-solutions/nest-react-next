import { useCallback } from 'react';
import { Controller, useFormContext } from 'react-hook-form';

import { AutocompleteNew, AutocompleteNewProps } from '../fields/autocomplete-new';


export interface RHFAutocompleteProps extends Omit<AutocompleteNewProps, 'onChange'> {
    name: string;
    onChange?: (newValue?: any, obj?: any) => void;
}

export function RHFAutocomplete({
    name,
    onChange,
    ...other
}: RHFAutocompleteProps) {
    const { control, setValue } = useFormContext();

    const handleChange = useCallback(
        (newValue: any, obj: any) => {
            setValue(name, newValue, { shouldValidate: true });
            if (onChange) {
                onChange(newValue, obj);
            }
        },
        [
            name,
            onChange,
            setValue,
        ],
    );

    return (
        <Controller
            name={name}
            control={control}
            render={({ field, fieldState: { error } }) => (
                <AutocompleteNew
                    {...field}
                    onChange={handleChange}
                    error={error}
                    {...other}
                />
            )}
        />
    );
}
