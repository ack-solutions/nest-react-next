import { Refresh } from '@mui/icons-material';
import { Box, Typography, Alert, Divider, Stack, Switch, FormControlLabel, IconButton, Tooltip, CircularProgress, Button } from '@mui/material';
import { styled } from '@mui/material/styles';
import { useState, useCallback, useEffect, useRef } from 'react';
import { Group, Panel, Separator } from "react-resizable-panels";
import { TemplateEditorViewModes, ViewMode } from './template-editor-view-modes';
import useDebounce from '../../hook/use-debounce';
import MJMLSplitEditor, { MJMLSplitEditorProps } from '../email-editor/layout-editor';


export interface EnhancedTemplateEditorProps extends Omit<MJMLSplitEditorProps, 'onChange' | 'showPreview'> {
    value?: string;
    onChange?: (value: string) => void;
    language?: 'mjml' | 'html' | 'json';
    onRender?: (content: string) => Promise<string>;
    renderOnChange?: boolean;
    debounceTime?: number;
    minContentLength?: number;
    title?: string;
    height?: string | number;
    htmlContent?: string;
}

const ResizeHandle = styled(Separator)(({ theme }) => ({
    width: '8px',
    cursor: 'col-resize',
    backgroundColor: 'transparent',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    transition: 'all 0.2s ease-in-out',
    '&:hover': {
        backgroundColor: theme.palette.action.hover,
    },
    '&::after': {
        content: '""',
        width: '2px',
        height: '40px',
        backgroundColor: theme.palette.divider,
        borderRadius: '1px',
        transition: 'all 0.2s ease-in-out',
    },
    '&:hover::after': {
        backgroundColor: theme.palette.primary.main,
        height: '60px',
        width: '3px',
    },
    '&:active::after': {
        backgroundColor: theme.palette.primary.dark,
    },
}));

const PreviewContainer = styled(Box)(({ theme }) => ({
    height: '100%',
    backgroundColor: theme.palette.background.paper,
    border: `1px solid ${theme.palette.divider}`,
    borderRadius: theme.shape.borderRadius,
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
}));

const PreviewFrame = styled('iframe')({
    width: '100%',
    height: '100%',
    border: 'none',
    backgroundColor: 'white',
});

export function EnhancedTemplateEditor({
    value = '',
    onChange,
    language = 'mjml',
    onRender,
    renderOnChange = true,
    debounceTime = 2000,
    minContentLength = 10,
    title = 'Template Editor',
    height = '600px',
    htmlContent = '',
    ...props
}: EnhancedTemplateEditorProps) {
    const [viewMode, setViewMode] = useState<ViewMode>('split');
    const [localHtmlContent, setLocalHtmlContent] = useState(htmlContent);
    const [isRendering, setIsRendering] = useState(false);
    const [renderError, setRenderError] = useState<string | null>(null);
    const [autoRenderEnabled, setAutoRenderEnabled] = useState(renderOnChange);
    const [isEditing, setIsEditing] = useState(false);

    const renderAbortController = useRef<AbortController | null>(null);
    const lastRenderedContent = useRef<string>('');
    const renderTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    const debouncedValue = useDebounce(value, debounceTime);

    const handleContentChange = useCallback((newValue: string) => {
        onChange?.(newValue || '');
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
            setLocalHtmlContent(rendered);
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

    const handleAutoRenderToggle = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        setAutoRenderEnabled(event.target.checked);
    }, []);

    // Auto-render effect
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

    // Update local HTML content when prop changes
    useEffect(() => {
        setLocalHtmlContent(htmlContent);
    }, [htmlContent]);

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

    const showRenderControls = onRender && language !== 'json';

    const renderEditor = () => (
        <Box
            sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                overflow: 'hidden',
            }}
        >
            <MJMLSplitEditor
                value={value}
                language={language}
                onChange={handleContentChange}
                htmlContent={localHtmlContent}
                showPreview={false} // We handle preview separately
                height="100%"
                {...props}
            />
        </Box>
    );

    const renderPreview = () => (
        <PreviewContainer>
            <Box
                sx={{
                    p: 2,
                    borderBottom: 1,
                    borderColor: 'divider',
                    bgcolor: 'grey.50',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    minHeight: 48,
                }}
            >
                <Typography variant="subtitle2" fontWeight="medium" color="text.primary">
                    Preview
                </Typography>
            </Box>
            <Box sx={{
                flex: 1,
                overflow: 'hidden',
            }}>
                {localHtmlContent ? (
                    <PreviewFrame
                        srcDoc={localHtmlContent}
                        title="Template Preview"
                    />
                ) : (
                    <Box
                        sx={{
                            height: '100%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: 'text.secondary',
                        }}
                    >
                        <Typography variant="body2">
                            No preview available. Click render to generate preview.
                        </Typography>
                    </Box>
                )}
            </Box>
        </PreviewContainer>
    );

    const renderContent = () => {
        switch (viewMode) {
            case 'code':
                return renderEditor();
            case 'preview':
                return renderPreview();
            case 'split':
                return (
                    <Group orientation="horizontal">
                        <Panel defaultSize={50} minSize={30}>
                            {renderEditor()}
                        </Panel>
                        <ResizeHandle />
                        <Panel defaultSize={50} minSize={30}>
                            {renderPreview()}
                        </Panel>
                    </Group>
                );
            default:
                return renderEditor();
        }
    };

    return (
        <Box
            sx={{
                height: height,
                display: 'flex',
                flexDirection: 'column',
                border: 1,
                borderColor: 'divider',
                borderRadius: 2,
                overflow: 'hidden',
                bgcolor: 'background.paper',
            }}
        >
            {/* Header with controls */}
            <Box
                sx={{
                    borderBottom: 1,
                    borderColor: 'divider',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    px: 2,
                    py: 1.5,
                    minHeight: 56,
                    bgcolor: 'grey.50',
                }}
            >
                <Typography variant="h6" fontWeight="medium" color="text.primary">
                    {title}
                </Typography>

                <Stack direction="row" spacing={2} alignItems="center">
                    {/* View Mode Toggle */}
                    <TemplateEditorViewModes
                        viewMode={viewMode}
                        onViewModeChange={setViewMode}
                        disabled={isRendering}
                    />

                    <Divider orientation="vertical" flexItem />

                    {/* Render Controls */}
                    {showRenderControls && (
                        <>
                            <FormControlLabel
                                control={
                                    <Switch
                                        size="small"
                                        checked={autoRenderEnabled}
                                        onChange={handleAutoRenderToggle}
                                        color="primary"
                                    />
                                }
                                label={
                                    <Typography variant="caption" color="text.secondary">
                                        Auto Render
                                    </Typography>
                                }
                                sx={{
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
                                        <CircularProgress size={16} color="inherit" />
                                    ) : (
                                        <Refresh fontSize="small" />
                                    )}
                                </IconButton>
                            </Tooltip>
                        </>
                    )}
                </Stack>
            </Box>

            {/* Error Alert */}
            {renderError && (
                <Alert
                    severity="error"
                    sx={{
                        m: 1,
                        mb: 0,
                        borderRadius: 1,
                    }}
                    action={
                        <Button
                            size="small"
                            onClick={handleManualRender}
                            disabled={isRendering}
                            variant="outlined"
                            color="error"
                        >
                            Retry
                        </Button>
                    }
                >
                    <Typography variant="body2">
                        {renderError}
                    </Typography>
                </Alert>
            )}

            {/* Main Content */}
            <Box
                sx={{
                    flex: 1,
                    overflow: 'hidden',
                    minHeight: 0,
                }}
            >
                {renderContent()}
            </Box>
        </Box>
    );
}
