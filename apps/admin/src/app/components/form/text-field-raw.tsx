import {
    TextField as MUITextField,
    TextFieldProps as MUITextFieldProps,
    Box,
    SxProps,
    useTheme,
} from '@mui/material';
import { InputLabel } from '@mui/material';
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
    const theme = useTheme()

    return (
        <Box
            sx={{
                width: '100%',
                ...sx 
            }}
        >
            {label && (
                <InputLabel
                    disabled={!!props?.disabled}
                    required={!!props?.required}
                    error={!!props?.error}
                    htmlFor={props?.name}
                    margin='dense'
                    sx={{
                        ...theme.typography.body2,
                        color: 'text.secondary',
                        mb:0.5
                    }}
                >
                    {label}
                </InputLabel>
            )}
            <MUITextField
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