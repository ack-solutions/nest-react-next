import Box, { BoxProps } from '@mui/material/Box';
import { Palette, PaletteColor, Theme, alpha, styled } from '@mui/material/styles';


export type LabelColor = 'default' | 'primary' | 'secondary' | 'info' | 'success' | 'warning' | 'error' | 'tertiary';

export type LabelVariant = 'filled' | 'outlined' | 'soft';


export interface StyledLabelProps {
	theme: Theme;
	ownerState: {
		color: LabelColor;
		variant: LabelVariant;
	};
}

export const StyledLabel = styled<BoxProps<'span', any>>(Box)(({
    theme,
    ownerState,
}: StyledLabelProps) => {
    const isLight = theme.palette.mode === 'light';

    const filledVariant = ownerState.variant === 'filled';

    const outlinedVariant = ownerState.variant === 'outlined';

    const softVariant = ownerState.variant === 'soft';

    const defaultStyle = {
        ...(ownerState.color === 'default' && {
            // FILLED
            ...(filledVariant && {
                color: isLight ? theme.palette.common.white : theme.palette.grey[800],
                backgroundColor: theme.palette.text.primary,
            }),
            // OUTLINED
            ...(outlinedVariant && {
                backgroundColor: 'transparent',
                color: theme.palette.text.primary,
                border: `2px solid ${theme.palette.text.primary}`,
            }),
            // SOFT
            ...(softVariant && {
                color: theme.palette.text.secondary,
                backgroundColor: alpha(theme.palette.grey[500], 0.16),
            }),
        }),
    };

    const colorStyle = {
        ...(ownerState.color !== 'default' && {
            // FILLED
            ...(filledVariant && {
                color: (theme.palette[ownerState.color as keyof Palette] as PaletteColor).contrastText,
                backgroundColor: (theme.palette[ownerState.color as keyof Palette] as PaletteColor).main,
            }),
            // OUTLINED
            ...(outlinedVariant && {
                backgroundColor: 'transparent',
                color: (theme.palette[ownerState.color as keyof Palette] as PaletteColor).main,
                border: `2px solid ${(theme.palette[ownerState.color as keyof Palette] as PaletteColor).main}`,
            }),
            // SOFT
            ...(softVariant && {
                color: (theme.palette[ownerState.color as keyof Palette] as PaletteColor)[isLight ? 'dark' : 'light'],
                backgroundColor: alpha((theme.palette[ownerState.color as keyof Palette] as PaletteColor).main, 0.16),
            }),
        }),
    };

    return {
        height: 24,
        minWidth: 24,
        lineHeight: 0,
        borderRadius: 6,
        cursor: 'default',
        alignItems: 'center',
        whiteSpace: 'nowrap',
        display: 'inline-flex',
        justifyContent: 'center',
        textTransform: 'capitalize',
        padding: theme.spacing(0, 0.75),
        fontSize: theme.typography.pxToRem(12),
        fontWeight: theme.typography.fontWeightBold,
        transition: theme.transitions.create('all', {
            duration: theme.transitions.duration.shorter,
        }),
        ...defaultStyle,
        ...colorStyle,
    };
});
