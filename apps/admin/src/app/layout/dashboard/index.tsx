import { Box } from '@mui/material';
import { useEffect, useMemo, useState } from 'react';
import { Outlet } from 'react-router-dom';

import { useResponsive } from '../../hook/use-responsive';
import { HEADER, NAV, SPACING } from '../config';
import Header from './header';
import { Navigation } from './navigation';
import { useSettingsContext } from '../../contexts/settings-provider';
import { SettingsDrawer } from '../../theme/settings';


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
                    display: { md: 'flex', flexDirection: 'column' },
                    minHeight: 1,
                }}
            >
                <Navigation
                    openNav={open}
                    onCloseNav={handleClose}
                />

                <Box
                    component="main"
                    sx={{
                        flexGrow: 1,
                        minHeight: 1,
                        display: 'flex',
                        flexDirection: 'column',
                        pt: `${HEADER.H_MOBILE + SPACING}px`,
                        pb: 2,
                        px: 2,
                        backgroundColor: (theme) => theme.palette.background.default,
                        ...(isDesktop && {
                            pt: `${HEADER.H_DESKTOP + SPACING}px`,
                            ml: isNavMini ? `${NAV.W_MINI}px` : `${NAV.W_VERTICAL}px`,
                        }),
                    }}
                >
                    <Outlet />
                </Box>
            </Box>

            <SettingsDrawer />
        </>
    );
}
