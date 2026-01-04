import {
    Box,
    Drawer,
    Stack,
    Typography,
    IconButton,
    styled,
} from '@mui/material';
import { useMemo } from 'react';

import NavigationGroupComponent from './navigation-group';
import { useNavigation } from './use-navigation';
import { Icon } from '../../../components/icons/icon';
import { IconEnum } from '../../../components/icons/icons';
import { Logo } from '../../../components/logo';
import { useSettingsContext } from '../../../contexts/settings-provider';
import { useResponsive } from '../../../hook/use-responsive';
import { NAV } from '../../config';


interface NavigationProps {
    openNav?: boolean;
    onCloseNav?: () => void;
}

const StyledDrawer = styled(Drawer)(({ theme }) => ({
    '& .MuiDrawer-paper': {
        width: NAV.W_VERTICAL,
        borderRight: `dashed 1px ${theme.palette.divider}`,
        backgroundColor: theme.palette.background.default,
    },
}));

const StyledMiniDrawer = styled(Drawer)(({ theme }) => ({
    '& .MuiDrawer-paper': {
        width: NAV.W_MINI,
        borderRight: `dashed 1px ${theme.palette.divider}`,
        backgroundColor: theme.palette.background.default,
    },
}));

const ToggleButton = styled(IconButton)(({ theme }) => ({
    position: 'fixed',
    top: 20,
    left: NAV.W_VERTICAL - 12,
    zIndex: theme.zIndex.drawer + 1,
    width: 24,
    height: 24,
    padding: 0,
    border: `dashed 1px ${theme.palette.divider}`,
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[2],
    '&:hover': {
        backgroundColor: theme.palette.background.default,
        boxShadow: theme.shadows[4],
    },
}));

const MiniToggleButton = styled(IconButton)(({ theme }) => ({
    position: 'fixed',
    top: 20,
    left: NAV.W_MINI - 12,
    zIndex: theme.zIndex.drawer + 1,
    width: 24,
    height: 24,
    padding: 0,
    border: `dashed 1px ${theme.palette.divider}`,
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[2],
    '&:hover': {
        backgroundColor: theme.palette.background.default,
        boxShadow: theme.shadows[4],
    },
}));

import { config } from '@libs/react-shared';

const version = config.version;

export default function Navigation({ openNav = false, onCloseNav }: NavigationProps) {
    const { navigation, isItemActive } = useNavigation();
    const { navLayout, onUpdate } = useSettingsContext();
    const isDesktop = useResponsive('up', 'md');
    const isLaptopSize = useResponsive('between', 'md', 'lg');

    const isCompactMode = useMemo(
        () => navLayout === 'mini' && isDesktop,
        [navLayout, isDesktop],
    );

    const handleToggleNav = () => {
        onUpdate('navLayout', navLayout === 'vertical' ? 'mini' : 'vertical');
    };

    const renderContent = (
        <>
            <Logo
                small={isCompactMode}
                disabledLink
                sx={{
                    my: 2,
                    display: 'block',
                    mx: 'auto',
                    ...(isCompactMode && {
                        width: 50,
                    }),
                }}
            />

            <Stack
                sx={{
                    flex: 1,
                    flexShrink: 0,
                    overflow: 'auto',
                    '&::-webkit-scrollbar': {
                        display: 'none',
                    },
                }}
            >
                {navigation.map((group) => (
                    <NavigationGroupComponent
                        key={group.label}
                        group={group}
                        isItemActive={isItemActive}
                        isCompact={isCompactMode}
                        onClose={onCloseNav}
                    />
                ))}
            </Stack>


            {!isCompactMode && (
                <Box
                    sx={{
                        py: 2,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                >
                    <Typography variant="caption" color="text.secondary">
                        Version {version}
                    </Typography>
                </Box>
            )}
        </>
    );

    if (isCompactMode) {
        return (
            <>
                <StyledMiniDrawer
                    variant="permanent"
                    open={true}
                >
                    {renderContent}
                </StyledMiniDrawer>
                {isDesktop && (
                    <MiniToggleButton onClick={handleToggleNav}>
                        <Icon icon={IconEnum.ChevronRight} size="x-small" />
                    </MiniToggleButton>
                )}
            </>
        );
    }

    return (
        <>
            <StyledDrawer
                open={openNav}
                onClose={onCloseNav}
                variant={isDesktop ? 'permanent' : 'temporary'}
                ModalProps={{
                    keepMounted: true,
                }}
            >
                {renderContent}
            </StyledDrawer>
            {isDesktop && (
                <ToggleButton onClick={handleToggleNav}>
                    <Icon icon={IconEnum.ChevronLeft} size="x-small" />
                </ToggleButton>
            )}
        </>
    );
}
