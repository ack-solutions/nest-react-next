import Editor from '@monaco-editor/react';
import { Stack } from '@mui/material'
import React, { useCallback, useRef, useState } from 'react'
import EmailEditor from 'react-email-editor';


const EmailLayoutTemplate = () => {
    const [htmlContent, setHtmlContent] = useState('');
    const emailEditorRef = useRef(null);

    const updateEmailEditor = useCallback((content) => {
        console.log(content);

        if (emailEditorRef.current) {

            const unlayer = emailEditorRef.current.editor;
            const design = {
                body: {
                    rows: [
                        {
                            columns: [
                                {
                                    contents: [
                                        {
                                            type: 'html',
                                            values: {
                                                html: content,
                                            },
                                        },
                                    ],
                                },
                            ],
                        },
                    ],
                },
            };
            unlayer.loadDesign(JSON.stringify(design));
        }
    }, []);

    const handleEditorChange = useCallback((value, event) => {
        setHtmlContent(value || '');
        updateEmailEditor(value || '');
    }, [updateEmailEditor]);

    return (
        <Stack
            spacing={2}
            direction='row'
        >

            <EmailEditor
                ref={emailEditorRef}
            />
            <Editor
                height="90vh"
                language="html"
                value={htmlContent}
                onChange={handleEditorChange}
            />
        </Stack>
    )
}

export default EmailLayoutTemplate
