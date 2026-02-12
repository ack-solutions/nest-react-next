import { styled, alpha } from '@mui/material';
import { Toaster } from 'sonner';


type StyledIconProps = {
    color: 'info' | 'success' | 'warning' | 'error';
};

export const StyledIcon = styled('span')<StyledIconProps>(
    ({ color, theme }) => ({
        width: 44,
        height: 44,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: theme.spacing(1.5),
        color: theme.palette[color].main,
        borderRadius: theme.shape.borderRadius,
        backgroundColor: alpha(theme.palette[color].main, 0.16),
    }),
);

export const StyledToaster = styled(Toaster)(({ theme }) => {
    const baseStyles = {
        toastDefault: {
            padding: theme.spacing(1, 1, 1, 1.5),
            boxShadow: theme.customShadows.z8,
            color: theme.palette.background.paper,
            backgroundColor: theme.palette.text.primary,
        },
        toastColor: {
            padding: theme.spacing(0.5, 1, 0.5, 0.5),
            boxShadow: theme.customShadows.z8,
            color: theme.palette.text.primary,
            backgroundColor: theme.palette.background.paper,
        },
        toastLoader: {
            padding: theme.spacing(0.5, 1, 0.5, 0.5),
            boxShadow: theme.customShadows.z8,
            color: theme.palette.text.primary,
            backgroundColor: theme.palette.background.paper,
        },
    };

    const loadingStyles = {
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        display: 'none',
        transform: 'none',
        overflow: 'hidden',
        alignItems: 'center',
        position: 'absolute',
        borderRadius: 'inherit',
        justifyContent: 'center',
        background: theme.palette.background.neutral,
        '& .toaster__loading_icon': {
            zIndex: 9,
            width: 24,
            height: 24,
            borderRadius: '50%',
            animation: 'rotate 3s infinite linear',
            background: `conic-gradient(${alpha(
                theme.palette.text.primary,
                0,
            )}, ${alpha(theme.palette.text.disabled, 0.64)})`,
        },
        ['&[data-visible="true"]']: { display: 'flex' },
    };

    return {
        width: 400,
        '& .toaster__toast': {
            gap: 12,
            width: '100%',
            minHeight: 52,
            display: 'flex',
            borderRadius: 12,
            alignItems: 'center',
        },
        /*
         * Content
         */
        '& .toaster__content': {
            gap: 0,
            flex: '1 1 auto',
        },
        '& .toaster__title': {
            fontSize: theme.typography.subtitle2.fontSize,
        },
        '& .toaster__description': {
            ...theme.typography.caption,
            opacity: 0.64,
        },
        /*
         * Buttons
         */
        '& .toaster__action__button': {},
        '& .toaster__cancel__button': {},
        '& .toaster__close_button': {
            top: 8,
            right: 8,
            left: 'auto',
            width: 32,
            height: 32,
            minWidth: 32,
            position: 'absolute',
            color: 'currentColor',
            backgroundColor: 'transparent',
            border: 'none',
            borderRadius: 4,
            padding: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: theme.transitions.create(['background-color']),
            '&:hover': {
                backgroundColor: alpha(theme.palette.grey['500'], 0.08),
            },
            '& svg': {
                fontSize: 18,
                width: 18,
                height: 18,
            },
        },
        /*
         * Icon
         */
        '& .toaster__icon': {
            margin: 0,
            width: 48,
            height: 48,
            display: 'flex',
            alignItems: 'center',
            borderRadius: 'inherit',
            justifyContent: 'center',
            alignSelf: 'flex-start',
            position: 'relative',
            '& .toaster__icon__svg': {
                // width: 24,
                // height: 24,
                fontSize: 24,
            },
        },

        /*
         * Default
         */
        '@keyframes rotate': { to: { transform: 'rotate(1turn)' } },

        '& .toaster__default': {
            ...baseStyles.toastDefault,
            '&:has([data-close-button="true"])': {
                '& .toaster__content': {
                    paddingRight: 32,
                },
            },
            /*
             * With loader
             */
            '&:has(.sonner-loader)': baseStyles.toastLoader,
            '& .sonner-loader': loadingStyles,
        },
        /*
         * Error
         */
        '& .toaster__error': {
            ...baseStyles.toastColor,
            '& .toaster__icon': {
                color: theme.palette.error.main,
                backgroundColor: alpha(theme.palette.error.main, 0.08),
            },
        },
        /*
         * Success
         */
        '& .toaster__success': {
            ...baseStyles.toastColor,
            '& .toaster__icon': {
                color: theme.palette.success.main,
                backgroundColor: alpha(theme.palette.success.main, 0.08),
            },
        },
        /*
         * Warning
         */
        '& .toaster__warning': {
            ...baseStyles.toastColor,
            '& .toaster__icon': {
                color: theme.palette.warning.main,
                backgroundColor: alpha(theme.palette.warning.main, 0.08),
            },
        },
        /*
         * Info
         */
        '& .toaster__info': {
            ...baseStyles.toastColor,
            '& .toaster__icon': {
                color: theme.palette.info.main,
                backgroundColor: alpha(theme.palette.info.main, 0.08),
            },
        },
    };
});
