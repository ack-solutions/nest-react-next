import {
    Box,
    Collapse,
    List,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    MenuItem,
    MenuList,
    Paper,
    Popover,
    Typography,
    alpha,
    styled,
    useTheme,
} from '@mui/material';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';

import { NavigationItem } from './navigation-config';
import NavigationItemComponent, {
    NavigationItemComponentProps,
} from './navigation-item';
import { IconEnum } from '@admin/app/components/icons/icons';
import { Icon } from '@admin/app/components';

const StyledListItemButton = styled(ListItemButton, {
    shouldForwardProp: (prop) =>
        prop !== 'isActive' && prop !== 'isCompact' && prop !== 'depth' && prop !== 'isOpen',
})<{
    isActive: boolean;
    isCompact: boolean;
    depth?: number;
    isOpen?: boolean;
}>(({ theme, isActive, isCompact, depth = 0, isOpen = false }) => {
    const isChild = depth > 0;
    const highlight = isActive;

    return {
        position: 'relative',
        padding: isCompact ? theme.spacing(1) : theme.spacing(0.75, 1.5, 0.75, `${theme.spacing(1.5) + depth * 16}px`),
        marginBottom: theme.spacing(0.5),
        borderRadius: theme.spacing(1),
        minWidth: 0,
        minHeight: isCompact ? 'auto' : isChild ? 34 : 40,
        width: 'auto',
        marginLeft: isCompact ? theme.spacing(0.5) : 0,
        marginRight: isCompact ? theme.spacing(0.5) : 0,
        color: highlight ? theme.palette.primary.main : theme.palette.text.secondary,
        display: 'flex',
        alignItems: 'center',
        gap: theme.spacing(isCompact ? 0.5 : 1.5),
        flexDirection: isCompact ? 'column' : 'row',
        justifyContent: isCompact ? 'center' : 'flex-start',
        transition: 'all 0.15s ease-in-out',
        ...(isOpen ? {
            backgroundColor: alpha(theme.palette.grey[500], 0.14),
        } : {}),
        ...(highlight &&
            !isChild && {
            backgroundColor: alpha(theme.palette.primary.main, isOpen ? 0.14 : 0.1),
            '&:hover': {
                backgroundColor: alpha(theme.palette.primary.main, isOpen ? 0.18 : 0.14),
            },
        }),

        ...(highlight &&
            isChild && {
            fontWeight: 700,
        }),


        ...(!highlight && {
            '&:hover': {
                backgroundColor: theme.palette.action.hover,
                color: theme.palette.text.primary,
            },
        }),
    };
});

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
        marginRight: 0,
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

function normalizeChildItem(
    parent: NavigationItem,
    child: NonNullable<NavigationItem['children']>[number],
): NavigationItem {
    return {
        ...child,
        icon: undefined,
        group: parent.group,
    };
}

export default function NavigationParentItem({
    item,
    isActive,
    isCompact = false,
    onClose,
    isItemActive,
    depth = 0,
}: NavigationItemComponentProps) {
    const theme = useTheme();
    const buttonRef = useRef<HTMLDivElement | null>(null);
    const hoverCloseTimerRef = useRef<number | null>(null);
    const isChild = depth > 0;

    const children = useMemo(
        () => (item.children ?? []).map((child) => normalizeChildItem(item, child)),
        [item],
    );

    const hasActiveChild = useMemo(() => {
        if (!isItemActive) {
            return false;
        }

        return children.some((child) => isItemActive(child));
    }, [children, isItemActive]);

    const [open, setOpen] = useState(hasActiveChild);
    const [popoverOpen, setPopoverOpen] = useState(false);

    useEffect(() => {
        if (hasActiveChild && !isCompact) {
            setOpen(true);
        }
    }, [hasActiveChild, isCompact]);

    useEffect(() => {
        return () => {
            if (hoverCloseTimerRef.current) {
                window.clearTimeout(hoverCloseTimerRef.current);
            }
        };
    }, []);

    const clearHoverCloseTimer = () => {
        if (hoverCloseTimerRef.current) {
            window.clearTimeout(hoverCloseTimerRef.current);
            hoverCloseTimerRef.current = null;
        }
    };

    const handleParentClick = () => {
        if (isCompact) {
            clearHoverCloseTimer();
            setPopoverOpen((prev) => !prev);
            return;
        }

        setOpen((prev) => !prev);
    };

    const handlePopoverClose = () => {
        clearHoverCloseTimer();
        setPopoverOpen(false);
    };

    const handleCompactChildClick = () => {
        clearHoverCloseTimer();
        setPopoverOpen(false);
        onClose?.();
    };

    return (
        <>
            <StyledListItemButton
                ref={buttonRef}
                onClick={handleParentClick}
                isActive={isActive}
                isCompact={isCompact}
                depth={depth}
                isOpen={isCompact ? popoverOpen : open}
            >
                <StyledListItemIcon
                    isCompact={isCompact}
                    isChild={isChild}
                    isActive={isActive || hasActiveChild}
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
                                fontWeight: isActive || open ? (isChild ? 700 : 600) : 400,
                            },
                        },
                    }}
                />
                {/* )} */}

                {!isCompact && (
                    <Icon
                        icon={open ? IconEnum.ChevronUp : IconEnum.ChevronDown}
                        size="small"
                        style={{ marginLeft: 'auto', opacity: 0.5 }}
                    />
                )}

                {isCompact && !isChild && (
                    <Box
                        sx={{
                            position: 'absolute',
                            right: 2,
                            top: 10,
                            color: popoverOpen
                                ? theme.palette.primary.main
                                : theme.palette.text.secondary,
                            pointerEvents: 'none',
                        }}
                    >
                        <Icon icon={IconEnum.ChevronRight} size="small" />
                    </Box>
                )}
            </StyledListItemButton>
            {!isCompact && (
                <Collapse in={open} timeout="auto" unmountOnExit>
                    <List component="div" disablePadding>
                        {children.map((child) => (
                            <NavigationItemComponent
                                key={child.id}
                                item={child}
                                isActive={isItemActive ? isItemActive(child) : false}
                                isCompact={false}
                                onClose={onClose}
                                isItemActive={isItemActive}
                                depth={depth + 1}
                            />
                        ))}
                    </List>
                </Collapse>
            )}
            {isCompact && (
                <Popover
                    open={popoverOpen}
                    anchorEl={buttonRef.current}
                    onClose={handlePopoverClose}
                    anchorOrigin={{
                        vertical: 'center',
                        horizontal: 'right',
                    }}
                    transformOrigin={{
                        vertical: 'center',
                        horizontal: 'left',
                    }}
                    disableRestoreFocus
                    slotProps={{
                        paper: {
                            sx: {
                                minWidth: 220,
                                ml: 1,
                                boxShadow: theme.shadows[8],
                                borderRadius: 2,
                                overflow: 'hidden',
                            },
                        },
                    }}
                >
                    <Paper elevation={0}>
                        <Typography
                            variant="subtitle2"
                            sx={{
                                px: 2,
                                py: 1.25,
                                color: 'text.secondary',
                                borderBottom: `1px solid ${theme.palette.divider}`,
                                fontWeight: 600,
                            }}
                        >
                            {item.title}
                        </Typography>

                        <MenuList sx={{ py: 0.75 }}>
                            {children.map((child) => {
                                const childIsActive = isItemActive ? isItemActive(child) : false;

                                return (
                                    <MenuItem
                                        key={child.id}
                                        component={Link}
                                        to={child.path!}
                                        onClick={handleCompactChildClick}
                                        sx={{
                                            mx: 0.75,
                                            my: 0.25,
                                            borderRadius: 1.5,
                                            color: childIsActive ? 'primary.main' : 'text.primary',
                                            fontWeight: childIsActive ? 600 : 400,
                                            backgroundColor: childIsActive
                                                ? alpha(theme.palette.primary.main, 0.08)
                                                : 'transparent',
                                            '&:hover': {
                                                backgroundColor: childIsActive
                                                    ? alpha(theme.palette.primary.main, 0.12)
                                                    : theme.palette.action.hover,
                                            },
                                        }}
                                    >
                                        <Typography variant="body2">
                                            {child.title}
                                        </Typography>
                                    </MenuItem>
                                );
                            })}
                        </MenuList>
                    </Paper>
                </Popover>
            )}
        </>
    );
}
