import Box from '@mui/material/Box';
import type { CardProps } from '@mui/material/Card';
import Card from '@mui/material/Card';
import Skeleton from '@mui/material/Skeleton';
import { alpha, useTheme } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import { ReactNode } from 'react';


type Props = CardProps & {
    icon?: ReactNode;
    title: string;
    total: string | number;
    subtitle?: string;
    trend?: {
        value: string;
        isPositive: boolean;
        label?: string;
    };
    color?: 'primary' | 'secondary' | 'info' | 'success' | 'warning' | 'error';
    isLoading?: boolean;
    compact?: boolean;
    showBackground?: boolean;
    onClick?: () => void;
};

export function DashboardOverviewCard({
    sx,
    icon,
    title,
    total,
    subtitle,
    trend,
    color = 'primary',
    isLoading = false,
    compact = true,
    showBackground = true,
    onClick,
    ...other
}: Props) {
    const theme = useTheme();

    if (isLoading) {
        return (
            <Card
                sx={{
                    p: compact ? 2 : 3,
                    height: '100%',
                    minWidth: 250,
                    ...sx,
                }}
            >
                <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        mb: 1,
                    }}
                >
                    {icon ? (
                        <Skeleton
                            variant="circular"
                            width={compact ? 32 : 40}
                            height={compact ? 32 : 40}
                            sx={{ mr: 1.5 }}
                        />
                    ) : null}
                    <Box sx={{ flex: 1 }}>
                        <Skeleton
                            variant="text"
                            width="60%"
                            height={24}
                        />
                        <Skeleton
                            variant="text"
                            width="40%"
                            height={20}
                        />
                    </Box>
                </Box>
                <Skeleton
                    variant="text"
                    width="80%"
                    height={compact ? 32 : 40}
                />
                {subtitle ? (
                    <Skeleton
                        variant="text"
                        width="50%"
                        height={16}
                    />
                ) : null}
            </Card>
        );
    }

    return (
        <Card
            sx={{
                position: 'relative',
                overflow: 'hidden',
                cursor: onClick ? 'pointer' : 'default',
                transition: onClick ? 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)' : 'none',
                height: '100%',
                p: compact ? 2 : 3,
                display: 'flex',
                flexDirection: 'column',
                ...(onClick && {
                    '&:hover': {
                        transform: 'translateY(-2px)',
                        boxShadow: theme.shadows[8],
                        '& .icon-container': {
                            transform: 'scale(1.1)',
                            backgroundColor: alpha(theme.palette[color].main, 0.15),
                        },
                        '& .count-text': {
                            color: theme.palette[color].main,
                        },
                    },
                }),
                ...sx,
            }}
            onClick={onClick}
            {...other}
        >
            {/* Background Pattern */}
            {showBackground ? (
                <Box
                    sx={{
                        position: 'absolute',
                        top: -40,
                        right: -40,
                        width: compact ? 120 : 140,
                        height: compact ? 120 : 140,
                        opacity: 0.08,
                        borderRadius: '50%',
                        background: `linear-gradient(135deg, ${theme.palette[color].main} 0%, ${alpha(theme.palette[color].main, 0.6)} 100%)`,
                        transform: 'rotate(15deg)',
                        zIndex: 1,
                    }}
                />
            ) : null}

            <Box
                sx={{
                    position: 'relative',
                    zIndex: 2,
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                }}
            >
                {/* Header Section */}
                <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'flex-start',
                        justifyContent: 'space-between',
                        mb: compact ? 1.5 : 2,
                        gap: 1,
                    }}
                >
                    <Box
                        sx={{
                            flex: 1,
                            minWidth: 0,
                        }}
                    >
                        <Typography
                            variant={compact ? 'body2' : 'subtitle1'}
                            sx={{
                                fontWeight: 600,
                                color: 'text.primary',
                                mb: 0.5,
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap',
                            }}
                        >
                            {title}
                        </Typography>

                        {subtitle ? (
                            <Typography
                                variant="caption"
                                sx={{
                                    color: 'text.secondary',
                                    fontSize: {
                                        xs: '0.6875rem',
                                        sm: '0.75rem',
                                    },
                                    fontWeight: 500,
                                    display: 'block',
                                }}
                            >
                                {subtitle}
                            </Typography>
                        ) : null}
                    </Box>

                    {/* Icon - Properly contained */}
                    {icon ? (
                        <Box
                            className="icon-container"
                            sx={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                width: compact ? 40 : 48,
                                height: compact ? 40 : 48,
                                borderRadius: 2,
                                backgroundColor: alpha(theme.palette[color].main, 0.1),
                                color: theme.palette[color].main,
                                transition: onClick ? 'all 0.3s ease' : 'none',
                                flexShrink: 0,
                            }}
                        >
                            {icon}
                        </Box>
                    ) : null}
                </Box>

                {/* Count Section */}
                <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'flex-end',
                        gap: 1.5,
                        flexWrap: 'wrap',
                        mb: compact ? 0 : 1,
                        flex: 1,
                    }}
                >
                    <Typography
                        className="count-text"
                        variant={compact ? 'h4' : 'h3'}
                        sx={{
                            fontWeight: 700,
                            color: 'text.primary',
                            lineHeight: 1.2,
                            transition: onClick ? 'color 0.3s ease' : 'none',
                        }}
                    >
                        {typeof total === 'number' ? total.toLocaleString() : total}
                    </Typography>

                    {/* Trend Chip - Inline with count */}
                    {trend ? (
                        <Box
                            sx={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: 0.5,
                                px: compact ? 1 : 1.25,
                                py: compact ? 0.25 : 0.375,
                                borderRadius: 2,
                                backgroundColor: alpha(
                                    trend.isPositive ? theme.palette.success.main : theme.palette.error.main,
                                    0.1,
                                ),
                                border: `1px solid ${alpha(
                                    trend.isPositive ? theme.palette.success.main : theme.palette.error.main,
                                    0.3,
                                )}`,
                                minHeight: 'auto',
                                alignSelf: 'flex-end',
                                mb: compact ? 0 : 0.5,
                            }}
                        >
                            {/* Trend Icon */}
                            <Box
                                sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    width: compact ? 14 : 16,
                                    height: compact ? 14 : 16,
                                    borderRadius: '50%',
                                    backgroundColor: trend.isPositive ? 'success.main' : 'error.main',
                                    color: 'white',
                                    fontSize: compact ? '0.625rem' : '0.75rem',
                                    fontWeight: 'bold',
                                }}
                            >
                                {trend.isPositive ? '↗' : '↘'}
                            </Box>

                            {/* Trend Value */}
                            <Typography
                                variant="caption"
                                sx={{
                                    fontWeight: 600,
                                    color: trend.isPositive ? 'success.main' : 'error.main',
                                    fontSize: {
                                        xs: compact ? '0.6875rem' : '0.75rem',
                                        sm: compact ? '0.75rem' : '0.8125rem',
                                    },
                                    lineHeight: 1,
                                }}
                            >
                                {trend.value}
                            </Typography>
                        </Box>
                    ) : null}
                </Box>

                {/* Trend Label - Separate line if provided */}
                {trend?.label ? (
                    <Typography
                        variant="caption"
                        sx={{
                            color: 'text.secondary',
                            fontSize: {
                                xs: '0.6875rem',
                                sm: '0.75rem',
                            },
                            fontWeight: 500,
                            mt: 0.5,
                            display: 'block',
                        }}
                    >
                        {trend.label}
                    </Typography>
                ) : null}
            </Box>
        </Card>
    );
}
