import { FormHelperText, FormLabel, Box } from '@mui/material';
import { ReactNode, useCallback, useEffect, useRef, useState } from 'react';
import { useController, Control } from 'react-hook-form';

import { EnhancedTemplateEditor, EnhancedTemplateEditorProps } from '../../components/template-editor/enhanced-template-editor';
import useDebounce from '../../hook/use-debounce';


export interface RHFEnhancedTemplateEditorProps extends Omit<EnhancedTemplateEditorProps, 'onChange' | 'value'> {
    name: string;
    control?: Control<any>;
    label?: string | ReactNode;
    language?: 'mjml' | 'html' | 'json';
    onRender?: (content: string) => Promise<string>;
    renderOnChange?: boolean;
    height?: string | number;
    debounceTime?: number;
    minContentLength?: number;
    title?: string;
}

export function RHFEnhancedTemplateEditor({
    name,
    control,
    label,
    language = 'mjml',
    onRender,
    renderOnChange = true,
    debounceTime = 2000,
    minContentLength = 10,
    title,
    height = '600px',
    ...props
}: RHFEnhancedTemplateEditorProps) {
    const {
        field: { onChange, value },
        fieldState: { error },
    } = useController({
        name,
        control,
        defaultValue: '',
    });

    const [htmlContent, setHtmlContent] = useState('');
    const [isRendering, setIsRendering] = useState(false);
    const [renderError, setRenderError] = useState<string | null>(null);
    const [autoRenderEnabled, setAutoRenderEnabled] = useState(renderOnChange);
    const [isEditing, setIsEditing] = useState(false);

    const renderAbortController = useRef<AbortController | null>(null);
    const lastRenderedContent = useRef<string>('');
    const renderTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    const debouncedValue = useDebounce(value, debounceTime);

    const handleContentChange = useCallback((newValue: string) => {
        onChange(newValue || '');
        setIsEditing(true);
        if (renderTimeoutRef.current) {
            clearTimeout(renderTimeoutRef.current);
        }
        renderTimeoutRef.current = setTimeout(() => {
            setIsEditing(false);
        }, 500);
    }, [onChange]);

    const handleRender = useCallback(async (content: string, isManual = false) => {
        if (!onRender || !content) return;

        if (!isManual && content === lastRenderedContent.current) {
            return;
        }
        if (!isManual && content.length < minContentLength) {
            return;
        }

        if (renderAbortController.current) {
            renderAbortController.current.abort();
        }

        renderAbortController.current = new AbortController();
        const currentController = renderAbortController.current;

        setIsRendering(true);
        setRenderError(null);

        try {
            const rendered = await onRender(content);
            if (currentController.signal.aborted) {
                return;
            }
            setHtmlContent(rendered);
            lastRenderedContent.current = content;
        } catch (_err) {
            if (currentController.signal.aborted) {
                return;
            }

            const errorMessage = _err instanceof Error ? _err.message : 'Failed to render template';
            setRenderError(errorMessage);
            console.error('Render error:', _err);
        } finally {
            if (!currentController.signal.aborted) {
                setIsRendering(false);
            }
        }
    }, [onRender, minContentLength]);

    useEffect(() => {
        if (
            autoRenderEnabled &&
            onRender &&
            debouncedValue &&
            !isEditing &&
            debouncedValue !== lastRenderedContent.current
        ) {
            handleRender(debouncedValue, false);
        }
    }, [
        debouncedValue,
        autoRenderEnabled,
        onRender,
        handleRender,
        isEditing,
    ]);

    // Cleanup effect
    useEffect(() => {
        return () => {
            if (renderAbortController.current) {
                renderAbortController.current.abort();
            }
            if (renderTimeoutRef.current) {
                clearTimeout(renderTimeoutRef.current);
            }
        };
    }, []);

    return (
        <Box
            sx={{
                width: '100%',
                display: 'flex',
                flexDirection: 'column',
            }}
        >
            {/* Label */}
            {label && (
                <Box
                    sx={{
                        mb: 1,
                        flexShrink: 0,
                    }}
                >
                    <FormLabel
                        sx={{
                            fontWeight: 600,
                            color: 'text.primary',
                        }}
                    >
                        {label}
                    </FormLabel>
                </Box>
            )}

            {/* Enhanced Template Editor */}
            <EnhancedTemplateEditor
                value={value}
                onChange={handleContentChange}
                language={language}
                onRender={onRender}
                renderOnChange={renderOnChange}
                debounceTime={debounceTime}
                minContentLength={minContentLength}
                title={title || 'Template Editor'}
                height={height}
                htmlContent={htmlContent}
                {...props}
            />

            {/* Error Message */}
            {error && (
                <FormHelperText
                    sx={{
                        color: (theme) => theme.palette.error.main,
                        mt: 1,
                        flexShrink: 0,
                    }}
                >
                    {error.message}
                </FormHelperText>
            )}
        </Box>
    );
}

export default RHFEnhancedTemplateEditor;
