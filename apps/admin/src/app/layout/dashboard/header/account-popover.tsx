import { MenuDropdown, useAuth } from '@libs/react-core';
import { Box, Divider, Typography, Stack, MenuItem, Avatar, Button } from '@mui/material';
import { startCase } from 'lodash';
import { useNavigate } from 'react-router-dom';

import { PATH_DASHBOARD, PATH_AUTH } from '../../../routes/paths';


export default function AccountPopover() {
    const OPTIONS = [
        {
            label: 'Profile',
            linkTo: PATH_DASHBOARD.profile.root,
        },
    ];
    const navigate = useNavigate();
    const { currentUser, logout } = useAuth();

    const handleLogout = async () => {
        try {
            logout();
            navigate(PATH_AUTH.login, { replace: true });
        } catch (error) {
            console.error(error);
            // showToasty('Unable to logout!', 'error');
        }
    };

    const handleClickItem = (path: string) => {
        navigate(path);
    };

    return (
        <MenuDropdown
            anchor={(
                <Button
                    color="primary"
                    disableRipple
                    disableTouchRipple
                    disableElevation
                >
                    <Avatar
                        alt={currentUser?.name}
                        src={currentUser?.avatarUrl}
                        sx={{
                            width: {
                                xs: 48,
                                sm: 48,
                            },
                            height: {
                                xs: 48,
                                sm: 48,
                            },
                        }}
                    />
                    <Typography
                        ml={1}
                        variant="subtitle1"
                        noWrap
                        fontWeight={500}
                        display={{
                            xs: 'none',
                            sm: 'block',
                        }}
                    >
                        {startCase(currentUser?.name)}
                    </Typography>
                </Button>
            )}
        >
            {() => (
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
                            {startCase(currentUser?.name)}
                        </Typography>

                        <Typography
                            variant="body2"
                            sx={{ color: 'text.secondary' }}
                            noWrap
                        >
                            {/* {user?.email} */}
                        </Typography>
                    </Box>

                    <Divider sx={{ borderStyle: 'dashed' }} />

                    <Stack sx={{ p: 1 }}>
                        {OPTIONS.map((option) => (
                            <MenuItem
                                key={option.label}
                                onClick={() => handleClickItem(option.linkTo)}
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
