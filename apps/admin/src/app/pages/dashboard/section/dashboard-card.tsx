import Box from '@mui/material/Box';
import type { CardProps } from '@mui/material/Card';
import Card from '@mui/material/Card';
import { alpha, useTheme } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import { ReactNode } from 'react';


type Props = CardProps & {
    icon: ReactNode;
    title: string;
    total: any;
    color?: 'primary' | 'secondary' | 'info' | 'success' | 'warning' | 'error';
};

export function DashboardCard({
    sx,
    icon,
    title,
    total,
    color = 'warning',
    ...other
}: Props) {
    const theme = useTheme();

    return (
        <Card
            sx={{
                py: 3,
                pl: 3,
                pr: 2.5,
                position: 'relative',
                cursor: 'pointer',
                ...sx,
            }}
            {...other}
        >
            <Box sx={{ flexGrow: 1 }}>
                <Box sx={{ typography: 'h3' }}>{(total || '00')}</Box>
                <Typography
                    noWrap
                    variant="subtitle2"
                    component="div"
                    sx={{ color: 'text.secondary' }}
                >
                    {title}
                </Typography>
            </Box>

            <Box
                sx={{
                    flexShrink: 0,
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    top: 24,
                    right: 20,
                    width: 36,
                    height: 36,
                    position: 'absolute',
                }}
                {...other}
            >
                {icon}
            </Box>

            <Box
                sx={{
                    top: -44,
                    width: 160,
                    // zIndex: -1,
                    height: 160,
                    right: -104,
                    opacity: 0.12,
                    borderRadius: 3,
                    position: 'absolute',
                    transform: 'rotate(40deg)',
                    background: `linear-gradient(to right, ${theme.palette[color].main} 0%, ${alpha(theme.palette[color].main, 0)} 100%)`,
                }}
            />
        </Card>
    );
}
