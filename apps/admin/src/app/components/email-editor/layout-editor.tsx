import Editor, { EditorProps } from '@monaco-editor/react';
import { Box, Typography, Alert } from '@mui/material';
import mjml2html from 'mjml-browser';
import { useState, useEffect, useRef, useCallback, useMemo } from 'react';


export interface MJMLSplitEditorProps extends Omit<EditorProps, 'onChange'> {
    language?: 'mjml' | 'html' | 'json';
    onChange?: (value: string) => void;
    value?: string;
    htmlContent?: string;
    showPreview?: boolean;
}


const languageConfig = {
    mjml: {
        monacoLang: 'html',
        snippets: [
            {
                label: 'mjml',
                kind: 'Snippet',
                insertText: `<mjml>
  <mj-body>
    <mj-text>\${1:Hello}</mj-text>
  </mj-body>
</mjml>`,
                documentation: 'Basic MJML structure',
            },
        ],
        title: 'MJML Editor',
    },
    html: {
        monacoLang: 'html',
        snippets: [
            {
                label: 'html5',
                kind: 'Snippet',
                insertText: `<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>\${1:Document}</title>
</head>

<body>
  \${2:Content}
</body>

</html>`,
                documentation: 'HTML5 boilerplate',
            },
        ],
        title: 'HTML Editor',
    },
    json: {
        monacoLang: 'json',
        snippets: [
            {
                label: 'object',
                kind: 'Snippet',
                insertText: `{
  "\${1:key}": "\${2:value}"
}`,
                documentation: 'JSON object',
            },
        ],
        title: 'JSON Editor',
    },
};

function MJMLSplitEditor({
    language = 'mjml',
    onChange,
    value,
    htmlContent,
    showPreview = true,
    ...props
}: MJMLSplitEditorProps) {
    const [code, setCode] = useState<string>('');
    const [jsonError, setJsonError] = useState<string | null>(null);
    const [mjmlErrors, setMjmlErrors] = useState<string[]>([]);
    const registeredRef = useRef<Record<string, boolean>>({});
    const { monacoLang, snippets } = languageConfig[language];

    // Validate JSON
    const validateJson = useCallback((jsonString: string) => {
        try {
            JSON.parse(jsonString);
            setJsonError(null);
        } catch (err) {
            setJsonError(err instanceof Error ? err.message : 'Invalid JSON');
        }
    }, []);

    // Validate MJML
    const validateMjml = useCallback((mjmlString: string) => {
        try {
            const { errors } = mjml2html(mjmlString, { minify: true });
            if (errors.length) {
                setMjmlErrors(errors.map((e) => `Line ${e.line}: ${e.message}`));
            } else {
                setMjmlErrors([]);
            }
        } catch (_err) {
            setMjmlErrors(['Failed to compile MJML']);
        }
    }, []);

    // Editor onChange handler
    const handleChangeCode = useCallback((val: string | undefined) => {
        const newValue = typeof val === 'string' ? val : '';
        setCode(newValue);
        onChange?.(newValue);

        // if (language === 'json') validateJson(newValue);
        // if (language === 'mjml') validateMjml(newValue);
    }, [onChange]);

    // Initial value setup
    useEffect(() => {
        if (value !== undefined) {
            const codeString = typeof value === 'string' ? value : JSON.stringify(value, null, 2);
            setCode(codeString);

            if (language === 'json') validateJson(codeString);
            // if (language === 'mjml') validateMjml(codeString);
        }
    }, [
        value,
        language,
        validateJson,
        validateMjml,
    ]);

    const getEditorOptions: EditorProps['options'] = useMemo(() => ({
        minimap: { enabled: false },
        wordWrap: 'on' as const,
        formatOnPaste: true,
        formatOnType: language === 'json',
        automaticLayout: true,
        scrollBeyondLastLine: false,
        fontSize: 14,
        lineHeight: 1.5,
        padding: {
            top: 16,
            bottom: 16,
        },
        scrollbar: {
            vertical: 'auto',
            horizontal: 'auto',
            verticalScrollbarSize: 12,
            horizontalScrollbarSize: 12,
        },
        ...(language === 'json' && {
            tabSize: 2,
            insertSpaces: true,
            detectIndentation: false,
            folding: true,
            bracketPairColorization: { enabled: true },
        }),
        ...props.options,
    }), [language, props.options]);

    const handleBeforeMount = useCallback((monaco: any) => {
        const registrationKey = `${monacoLang}-${language}`;
        if (registeredRef.current[registrationKey]) return;

        monaco.languages.registerCompletionItemProvider(monacoLang, {
            provideCompletionItems: () => ({
                suggestions: snippets.map(({ label, insertText, documentation }) => ({
                    label,
                    kind: monaco.languages.CompletionItemKind.Snippet,
                    insertText,
                    insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
                    documentation,
                })),
            }),
        });

        registeredRef.current[registrationKey] = true;
    }, [
        monacoLang,
        language,
        snippets,
    ]);

    const shouldShowPreview = showPreview && language !== 'json';

    return (
        <Box
            sx={{
                height: '100%',
                width: '100%',
                display: 'flex',
                flexDirection: 'column',
                overflow: 'hidden',
            }}
        >
            {shouldShowPreview ? (
                <Box
                    sx={{
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        overflow: 'hidden',
                        bgcolor: 'background.paper',
                    }}
                >
                    {language === 'mjml' && mjmlErrors.length > 0 && (
                        <Alert
                            severity="error"
                            sx={{
                                m: 1,
                                mb: 0,
                                flexShrink: 0,
                                borderRadius: 1,
                            }}
                        >
                            <Typography
                                variant="body2"
                                component="div"
                            >
                                <strong>MJML Errors:</strong>
                                <Box
                                    component="ul"
                                    sx={{
                                        mt: 0.5,
                                        mb: 0,
                                        pl: 2,
                                    }}
                                >
                                    {mjmlErrors.map((error) => (
                                        <li key={error}>
                                            <Typography
                                                variant="caption"
                                                component="span"
                                            >
                                                {error}
                                            </Typography>
                                        </li>
                                    ))}
                                </Box>
                            </Typography>
                        </Alert>
                    )}

                    <Box
                        sx={{
                            flex: 1,
                            overflow: 'hidden',
                            minHeight: '500px',
                        }}
                    >
                        <Editor
                            language={monacoLang}
                            value={typeof code === 'string' ? code : JSON.stringify(code || {}, null, 2)}
                            onChange={handleChangeCode}
                            theme="monokai"
                            options={getEditorOptions}
                            beforeMount={handleBeforeMount}
                            height="500px"
                            {...props}
                        />
                    </Box>
                </Box>
            ) : (
                <Box
                    sx={{
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        overflow: 'hidden',
                        bgcolor: 'background.paper',
                    }}
                >
                    {language === 'json' && jsonError ? (
                        <Alert
                            severity="error"
                            sx={{
                                m: 1,
                                mb: 0,
                                flexShrink: 0,
                                borderRadius: 1,
                            }}
                        >
                            <Typography variant="body2">
                                <strong>JSON Error:</strong>
                                {' '}
                                {jsonError}
                            </Typography>
                        </Alert>
                    ) : null}

                    <Box
                        sx={{
                            flex: 1,
                            overflow: 'hidden',
                            minHeight: '300px',
                        }}
                    >
                        <Editor
                            language={monacoLang}
                            value={typeof code === 'string' ? code : JSON.stringify(code || {}, null, 2)}
                            onChange={handleChangeCode}
                            theme="monokai"
                            options={getEditorOptions}
                            beforeMount={handleBeforeMount}
                            {...props}
                        />
                    </Box>
                </Box>
            )}
        </Box>
    );
}

export default MJMLSplitEditor;
