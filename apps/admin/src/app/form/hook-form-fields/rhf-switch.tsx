import {
    FormControlLabel,
    FormGroup,
    Switch,
    SwitchProps,
} from '@mui/material';
import { useCallback } from 'react';
import { Control, useController } from 'react-hook-form';


export interface RHFSwitchProps extends SwitchProps {
    label?: string | number | React.ReactNode;
    sx?: any;
    name: string;
    control?: Control;
    fullWidth?: boolean;
}

export function RHFSwitch({
    name,
    control,
    label,
    fullWidth,
    sx,
    ...props
}: RHFSwitchProps) {
    const { field } = useController({
        name,
        control,
    });

    const handleChange = useCallback(
        (event) => {
            field.onChange(event.target.checked);
        },
        [field],
    );

    return (
        <FormGroup
            sx={{
                width: fullWidth ? '100%' : 'auto',
                ...sx,
            }}
        >
            <FormControlLabel
                control={(
                    <Switch
                        name={name}
                        checked={field?.value}
                        onChange={handleChange}
                        {...props}
                    />
                )}
                label={label}
            />
        </FormGroup>
    );
}
