import React, { forwardRef } from 'react';
import Box, { BoxProps } from '@mui/material/Box';
import { StyledLabel } from './styles';
// import { StyledLabel } from './styles'; // Assuming you already have the StyledLabel component

// Define color and variant types for the Label component
export type LabelColor = 'default' | 'primary' | 'secondary' | 'info' | 'success' | 'warning' | 'error' | 'tertiary';
export type LabelVariant = 'filled' | 'outlined' | 'soft';

export interface LabelProps extends BoxProps {
	startIcon?: React.ReactElement | null;
	endIcon?: React.ReactElement | null;
	color?: LabelColor;
	variant?: LabelVariant;
}

// Define the Label component using forwardRef
const Label = forwardRef<HTMLSpanElement, LabelProps>(
	({ children, color = 'default', variant = 'soft', startIcon, endIcon, sx = {}, ...other }, ref) => {

		// Define common styles for the icons
		const iconStyle = {
			width: 16,
			height: 16,
			'& svg, img': { width: '100%', height: '100%', objectFit: 'cover' }
		};

		return (
			<StyledLabel
				ref={ref}
				// component="span"
				ownerState={{ color, variant }}
				sx={{
					// Add padding if there's an icon
					...(startIcon && { pl: 0.75 }),
					...(endIcon && { pr: 0.75 }),
					...sx // Spread the `sx` styles
				}}
				{...other} // Spread other props (make sure they are safe to use)
			>
				{/* Start icon if provided */}
				{startIcon && <Box sx={{ mr: 0.75, ...iconStyle }}>{startIcon}</Box>}

				{/* Label text */}
				{children}

				{/* End icon if provided */}
				{endIcon && <Box sx={{ ml: 0.75, ...iconStyle }}>{endIcon}</Box>}
			</StyledLabel>
		);
	}
);

// Set displayName for better debugging in React DevTools
// Label.displayName = 'Label';

export default Label;