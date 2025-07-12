import {
    Box,
    List,
    Stack,
    Paper,
    Button,
    ListItem,
    Typography,
    ListItemText,
    IconButton,
    SxProps,
    alpha,
    Theme,
    styled,
} from '@mui/material';
import { isString } from 'lodash';
import { useDropzone, DropzoneOptions } from 'react-dropzone';


import RejectionFiles from './rejection-files';
import { fData } from './utils';
import { Icon } from '../../../components';
import { IconEnum } from '../../../components/icons/icons';


const DropZoneStyle = styled('div')(({ theme }) => ({
    outline: 'none',
    display: 'flex',
    textAlign: 'center',
    alignItems: 'center',
    flexDirection: 'column',
    justifyContent: 'center',
    padding: theme.spacing(5, 1),
    borderRadius: theme.shape.borderRadius,
    backgroundColor: theme.palette.background.default,
    border: `1px dashed ${theme.palette.grey[500]}`,
    '&:hover': {
        opacity: 0.72,
        cursor: 'pointer',
    },
    [theme.breakpoints.up('md')]: {
        textAlign: 'left',
        flexDirection: 'row',
    },
}));

export interface CustomFile extends Partial<File> {
    path?: string;
    preview?: {
        fileName?: string;
        size?: number;
        imageUrl?: string;
        fileUrl?: string;
        id?: string;
        url?: string;
    };
    key?: string;
}

export interface UploadMultiFileProps extends DropzoneOptions {
    error?: boolean;
    files?: CustomFile[];
    showImagePreview?: boolean;
    onRemove?: (file: CustomFile, index?: number) => void;
    onRemoveAll?: VoidFunction;
    sx?: SxProps<Theme>;
}

const getFileData = (file: CustomFile | string) => {
    if (typeof file === 'string') {
        return {
            key: file,
        };
    }
    return {
        key: file.name,
        name: file.name,
        size: file.size,
        preview: file.preview,
    };
};

export function UploadMultiFile({
    error,
    showImagePreview = true,
    files,
    onRemove,
    onRemoveAll,
    sx,
    ...other
}: UploadMultiFileProps) {
    const hasFile = files && files?.length > 0;

    const {
        getRootProps,
        getInputProps,
        isDragActive,
        isDragReject,
        fileRejections,
    } = useDropzone({
        ...other,
    });

    return (
        <Box>
            <DropZoneStyle
                {...getRootProps()}
                sx={{
                    height: '100%',
                    ...(isDragActive && { opacity: 0.72 }),
                    ...((isDragReject || error) && {
                        color: 'error.main',
                        borderColor: 'error.light',
                        bgcolor: 'error.lighter',
                    }),
                }}
            >
                <input
                    {...getInputProps()}
                    type="file"
                />

                {/* <UploadIllustration sx={{ width: 220 }} /> */}

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
                        sx={{ color: 'text.secondary' }}
                    >
                        Drop files here or click&nbsp;
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
                        &nbsp;thorough your machine
                    </Typography>
                </Box>
            </DropZoneStyle>

            {fileRejections?.length > 0 && <RejectionFiles fileRejections={fileRejections as any} />}

            <List
                disablePadding
                sx={{ ...(hasFile && { my: 3 }) }}
            >
                {files?.map((file, index) => {
                    const { key, name, size, preview } = getFileData(
                        file as CustomFile,
                    );

                    if (showImagePreview) {
                        return (
                            <ListItem
                                key={key}
                                // component={motion.div}
                                sx={{
                                    p: 0,
                                    m: 0.5,
                                    width: 80,
                                    height: 80,
                                    borderRadius: 1.5,
                                    overflow: 'hidden',
                                    position: 'relative',
                                    display: 'inline-flex',
                                }}
                            >
                                <Paper
                                    variant="outlined"
                                    component="img"
                                    src={
                                        isString(preview) ?
                                            preview :
                                            preview?.imageUrl
                                    }
                                    sx={{
                                        width: '100%',
                                        height: '100%',
                                        objectFit: 'cover',
                                        position: 'absolute',
                                    }}
                                />
                                <Box
                                    sx={{
                                        top: 6,
                                        right: 6,
                                        position: 'absolute',
                                    }}
                                >
                                    <IconButton
                                        size="small"
                                        onClick={() => onRemove && onRemove(file, index)
                                        }
                                        sx={{
                                            color: 'common.white',
                                            bgcolor: (theme) => alpha(
                                                theme.palette.grey[900],
                                                0.72,
                                            ),
                                            '&:hover': {
                                                bgcolor: (theme) => alpha(
                                                    theme.palette.grey[900],
                                                    0.48,
                                                ),
                                            },
                                        }}
                                    >
                                        <Icon icon={IconEnum.X} />
                                    </IconButton>
                                </Box>
                            </ListItem>
                        );
                    }

                    return (
                        <ListItem
                            key={key}
                            // component={motion.div}
                            sx={{
                                my: 1,
                                py: 0.75,
                                px: 2,
                                borderRadius: 1,
                                border: (theme) => `solid 1px ${theme.palette.divider}`,
                                bgcolor: 'background.paper',
                            }}
                            secondaryAction={(
                                <IconButton
                                    size="small"
                                    edge="end"
                                    onClick={() => onRemove && onRemove(file, index)
                                    }
                                >
                                    <Icon icon={IconEnum.X} />
                                </IconButton>
                            )}
                        >
                            <ListItemText
                                primary={isString(preview) ? name : preview?.fileName}
                                secondary={
                                    isString(preview) ? fData(size || 0) : fData(preview?.size || 0)
                                }
                                primaryTypographyProps={{
                                    variant: 'subtitle2',
                                }}
                                secondaryTypographyProps={{
                                    variant: 'caption',
                                }}
                            />
                        </ListItem>
                    );
                })}
            </List>

            {hasFile && onRemoveAll ? (
                <Stack
                    direction="row"
                    justifyContent="flex-end"
                >
                    <Button
                        onClick={onRemoveAll}
                        sx={{ mr: 1.5 }}
                    >
                        Remove all
                    </Button>
                    <Button variant="contained">Upload files</Button>
                </Stack>
            ) : null}
        </Box>
    );
}
