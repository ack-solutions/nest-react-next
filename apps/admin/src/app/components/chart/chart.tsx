import type { BoxProps } from '@mui/material/Box';
import Box from '@mui/material/Box';
import { useTheme } from '@mui/material/styles';
import ApexChart from 'react-apexcharts';

import type { ChartProps } from './types';


export function Chart({
    sx,
    type,
    series,
    height,
    options,
    width = '100%',
    ...other
}: BoxProps & ChartProps) {
    const theme = useTheme();

    return (
        <Box
            dir="ltr"
            sx={{
                width,
                height: typeof height === 'object' ? height : height,
                flexShrink: 0,
                borderRadius: 1.5,
                position: 'relative',
                '& .apexcharts-canvas': {
                    borderRadius: 1.5,
                },
                '& .apexcharts-tooltip': {
                    borderRadius: theme.spacing(1),
                    boxShadow: theme.shadows[8],
                    border: `1px solid ${theme.palette.divider}`,
                },
                '& .apexcharts-legend': {
                    fontSize: '14px !important',
                    fontWeight: '500 !important',
                    color: `${theme.palette.text.secondary} !important`,
                },
                '& .apexcharts-gridline': {
                    stroke: theme.palette.divider,
                },
                '& .apexcharts-text': {
                    fill: `${theme.palette.text.secondary} !important`,
                },
                ...sx,
            }}
            {...other}
        >
            <ApexChart
                type={type}
                series={series}
                options={options}
                width="100%"
                height="100%"
            />
        </Box>
    );
}
