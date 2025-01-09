import { Logo } from '@admin/app/components';
import Scrollbar from '@admin/app/components/scrollbar/scrollbar';
import { useResponsive } from '@libs/react-core';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import Stack from '@mui/material/Stack';
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

import { useNavData } from './nav-config';
import NavbarGroup from './navbar-group';
import NavbarToggleButton from './navbar-toggle-button';
import { NavbarConfigProps } from '../../../types/navigation';
import { NAV } from '../../config';


export const navVerticalConfig = (config?: NavbarConfigProps) => ({
    itemGap: config?.itemGap || 4,
    iconSize: config?.iconSize || 24,
    currentRole: config?.currentRole,
    itemRootHeight: config?.itemRootHeight || 44,
    itemSubHeight: config?.itemSubHeight || 36,
    itemPadding: config?.itemPadding || '4px 8px 4px 12px',
    itemRadius: config?.itemRadius || 8,
    hiddenLabel: config?.hiddenLabel || false
});

interface NavbarProps {
    openNav: boolean;
    onCloseNav: () => void;
}

;

export default function Navbar({ openNav, onCloseNav }: NavbarProps) {
    const { pathname } = useLocation();
    const lgUp = useResponsive('up', 'lg');
    const navData = useNavData();

    useEffect(() => {
        if (openNav) {
            onCloseNav();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [pathname]);

    const renderContent = (
        <Scrollbar
            sx={{
                height: 1,
                '& .simplebar-content': {
                    height: 1,
                    display: 'flex',
                    flexDirection: 'column'
                }
            }}
        >
            <>
                <Logo
                    sx={{
                        width: 180,
                        height: 48,
                        my: 2,
                        mx: 'auto'
                    }}
                />
                <Stack>
                    {navData.map((group, index) => (
                        <NavbarGroup
                            key={group.subheader || index}
                            subheader={group.subheader}
                            items={group.items}
                            config={navVerticalConfig({})}
                        />
                    ))}
                    <Box sx={{ flexGrow: 1 }} />
                </Stack>
            </>
        </Scrollbar>
    );

    return (
        <Box
            component="nav"
            sx={{
                flexShrink: { lg: 0 },
                width: { lg: NAV.W_VERTICAL }
            }}
        >
            {lgUp ? (<>
                <NavbarToggleButton />
                <Stack
                    sx={{
                        height: 1,
                        position: 'fixed',
                        width: NAV.W_VERTICAL,
                        borderRight: (theme) => `dashed 1px ${theme.palette.divider}`
                    }}
                >
                    {renderContent}
                </Stack>
            </>
            ) : (
                <Drawer
                    open={openNav}
                    onClose={onCloseNav}
                    PaperProps={{
                        sx: {
                            width: NAV.W_VERTICAL,
                        }
                    }}
                >
                    {renderContent}
                </Drawer>
            )}
        </Box>
    );
}
