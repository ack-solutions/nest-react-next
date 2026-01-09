import { IMfaDevice } from '@libs/types';
import { UserService } from '@libs/react-shared';
import {
    Box,
    Button,
    Card,
    CardContent,
    CircularProgress,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    IconButton,
    Stack,
    Switch,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Tooltip,
    Typography,
} from '@mui/material';
import { useCallback, useEffect, useState } from 'react';
import { Icon } from '../../components';
import { IconEnum } from '../../components/icons/icons';
import { useToasty } from '../../hook';
import { IUser } from '@libs/types';
import { toDisplayDate } from '@libs/utils';


interface UserMfaDialogProps {
    open: boolean;
    onClose: () => void;
    user: IUser | null;
    onMfaChanged?: () => void;
}

const userService = UserService.getInstance<UserService>();

export default function UserMfaDialog({
    open,
    onClose,
    user,
    onMfaChanged,
}: UserMfaDialogProps) {
    const { showToasty } = useToasty();
    const [isLoading, setIsLoading] = useState(false);
    const [isMfaEnabled, setIsMfaEnabled] = useState(false);
    const [devices, setDevices] = useState<IMfaDevice[]>([]);
    const [canToggle, setCanToggle] = useState(false);
    const [isTogglingMfa, setIsTogglingMfa] = useState(false);
    const [removingDeviceId, setRemovingDeviceId] = useState<string | null>(null);

    // Load MFA status and devices when dialog opens
    useEffect(() => {
        if (open && user) {
            loadMfaData();
        }
    }, [open, user]);

    const loadMfaData = useCallback(async () => {
        if (!user) return;

        setIsLoading(true);
        try {
            // Check if MFA can be toggled
            const canToggleResponse = await userService.canToggleMfa();
            setCanToggle(canToggleResponse.access);

            // Get user's MFA status from authUser
            setIsMfaEnabled(user.authUser?.isMfaEnabled ?? false);

            // Load TOTP devices
            const devicesData = await userService.getMfaDevices(user.id);
            setDevices(devicesData || []);
        } catch (error) {
            console.error('Failed to load MFA data:', error);
            showToasty('Failed to load MFA data', 'error');
        } finally {
            setIsLoading(false);
        }
    }, [user, showToasty]);

    const handleToggleMfa = useCallback(async () => {
        if (!user) return;

        setIsTogglingMfa(true);
        try {
            const newState = !isMfaEnabled;
            await userService.toggleMfa(user.id, newState);
            setIsMfaEnabled(newState);
            showToasty(
                newState
                    ? 'MFA enabled successfully'
                    : 'MFA disabled successfully'
            );
            onMfaChanged?.();
        } catch (error) {
            console.error('Failed to toggle MFA:', error);
            showToasty('Failed to toggle MFA', 'error');
        } finally {
            setIsTogglingMfa(false);
        }
    }, [user, isMfaEnabled, showToasty, onMfaChanged]);

    const handleRemoveDevice = useCallback(async (deviceId: string) => {
        setRemovingDeviceId(deviceId);
        try {
            await userService.removeMfaDevice(deviceId);
            setDevices((prev) => prev.filter((d) => d.id !== deviceId));
            showToasty('Device removed successfully');
            onMfaChanged?.();
        } catch (error) {
            console.error('Failed to remove device:', error);
            showToasty('Failed to remove device', 'error');
        } finally {
            setRemovingDeviceId(null);
        }
    }, [showToasty, onMfaChanged]);

    const handleClose = useCallback(() => {
        setDevices([]);
        setCanToggle(false);
        setIsMfaEnabled(false);
        onClose();
    }, [onClose]);

    if (!user) return null;

    return (
        <Dialog
            open={open}
            onClose={handleClose}
            maxWidth="sm"
            fullWidth
        >
            <DialogTitle>
                <Stack direction="row" alignItems="center" spacing={2}>
                    <Box
                        sx={{
                            p: 1,
                            borderRadius: 1,
                            bgcolor: 'primary.lighter',
                            display: 'flex',
                            alignItems: 'center',
                        }}
                    >
                        <Icon icon={IconEnum.Shield} color="primary" width={24} height={24} />
                    </Box>
                    <Box>
                        <Typography variant="h6">
                            MFA Settings
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            {user.firstName} {user.lastName}
                        </Typography>
                    </Box>
                </Stack>
            </DialogTitle>

            <DialogContent>
                {isLoading ? (
                    <Box
                        sx={{
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            minHeight: 200,
                        }}
                    >
                        <CircularProgress />
                    </Box>
                ) : (
                    <Stack spacing={3} sx={{ mt: 1 }}>
                        {/* MFA Toggle */}
                        {canToggle && (
                            <Card variant="outlined">
                                <CardContent>
                                    <Stack
                                        direction="row"
                                        alignItems="center"
                                        justifyContent="space-between"
                                    >
                                        <Box>
                                            <Typography variant="subtitle1" fontWeight={600}>
                                                Two-Factor Authentication
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary">
                                                {isMfaEnabled
                                                    ? 'MFA is enabled for this user'
                                                    : 'Enable MFA to add an extra layer of security'}
                                            </Typography>
                                        </Box>
                                        <Switch
                                            checked={isMfaEnabled}
                                            onChange={handleToggleMfa}
                                            disabled={isTogglingMfa}
                                            color="primary"
                                        />
                                    </Stack>
                                </CardContent>
                            </Card>
                        )}

                        {/* TOTP Devices */}
                        {devices.length > 0 && (
                            <Box>
                                <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 2 }}>
                                    Authenticator Apps
                                </Typography>
                                <TableContainer component={Card} variant="outlined">
                                    <Table size="small">
                                        <TableHead>
                                            <TableRow>
                                                <TableCell>Device Name</TableCell>
                                                <TableCell>Last Used</TableCell>
                                                <TableCell>Status</TableCell>
                                                <TableCell align="right">Actions</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {devices.map((device) => (
                                                <TableRow key={device.id}>
                                                    <TableCell>
                                                        <Stack direction="row" alignItems="center" spacing={1}>
                                                            <Icon
                                                                icon={IconEnum.Smartphone}
                                                                width={18}
                                                                height={18}
                                                            />
                                                            <Typography variant="body2">
                                                                {device.deviceName || 'Authenticator App'}
                                                            </Typography>
                                                        </Stack>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Typography variant="body2" color="text.secondary">
                                                            {device.lastUsedAt
                                                                ? toDisplayDate(device.lastUsedAt)
                                                                : 'Never'
                                                            }
                                                        </Typography>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Typography
                                                            variant="caption"
                                                            sx={{
                                                                px: 1,
                                                                py: 0.25,
                                                                borderRadius: 0.5,
                                                                bgcolor: device.verified
                                                                    ? 'success.lighter'
                                                                    : 'warning.lighter',
                                                                color: device.verified
                                                                    ? 'success.main'
                                                                    : 'warning.main',
                                                            }}
                                                        >
                                                            {device.verified ? 'Verified' : 'Pending'}
                                                        </Typography>
                                                    </TableCell>
                                                    <TableCell align="right">
                                                        <Tooltip title="Remove device">
                                                            <IconButton
                                                                size="small"
                                                                color="error"
                                                                onClick={() => handleRemoveDevice(device.id)}
                                                                disabled={removingDeviceId === device.id}
                                                            >
                                                                {removingDeviceId === device.id ? (
                                                                    <CircularProgress size={18} />
                                                                ) : (
                                                                    <Icon icon={IconEnum.Trash} width={18} height={18} />
                                                                )}
                                                            </IconButton>
                                                        </Tooltip>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            </Box>
                        )}

                        {/* No devices message */}
                        {devices.length === 0 && isMfaEnabled && (
                            <Card variant="outlined" sx={{ bgcolor: 'grey.50' }}>
                                <CardContent>
                                    <Stack alignItems="center" spacing={1} sx={{ py: 2 }}>
                                        <Icon
                                            icon={IconEnum.Smartphone}
                                            width={40}
                                            height={40}
                                        />
                                        <Typography variant="body2" color="text.secondary" textAlign="center">
                                            No authenticator apps configured.
                                            <br />
                                            The user needs to set up an authenticator app.
                                        </Typography>
                                    </Stack>
                                </CardContent>
                            </Card>
                        )}

                        {/* MFA not available message */}
                        {!canToggle && (
                            <Card variant="outlined" sx={{ bgcolor: 'grey.50' }}>
                                <CardContent>
                                    <Stack alignItems="center" spacing={1}>
                                        <Icon
                                            icon={IconEnum.Info}
                                            width={24}
                                            height={24}
                                        />
                                        <Typography variant="body2" color="text.secondary" textAlign="center">
                                            MFA management is not available.
                                            <br />
                                            Either MFA is not enabled in the system or it is required for all users.
                                        </Typography>
                                    </Stack>
                                </CardContent>
                            </Card>
                        )}
                    </Stack>
                )}
            </DialogContent>

            <DialogActions>
                <Button onClick={handleClose} variant="outlined">
                    Close
                </Button>
            </DialogActions>
        </Dialog>
    );
}
