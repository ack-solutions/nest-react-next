import { Box, BoxProps } from '@mui/material';
import { styled } from '@mui/material/styles';
import ReactQuill, { ReactQuillProps } from 'react-quill';

import EditorToolbar, { formats, redoChange, undoChange } from './quill-editor-toolbar';


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

export interface QuillEditorProps extends ReactQuillProps {
    id?: string;
    error?: boolean;
    simple?: boolean;
    sx?: BoxProps;
}

export default function QuillEditor({
    id = 'minimal-quill',
    error,
    value,
    onChange,
    simple = false,
    sx,
    ...other
}: QuillEditorProps) {
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
                value={value}
                onChange={onChange}
                modules={modules}
                formats={formats}
                placeholder="Write something awesome..."
                {...other}
            />
        </RootStyle>
    );
}
