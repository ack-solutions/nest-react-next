import Checkbox from '@mui/material/Checkbox';
import FormControl from '@mui/material/FormControl';
import FormControlLabel, { FormControlLabelProps } from '@mui/material/FormControlLabel';
import FormHelperText from '@mui/material/FormHelperText';
import { ReactNode } from 'react';
import { useController, Control } from 'react-hook-form';

import { CheckBoxGroup, CheckBoxGroupProps } from '../fields/check-box-group';


interface RHFCheckboxProps extends Omit<FormControlLabelProps, 'control' | 'label'> {
    name: string;
    control?: Control;
    helperText?: ReactNode;
    label?: string
}

export function RHFCheckbox({ name, control, helperText, label, ...other }: RHFCheckboxProps) {
    const {
        field: { onChange, value },
        fieldState: { error }
    } = useController({
        name,
        control,
    });
    return (
        <FormControl error={!!error}>
            <FormControlLabel
                control={
                    <Checkbox
                        onChange={(e, checked) => onChange(checked)}
                        checked={value}
                    />
                }
                label={label}
                {...other}
            />
            {(!!error || helperText) && (
                <FormHelperText error={!!error}>{error ? error?.message : helperText}</FormHelperText>
            )}
        </FormControl>
    );
}


interface RHFMultiCheckboxProps extends CheckBoxGroupProps {
    name: string;
    control?: Control;
}

export function RHFMultiCheckbox({
    name,
    control,
    ...other
}: RHFMultiCheckboxProps) {
    const {
        field: { onChange, value },
        fieldState: { error }
    } = useController({
        name,
        control,
    });

    return (
        <CheckBoxGroup
            {...other}
            value={value}
            error={!!error}
            onChange={onChange}
        />

    );
}
