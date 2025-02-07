import { useResponsive, useSettingsContext } from '@libs/react-core';
import { Box } from '@mui/material';
import { useMemo, useState } from 'react';
import { Outlet } from 'react-router-dom';

import { HEADER, NAV } from '../config';
import Header from './header';
import Navbar from './navbar/navbar';
import NavbarMini from './navbar/navbar-mini';


const SPACING = 8;

export default function DashboardLayout() {
    const { navLayout } = useSettingsContext();
    const isDesktop = useResponsive('up', 'lg');
    const [open, setOpen] = useState(false);

    const isNavMini = useMemo(() => (navLayout === 'mini' && isDesktop), [isDesktop, navLayout]);

    const handleOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    return (
        <>
            <Header onOpenNav={handleOpen} />
            <Box
                sx={{
                    display: { lg: 'flex' },
                    minHeight: { lg: 1 },
                }}
            >
                {isNavMini ? <NavbarMini /> : <Navbar
                    openNav={open}
                    onCloseNav={handleClose}
                />}
                <Box
                    component="main"
                    sx={{
                        flexGrow: 1,
                        minHeight: 1,
                        display: 'flex',
                        flexDirection: 'column',
                        alignSelf: 'stretch',
                        pt: `${HEADER.H_MOBILE + SPACING}px`,
                        pb: 2,
                        ...(isDesktop && {
                            px: 2,
                            pt: `${HEADER.H_DESKTOP + SPACING}px`,
                            pb: 2,
                            width: `calc(100% - ${NAV.W_VERTICAL}px)`,
                            ...(isNavMini && {
                                width: `calc(100% - ${NAV.W_MINI}px)`,
                            }),
                        }),
                    }}
                >
                    <Outlet />
                </Box>
            </Box>
        </>
    );
}
