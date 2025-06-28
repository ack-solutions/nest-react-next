import { FormHelperText, Typography, Box, alpha, styled } from '@mui/material';
import { FileRejection, useDropzone } from 'react-dropzone';

import RejectionFiles from './rejection-files';
import { UploadProps } from './types';


const RootStyle = styled('div')(({ theme }) => ({
    width: 144,
    height: 144,
    margin: 'auto',
    borderRadius: '50%',
    padding: theme.spacing(1),
    border: `1px dashed ${alpha(theme.palette.grey[500], 0.5)}`,
}));

const DropZoneStyle = styled('div')({
    zIndex: 0,
    width: '100%',
    height: '100%',
    outline: 'none',
    display: 'flex',
    overflow: 'hidden',
    borderRadius: '50%',
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
    '& > *': {
        width: '100%',
        height: '100%',
    },
    '&:hover': {
        cursor: 'pointer',
        '& .placeholder': {
            zIndex: 9,
        },
    },
});

const PlaceholderStyle = styled('div')(({ theme }) => ({
    display: 'flex',
    position: 'absolute',
    alignItems: 'center',
    flexDirection: 'column',
    justifyContent: 'center',
    color: theme.palette.text.secondary,
    // backgroundColor: alpha(theme.palette.grey[500], 1),
    backgroundColor: theme.palette.grey[200],
    transition: theme.transitions.create('opacity', {
        easing: theme.transitions.easing.easeInOut,
        duration: theme.transitions.duration.shorter,
    }),
    borderRadius: '50%',
    overflow: 'hidden',
}));

export function UploadAvatar({
    error,
    file,
    helperText,
    preview,
    imageFitMode = 'cover',
    sx,
    ...other
}: UploadProps) {
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
    return (
        <>
            <RootStyle
                sx={{
                    ...((isDragReject || error) && {
                        borderColor: 'error.light',
                    }),
                    ...sx,
                }}
            >
                <DropZoneStyle
                    {...getRootProps()}
                    sx={{
                        ...(isDragActive && { opacity: 0.72 }),
                    }}
                >
                    <input {...getInputProps()} />

                    {file ? (
                        <Box
                            component="img"
                            alt="avatar"
                            src={
                                typeof file === 'string' ?
                                    preview || file :
                                    preview
                            }
                            sx={{
                                zIndex: 8,
                                objectFit: imageFitMode,
                                borderRadius: '50%',
                                overflow: 'hidden',
                            }}
                        />
                    ) : null}

                    <PlaceholderStyle
                        className="placeholder"
                        sx={{
                            ...(file && {
                                opacity: 0,
                                color: 'common.white',
                                bgcolor: 'grey.900',
                                '&:hover': { opacity: 0.72 },
                            }),
                            ...((isDragReject || error) && {
                                bgcolor: 'error.lighter',
                            }),
                        }}
                    >
                        <Typography
                            variant="caption"
                            textAlign="center"
                        >
                            Upload
                        </Typography>
                    </PlaceholderStyle>
                </DropZoneStyle>
            </RootStyle>

            {helperText || null}

            {error ? (
                <FormHelperText
                    error
                    sx={{
                        px: 4,
                        textAlign: 'center',
                    }}
                >
                    {error}
                </FormHelperText>
            ) : null}

            {fileRejections.length > 0 && (
                <RejectionFiles
                    fileRejections={fileRejections as FileRejection[]}
                />
            )}
        </>
    );
}
