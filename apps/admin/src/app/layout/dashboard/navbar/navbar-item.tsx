import {
    Link,
    Box,
    ListItemButtonProps,
    alpha,
    ListItemButton,
    ListItemIcon,
    styled,
} from '@mui/material';
import ListItemText from '@mui/material/ListItemText';
import Tooltip from '@mui/material/Tooltip';
import { forwardRef, useMemo } from 'react';
import { NavLink as RouterLink } from 'react-router-dom';

import { Icon } from '../../../components';
import { IconEnum } from '../../../components/icons/icons';
import useAccess from '../../../contexts/react-access-control/use-access';
import { NavbarConfigProps, NavigationItem } from './navbar-group';


export interface NavbarItemProps extends ListItemButtonProps {
    item: NavigationItem;
    depth: number;
    isMini?: boolean;
    open?: boolean;
    active: boolean;
    externalLink?: boolean;
    permissions?: string[];
    roles?: string[];
    config?: NavbarConfigProps;
}

export const StyledNavItem = styled(ListItemButton, {
    shouldForwardProp: (prop) => prop !== 'active' && prop !== 'isMini',
})<Omit<NavbarItemProps, 'item'>>(
    ({ active, depth, config, theme, isMini, open }) => {
        const subItem = depth !== 1;
        const deepSubItem = depth > 2;
        const activeStyles = {
            root: {
                color:
                    theme.palette.mode === 'light' ?
                        theme.palette.primary.main :
                        theme.palette.primary.light,
                backgroundColor: alpha(theme.palette.primary.main, 0.08),
                '&:hover': {
                    backgroundColor: alpha(theme.palette.primary.main, 0.16),
                },
            },
            sub: {
                color: theme.palette.text.primary,
                backgroundColor: isMini ?
                    theme.palette.action.selected :
                    'transparent',
                '&:hover': {
                    backgroundColor: theme.palette.action.hover,
                },
            },
        };
        return {
            // Root item
            padding: config?.itemPadding,
            marginBottom: config?.itemGap,
            borderRadius: config?.itemRadius,
            minHeight: config?.itemRootHeight,
            color: theme.palette.text.secondary,
            position: 'relative',
            // Active root item
            ...(active && {
                ...activeStyles.root,
            }),

            // Sub item
            ...(subItem && {
                minHeight: config?.itemSubHeight,
                // Active sub item
                ...(active && {
                    ...activeStyles.sub,
                }),
            }),

            // Deep sub item
            ...(deepSubItem && {
                paddingLeft: theme.spacing(depth),
            }),

            ...(isMini && {
                flexDirection: 'column',
                justifyContent: 'center',
                margin: `0 ${config?.itemGap}px ${config?.itemGap}px ${config?.itemGap}px`,
                ...(config?.hiddenLabel &&
                    !subItem && {
                    padding: config?.itemPadding,
                }),
                ...(subItem && {
                    margin: 0,
                    flexDirection: 'row',
                    padding: theme.spacing(0, 1),
                }),

                ...(open &&
                    !active && {
                    color: theme.palette.text.primary,
                    backgroundColor: theme.palette.action.hover,
                }),
            }),
        };
    },
);

export const StyledIcon = styled(ListItemIcon)<{ size?: number }>(
    ({ size }) => ({
        width: size,
        height: size,
        color: 'inherit',
        alignItems: 'center',
        justifyContent: 'center',
    }),

);

export const StyledDotIcon = styled('span')<{ active?: boolean }>(
    ({ active, theme }) => ({
        width: 4,
        height: 4,
        borderRadius: '50%',
        backgroundColor: theme.palette.text.disabled,
        transition: theme.transitions.create(['transform'], {
            duration: theme.transitions.duration.shorter,
        }),
        ...(active && {
            transform: 'scale(2)',
            backgroundColor: theme.palette.primary.main,
        }),
    }),
);

const NavbarItem = forwardRef(
    (
        {
            item,
            open,
            depth,
            active,
            config,
            externalLink,
            isMini,
            ...other
        }: NavbarItemProps,
        ref?: any,
    ) => {
        const { hasAnyPermission, hasAnyRole } = useAccess();

        const hasPermissionAccess = useMemo(() => {
            return item?.permissions?.length > 0 ? hasAnyPermission(item.permissions) : true;
        }, [item?.permissions, hasAnyPermission]);
        const hasRoleAccess = useMemo(() => {
            return item?.roles?.length > 0 ? hasAnyRole(item.roles) : true;
        }, [item?.roles, hasAnyRole]);

        const { title, path, icon, info, children, disabled, caption } = item;
        if (!hasPermissionAccess && !hasRoleAccess) {
            return null;
        }
        const subItem = depth !== 1;

        const renderContent = (
            <StyledNavItem
                ref={ref}
                disableGutters
                disabled={disabled}
                active={active}
                depth={depth}
                config={config}
                isMini={isMini}
                open={open}
                {...other}
            >
                {icon ? (
                    <StyledIcon
                        size={config?.iconSize}
                        sx={{
                            marginRight: isMini ? 0 : 2,
                        }}
                    >
                        {icon}
                    </StyledIcon>
                ) : null}


                {!(config?.hiddenLabel && !subItem) && (
                    <ListItemText
                        primary={title}
                        secondary={
                            caption ? (
                                <Tooltip
                                    title={caption}
                                    placement="top-start"
                                >
                                    <span>{caption}</span>
                                </Tooltip>
                            ) : null
                        }
                        {...(isMini ?
                            {
                                sx: {
                                    width: 1,
                                    flex: 'unset',
                                    ...(!subItem && {
                                        px: 0.5,
                                        mt: 0.5,
                                    }),
                                },
                            } :
                            {})}
                        slotProps={{
                            primary: {
                                noWrap: true,
                                typography: 'body2',
                                textTransform: 'capitalize',
                                fontWeight: active ? 600 : 500,
                                ...(isMini ?
                                    {
                                        fontSize: '10px !important',
                                        lineHeight: '16px',
                                        textAlign: 'center',
                                        ...(subItem && {
                                            textAlign: 'unset',
                                            typography: 'caption',
                                        }),
                                    } :
                                    {}),
                            },
                            secondary: {
                                noWrap: true,
                                component: 'span',
                                typography: 'caption',
                                color: 'text.disabled',
                            },
                        }}
                    />
                )}

                {info ? (
                    <Box
                        component="span"
                        sx={{
                            ml: 1,
                            lineHeight: 0,
                        }}
                    >
                        {info}
                    </Box>
                ) : null}

                {!!children && !isMini && (
                    <Icon
                        icon={open ? IconEnum.CARET_UP : IconEnum.CARET_RIGHT}
                        size="x-small"
                        sx={{
                            ml: 0,
                            flexShrink: 0,
                        }}
                    />
                )}
                {!!children && isMini ? (
                    <Icon
                        size="x-small"
                        icon={IconEnum.CARET_RIGHT}
                        sx={{
                            right: 0,
                            position: 'absolute',
                            top: '50%',
                            transform: 'translateY(-50%)',
                        }}
                    />
                ) : null}
            </StyledNavItem>
        );

        // External link
        if (externalLink) {
            return (
                <Link
                    href={path}
                    target="_blank"
                    rel="noopener"
                    underline="none"
                    color="inherit"
                    sx={{
                        ...(disabled && {
                            cursor: 'default',
                        }),
                    }}
                >
                    {renderContent}
                </Link>
            );
        }

        // Has child
        if (children) {
            return renderContent;
        }

        // Default
        return (
            <Link
                component={RouterLink}
                to={path}
                underline="none"
                color="inherit"
                sx={{
                    ...(disabled && {
                        cursor: 'default',
                    }),
                }}
            >
                {renderContent}
            </Link>
        );
    },
);

export default NavbarItem;
