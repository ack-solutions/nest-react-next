import { useForkRef } from '@mui/material';
import { forwardRef, Ref } from 'react';
import { Control, useController } from 'react-hook-form';

import { TextFieldRaw, TextFieldRawProps } from '../fields/text-field-raw';


export type RHFTextFieldProps = Omit<TextFieldRawProps, 'name'> & {
    name: string;
    control?: Control;
    component?: any;
};

export const RHFTextField = forwardRef(
    (props: RHFTextFieldProps, ref: Ref<HTMLDivElement>) => {
        const {
            name,
            control,
            component: TextFieldComponent = TextFieldRaw,
            inputRef,
            onBlur,
            ...rest
        } = props;

        const {
            field,
            fieldState: { error },
        } = useController({
            name,
            control,
            // disabled: rest.disabled,
        });

        const handleInputRef = useForkRef(field.ref, inputRef);

        return (
            <TextFieldComponent
                name={field.name}
                value={rest?.type === 'number' ? Number(field.value) || '' : field.value}
                onChange={(event) => {
                    field.onChange(event);
                    if (typeof rest.onChange === 'function') {
                        rest.onChange(event);
                    }
                }}
                onBlur={(event) => {
                    field.onBlur();
                    if (typeof onBlur === 'function') {
                        onBlur(event);
                    }
                }}
                error={!!error}
                helperText={error ? error.message : rest.helperText}
                ref={ref}
                inputRef={handleInputRef}
                {...rest}
            />
        );
    },
);
