import { FormHelperText } from '@mui/material';
import { Control, useController } from 'react-hook-form';

import {
    LabelDropdown,
    LabelDropdownProps,
} from '../../components/label/label-dropdown';


export interface RHFLabelDropdownProps extends LabelDropdownProps {
    name: string;
    control?: Control;
}

function RHFLabelDropdown({
    name,
    control,
    ...other
}: RHFLabelDropdownProps) {
    const {
        field,
        fieldState: { error },
    } = useController({
        name,
        control,
        defaultValue: '',
    });

    return (
        <>
            <LabelDropdown
                selected={field.value}
                onChange={(option) => {
                    field.onChange(option);
                    if (other.onChange) {
                        other.onChange(option);
                    }
                }}
                {...other}
            />
            {error ? (
                <FormHelperText
                    error
                    sx={{ px: 2 }}
                >
                    {error.message}
                </FormHelperText>
            ) : null}
        </>
    );
}

export default RHFLabelDropdown;
