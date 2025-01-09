import {
    TextField as MUITextField,
    TextFieldProps as MUITextFieldProps,
    Box,
    SxProps,
} from '@mui/material';
import { FieldProps } from 'formik';
import { fieldToTextField } from 'formik-mui';
import { omit } from 'lodash';
import { memo, ReactNode } from 'react';


export interface TextFieldRawProps extends Omit<MUITextFieldProps, 'name'> {
    name?: string;
    inputSx?: SxProps;
}

export interface TextFieldProps extends FieldProps, Omit<TextFieldRawProps, 'name' | 'value' | 'error' | 'variant'> {
    helperText?: string | ReactNode;
    label?: string | ReactNode;
    inputSx?: SxProps;
}


export const TextFieldRaw = memo(({
    label,
    sx,
    inputSx,
    ...props
}: TextFieldRawProps) => {

    return (
        <Box
            sx={{
                width: '100%',
                ...sx
            }}
        >
            <MUITextField
                label={label}
                id={props?.name}
                fullWidth
                variant='outlined'
                sx={inputSx}
                {...omit(props, 'label')}
            />
        </Box>
    );
});


const TextField = memo((props: TextFieldProps) => {
    return <TextFieldRaw
        inputSx={props.inputSx}
        {...fieldToTextField(props)}
    />
})

export default TextField
