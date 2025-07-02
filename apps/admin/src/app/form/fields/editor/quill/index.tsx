import { Box, BoxProps, styled } from '@mui/material';
import './highlight';
import ReactQuill from 'react-quill-new';

import EditorToolbar, {
    formats,
    redoChange,
    undoChange,
} from './quill-editor-toolbar';


type ReactQuillProps = React.ComponentProps<typeof ReactQuill>;


const RootStyle = styled(Box)(({ theme }) => ({
    borderRadius: theme.shape.borderRadius,
    border: `solid 1px ${theme.palette.divider}`,
    '& .ql-container.ql-snow': {
        borderColor: 'transparent',
        ...theme.typography.body1,
        fontFamily: theme.typography.fontFamily,
    },
    '& .ql-editor': {
        minHeight: 200,
        '&.ql-blank::before': {
            fontStyle: 'normal',
            color: theme.palette.text.disabled,
        },
        '& pre.ql-syntax': {
            ...theme.typography.body2,
            padding: theme.spacing(2),
            borderRadius: theme.shape.borderRadius,
            backgroundColor: theme.palette.grey[900],
        },
    },
}));

export interface QuillEditorProps extends Omit<ReactQuillProps, 'onChange' | 'value'> {
    id?: string;
    error?: boolean;
    simple?: boolean;
    sx?: BoxProps;
    value?: string;
    onChange?: (value: string) => void;
}

export function QuillEditor({
    id = 'minimal-quill',
    error,
    value,
    onChange,
    simple = false,
    sx,
    ...other
}: QuillEditorProps) {
    // Handle onChange with Quill instance
    const handleChange = (content: string, _delta: any, _source: any, editor: any) => {
        if (!onChange) return;

        // Use Quill's getText() method to check if content is truly empty
        const textContent = editor.getText().trim();

        if (textContent === '') {
            // Editor is empty, return empty string
            onChange('');
        } else {
            // Editor has content, return the HTML
            onChange(content);
        }
    };

    const modules = {
        toolbar: {
            container: `#${id}`,
            handlers: {
                undo: undoChange,
                redo: redoChange,
            },
        },
        history: {
            delay: 500,
            maxStack: 100,
            userOnly: true,
        },
        syntax: true,
        clipboard: {
            matchVisual: false,
        },
    };

    return (
        <RootStyle
            sx={{
                ...(error && {
                    border: (theme) => `solid 1px ${theme.palette.error.main}`,
                }),
                ...sx,
            }}
        >
            <EditorToolbar
                id={id}
                isSimple={simple}
            />
            <ReactQuill
                value={value || ''}
                onChange={handleChange}
                modules={modules}
                formats={formats}
                placeholder="Write something awesome..."
                {...other}
            />
        </RootStyle>
    );
}
