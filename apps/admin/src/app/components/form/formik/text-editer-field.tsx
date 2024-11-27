import { ErrorMessage, FieldProps } from 'formik';
import { FC, ReactNode, useCallback } from 'react';
import QuillEditor, { QuillEditorProps } from '../../editor/quill';
import { Box } from "@mui/system";
import { FormHelperText, FormLabel } from "@mui/material";
import { get } from 'lodash';

export interface TextEditorFieldProps extends FieldProps {
    editorProps?: QuillEditorProps;
    label: string | ReactNode;
    helperTax: string | ReactNode;
}

const TextEditorField = ({
    form: { setFieldValue, touched, errors },
    field: { name, value },
    label,
    editorProps,
    helperTax,
}: TextEditorFieldProps) => {

    const onChange = useCallback(
        (value) => {
            setFieldValue(name, value || []);
        },
        [setFieldValue, name]
    );
    const hasError = get(errors, name, false)
    const hasTouched = get(errors, name, false)

    return (
        <Box>
            {label && (<FormLabel>{label}</FormLabel>)}
            <QuillEditor
                id={name}
                value={value}
                onChange={onChange}
                error={!!(hasError && hasTouched)}
                {...editorProps}
            />
            {helperTax && (
                <FormHelperText>{helperTax}</FormHelperText>
            )}
            {(hasError && hasTouched) && (
                <FormHelperText sx={{ color: ((theme) => theme.palette.error.main) }}> <ErrorMessage name={name} /> </FormHelperText>
            )}

        </Box>
    );
}

export default TextEditorField;