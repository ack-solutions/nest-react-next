import {
    Typography,
    Box,
    SxProps,
    Stack,
    Chip,
    StackProps,
} from '@mui/material';
import { useMemo } from 'react';


export interface ViewDetailProps extends StackProps {
    icon?: React.ReactNode;
    label?: string;
    value?: any;
    inputType?: 'text' | 'multi-select' | 'file';
    variant?: 'inline' | 'space-between' | 'block';
    sx?: SxProps;
    labelSx?: SxProps;
    valueSx?: SxProps;
}

function ViewDetail({
    label,
    sx,
    value,
    icon,
    labelSx,
    valueSx,
    inputType = 'text',
    variant = 'inline',
    ...props
}: ViewDetailProps) {
    const stackProps = useMemo(() => {
        if (variant === 'inline') {
            return {
                direction: 'row',
                alignItems: 'center',
                spacing: 1,
            } as StackProps;
        }
        if (variant === 'space-between') {
            return {
                direction: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                spacing: 4,
            } as StackProps;
        }
        return {};
    }, [variant]);

    const labelSxProp = useMemo(() => {
        if (variant === 'inline') {
            return {
                alignSelf: 'flex-start',
                ...labelSx,
            } as SxProps;
        }
        if (variant === 'space-between') {
            return {
                alignSelf: 'flex-start',
                ...labelSx,
            } as SxProps;
        }
        return {};
    }, [variant, labelSx]);

    const valueSxProp = useMemo(() => {
        if (variant === 'space-between') {
            return {
                alignSelf: 'flex-end',
                ...valueSx,
            } as SxProps;
        }
        return {};
    }, [variant, valueSx]);

    return (
        <Stack
            spacing={1}
            sx={{
                width: '100%',
                py: 1,
                ...sx,
            }}
            {...stackProps}
            {...props}
        >
            <Stack
                direction="row"
                alignItems="center"
                spacing={2}
                sx={{
                    flex: 0,
                    ...labelSxProp,
                }}
            >
                {icon ? (
                    <Box
                        sx={{
                            color: 'text.secondary',
                        }}
                    >
                        {icon}
                    </Box>
                ) : null}

                {label ? (
                    <Typography
                        sx={{
                            whiteSpace: 'nowrap',
                            flex: 0,
                        }}
                        color="textSecondary"
                    >
                        {label}
                    </Typography>
                ) : null}
            </Stack>

            {variant === 'inline' && (
                <Typography
                    color="textSecondary"
                    sx={{
                        flex: 0,
                        alignSelf: 'flex-start',
                    }}
                >
                    :
                </Typography>
            )}

            <Box
                sx={{
                    ...valueSxProp,
                    flex: 1,
                }}
            >
                {inputType === 'text' && <Typography>{value || '-'}</Typography>}
                {inputType === 'multi-select' && (
                    <Stack
                        spacing={0.5}
                        direction="row"
                    >
                        {value?.map((item) => (
                            <Chip
                                key={item}
                                label={item}
                                size="small"
                            />
                        ))}
                    </Stack>
                )}
            </Box>
        </Stack>
    );
}

export default ViewDetail;
