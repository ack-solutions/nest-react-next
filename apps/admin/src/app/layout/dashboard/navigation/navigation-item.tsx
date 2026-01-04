import {
    ListItemButton,
    ListItemIcon,
    ListItemText,
    styled,
    alpha,
    useTheme,
    Collapse,
    List,
    Popover,
    Paper,
    MenuList,
    MenuItem,
    Typography,
    Box,
} from '@mui/material';
import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';

import { NavigationItem } from './navigation-config';
import { Icon } from '../../../components/icons/icon';
import { IconEnum } from '../../../components/icons/icons';
import { RequirePermission } from '@ackplus/nest-auth-react';


interface NavigationItemProps {
    item: NavigationItem;
    isActive: boolean;
    isCompact?: boolean;
    onClose?: () => void;
    isItemActive?: (item: NavigationItem) => boolean;
    depth?: number;
}

const StyledListItemButton = styled(ListItemButton, {
    shouldForwardProp: (prop) => prop !== 'isActive' && prop !== 'isCompact' && prop !== 'depth',
})<{ isActive: boolean; isCompact: boolean; depth?: number }>(({ theme, isActive, isCompact, depth = 0 }) => {
    const isChild = depth > 0;

    return {
        padding: isCompact ? '6px 0 0 0' : `4px 8px 4px ${12 + (depth * 16)}px`,
        marginBottom: isCompact ? 8 : 4,
        borderRadius: isCompact ? 6 : 8,
        minHeight: isCompact ? 56 : (isChild ? 36 : 44),
        color: theme.palette.text.secondary,
        position: 'relative',
        textDecoration: 'none',

        ...(isCompact && {
            flexDirection: 'column',
            justifyContent: 'center',
            margin: `0 ${8}px ${8}px ${8}px`,
            padding: '8px 4px',
        }),

        // Parent item active state
        ...(isActive && !isChild && {
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

        // Child item active state - clean style with just color and font weight
        ...(isActive && isChild && {
            color: theme.palette.primary.main,
            fontWeight: theme.typography.fontWeightBold,
        }),

        '&:hover': {
            backgroundColor: alpha(theme.palette.text.primary, 0.04),
            ...(isActive && !isChild && {
                backgroundColor: alpha(theme.palette.primary.main, 0.12),
            }),
        },
    };
});

const StyledListItemIcon = styled(ListItemIcon, {
    shouldForwardProp: (prop) => prop !== 'isCompact' && prop !== 'isChild' && prop !== 'isActive',
})<{ isCompact: boolean; isChild?: boolean; isActive?: boolean }>(({ theme, isCompact, isChild, isActive }) => ({
    minWidth: 'auto',
    marginRight: isCompact ? 0 : theme.spacing(2),
    color: 'inherit',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    ...(isChild && {
        marginRight: theme.spacing(1.5),
        minWidth: isActive ? 8 : 6,
        width: isActive ? 8 : 6,
        height: isActive ? 8 : 6,
        borderRadius: '50%',
        backgroundColor: 'currentColor',
        opacity: isActive ? 1 : 0.6,
        display: 'block',
        content: '""',
        transition: theme.transitions.create(['width', 'height', 'opacity'], {
            duration: theme.transitions.duration.shorter,
        }),
    }),
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
            lineHeight: 1.2,
            wordBreak: 'break-word',
            hyphens: 'auto',
        },
    }),
}));

export default function NavigationItemComponent({
    item,
    isActive,
    isCompact = false,
    onClose,
    isItemActive,
    depth = 0,
}: NavigationItemProps) {
    const theme = useTheme();
    const buttonRef = useRef<HTMLDivElement>(null);

    // Auto-expand if any child is active
    const hasActiveChild = item.children?.some(child =>
        isItemActive ? isItemActive({ ...child, icon: undefined, group: item.group }) : false
    );

    const [open, setOpen] = useState(hasActiveChild || false);
    const [popoverOpen, setPopoverOpen] = useState(false);

    // Update open state when active child changes
    useEffect(() => {
        if (hasActiveChild && !isCompact) {
            setOpen(true);
        }
    }, [hasActiveChild, isCompact]);

    const hasChildren = item.children && item.children.length > 0;
    const hasPath = Boolean(item.path);

    const handleClick = () => {
        if (hasChildren) {
            if (isCompact) {
                setPopoverOpen(!popoverOpen);
            } else {
                setOpen(!open);
            }
        } else if (onClose) {
            onClose();
        }
    };

    const handlePopoverClose = () => {
        setPopoverOpen(false);
    };

    const handleChildClick = () => {
        setPopoverOpen(false);
        if (onClose) {
            onClose();
        }
    };

    const isChild = depth > 0;

    const renderContent = () => (
        <Box className="navigation-item-container">
            <StyledListItemButton
                ref={buttonRef}
                isActive={isActive}
                isCompact={isCompact}
                depth={depth}
                onClick={hasChildren ? handleClick : undefined}
            >
                <StyledListItemIcon isCompact={isCompact} isChild={isChild} isActive={isActive}>
                    {isChild ? null : item.icon}
                </StyledListItemIcon>
                <StyledListItemText
                    primary={item.title}
                    isCompact={isCompact}
                    primaryTypographyProps={{
                        variant: 'body2',
                        fontWeight: isActive ? (isChild ? 700 : 600) : 400,
                    }}
                />
                {hasChildren && !isCompact && (
                    <Icon
                        icon={open ? IconEnum.ChevronUp : IconEnum.ChevronDown}
                        size="small"
                        style={{ marginLeft: 'auto' }}
                    />
                )}
            </StyledListItemButton>
        </Box>
    );

    return (
        <>
            {hasPath ? (
                <RequirePermission permission={item.permissions}>
                    <Link
                        to={item.path!}
                        style={{
                            textDecoration: 'none',
                            color: 'inherit',
                        }}
                        onClick={handleClick}
                    >
                        {renderContent()}
                    </Link>
                </RequirePermission>
            ) : (
                renderContent()
            )}

            {hasChildren && !isCompact && (
                <Collapse in={open} timeout="auto" unmountOnExit>
                    <List component="div" disablePadding>
                        {item.children!.map((child) => {
                            const childItem: NavigationItem = {
                                ...child,
                                icon: undefined,
                                group: item.group,
                            };
                            const childIsActive = isItemActive ? isItemActive(childItem) : false;

                            return (
                                <RequirePermission key={child.id} permission={child.permissions}>
                                    <NavigationItemComponent
                                        item={childItem}
                                        isActive={childIsActive}
                                        isCompact={isCompact}
                                        onClose={onClose}
                                        isItemActive={isItemActive}
                                        depth={depth + 1}
                                    />
                                </RequirePermission>
                            );
                        })}
                    </List>
                </Collapse>
            )}

            {/* Popover for compact mode */}
            {hasChildren && isCompact && (
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
                    slotProps={{
                        paper: {
                            sx: {
                                minWidth: 200,
                                ml: 1,
                                boxShadow: theme.shadows[8],
                            },
                        },
                    }}
                >
                    <Paper>
                        <Typography
                            variant="subtitle2"
                            sx={{
                                px: 2,
                                py: 1,
                                color: 'text.secondary',
                                borderBottom: `1px solid ${theme.palette.divider}`,
                                fontWeight: 600,
                            }}
                        >
                            {item.title}
                        </Typography>
                        <MenuList>
                            {item.children!.map((child) => {
                                const childItem: NavigationItem = {
                                    ...child,
                                    icon: undefined,
                                    group: item.group,
                                };
                                const childIsActive = isItemActive ? isItemActive(childItem) : false;

                                return (
                                    <RequirePermission key={child.id} permission={child.permissions}>
                                        <MenuItem
                                            component={Link}
                                            to={child.path!}
                                            onClick={handleChildClick}
                                            sx={{
                                                color: childIsActive ? 'primary.main' : 'text.primary',
                                                fontWeight: childIsActive ? 600 : 400,
                                                backgroundColor: childIsActive ? alpha(theme.palette.primary.main, 0.08) : 'transparent',
                                                '&:hover': {
                                                    backgroundColor: childIsActive
                                                        ? alpha(theme.palette.primary.main, 0.12)
                                                        : alpha(theme.palette.action.hover, 0.04),
                                                },
                                            }}
                                        >
                                            <Typography variant="body2">
                                                {child.title}
                                            </Typography>
                                        </MenuItem>
                                    </RequirePermission>
                                );
                            })}
                        </MenuList>
                    </Paper>
                </Popover>
            )}
        </>
    );
}
