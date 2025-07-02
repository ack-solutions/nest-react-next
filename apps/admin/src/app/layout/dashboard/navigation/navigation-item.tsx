import {
    ListItemButton,
    ListItemIcon,
    ListItemText,
    styled,
    alpha,
    useTheme,
} from '@mui/material';
import { forwardRef } from 'react';
import { Link, LinkProps } from 'react-router-dom';

import { NavigationItem } from './navigation-config';


interface NavigationItemProps {
    item: NavigationItem;
    isActive: boolean;
    isCompact?: boolean;
    onClose?: () => void;
}

const StyledListItemButton = styled(ListItemButton, {
    shouldForwardProp: (prop) => prop !== 'isActive' && prop !== 'isCompact',
})<{ isActive: boolean; isCompact: boolean }>(({ theme, isActive, isCompact }) => ({
    padding: isCompact ? '6px 0 0 0' : '4px 8px 4px 12px',
    marginBottom: isCompact ? 8 : 4,
    borderRadius: isCompact ? 6 : 8,
    minHeight: isCompact ? 56 : 44,
    color: theme.palette.text.secondary,
    position: 'relative',
    textDecoration: 'none',

    ...(isCompact && {
        flexDirection: 'column',
        justifyContent: 'center',
        margin: `0 ${8}px ${8}px ${8}px`,
    }),

    ...(isActive && {
        color: theme.palette.primary.main,
        backgroundColor: alpha(theme.palette.primary.main, 0.08),
        fontWeight: theme.typography.fontWeightSemiBold,
        '&:before': {
            top: 0,
            left: 0,
            width: 2,
            height: '100%',
            content: '""',
            position: 'absolute',
            backgroundColor: theme.palette.primary.main,
        },
    }),

    '&:hover': {
        backgroundColor: alpha(theme.palette.text.primary, 0.04),
        ...(isActive && {
            backgroundColor: alpha(theme.palette.primary.main, 0.12),
        }),
    },
}));

const StyledListItemIcon = styled(ListItemIcon, {
    shouldForwardProp: (prop) => prop !== 'isCompact',
})<{ isCompact: boolean }>(({ theme, isCompact }) => ({
    minWidth: 'auto',
    marginRight: isCompact ? 0 : theme.spacing(2),
    color: 'inherit',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
}));

const StyledListItemText = styled(ListItemText, {
    shouldForwardProp: (prop) => prop !== 'isCompact',
})<{ isCompact: boolean }>(({ theme, isCompact }) => ({
    margin: 0,
    ...(isCompact && {
        marginTop: theme.spacing(0.5),
        '& .MuiListItemText-primary': {
            fontSize: '0.75rem',
            fontWeight: 500,
            textAlign: 'center',
        },
    }),
}));

export default function NavigationItemComponent({
    item,
    isActive,
    isCompact = false,
    onClose,
}: NavigationItemProps) {
    const theme = useTheme();

    const handleClick = () => {
        if (onClose) {
            onClose();
        }
    };

    return (
        <Link
            to={item.path}
            style={{
                textDecoration: 'none',
                color: 'inherit',
            }}
            onClick={handleClick}
        >
            <StyledListItemButton
                isActive={isActive}
                isCompact={isCompact}
            >
                <StyledListItemIcon isCompact={isCompact}>
                    {item.icon}
                </StyledListItemIcon>
                <StyledListItemText
                    primary={item.title}
                    isCompact={isCompact}
                    primaryTypographyProps={{
                        variant: 'body2',
                        fontWeight: isActive ? 600 : 400,
                    }}
                />
            </StyledListItemButton>
        </Link>
    );
}
