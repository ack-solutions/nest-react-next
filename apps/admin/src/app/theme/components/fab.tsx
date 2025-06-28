import { fabClasses } from '@mui/material/Fab';
import { type Theme, type Components, type ComponentsVariants, alpha } from '@mui/material/styles';


declare module '@mui/material/Fab' {
    interface FabPropsVariantOverrides {
        outlined: true;
        outlinedExtended: true;
        soft: true;
        softExtended: true;
    }

    interface FabPropsSizeOverrides {
        'x-small': true;
    }
}

const COLORS = [
    'primary',
    'secondary',
    'info',
    'success',
    'warning',
    'error',
] as const;

const DEFAULT_COLORS = ['default', 'inherit'];
const EXTENDED_VARIANT = [
    'extended',
    'outlinedExtended',
    'softExtended',
];
const FILLED_VARIANT = ['circular', 'extended'];
const OUTLINED_VARIANT = ['outlined', 'outlinedExtended'];
const SOFT_VARIANT = ['soft', 'softExtended'];

const filledVariant: Record<string, ComponentsVariants<Theme>['MuiFab']> = {
    colors: COLORS.map((color) => ({
        props: ({ ownerState }) => !ownerState?.disabled &&
            FILLED_VARIANT.includes(ownerState?.variant) &&
            ownerState.color === color,
        style: ({ theme }) => ({
            boxShadow: theme.customShadows[color],
            '&:hover': { boxShadow: 'none' },
        }),
    })),
    base: [
        {
            props: ({ ownerState }) => FILLED_VARIANT.includes(ownerState?.variant) && DEFAULT_COLORS.includes(ownerState?.color),
            style: ({ theme }) => ({
                boxShadow: theme.customShadows.z8,
                /**
                 * @color default
                 */
                color: theme.palette.grey[800],
                backgroundColor: theme.palette.grey[300],
                '&:hover': {
                    boxShadow: 'none',
                    backgroundColor: theme.palette.grey[400],
                },
                /**
                 * @color inherit
                 */
                [`&.${fabClasses.colorInherit}`]: {
                    color: theme.palette.common.white,
                    backgroundColor: theme.palette.text.primary,
                    '&:hover': { backgroundColor: theme.palette.grey[700] },
                    ...(theme.palette.mode === 'dark' && {
                        color: theme.palette.grey[800],
                        '&:hover': { backgroundColor: theme.palette.grey[400] },
                    }),
                },
            }),
        },
    ],
};

const outlinedVariant: Record<string, ComponentsVariants<Theme>['MuiFab']> = {
    colors: COLORS.map((color) => ({
        props: ({ ownerState }) => !ownerState?.disabled &&
            OUTLINED_VARIANT.includes(ownerState?.variant) &&
            ownerState.color === color,
        style: ({ theme }) => ({
            color: theme.palette[color].main,
            border: `solid 1px ${alpha(theme.palette[color].main, 0.48)}`,
            '&:hover': { backgroundColor: alpha(theme.palette[color].main, 0.08) },
        }),
    })),
    base: [
        {
            props: ({ ownerState }) => OUTLINED_VARIANT.includes(ownerState?.variant),
            style: ({ theme }) => ({
                boxShadow: 'none',
                backgroundColor: 'transparent',
                color: theme.palette.text.secondary,
                border: `solid 1px ${alpha(theme.palette.grey['500'], 0.32)}`,
                '&:hover': {
                    borderColor: 'currentColor',
                    boxShadow: '0 0 0 0.75px currentColor',
                    backgroundColor: theme.palette.action.hover,
                },
                [`&.${fabClasses.colorInherit}`]: { color: theme.palette.text.primary },
                [`&.${fabClasses.disabled}`]: {
                    backgroundColor: 'transparent',
                    border: `1px solid ${theme.palette.action.disabledBackground}`,
                },
            }),
        },
    ],
};

const softVariant: Record<string, ComponentsVariants<Theme>['MuiFab']> = {
    colors: COLORS.map((color) => ({
        props: ({ ownerState }) => !ownerState?.disabled &&
            SOFT_VARIANT.includes(ownerState?.variant) &&
            ownerState.color === color,
        style: ({ theme }) => ({
            boxShadow: 'none',
            color: theme.palette[color].dark,
            backgroundColor: alpha(theme.palette[color].main, 0.16),
            '&:hover': {
                boxShadow: 'none',
                backgroundColor: alpha(theme.palette[color].main, 0.32),
            },
            ...(theme.palette.mode === 'dark' && {
                color: theme.palette[color].light,
            }),
        }),
    })),
    base: [
        {
            props: ({ ownerState }) => SOFT_VARIANT.includes(ownerState?.variant) && DEFAULT_COLORS.includes(ownerState?.color),
            style: ({ theme }) => ({
                /**
                 * @color default
                 */
                boxShadow: 'none',
                color: theme.palette.grey[800],
                backgroundColor: theme.palette.grey[300],
                '&:hover': {
                    boxShadow: 'none',
                    backgroundColor: theme.palette.grey[400],
                },
                /**
                 * @color inherit
                 */
                [`&.${fabClasses.colorInherit}`]: {
                    color: theme.palette.text.primary,
                    backgroundColor: alpha(theme.palette.grey['500'], 0.08),
                    '&:hover': { backgroundColor: alpha(theme.palette.grey['500'], 0.24) },
                },
            }),
        },
    ],
};

const sizes: ComponentsVariants<Theme>['MuiFab'] = [
    {
        props: ({ ownerState }) => EXTENDED_VARIANT.includes(ownerState?.variant),
        style: ({ theme }) => ({
            height: 48,
            width: 'auto',
            minHeight: 48,
            borderRadius: 48 / 2,
            gap: theme.spacing(1),
            padding: theme.spacing(0, 2),
            [`&.${fabClasses.sizeSmall}`]: {
                height: 36,
                minHeight: 36,
                borderRadius: 36 / 2,
                gap: theme.spacing(0.5),
                padding: theme.spacing(0, 1),
            },
            [`&.${fabClasses.sizeMedium}`]: {
                height: 40,
                minHeight: 40,
                borderRadius: 40 / 2,
            },
        }),
    },
    {
        props: ({ ownerState }) => ownerState.size === 'x-small',
        style: ({ theme }) => ({
            height: 30,
            width: 30,
            minHeight: 30,
            borderRadius: 30 / 2,
            gap: theme.spacing(0.5),
            padding: theme.spacing(0, 1),
        }),
    },
];

const MuiFab: Components<Theme>['MuiFab'] = {
    defaultProps: { color: 'primary' },
    variants: [
        ...[...(filledVariant?.base ?? []), ...(filledVariant?.colors ?? [])],
        ...[...(outlinedVariant?.base ?? []), ...(outlinedVariant?.colors ?? [])],
        ...[...(softVariant?.base ?? []), ...(softVariant?.colors ?? [])],
        ...sizes,
    ],
    styleOverrides: {},
};


export const fab = { MuiFab };
