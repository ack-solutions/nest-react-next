import {
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Tooltip,
    alpha,
    styled,
} from '@mui/material';
import { Link } from 'react-router-dom';

import { NavigationItemComponentProps } from './navigation-item';

const StyledListItemIcon = styled(ListItemIcon, {
    shouldForwardProp: (prop) =>
        prop !== 'isCompact' && prop !== 'isChild' && prop !== 'isActive',
})<{
    isCompact: boolean;
    isChild?: boolean;
    isActive?: boolean;
}>(({ isCompact, isChild, isActive }) => ({
    minWidth: isCompact ? 20 : 'auto',
    marginRight: 0,
    color: 'inherit',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',

    ...(isChild && {
        minWidth: isActive ? 6 : 5,
        width: isActive ? 6 : 5,
        height: isActive ? 6 : 5,
        borderRadius: '50%',
        backgroundColor: 'currentColor',
        opacity: isActive ? 1 : 0.5,
        display: 'block',
        transition: 'all 0.15s ease-in-out',
    }),
}));

const StyledListItemText = styled(ListItemText)(() => ({
    margin: 0,
}));

export default function NavigationLeafItem({
    item,
    isActive,
    isCompact = false,
    onClose,
    depth = 0,
}: NavigationItemComponentProps) {
    const isChild = depth > 0;

    const handleClick = () => {
        onClose?.();
    };

    return (
        <ListItemButton
            component={Link}
            to={item.path!}
            onClick={handleClick}
            sx={(theme) => ({
                position: 'relative',
                padding: isCompact ? theme.spacing(1) : theme.spacing(0.75, 1.5, 0.75, `${theme.spacing(1.5) + depth * 16}px`),
                marginBottom: 0.5,
                borderRadius: 1,
                minHeight: isCompact ? 'auto' : isChild ? 34 : 40,
                width: 'auto',
                mx: isCompact ? theme.spacing(0.5) : 0,
                color: theme.palette.text.secondary,
                textDecoration: 'none',
                display: 'flex',
                gap: theme.spacing(isCompact ? 0.5 : 1.5),
                flexDirection: isCompact ? 'column' : 'row',
                alignItems: 'center',
                justifyContent: isCompact ? 'center' : 'flex-start',
                transition: 'all 0.15s ease-in-out',
                ...(isChild ? {
                    marginLeft: theme.spacing(1.5),
                } : {}),

                ...(isActive &&
                    !isChild && {
                    color: theme.palette.primary.main,
                    backgroundColor: alpha(theme.palette.primary.main, 0.08),
                    '&:hover': {
                        backgroundColor: alpha(theme.palette.primary.main, 0.12),
                    },
                }),

                ...(isActive &&
                    isChild && {
                    color: theme.palette.primary.main,
                    fontWeight: 700,
                }),

                ...(!isActive && {
                    '&:hover': {
                        backgroundColor: theme.palette.action.hover,
                        color: theme.palette.text.primary,
                    },
                }),
            })}
        >
            <StyledListItemIcon
                isCompact={isCompact}
                isChild={isChild}
                isActive={isActive}
            >
                {isChild ? null : item.icon}
            </StyledListItemIcon>
            {/* {!isCompact && ( */}
            <StyledListItemText
                primary={item.title}
                slotProps={{
                    primary: {
                        variant: 'body2',
                        sx: {
                            lineHeight: 1.2,
                            ...(isCompact ? {
                                textAlign: 'center',
                                fontSize: '0.65rem',
                            } : {}),
                            fontWeight: isActive ? (isChild ? 700 : 600) : 400,
                        },
                    },
                }}
            />
            {/* )} */}
        </ListItemButton>
    );
}
