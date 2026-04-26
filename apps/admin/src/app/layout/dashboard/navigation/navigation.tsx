import {
    Avatar,
    Box,
    Drawer,
    Stack,
    Typography,
    styled,
} from '@mui/material';

import NavigationGroupComponent from './navigation-group';
import { useNavigation } from './use-navigation';

import { config } from '@libs/react-shared';
import { useAuth } from '@libs/react-shared';
import { NAV } from '../../config';
import { useResponsive } from '@admin/app/hook';
import { useSettingsContext } from '@admin/app/contexts';

const version = config.version;

interface NavigationProps {
    openNav?: boolean;
    onCloseNav?: () => void;
}

const StyledDrawer = styled(Drawer)(({ theme }) => ({
    '& .MuiDrawer-paper': {
        width: NAV.W_VERTICAL,
        backgroundColor: theme.palette.background.paper,
        borderRight: `1px solid ${theme.palette.divider}`,
        overflowX: 'hidden',
    },
}));

const StyledMiniDrawer = styled(Drawer)(({ theme }) => ({
    '& .MuiDrawer-paper': {
        width: NAV.W_MINI,
        backgroundColor: theme.palette.background.paper,
        borderRight: `1px solid ${theme.palette.divider}`,
        overflowX: 'hidden',
    },
}));

export default function Navigation({
    openNav = false,
    onCloseNav,
}: NavigationProps) {
    const { navigation, isItemActive } = useNavigation();
    const { navLayout } = useSettingsContext();
    const isDesktop = useResponsive('up', 'md');
    const { currentUser } = useAuth();

    const isCompactMode = navLayout === 'mini' && isDesktop;

    const content = (
        <Stack
            sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
            }}
        >
            <Stack
                sx={{
                    flex: 1,
                    minHeight: 0,
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
                <>
                    <Box
                        sx={{
                            p: 2,
                            borderTop: 1,
                            borderColor: 'divider',
                        }}
                    >
                        <Stack direction="row" alignItems="center" spacing={1.5}>
                            <Avatar
                                sx={{
                                    width: 36,
                                    height: 36,
                                    bgcolor: 'grey.200',
                                    color: 'text.secondary',
                                    fontSize: 14,
                                    fontWeight: 600,
                                }}
                            >
                                {currentUser?.name?.charAt(0)?.toUpperCase() || 'U'}
                            </Avatar>

                            <Box sx={{ minWidth: 0, flex: 1 }}>
                                <Typography
                                    variant="body2"
                                    noWrap
                                    sx={{
                                        color: 'text.primary',
                                        fontWeight: 600,
                                        fontSize: '0.82rem',
                                    }}
                                >
                                    {currentUser?.name || 'User'}
                                </Typography>
                                <Typography
                                    variant="caption"
                                    noWrap
                                    sx={{
                                        color: 'text.secondary',
                                        fontSize: '0.7rem',
                                    }}
                                >
                                    Portal
                                </Typography>
                            </Box>
                        </Stack>
                    </Box>

                    <Box
                        sx={{
                            pb: 1.5,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}
                    >
                        <Typography
                            variant="caption"
                            sx={{
                                color: 'text.disabled',
                                fontSize: '0.65rem',
                            }}
                        >
                            v{version}
                        </Typography>
                    </Box>
                </>
            )}
        </Stack>
    );

    if (isCompactMode) {
        return (
            <StyledMiniDrawer variant="permanent" open>
                {content}
            </StyledMiniDrawer>
        );
    }

    return (
        <StyledDrawer
            open={openNav}
            onClose={onCloseNav}
            variant={isDesktop ? 'permanent' : 'temporary'}
            ModalProps={{ keepMounted: true }}
        >
            {content}
        </StyledDrawer>
    );
}
