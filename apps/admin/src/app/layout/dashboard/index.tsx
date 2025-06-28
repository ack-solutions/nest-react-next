import { Box } from '@mui/material';
import { useEffect, useMemo, useState } from 'react';
import { Outlet } from 'react-router-dom';

import { useResponsive } from '../../hook/use-responsive';
import { HEADER, NAV, SPACING } from '../config';
import Header from './header';
import Navbar from './navbar/navbar';
import NavbarMini from './navbar/navbar-mini';
import { useSettingsContext } from '../../contexts/settings-provider';


export default function DashboardLayout() {
    const { navLayout, onUpdate } = useSettingsContext();
    const isDesktop = useResponsive('up', 'md');
    const isLaptopSize = useResponsive('between', 'md', 'lg');
    const [open, setOpen] = useState(false);

    const isNavMini = useMemo(
        () => navLayout === 'mini' && isDesktop,
        [isDesktop, navLayout],
    );


    const handleOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    useEffect(() => {
        if (isLaptopSize && navLayout !== 'mini') {
            onUpdate('navLayout', 'mini');
        }
    }, [
        isLaptopSize,
        isDesktop,
        navLayout,
        onUpdate,
    ]);

    return (
        <>
            <Header onOpenNav={handleOpen} />
            <Box
                sx={{
                    display: { md: 'flex' },
                    minHeight: 1,
                }}
            >
                {isNavMini ? (
                    <NavbarMini />
                ) : (
                    <Navbar
                        openNav={open}
                        onCloseNav={handleClose}
                    />
                )}

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
                        px: 2,
                        backgroundColor: (theme) => theme.palette.background.default,
                        ...(isDesktop && {
                            pt: `${HEADER.H_DESKTOP + SPACING}px`,
                            width: `calc(100% - ${NAV.W_VERTICAL}px)`,

                        }),
                        ...(isNavMini && {
                            width: `calc(100% - ${NAV.W_MINI}px)`,
                        }),
                    }}
                >
                    <Outlet />
                </Box>
            </Box>
        </>
    );
}
