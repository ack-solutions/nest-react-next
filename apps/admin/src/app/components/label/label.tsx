import Box, { BoxProps } from '@mui/material/Box';
import React, { forwardRef } from 'react';

import { StyledLabel } from './styles';


export type LabelColor =
    | 'default'
    | 'primary'
    | 'secondary'
    | 'info'
    | 'success'
    | 'warning'
    | 'error'
    | 'tertiary';

export type LabelVariant = 'filled' | 'outlined' | 'soft';

export interface LabelProps extends BoxProps {
    startIcon?: React.ReactElement | null;
    endIcon?: React.ReactElement | null;
    color?: LabelColor;
    variant?: LabelVariant;
}

export const Label = forwardRef<HTMLSpanElement, LabelProps>(
    (
        {
            children,
            color = 'default',
            variant = 'soft',
            startIcon,
            endIcon,
            sx = {},
            ...other
        },
        ref,
    ) => {
        return (
            <StyledLabel
                ref={ref}
                ownerState={{
                    color,
                    variant,
                }}
                sx={{
                    ...(startIcon && { pl: 0.75 }),
                    ...(endIcon && { pr: 0.75 }),
                    ...sx,
                }}
                {...other}
            >
                {startIcon ? (
                    <Box
                        sx={{
                            mr: 0.75,
                        }}
                    >
                        {startIcon}
                    </Box>
                ) : null}

                {children}

                {endIcon ? (
                    <Box
                        sx={{
                            ml: 0.75,
                        }}
                    >
                        {endIcon}
                    </Box>
                ) : null}
            </StyledLabel>
        );
    },
);
