import React, { forwardRef } from 'react';
import Box, { BoxProps } from '@mui/material/Box';
import { StyledLabel } from './styles';

export type LabelColor = 'default' | 'primary' | 'secondary' | 'info' | 'success' | 'warning' | 'error' | 'tertiary';
export type LabelVariant = 'filled' | 'outlined' | 'soft';

export interface LabelProps extends BoxProps {
	startIcon?: React.ReactElement | null;
	endIcon?: React.ReactElement | null;
	color?: LabelColor;
	variant?: LabelVariant;
}

const Label = forwardRef<HTMLSpanElement, LabelProps>(
	({ children, color = 'default', variant = 'soft', startIcon, endIcon, sx = {}, ...other }, ref) => {
		const iconStyle = {
			width: 16,
			height: 16,
			'& svg, img': { width: '100%', height: '100%', objectFit: 'cover' }
		};

		return (
			<StyledLabel
				ref={ref}
				ownerState={{ color, variant }}
				sx={{
					...(startIcon && { pl: 0.75 }),
					...(endIcon && { pr: 0.75 }),
					...sx
				}}
				{...other}
			>
				{startIcon && <Box sx={{ mr: 0.75, ...iconStyle }}>{startIcon}</Box>}
				{children}
				{endIcon && <Box sx={{ ml: 0.75, ...iconStyle }}>{endIcon}</Box>}
			</StyledLabel>
		);
	}
);

export default Label;