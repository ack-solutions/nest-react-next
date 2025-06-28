import { FormHelperText, FormLabel, Box } from '@mui/material';
import { ReactNode, forwardRef, Ref } from 'react';
import { useController, Control } from 'react-hook-form';

import { QuillEditor, QuillEditorProps } from '../fields/editor/quill';


export interface RHFTextEditorProps {
    name: string;
    control?: Control;
    editorProps?: QuillEditorProps;
    label: string | ReactNode;
    helperText?: string | ReactNode;
}

export const RHFTextEditor = forwardRef(
    (
        { name, control, editorProps, label, helperText }: RHFTextEditorProps,
        ref: Ref<HTMLDivElement>,
    ) => {
        const {
            field: { onChange, value },
            fieldState: { error },
        } = useController({
            name,
            control,
            defaultValue: '',
        });

        return (
            <Box ref={ref}>
                {label ? <FormLabel>{label}</FormLabel> : null}
                <QuillEditor
                    id={name}
                    value={value || ''}
                    onChange={(value) => onChange(value || '')}
                    error={!!error}
                    {...editorProps}
                />
                {helperText ? <FormHelperText>{helperText}</FormHelperText> : null}
                {error ? (
                    <FormHelperText
                        sx={{ color: (theme) => theme.palette.error.main }}
                    >
                        {error.message}
                    </FormHelperText>
                ) : null}
            </Box>
        );
    },
);

export default RHFTextEditor;
