import {
    TextFieldProps as MuiTextFieldProps,
} from '@mui/material/TextField';
import { FieldProps, getIn } from 'formik';
import { TextFieldRaw } from '../text-field-raw';

export interface TextFieldProps extends FieldProps, Omit<MuiTextFieldProps, 'name' | 'value' | 'error'> {

}

export function fieldToTextField({
    disabled,
    field: { onBlur: fieldOnBlur, value, ...field },
    form: { isSubmitting, touched, errors },
    onBlur,
    helperText,
    ...props
}: TextFieldProps): MuiTextFieldProps {
    const fieldError = getIn(errors, field.name);
    const showError = getIn(touched, field.name) && !!fieldError;


    return {
        error: showError,
        helperText: showError ? fieldError : helperText,
        disabled: disabled ?? isSubmitting,
        onBlur:
            onBlur ??
            function (e) {
                fieldOnBlur(e ?? field.name);
            },
        value: value ? value : '',
        ...field,
        ...props,
    } as MuiTextFieldProps;
}

export function TextField({ children, ...props }: TextFieldProps) {
    return <TextFieldRaw {...fieldToTextField(props)}>{children}</TextFieldRaw>;
}
