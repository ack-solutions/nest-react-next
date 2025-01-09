import { FormHelperText, FormLabel } from "@mui/material";
import { Box } from "@mui/system";
import { ReactNode, forwardRef, Ref } from 'react';
import { useController, Control } from 'react-hook-form';

import { QuillEditor } from '../../components/editor';
import { QuillEditorProps } from '../../components/editor/quill';


export interface RHFTextEditorProps {
    name: string;
    control?: Control;
    editorProps?: QuillEditorProps;
    label: string | ReactNode;
    helperText?: string | ReactNode;
}

export const RHFTextEditor = forwardRef(({
    name,
    control,
    editorProps,
    label,
    helperText,
}: RHFTextEditorProps, ref: Ref<HTMLDivElement>) => {
    const {
        field: { onChange, onBlur, value },
        fieldState: { error }
    } = useController({
        name,
        control,
        defaultValue: '',
    });

    return (
        <Box ref={ref}>
            {label && (<FormLabel>{label}</FormLabel>)}
            <QuillEditor
                id={name}
                value={value}
                onChange={(value) => onChange(value || '')}
                onBlur={onBlur}
                error={!!error}
                {...editorProps}
            />
            {helperText && (
                <FormHelperText>{helperText}</FormHelperText>
            )}
            {error && (
                <FormHelperText sx={{ color: (theme) => theme.palette.error.main }}>
                    {error.message}
                </FormHelperText>
            )}
        </Box>
    );
});

export default RHFTextEditor;
