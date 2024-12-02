import { useDropzone } from 'react-dropzone';
import { Box, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import AddAPhotoOutlinedIcon from '@mui/icons-material/AddAPhotoOutlined';
import { UploadProps } from './type';
import Image from '../image';



const RootStyle = styled('div')(({ theme }) => ({
    width: 144,
    height: 144,
    margin: 'auto',
    borderRadius: '50%',
    padding: theme.spacing(1),
    border: `1px dashed ${theme.palette.grey[500]}`,
}));

const DropZoneStyle = styled('div')(({ theme }) => ({
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
    backgroundColor: theme.palette.background.default,
    '& > *': { width: '100%', height: '100%' },
    '&:hover': {
        cursor: 'pointer',
        '& .placeholder': {
            zIndex: 9,
        },
    },
}));

const PlaceholderStyle = styled('div')(({ theme }) => ({
    display: 'flex',
    position: 'absolute',
    alignItems: 'center',
    flexDirection: 'column',
    justifyContent: 'center',
    color: theme.palette.text.secondary,
    backgroundColor: theme.palette.background.paper,
    transition: theme.transitions.create('opacity', {
        easing: theme.transitions.easing.easeInOut,
        duration: theme.transitions.duration.shorter,
    }),
    '&:hover': { opacity: 0.72 },
}));



export default function UploadAvatar({ error, file, label = "Photo", helperText, sx, ...other }: UploadProps) {
    const { getRootProps, getInputProps, isDragActive, isDragReject, fileRejections } = useDropzone({
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

                    {file && (
                        <Image
                            alt="avatar"
                            src={typeof file === 'string' ? file : file.preview}
                            sx={{ zIndex: 8 }}
                        />
                    )}
                    {!file && (
                        <Image
                            alt="avatar"
                            src='/assets/image/avatar-placeholder.webp'
                        />
                    )}
                    <PlaceholderStyle
                        className="placeholder"
                        sx={{
                            opacity: 0,
                            color: 'common.white',
                            bgcolor: 'grey.900',
                            '&:hover': { opacity: 0.72 },
                            ...((isDragReject || error) && {
                                bgcolor: 'error.lighter',
                            }),
                        }}
                    >
                        <AddAPhotoOutlinedIcon sx={{ width: 24, height: 24, mb: 1 }} />
                        <Typography textAlign="center" variant="caption">{file ? `Update ${label}` : `Upload ${label}`}</Typography>
                    </PlaceholderStyle>
                </DropZoneStyle>
            </RootStyle>

            {helperText && helperText}

        </>
    );
}
