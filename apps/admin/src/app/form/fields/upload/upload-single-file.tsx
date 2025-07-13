/* eslint-disable react/no-multi-comp */
/* eslint-disable @stylistic/js/no-multiple-empty-lines */
import { Box, Theme, Typography, Paper, Button, Stack } from '@mui/material';
import { alpha, styled } from '@mui/material/styles';
import { SxProps } from '@mui/system';
import { useCallback } from 'react';
import { useDropzone, DropzoneOptions, FileRejection } from 'react-dropzone';

import { fData } from './utils';



const DropZoneStyle = styled('div')(({ theme }) => ({
    outline: 'none',
    display: 'flex',
    overflow: 'hidden',
    textAlign: 'center',
    position: 'relative',
    alignItems: 'center',
    flexDirection: 'column',
    justifyContent: 'center',
    padding: theme.spacing(5, 0),
    borderRadius: theme.shape.borderRadius,
    transition: theme.transitions.create('padding'),
    backgroundColor: theme.palette.background.default,
    border: `1px dashed ${theme.palette.grey[300]}`,
    '&:hover': {
        opacity: 0.72,
        cursor: 'pointer',
    },
    [theme.breakpoints.up('md')]: {
        textAlign: 'left',
        flexDirection: 'row',
    },
}));

const DropZoneSmallStyle = styled('div')(() => ({
    textAlign: 'start',
    cursor: 'pointer',
}));

interface CustomFile extends File {
    path?: string;
    preview?: string;
}

export interface UploadSingleFileProps extends DropzoneOptions {
    error?: boolean;
    previewUrl?: string;
    label?: string;
    file?: CustomFile | string | null;
    sx?: SxProps<Theme>;
    small?: boolean;
    isVideo?: boolean;
    onRemove?: () => void;
    isRemove?: boolean
}

function ShowRejectionItems({ fileRejections }: { fileRejections: FileRejection[] }) {
    return (
        <Paper
            variant="outlined"
            sx={{
                py: 1,
                px: 2,
                mt: 3,
                borderColor: 'error.light',
                bgcolor: (theme) => alpha(theme.palette.error.main, 0.08),
            }}
        >
            {fileRejections.map(({ file, errors }) => {
                const { path, size }: CustomFile = file;
                return (
                    <Box
                        key={path}
                        sx={{ my: 1 }}
                    >
                        <Typography
                            variant="subtitle2"
                            noWrap
                        >
                            {path}
                            {' '}
                            -
                            {fData(size)}
                        </Typography>
                        {errors.map((e) => (
                            <Typography
                                key={e.code}
                                variant="caption"
                                component="p"
                            >
                                -
                                {' '}
                                {e.message}
                            </Typography>
                        ))}
                    </Box>
                );
            })}
        </Paper>
    );
}

export default function UploadSingleFile({
    error = false,
    previewUrl,
    file,
    small,
    onRemove,
    label,
    isVideo,
    isRemove = true,
    sx,
    ...other
}: UploadSingleFileProps) {
    const {
        getRootProps,
        getInputProps,
        isDragActive,
        isDragReject,
        fileRejections,
    } = useDropzone({
        multiple: false,
        ...other,
    });

    const handleRemove = useCallback(() => {
        if (onRemove) { onRemove(); }
    }, [onRemove]);



    return (
        <Box>
            {small ? (
                <>
                    <Typography
                        variant="subtitle2"
                        mb={2}
                    >
                        {label}
                    </Typography>

                    {previewUrl ? (
                        <Stack
                            direction="row"
                            alignItems="center"
                        >
                            {isVideo ? (
                                <Box
                                    component="video"
                                    src={previewUrl}
                                    controls
                                    sx={{
                                        width: 200,
                                        height: 150,
                                        border: '1px solid grey',
                                        objectFit: 'contain',
                                        borderRadius: 0.5,
                                        p: 0.5,

                                    }}
                                />
                            ) : (
                                <Box
                                    component="img"
                                    alt="file preview"
                                    src={previewUrl}
                                    sx={{
                                        background: (theme) => theme.palette.grey[300],
                                        borderRadius: 0.5,
                                        border: (theme) => `1px solid ${theme.palette.grey[300]}`,
                                        objectFit: 'contain',
                                        padding: 0.5,
                                        width: 80,
                                        height: 80,
                                    }}
                                />
                            )}

                            <Stack
                                spacing={2}
                                direction="row"
                                m={1}
                            >
                                {isRemove ? (
                                    <Button
                                        variant="contained"
                                        color="error"
                                        onClick={handleRemove}
                                    >
                                        Remove
                                    </Button>
                                ) : null}

                                <DropZoneSmallStyle
                                    {...getRootProps()}
                                    sx={{
                                        ...(isDragActive && { opacity: 0.72 }),
                                        ...((isDragReject || error) && {
                                            color: 'error.main',
                                            borderColor: 'error.light',
                                            bgcolor: 'error.lighter',
                                        }),
                                        ...(file && { padding: '0 0' }),
                                    }}
                                >
                                    <Button variant="contained">Change</Button>
                                </DropZoneSmallStyle>
                            </Stack>
                        </Stack>
                    ) : null}
                    <DropZoneSmallStyle
                        {...getRootProps()}
                        sx={{
                            ...(isDragActive && { opacity: 0.72 }),
                            ...((isDragReject || error) && {
                                color: 'error.main',
                                borderColor: 'error.light',
                                bgcolor: 'error.lighter',
                            }),
                            ...(file && { padding: '0 0' }),
                        }}
                    >
                        <input
                            type="file"
                            {...getInputProps()}
                        />
                        {!previewUrl ? (
                            <Box>
                                <Button variant="contained">Upload</Button>
                            </Box>
                        ) : null}
                    </DropZoneSmallStyle>
                </>
            ) : (
                <DropZoneStyle
                    {...getRootProps()}
                    sx={{
                        ...(isDragActive && {
                            opacity: 0.72,
                        }),
                        ...((isDragReject || error) && {
                            color: 'error.main',
                            borderColor: 'error.light',
                            bgcolor: 'error.lighter',
                        }),
                        ...(file && {
                            backgroundColor: (theme: Theme) => theme.palette.background.default + ' !important',
                            padding: '0 0',
                        }),
                    }}
                >
                    <input
                        type="file"
                        {...getInputProps()}
                    />


                    <Box
                        sx={{
                            p: 3,
                            ml: { md: 2 },
                        }}
                    >
                        <Typography
                            gutterBottom
                            variant="h5"
                        >
                            Drop or Select file
                        </Typography>

                        <Typography
                            variant="body2"
                            sx={{
                                color: 'text.secondary',
                            }}
                        >
                            Drop files here or click
                            <Typography
                                variant="body2"
                                component="span"
                                sx={{
                                    color: 'primary.main',
                                    textDecoration: 'underline',
                                }}
                            >
                                browse
                            </Typography>
                            thorough your machine
                        </Typography>
                    </Box>

                    {previewUrl ? (
                        <Box
                            component="img"
                            alt="file preview"
                            src={previewUrl}
                            sx={{
                                top: 8,
                                borderRadius: 1,
                                objectFit: 'cover',
                                position: 'absolute',
                                width: 'calc(100% - 16px)',
                                height: 'calc(100% - 16px)',
                            }}
                        />
                    ) : null}
                </DropZoneStyle>
            )}

            {fileRejections.length > 0 && <ShowRejectionItems fileRejections={fileRejections as FileRejection[]} />}
        </Box>
    );
}
