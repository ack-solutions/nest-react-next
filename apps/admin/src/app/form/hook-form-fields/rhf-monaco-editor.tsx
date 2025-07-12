import { Editor } from '@monaco-editor/react';
import { FormHelperText, FormLabel, Box } from '@mui/material';
import { ReactNode, forwardRef, Ref } from 'react';
import { useController, Control } from 'react-hook-form';


export interface RHFMonacoEditorProps {
    name: string;
    control?: Control;
    label: string | ReactNode;
    helperText?: string | ReactNode;
    language?: string;
    height?: string | number;
    options?: any;
}

export const RHFMonacoEditor = forwardRef(
    (
        {
            name,
            control,
            label,
            helperText,
            language = 'html',
            height = '400px',
            options,
        }: RHFMonacoEditorProps,
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
                <Box
                    sx={{
                        border: '1px solid',
                        borderColor: error ? 'error.main' : 'divider',
                        borderRadius: 1,
                        overflow: 'hidden',
                        mt: 1,
                    }}
                >
                    <Editor
                        height={height}
                        language={language}
                        value={value || ''}
                        onChange={(newValue) => onChange(newValue || '')}
                        theme="monokai"
                        options={{
                            minimap: { enabled: false },
                            scrollBeyondLastLine: false,
                            fontSize: 14,
                            wordWrap: 'on',
                            automaticLayout: true,
                            formatOnPaste: true,
                            formatOnType: true,
                            ...options,
                        }}
                    />
                </Box>
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

export default RHFMonacoEditor;
