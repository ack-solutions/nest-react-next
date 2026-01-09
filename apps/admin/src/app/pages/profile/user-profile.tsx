import {
    Box,
    Stack,
    Typography,
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Divider,
    alpha,
    IconButton,
    Card,
    CardContent,
    styled,
} from '@mui/material';
import { useState, useCallback, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';

import { Avatar, Icon, InfoCard, Page } from '../../components';
import { IconEnum } from '../../components/icons/icons';
import { useAuth, useUser } from '@libs/react-shared';
import { PATH_DASHBOARD } from '../../routes/paths';
import BasicInfoEditDialog from '../../sections/profile/basic-info-edit-dialog';
import UserChangeEmail from '../../sections/profile/user-change-email';
import UserChangePassword from '../../sections/profile/user-change-password';
import UserChangePhone from '../../sections/profile/user-change-phone';
import TotpManagement from '../../sections/profile/totp-management';
import { useToasty } from '../../hook';

const SECTION_PARAM = 'section';
const DEFAULT_SECTION = 'contact';

const ListItemButtonStyle = styled(ListItemButton)(({ theme }) => ({
    borderRadius: 12,
    py: 12,
    px: 16,
    '&.Mui-selected': {
        backgroundColor: alpha(theme.palette.primary.main, 0.08),
        color: theme.palette.primary.main,
        '& .MuiListItemIcon-root': {
            color: theme.palette.primary.main,
        },
        '&:hover': {
            backgroundColor: alpha(theme.palette.primary.main, 0.12),
        },
    },
    '&:hover': {
        backgroundColor: alpha(theme.palette.grey[500], 0.04),
    },
}));

const profileSections = [
    {
        id: 'contact',
        label: 'Contact Information',
        icon: IconEnum.Mail,
        description: 'Manage your email address and phone number',
    },
    {
        id: 'password',
        label: 'Password',
        icon: IconEnum.Key,
        description: 'Update your account password',
    },
    {
        id: 'security',
        label: 'Security & 2FA',
        icon: IconEnum.Shield,
        description: 'Manage two-factor authentication',
    },
];

const validSectionIds = profileSections.map((s) => s.id);

function UserProfile() {
    const [searchParams, setSearchParams] = useSearchParams();

    // Get active section from URL, with validation and fallback to default
    const activeSection = useMemo(() => {
        const sectionFromUrl = searchParams.get(SECTION_PARAM);
        if (sectionFromUrl && validSectionIds.includes(sectionFromUrl)) {
            return sectionFromUrl;
        }
        return DEFAULT_SECTION;
    }, [searchParams]);

    // Update URL when section changes
    const setActiveSection = useCallback((sectionId: string) => {
        setSearchParams((prev) => {
            const newParams = new URLSearchParams(prev);
            if (sectionId === DEFAULT_SECTION) {
                newParams.delete(SECTION_PARAM);
            } else {
                newParams.set(SECTION_PARAM, sectionId);
            }
            return newParams;
        }, { replace: true });
    }, [setSearchParams]);

    const { currentUser, authUser, refetchUser } = useAuth();
    const { showToasty } = useToasty();
    const [openEditDialog, setOpenEditDialog] = useState(false);
    const { useUpdateProfile } = useUser();
    const { mutateAsync: updateProfile } = useUpdateProfile();

    const handleOpenEditDialog = () => {
        setOpenEditDialog(true);
    };

    const handleCloseEditDialog = () => {
        setOpenEditDialog(false);
    };

    const renderSidebar = (
        <Card
            sx={{
                position: 'relative',
            }}
        >
            <CardContent>
                <IconButton
                    onClick={handleOpenEditDialog}
                    sx={{
                        position: 'absolute',
                        top: 16,
                        right: 16,
                    }}
                >
                    <Icon
                        icon={IconEnum.Pencil}
                        sx={{ fontSize: 16 }}
                    />
                </IconButton>

                {/* Profile Header */}
                <Stack
                    alignItems="center"
                    spacing={2}
                    sx={{ mb: 3 }}
                >
                    <Avatar
                        src={currentUser?.avatarUrl}
                        sx={{
                            width: 80,
                            height: 80,
                        }}
                    />

                    <Box textAlign="center">
                        <Typography
                            variant="h6"
                            fontWeight="600"
                        >
                            {currentUser?.name}
                        </Typography>
                        <Typography
                            variant="body2"
                            color="text.secondary"
                        >
                            {authUser?.email}
                        </Typography>
                    </Box>
                </Stack>

                <Divider sx={{ mb: 2 }} />

                <List disablePadding>
                    {profileSections.map((section) => (
                        <ListItem
                            key={section.id}
                            disablePadding
                            sx={{ mb: 1 }}
                        >
                            <ListItemButtonStyle
                                selected={activeSection === section.id}
                                onClick={() => setActiveSection(section.id)}
                            >
                                <ListItemIcon sx={{ minWidth: 20 }}>
                                    <Icon
                                        icon={section.icon}
                                        sx={{ fontSize: 20 }}
                                    />
                                </ListItemIcon>
                                <ListItemText
                                    primary={section.label}
                                    secondary={section.description}
                                    slotProps={{
                                        primary: {
                                            fontWeight: activeSection === section.id ? 600 : 500,
                                            fontSize: '0.875rem',
                                        },
                                        secondary: {
                                            fontSize: '0.75rem',
                                            lineHeight: 1.2,
                                            mt: 0.5,
                                        },
                                    }}
                                />
                            </ListItemButtonStyle>
                        </ListItem>
                    ))}
                </List>
            </CardContent>
        </Card>
    );

    const renderContent = (
        <Stack spacing={2}>
            {profileSections.map((section) => {
                if (section.id === activeSection) {
                    return (
                        <InfoCard
                            key={section.id}
                            title={section.label}
                            icon={<Icon icon={section.icon} />}
                            subheader={section.description}
                            showDivider
                        >
                            <Box>
                                {activeSection === 'contact' && (
                                    <>
                                        <UserChangeEmail />
                                        <UserChangePhone />
                                    </>
                                )}
                                {activeSection === 'password' && (
                                    <UserChangePassword />
                                )}
                                {activeSection === 'security' && (
                                    <TotpManagement />
                                )}
                            </Box>

                        </InfoCard>
                    );
                }

                return null;
            })}
        </Stack>
    );

    return (
        <Page
            title="Profile"
            breadcrumbs={[
                {
                    name: 'Dashboard',
                    href: PATH_DASHBOARD.root,
                },
                { name: 'Profile' },
            ]}
        >
            <Stack
                direction={{
                    xs: 'column',
                    lg: 'row',
                }}
                spacing={2}
                alignItems="flex-start"
            >
                <Box
                    sx={{
                        width: {
                            xs: '100%',
                            lg: 320,
                        },
                        flexShrink: 0,
                    }}
                >
                    {renderSidebar}
                </Box>

                <Box
                    sx={{
                        flex: 1,
                        width: '100%',
                    }}
                >
                    {renderContent}
                </Box>
            </Stack>

            <BasicInfoEditDialog
                open={openEditDialog}
                onClose={handleCloseEditDialog}
                user={currentUser}
            />
        </Page>
    );
}

export default UserProfile;
