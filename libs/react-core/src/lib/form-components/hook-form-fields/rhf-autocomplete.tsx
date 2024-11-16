import { Controller, useFormContext } from 'react-hook-form';
import { useCallback } from 'react';
import Autocomplete, { AutocompleteProps } from '../fields/autocomplete';

export interface RHFAutocompleteProps extends AutocompleteProps {
    name: string;
}

export default function RHFAutocomplete({
    name,
    onChange,
    ...other
}: RHFAutocompleteProps) {
    const { control, setValue } = useFormContext();

    const handleChange = useCallback(
        (newValue: any) => {
            setValue(name, newValue, { shouldValidate: true });
            if (onChange) {
                onChange(newValue)
            }
        },
        [name, onChange, setValue],
    )

    return (
        <Controller
            name={name}
            control={control}
            render={({ field, fieldState: { error } }) => (
                <Autocomplete
                    {...field}
                    onChange={handleChange}
                    error={error}
                    {...other}
                />
            )}

        />
    )
}
