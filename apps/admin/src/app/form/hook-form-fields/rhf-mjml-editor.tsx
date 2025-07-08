import MJMLSplitEditor, { MJMLSplitEditorProps } from '@admin/app/components/email-editor/layout-editor';
import useDebounce from '@admin/app/hook/use-debounce';
import { Refresh } from '@mui/icons-material';
import { FormHelperText, FormLabel, Box, Button, IconButton, Tooltip, Alert, CircularProgress, Typography, Switch, FormControlLabel } from '@mui/material';
import { ReactNode, useState, useCallback, useEffect, useRef } from 'react';
import { useController, Control } from 'react-hook-form';


export interface RHFMJMLSplitEditorProps extends Omit<MJMLSplitEditorProps, 'onChange'> {
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

export function RHFMJMLSplitEditor({
    name,
    control,
    label,
    language = 'mjml',
    onRender,
    renderOnChange = true,
    debounceTime = 2000,
    minContentLength = 10,
    title,
    ...props
}: RHFMJMLSplitEditorProps) {
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

    const handleManualRender = useCallback(async () => {
        await handleRender(value, true);
    }, [handleRender, value]);

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

    // Toggle auto-render
    const handleAutoRenderToggle = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        setAutoRenderEnabled(event.target.checked);
    }, []);

    // Show render controls
    const showRenderControls = onRender && language !== 'json';

    return (
        <Box
            sx={{
                width: '100%',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
            }}
        >
            {/* Label */}
            {label ? (
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
            ) : null}

            <Box
                sx={{
                    flex: 1,
                    border: (theme) => `1px solid ${theme.palette.divider}`,
                    borderRadius: 2,
                    overflow: 'hidden',
                    display: 'flex',
                    flexDirection: 'column',
                    bgcolor: 'background.paper',
                    minHeight: 0,
                }}
            >
                {showRenderControls ? (
                    <Box
                        sx={{
                            borderBottom: (theme) => `1px solid ${theme.palette.divider}`,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            px: 2,
                            py: 1,
                            minHeight: 48,
                            flexShrink: 0,
                            bgcolor: 'grey.50',
                        }}
                    >
                        <Typography
                            variant="subtitle2"
                            fontWeight="medium"
                            color="text.primary"
                        >
                            {title || 'Editor'}
                        </Typography>

                        <Box
                            sx={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 1,
                            }}
                        >
                            <FormControlLabel
                                control={(
                                    <Switch
                                        size="small"
                                        checked={autoRenderEnabled}
                                        onChange={handleAutoRenderToggle}
                                        color="primary"
                                    />
                                )}
                                label={(
                                    <Typography
                                        variant="caption"
                                        color="text.secondary"
                                    >
                                        Auto Reload
                                    </Typography>
                                )}
                                sx={{
                                    mr: 1,
                                    '& .MuiFormControlLabel-label': {
                                        fontSize: '0.75rem',
                                    },
                                }}
                            />

                            <Tooltip title="Manual Refresh Preview">
                                <IconButton
                                    size="small"
                                    onClick={handleManualRender}
                                    disabled={isRendering}
                                    color="primary"
                                    sx={{
                                        bgcolor: isRendering ? 'action.disabled' : 'primary.main',
                                        color: 'white',
                                        '&:hover': {
                                            bgcolor: 'primary.dark',
                                        },
                                        '&.Mui-disabled': {
                                            bgcolor: 'action.disabled',
                                            color: 'action.disabled',
                                        },
                                    }}
                                >
                                    {isRendering ? (
                                        <CircularProgress
                                            size={16}
                                            color="inherit"
                                        />
                                    ) : (
                                        <Refresh fontSize="small" />
                                    )}
                                </IconButton>
                            </Tooltip>
                        </Box>
                    </Box>
                ) : null}

                {renderError ? (
                    <Alert
                        severity="error"
                        sx={{
                            m: 1,
                            mb: 0,
                            flexShrink: 0,
                            borderRadius: 1,
                        }}
                        action={(
                            <Button
                                size="small"
                                onClick={handleManualRender}
                                disabled={isRendering}
                                variant="outlined"
                                color="error"
                            >
                                Retry
                            </Button>
                        )}
                    >
                        <Typography variant="body2">
                            {renderError}
                        </Typography>
                    </Alert>
                ) : null}

                <Box
                    sx={{
                        flex: 1,
                        overflow: 'hidden',
                        minHeight: 0,
                    }}
                >
                    <MJMLSplitEditor
                        value={value}
                        language={language}
                        onChange={handleContentChange}
                        htmlContent={htmlContent}
                        showPreview={language !== 'json'}
                        {...props}
                    />
                </Box>
            </Box>

            {error ? (
                <FormHelperText
                    sx={{
                        color: (theme) => theme.palette.error.main,
                        mt: 1,
                        flexShrink: 0,
                    }}
                >
                    {error.message}
                </FormHelperText>
            ) : null}
        </Box>
    );
}

export default RHFMJMLSplitEditor;
