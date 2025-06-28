// @mui
import { Skeleton } from '@mui/material';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import { chain, range } from 'lodash';
import { useMemo } from 'react';

import { useNavData } from './nav-config';
import NavbarGroup from './navbar-group';
import NavbarToggleButton from './navbar-toggle-button';
import { Logo } from '../../../components/logo';
import { useAccess, useAuth } from '../../../contexts';
import { useResponsive } from '../../../hook';
import { NavbarConfigProps, NavigationItem } from './navbar-group';
import { NAV } from '../../config';


export const hideScroll = {
    x: {
        msOverflowStyle: 'none',
        scrollbarWidth: 'none',
        overflowX: 'scroll',
        '&::-webkit-scrollbar': {
            display: 'none',
        },
    },
    y: {
        msOverflowStyle: 'none',
        scrollbarWidth: 'none',
        overflowY: 'scroll',
        '&::-webkit-scrollbar': {
            display: 'none',
        },
    },
} as const;

export const navMiniConfig = (config?: NavbarConfigProps) => ({
    itemGap: config?.itemGap || 8,
    iconSize: config?.iconSize || 16,
    itemRootHeight: config?.itemRootHeight || 56,
    itemSubHeight: config?.itemSubHeight || 34,
    itemPadding: config?.itemPadding || '6px 0 0 0',
    itemRadius: config?.itemRadius || 6,
    hiddenLabel: config?.hiddenLabel || false,
});

export default function NavbarMini() {
    const navData = useNavData();
    const { currentUser } = useAuth();
    const isLaptopSize = useResponsive('between', 'md', 'lg');
    const { hasAnyPermission, hasAnyRole } = useAccess();

    const isItemVisible = useMemo(() => {
        return (item: NavigationItem) => {
            if (item.permissions?.length > 0 || item.roles?.length > 0) {
                return hasAnyPermission(item.permissions) || hasAnyRole(item.roles);
            }
            return true;
        };
    }, [hasAnyPermission, hasAnyRole]);

    const filteredSidebarConfig = useMemo(() => {
        return navData.map((group) => {
            const filteredItems = chain(group.items)
                .map((item) => {
                    if (!isItemVisible(item)) {
                        return null;
                    }

                    if (item.children) {
                        return null;
                    }
                    return {
                        ...item,
                        children: undefined,
                    };
                })
                .filter(Boolean)
                .value();
            return filteredItems.length > 0
                ? {
                    ...group,
                    items: filteredItems,
                }
                : null;
        }).filter(Boolean);
    }, [
        navData,
        isItemVisible,
    ]);

    if (!currentUser?.id) {
        return (
            <Box
                component="nav"
                sx={{
                    flexShrink: { md: 0 },
                    width: { md: NAV.W_MINI },
                }}
            >
                <Stack
                    spacing={3}
                    p={1.5}
                >
                    {range(10).map((index) => (
                        <Skeleton
                            variant="rounded"
                            sx={{
                                maxWidth: NAV.W_MINI,
                                width: '100%',
                                height: 50,
                            }}
                            key={`navbar-mini-skeleton-${index}`}
                        />
                    ))}
                </Stack>
            </Box>
        );
    }

    return (
        <Box
            component="nav"
            sx={{
                flexShrink: { md: 0 },
                width: { md: NAV.W_MINI },
            }}
        >
            {!isLaptopSize ? (
                <NavbarToggleButton
                    sx={{
                        left: NAV.W_MINI - 12,
                    }}
                />
            ) : null}


            <Stack
                sx={{
                    pb: 2,
                    height: 1,
                    position: 'fixed',
                    width: NAV.W_MINI,
                    borderRight: (theme) => `dashed 1px ${theme.palette.divider}`,
                    ...hideScroll.x,
                }}
            >
                <Logo
                    small
                    sx={{
                        mx: 'auto',
                        width: 50,
                        my: 2,
                    }}
                />

                <Stack
                    sx={{
                        overflow: 'auto',
                        '&::-webkit-scrollbar': {
                            display: 'none',
                        },
                    }}
                >
                    {filteredSidebarConfig.map((group, index) => (
                        <NavbarGroup
                            key={group.subheader || index}
                            items={group.items}
                            config={navMiniConfig(navMiniConfig())}
                            isMini
                        />
                    ))}
                </Stack>
            </Stack>
        </Box>
    );
}
