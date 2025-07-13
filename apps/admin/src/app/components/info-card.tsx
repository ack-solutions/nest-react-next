import { Avatar, Button, CardContent, CardContentProps, CardProps, Stack } from '@mui/material';
import { Card } from '@mui/material';
import { CardHeader } from '@mui/material';
import { Divider } from '@mui/material';

import { Icon } from './icons/icon';
import { IconEnum } from './icons/icons';


interface InfoCardProps extends CardProps {
    title?: string;
    compact?: boolean;
    subheader?: string;
    action?: React.ReactNode;
    children?: React.ReactNode;
    icon?: React.ReactNode;
    editButton?: boolean;
    onEdit?: () => void;
    showDivider?: boolean;
    fullHeight?: boolean;
    cardContentProps?: CardContentProps;
}

export function InfoCard({
    title,
    fullHeight,
    compact,
    icon,
    subheader,
    action,
    editButton,
    onEdit,
    children = null,
    showDivider,
    cardContentProps,
    ...props
}: InfoCardProps) {
    return (
        <Card
            elevation={0}
            sx={{
                border: 1,
                borderColor: 'divider',
                height: fullHeight ? 1 : 'fit-content',
            }}
            {...props}
        >
            {title ? (
                <CardHeader
                    sx={{
                        ...(compact ? {
                            px: 2,
                            py: 1.5,
                        } : {}),
                    }}
                    avatar={icon ? (
                        <Avatar
                            sx={{
                                bgcolor: 'grey.300',
                                width: 36,
                                height: 36,
                                color: 'grey.900',
                            }}
                        >
                            {icon}
                        </Avatar>
                    ) : null}
                    title={title}
                    subheader={subheader}
                    action={(
                        <Stack
                            direction="row"
                            spacing={1}
                        >
                            {action}
                            {editButton ? (
                                <Button
                                    onClick={onEdit}
                                    startIcon={(
                                        <Icon
                                            size="small"
                                            icon={IconEnum.Pencil}
                                        />
                                    )}
                                    variant="outlined"
                                    size="small"
                                >
                                    Edit
                                </Button>
                            ) : null}
                        </Stack>
                    )}

                />
            ) : null}
            {showDivider ? <Divider sx={{ my: 0 }} /> : null}
            {children ? (
                <CardContent
                    {...cardContentProps}
                    sx={{
                        ...(compact ? {
                            px: 2,
                            py: 1.5,
                        } : {}),
                        ...cardContentProps?.sx,
                    }}
                >
                    {children}
                </CardContent>
            ) : null}
        </Card>
    );
}
