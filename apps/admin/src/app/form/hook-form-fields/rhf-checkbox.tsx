/* eslint-disable react/no-multi-comp */
import Checkbox from '@mui/material/Checkbox';
import FormControl from '@mui/material/FormControl';
import FormControlLabel, {
    FormControlLabelProps,
} from '@mui/material/FormControlLabel';
import FormHelperText from '@mui/material/FormHelperText';
import { ReactNode, useCallback } from 'react';
import { useController, Control } from 'react-hook-form';

import { CheckBoxGroup, CheckBoxGroupProps } from '../fields/check-box-group';


interface RHFCheckboxProps
    extends Omit<FormControlLabelProps, 'control' | 'label'> {
    name: string;
    control?: Control;
    helperText?: ReactNode;
    label?: any;
}

export function RHFCheckbox({
    name,
    control,
    helperText,
    label,
    ...other
}: RHFCheckboxProps) {
    const {
        field: { onChange, value },
        fieldState: { error },
    } = useController({
        name,
        control,
    });
    return (
        <FormControl>
            <FormControlLabel
                control={(
                    <Checkbox
                        onChange={(_e, checked) => onChange(checked)}
                        checked={value}
                    />
                )}
                label={label}
                {...other}
            />
            {(!!error || helperText) ? (
                <FormHelperText error={!!error}>
                    {error ? error?.message : helperText}
                </FormHelperText>
            ) : null}
        </FormControl>
    );
}

interface RHFMultiCheckboxProps extends Omit<CheckBoxGroupProps, 'onChange' | 'value'> {
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
        fieldState: { error },
    } = useController({
        name,
        control,
    });

    const handleChange = useCallback((value: string[]) => {
        onChange(value);
    }, [onChange]);

    return (
        <CheckBoxGroup
            value={value}
            error={!!error}
            onChange={handleChange}
            {...other}
        />
    );
}
