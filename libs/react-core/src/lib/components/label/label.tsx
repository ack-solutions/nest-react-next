import { forwardRef } from 'react';
import { useTheme } from '@mui/material/styles';
import { Box, BoxProps } from '@mui/material';
import { LabelColor, LabelVariant, StyledLabel } from './styles';

export interface LabelProps extends BoxProps {
	startIcon?: React.ReactElement | null;
	endIcon?: React.ReactElement | null;
	color?: LabelColor;
	variant?: LabelVariant;
}


export const Label = forwardRef<HTMLSpanElement, LabelProps>(({
    children,
    color = 'default',
    variant = 'soft',
    startIcon,
    endIcon,
    sx,
    ...other
}, ref) => {
    const theme = useTheme();

    const iconStyle = {
        width: 16,
        height: 16,
        '& svg, img': { width: 1, height: 1, objectFit: 'cover' }
    };

    return (
        <StyledLabel
            ref={ref}
            component="span"
            ownerState={{ color, variant }}
            sx={{
                ...(startIcon && { pl: 0.75 }),
                ...(endIcon && { pr: 0.75 }),
                ...sx
            }}
            // theme={theme}
            {...other}
        >
            {startIcon && <Box sx={{ mr: 0.75, ...iconStyle }}> {startIcon} </Box>}

            {children}

            {endIcon && <Box sx={{ ml: 0.75, ...iconStyle }}> {endIcon} </Box>}
        </StyledLabel>
    );
});

