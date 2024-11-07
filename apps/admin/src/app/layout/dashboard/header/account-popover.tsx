import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { alpha } from '@mui/material/styles';
import { Box, Divider, Typography, Stack, MenuItem, IconButton, Avatar, Button } from '@mui/material';
import { PATH_DASHBOARD, PATH_AUTH } from '../../../routes/paths';
import { MenuDropdown, useAccess, useAuth } from '@mlm/react-core';
import { startCase } from 'lodash';



export default function AccountPopover() {
  const { hasAnyRole, hasAnyPermission } = useAccess();

  const OPTIONS = [
    {
      label: 'Home',
      linkTo: '/',
    },

    {
      label: 'Profile',
      linkTo: PATH_DASHBOARD.root,
    },

  ];
  const navigate = useNavigate();
  const { user, logout } = useAuth();

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
            alt={user?.name}
            // src={user?.photoUrl || '/image/default-user.png'}
            sx={{
              width: { xs: 48, sm: 48 },
              height: { xs: 48, sm: 48 },
            }}
          />
          <Typography
            ml={1}
            variant="subtitle1"
            noWrap
            fontWeight={500}
            display={{ xs: 'none', sm: 'block' }}
          >
            {startCase(user?.name)}
          </Typography>
        </Button>
      )}
    >
      {({ }) => (
        <Box sx={{ minWidth: 200 }}>
          <Box sx={{ my: 1.5, px: 2.5 }}>
            <Typography variant="subtitle2" noWrap>
              {startCase(user?.name)}
            </Typography>

            <Typography variant="body2" sx={{ color: 'text.secondary' }} noWrap>
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

          <MenuItem onClick={handleLogout} sx={{ m: 1 }}>
            Logout
          </MenuItem>
        </Box>
      )}
    </MenuDropdown>
  );
}
