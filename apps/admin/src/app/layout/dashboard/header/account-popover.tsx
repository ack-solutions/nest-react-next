import {
    Box,
    Divider,
    Typography,
    Stack,
    MenuItem,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

import { MenuDropdown } from '../../../components/menu-dropdown/menu-drop-down';
import UserWithAvatar from '../../../components/user/user-with-avatar';
import { useAuth } from '@libs/react-shared';
import { useResponsive } from '../../../hook';
import { PATH_DASHBOARD, PATH_AUTH } from '../../../routes/paths';


export default function AccountPopover() {
    const isMobile = useResponsive('down', 'sm');
    const OPTIONS = [
        {
            label: 'Home',
            linkTo: '/',
        },

        {
            label: 'Profile',
            linkTo: PATH_DASHBOARD.profile.root,
        },
    ];
    const navigate = useNavigate();
    const { currentUser, logout, authUser } = useAuth();

    const handleLogout = async () => {
        try {
            await logout();
            navigate(PATH_AUTH.login, { replace: true });
        } catch (error) {
            console.error(error);
        }
    };

    const handleClickItem = (path: string) => {
        navigate(path);
    };

    return (
        <MenuDropdown
            anchor={(
                <Box sx={{ cursor: 'pointer' }}>
                    <UserWithAvatar
                        user={currentUser}
                        hideName={isMobile}
                    />
                </Box>
            )}
        >
            {({ handleClose }) => (
                <Box sx={{ minWidth: 200 }}>
                    <Box
                        sx={{
                            my: 1.5,
                            px: 2.5,
                        }}
                    >
                        <Typography
                            variant="subtitle2"
                            noWrap
                        >
                            {currentUser?.name}
                        </Typography>

                        <Typography
                            variant="body2"
                            sx={{ color: 'text.secondary' }}
                            noWrap
                        >
                            {authUser?.email}
                        </Typography>
                    </Box>

                    <Divider sx={{ borderStyle: 'dashed' }} />

                    <Stack sx={{ p: 1 }}>
                        {OPTIONS.map((option) => (
                            <MenuItem
                                key={option.label}
                                onClick={() => {
                                    handleClose();
                                    handleClickItem(option.linkTo);
                                }}
                            >
                                {option.label}
                            </MenuItem>
                        ))}
                    </Stack>

                    <Divider sx={{ borderStyle: 'dashed' }} />

                    <MenuItem
                        onClick={handleLogout}
                        sx={{ m: 1 }}
                    >
                        Logout
                    </MenuItem>
                </Box>
            )}
        </MenuDropdown>
    );
}
