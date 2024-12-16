// @mui
import MenuItem from '@mui/material/MenuItem';
import TextField, { TextFieldProps } from '@mui/material/TextField';
import { get, isArray } from 'lodash';
import { Controller, useFormContext } from 'react-hook-form';


type RHFSelectProps = TextFieldProps & {
	name: string;
	native?: boolean;
	nullable?: boolean;
	maxHeight?: boolean | number;
	options?: any[];
	valueKey?: string;
	labelKey?: string;
	isMultiple?: boolean
};

export function RHFSelect({
    name,
    helperText,
    children,
    native,
    nullable = true,
    options,
    valueKey,
    labelKey,
    slotProps,
    isMultiple,
    ...other
}: RHFSelectProps) {
    const { control } = useFormContext();

    const OptionsComponent = native ? 'option' : MenuItem;

    return (
        <Controller
            name={name}
            control={control}
            render={({ field, fieldState: { error } }) => (
                <TextField
                    {...field}
                    value={isMultiple ? (isArray(field.value) ? field.value : []) : (field.value === undefined || field.value === '') ? null : field.value}
                    select
                    fullWidth
                    error={!!error}
                    helperText={error ? error?.message : helperText}
                    slotProps={{
                        ...slotProps,
                        select: {
                            ...slotProps.select,
                            native,
                        }
                    }}
                    {...other}
                >
                    {nullable && (
                        <OptionsComponent value={null} />
                    )}
                    {options?.map((option) => (
                        <OptionsComponent
                            key={get(option, valueKey)}
                            value={get(option, valueKey)}
                        >
                            {get(option, labelKey)}
                        </OptionsComponent>
                    ))}
                    {children}
                </TextField>
            )}
        />
    );
}
