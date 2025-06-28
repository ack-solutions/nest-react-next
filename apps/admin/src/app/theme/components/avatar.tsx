import { avatarGroupClasses } from '@mui/material/AvatarGroup';
import { type Theme, type Components, type ComponentsVariants, alpha } from '@mui/material/styles';


// NEW VARIANT
declare module '@mui/material/AvatarGroup' {
    interface AvatarGroupPropsVariantOverrides {
        compact: true;
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

const colorByName = (name: string) => {
    const charAt = name.charAt(0).toLowerCase();

    if ([
        'a',
        'c',
        'f',
    ].includes(charAt)) return 'primary';
    if ([
        'e',
        'd',
        'h',
    ].includes(charAt)) return 'secondary';
    if ([
        'i',
        'k',
        'l',
    ].includes(charAt)) return 'info';
    if ([
        'm',
        'n',
        'p',
    ].includes(charAt)) return 'success';
    if ([
        'q',
        's',
        't',
    ].includes(charAt)) return 'warning';
    if ([
        'v',
        'x',
        'y',
    ].includes(charAt)) return 'error';
    return 'default';
};


const avatarColors: Record<string, ComponentsVariants<Theme>['MuiAvatar']> = {
    colors: COLORS.map((color) => ({
        props: ({ ownerState }) => ownerState.color === color,
        style: ({ theme }) => ({
            color: theme.palette[color].contrastText,
            backgroundColor: theme.palette[color].main,
        }),
    })),
    defaultColor: [
        {
            props: ({ ownerState }) => ownerState.color === 'default',
            style: ({ theme }) => ({
                color: theme.palette.text.secondary,
                backgroundColor: alpha(theme.palette.grey[500], 0.5),
            }),
        },
    ],
};

const MuiAvatar: Components<Theme>['MuiAvatar'] = {

    variants: [...[...avatarColors.defaultColor, ...avatarColors.colors]],
    styleOverrides: {
        rounded: ({ theme }) => ({ borderRadius: (Number(theme.shape.borderRadius) || 1) * 1.5 }),
        colorDefault: ({ ownerState, theme }) => {
            const color = colorByName(`${ownerState.alt}`);

            return {
                ...(!!ownerState.alt && {
                    ...(color !== 'default'
                        ? {
                            color: theme.palette[color].contrastText,
                            backgroundColor: theme.palette[color].main,
                        }
                        : {
                            color: theme.palette.text.secondary,
                            backgroundColor: alpha(theme.palette.grey[500], 0.1),
                        }),
                }),
            };
        },
    },
};

const MuiAvatarGroup: Components<Theme>['MuiAvatarGroup'] = {
    defaultProps: { max: 4 },

    styleOverrides: {
        root: ({ ownerState }) => ({
            justifyContent: 'flex-end',
            ...(ownerState.variant === 'compact' && {
                width: 40,
                height: 40,
                position: 'relative',
                [`& .${avatarGroupClasses.avatar}`]: {
                    margin: 0,
                    width: 28,
                    height: 28,
                    position: 'absolute',
                    '&:first-of-type': {
                        left: 0,
                        bottom: 0,
                        zIndex: 9,
                    },
                    '&:last-of-type': {
                        top: 0,
                        right: 0,
                    },
                },
            }),
        }),
        avatar: ({ theme }) => ({
            fontSize: 16,
            fontWeight: theme.typography.fontWeightSemiBold,
            '&:first-of-type': {
                fontSize: 12,
                color: theme.palette.primary.dark,
                backgroundColor: theme.palette.primary.lighter,
            },
        }),
    },
};

export const avatar = {
    MuiAvatar,
    MuiAvatarGroup,
};
