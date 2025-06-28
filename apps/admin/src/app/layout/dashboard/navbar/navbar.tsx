/* eslint-disable @nx/enforce-module-boundaries */
import { Skeleton } from '@mui/material';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { chain, range } from 'lodash';
import { useMemo } from 'react';

import { useNavData } from './nav-config';
import NavbarGroup from './navbar-group';
import NavbarToggleButton from './navbar-toggle-button';
import packageJson from '../../../../../../../package.json';
import { Logo } from '../../../components/logo';
import { useAccess, useAuth } from '../../../contexts';
import { useResponsive } from '../../../hook/use-responsive';
import { NAV } from '../../config';


export const navVerticalConfig = (config?: any) => ({
    itemGap: config?.itemGap || 4,
    iconSize: config?.iconSize || 18,
    currentRole: config?.currentRole,
    itemRootHeight: config?.itemRootHeight || 44,
    itemSubHeight: config?.itemSubHeight || 36,
    itemPadding: config?.itemPadding || '4px 8px 4px 12px',
    itemRadius: config?.itemRadius || 8,
    hiddenLabel: config?.hiddenLabel || false,

});

interface NavbarProps {
    openNav: boolean;
    onCloseNav: () => void;
}


const version = process.env.NX_PUBLIC_REACT_APP_VERSION || packageJson.version || '0.0.0';

export default function Navbar({ openNav, onCloseNav }: NavbarProps) {
    const lgUp = useResponsive('up', 'md');
    const navData = useNavData();
    const { currentUser } = useAuth();
    const { hasAnyPermission, hasAnyRole } = useAccess();


    const isItemVisible = useMemo(() => {
        return (item: any) => {
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
    }, [navData, isItemVisible]);

    if (!currentUser?.id) {
        return (
            <Box
                component="nav"
                sx={{
                    flexShrink: { lg: 0 },
                    width: { lg: NAV.W_VERTICAL },
                    backgroundColor: (theme) => theme.palette.background.paper,
                }}
            >
                <Stack
                    spacing={3}
                    sx={{
                        p: 2,
                        overflow: 'auto',
                        '&::-webkit-scrollbar': {
                            display: 'none',
                        },
                    }}
                >
                    {range(10).map((index) => (
                        <Skeleton
                            key={`navbar-skeleton-${index}`}
                            variant="rounded"
                            sx={{
                                maxWidth: NAV.W_VERTICAL,
                                width: '100%',
                            }}
                            height={50}
                        />
                    ))}
                </Stack>
            </Box>
        );
    }

    const renderContent = (
        <>
            <Logo
                disabledLink
                sx={{
                    my: 2,
                    display: 'block',
                    mx: 'auto',
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
                        subheader={group.items?.length > 0 && group.subheader}
                        items={group.items}
                        config={navVerticalConfig({})}
                        onCloseNav={onCloseNav}
                    />
                ))}
            </Stack>
            <Box
                sx={{
                    flexGrow: 1,
                    py: 2,
                }}
            />
            <Box
                py={3}
                display="flex"
                alignItems="center"
                justifyContent="center"
            >
                <Typography color="textSecondary">
                    Version
                    {' '}
                    {version}
                </Typography>
            </Box>
        </>
    );

    return (
        <Box
            component="nav"
            sx={{
                flexShrink: { lg: 0 },
                width: { lg: NAV.W_VERTICAL },
                backgroundColor: (theme) => theme.palette.background.paper,
            }}
        >
            {lgUp ? (
                <>
                    <NavbarToggleButton />
                    <Stack
                        sx={{
                            height: 1,
                            position: 'fixed',
                            width: NAV.W_VERTICAL,
                            borderRight: (theme) => `dashed 1px ${theme.palette.divider}`,
                        }}
                    >
                        {renderContent}
                    </Stack>
                </>
            ) : (
                <Drawer
                    open={openNav}
                    onClose={onCloseNav}
                    slotProps={{
                        paper: {
                            sx: {
                                width: NAV.W_VERTICAL,
                            },
                        },
                    }}
                >
                    {renderContent}
                </Drawer>
            )}
        </Box>
    );
}
