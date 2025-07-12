import { downloadURI } from '@libs/utils';
import {
    Typography,
    Divider,
    Box,
    SxProps,
    Stack,
    Chip,
    ListItemAvatar,
    Avatar,
    alpha,
    ListItemText,
    ListItem,
    IconButton,
    Tooltip,
} from '@mui/material';

import { useToasty } from '../hook';
import { Icon } from './icons/icon';
import { IconEnum } from './icons/icons';


export interface ViewRowDetailProps {
    label?: string;
    name?: any;
    variant?: 'text' | 'multi-select' | 'file';
    downloadUrl?: string;
    filePrimaryText?: string;
    fileSecondaryText?: any;
    valueMap?: (value: any) => string;
    sx?: SxProps;
}

function ViewRowDetail({
    label,
    sx,
    name,
    downloadUrl,
    filePrimaryText,
    fileSecondaryText,
    variant = 'text',
    valueMap = (value) => value,
    ...props
}: ViewRowDetailProps) {
    const { showToasty } = useToasty();

    const handleFileDownload = (fileUrl) => {
        if (fileUrl) {
            downloadURI(fileUrl, name);
        } else {
            showToasty('File not found', 'error');
        }
    };

    return (
        <Box
            sx={{
                width: '100%',
                ...sx,
            }}
            {...props}
        >
            <Typography
                variant="caption"
                color="textSecondary"
            >
                {label}
            </Typography>
            {variant === 'text' && <Typography>{name || '-'}</Typography>}
            {variant === 'multi-select' && (
                <Stack
                    spacing={0.5}
                    direction="row"
                >
                    {name?.map((item) => (
                        <Chip
                            key={item}
                            label={valueMap(item)}
                            size="small"
                        />
                    ))}
                </Stack>
            )}

            {variant === 'file' && (
                <ListItem
                    secondaryAction={(
                        <Tooltip title="View File">
                            <IconButton onClick={() => handleFileDownload(downloadUrl)}>
                                <Icon icon={IconEnum.Eye} />
                            </IconButton>
                        </Tooltip>
                    )}
                >
                    <ListItemAvatar>
                        <Avatar
                            sx={{
                                bgcolor: (theme) => alpha(theme.palette.primary.main, 0.08),
                            }}
                        >
                            <Icon
                                icon={IconEnum.Copy}
                                color="primary"
                            />
                        </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                        primary={filePrimaryText}
                        secondary={fileSecondaryText}
                    />
                </ListItem>
            )}
            <Divider
                variant="middle"
                sx={{
                    mx: 0,
                    mt: 0.5,
                }}
                flexItem
            />
        </Box>
    );
}

export default ViewRowDetail;
