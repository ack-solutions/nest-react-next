import Scrollbar from '@admin/app/components/scrollbar/scrollbar';
import { PATH_DASHBOARD } from '@admin/app/routes/paths';
import {
    EmailTwoTone as EmailTwoToneIcon,
    NotificationsNoneTwoTone as NotificationsNoneTwoToneIcon,
    InboxTwoTone as InboxTwoToneIcon,
} from '@mui/icons-material';
import { alpha, Box, List, ListItemButton, ListItemText, ListSubheader, Stack, useTheme } from '@mui/material';
import ListItemIcon from '@mui/material/ListItemIcon';
import { Fragment } from 'react';
import { matchPath, Outlet, useLocation } from 'react-router-dom';
import { Link } from 'react-router-dom';


const menuSections = [
    {
        id: 'setting',
        title: 'Setting',
        staticPaths: [PATH_DASHBOARD.settings],
        children: [
            {
                icon: <EmailTwoToneIcon />,
                text: 'Email ',
                path: PATH_DASHBOARD.settings.emailSetting,
            },
            {
                icon: <NotificationsNoneTwoToneIcon />,
                text: 'Notification',
                path: PATH_DASHBOARD.settings.notificationSetting,
            },
            {
                icon: <InboxTwoToneIcon />,
                text: "Email Layout",
                path: PATH_DASHBOARD.settings.emailLayout
            },
        ],
    },
];

const SettingPage = () => {
    const { pathname } = useLocation();
    const theme = useTheme();
    return (
        <Box
            sx={{
                display: 'flex',
                minHeight: 1,
            }}
        >
            <Box
                component="nav"
                sx={{
                    flexShrink: 0,
                    width: 280,
                    mr: 2,
                }}
            >
                <Stack
                    sx={{
                        height: 1,
                        position: 'fixed',
                        width: 280,
                        pr: 2,
                        borderRight: (theme) => `dashed 1px ${theme.palette.divider}`,
                    }}
                >
                    <Scrollbar
                        sx={{
                            height: 1,
                            '& .simplebar-content': {
                                height: 1,
                                display: 'flex',
                                flexDirection: 'column',
                            },
                        }}
                    >
                        <Stack>
                            <List
                                component="nav"
                                disablePadding
                            >
                                {menuSections.map((section) => (
                                    <Fragment key={section.title}>
                                        <ListSubheader component="div">{section.title}</ListSubheader>
                                        {section.children.map((item, index) => {
                                            const active = item?.path ? !!matchPath(item?.path, pathname) : false;
                                            return (
                                                <ListItemButton
                                                    key={index}
                                                    component={Link}
                                                    to={item.path}
                                                    sx={{
                                                        borderRadius: 1,
                                                        mb: 1,
                                                        color: active ? theme.palette.primary.main : theme.palette.text.secondary,
                                                        backgroundColor: alpha(theme.palette.primary.main, 0.08),
                                                        '&:hover': {
                                                            backgroundColor: alpha(theme.palette.primary.main, 0.16),
                                                        },
                                                    }}
                                                >
                                                    <ListItemIcon
                                                        sx={{
                                                            minWidth: 36,
                                                            color: (theme) => active ? theme.palette.primary.main : theme.palette.text.secondary,
                                                        }}
                                                    >
                                                        {item.icon}
                                                    </ListItemIcon>
                                                    <ListItemText
                                                        primary={item.text}
                                                        primaryTypographyProps={{
                                                            fontWeight: active ? 600 : 500,
                                                        }}
                                                    />
                                                </ListItemButton>
                                            );
                                        })}
                                    </Fragment>
                                ))}
                            </List>
                            <Box sx={{ flexGrow: 1 }} />
                        </Stack>
                    </Scrollbar>
                </Stack>
            </Box>
            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    minHeight: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    alignSelf: 'stretch',
                }}
            >
                <Outlet />
            </Box>
        </Box>
    );
};

export default SettingPage;
