'use client';

import { useCallback, useEffect, useState } from 'react';
import {
    Alert,
    Box,
    Button,
    Card,
    CardContent,
    CircularProgress,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Divider,
    IconButton,
    List,
    ListItem,
    ListItemIcon,
    ListItemSecondaryAction,
    ListItemText,
    Stack,
    Switch,
    TextField,
    Tooltip,
    Typography,
    alpha,
} from '@mui/material';
import { useAuth } from '@libs/react-shared';
import { IMfaDevice, IMfaStatusResponse, ITotpSetupResponse } from '@libs/types';

import { Icon } from '../../components';
import { IconEnum } from '../../components/icons/icons';
import { useToasty } from '../../hook';
import TotpSetupDialog from './totp-setup-dialog';



/**
 * TOTP Management Component
 * Allows users to manage their TOTP/MFA settings from their profile.
 */
export default function TotpManagement() {
    const {
        getMfaStatus,
        toggleMfa,
        listTotpDevices,
        removeTotpDevice,
        generateRecoveryCode,
        refetchUser,
    } = useAuth();

    const { showToasty } = useToasty();

    // State
    const [isLoading, setIsLoading] = useState(true);
    const [mfaStatus, setMfaStatus] = useState<IMfaStatusResponse | null>(null);
    const [devices, setDevices] = useState<IMfaDevice[]>([]);
    const [isTotpSetupOpen, setIsTotpSetupOpen] = useState(false);
    const [isToggling, setIsToggling] = useState(false);
    const [removingDeviceId, setRemovingDeviceId] = useState<string | null>(null);

    // Recovery code dialog
    const [isRecoveryDialogOpen, setIsRecoveryDialogOpen] = useState(false);
    const [recoveryCode, setRecoveryCode] = useState<string | null>(null);
    const [isGeneratingRecovery, setIsGeneratingRecovery] = useState(false);

    /**
     * Fetch MFA status and devices
     */
    const fetchMfaData = useCallback(async () => {
        setIsLoading(true);
        try {
            const [status, deviceList] = await Promise.all([
                getMfaStatus(),
                listTotpDevices(),
            ]);
            setMfaStatus(status);
            setDevices(deviceList || []);
        } catch (error: any) {
            console.error('[TotpManagement] Error fetching MFA data:', error);
            showToasty('Failed to load MFA settings', 'error');
        } finally {
            setIsLoading(false);
        }
    }, [getMfaStatus, listTotpDevices, showToasty]);

    useEffect(() => {
        fetchMfaData();
    }, [fetchMfaData]);

    /**
     * Toggle MFA on/off
     */
    const handleToggleMfa = useCallback(
        async (event: React.ChangeEvent<HTMLInputElement>) => {
            const enabled = event.target.checked;

            // If enabling MFA and no TOTP devices exist, open setup dialog
            if (enabled && devices.length === 0) {
                setIsTotpSetupOpen(true);
                return;
            }

            setIsToggling(true);
            try {
                await toggleMfa({ enabled });
                await fetchMfaData();
                await refetchUser();
                showToasty(`MFA ${enabled ? 'enabled' : 'disabled'} successfully`);
            } catch (error: any) {
                console.error('[TotpManagement] Error toggling MFA:', error);
                showToasty(error?.message || 'Failed to toggle MFA', 'error');
            } finally {
                setIsToggling(false);
            }
        },
        [devices.length, toggleMfa, fetchMfaData, refetchUser, showToasty],
    );

    /**
     * Remove a TOTP device
     */
    const handleRemoveDevice = useCallback(
        async (deviceId: string) => {
            setRemovingDeviceId(deviceId);
            try {
                await removeTotpDevice(deviceId);
                await fetchMfaData();
                showToasty('Device removed successfully');
            } catch (error: any) {
                console.error('[TotpManagement] Error removing device:', error);
                showToasty(error?.message || 'Failed to remove device', 'error');
            } finally {
                setRemovingDeviceId(null);
            }
        },
        [removeTotpDevice, fetchMfaData, showToasty],
    );

    /**
     * Generate recovery code
     */
    const handleGenerateRecoveryCode = useCallback(async () => {
        setIsGeneratingRecovery(true);
        try {
            const result = await generateRecoveryCode();
            setRecoveryCode(result.code);
            setIsRecoveryDialogOpen(true);
        } catch (error: any) {
            console.error('[TotpManagement] Error generating recovery code:', error);
            showToasty(error?.message || 'Failed to generate recovery code', 'error');
        } finally {
            setIsGeneratingRecovery(false);
        }
    }, [generateRecoveryCode, showToasty]);

    /**
     * Handle TOTP setup complete
     */
    const handleTotpSetupComplete = useCallback(async () => {
        setIsTotpSetupOpen(false);
        await fetchMfaData();
        await refetchUser();
    }, [fetchMfaData, refetchUser]);

    /**
     * Copy recovery code to clipboard
     */
    const handleCopyRecoveryCode = useCallback(() => {
        if (recoveryCode) {
            navigator.clipboard.writeText(recoveryCode);
            showToasty('Recovery code copied to clipboard');
        }
    }, [recoveryCode, showToasty]);

    /**
     * Format date for display
     */
    const formatDate = (date: Date | string | null | undefined) => {
        if (!date) return 'Never';
        const d = new Date(date);
        return d.toLocaleDateString(undefined, {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    if (isLoading) {
        return (
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    py: 4,
                }}
            >
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Stack spacing={3}>
            {/* MFA Toggle */}
            <Card>
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
                                Add an extra layer of security to your account by requiring a verification code in addition to your password.
                            </Typography>
                        </Box>
                        <Switch
                            checked={mfaStatus?.isEnabled || false}
                            onChange={handleToggleMfa}
                            disabled={isToggling || !mfaStatus?.allowUserToggle}
                        />
                    </Stack>
                    {!mfaStatus?.allowUserToggle && (
                        <Alert severity="info" sx={{ mt: 2 }}>
                            MFA settings are managed by your administrator.
                        </Alert>
                    )}
                </CardContent>
            </Card>

            {/* Authenticator App Section */}
            <Card>
                <CardContent>
                    <Stack
                        direction="row"
                        alignItems="center"
                        justifyContent="space-between"
                        sx={{ mb: 2 }}
                    >
                        <Stack direction="row" alignItems="center" spacing={2}>
                            <Box
                                sx={{
                                    p: 1.5,
                                    borderRadius: 1,
                                    bgcolor: 'primary.lighter',
                                    color: 'primary.main',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                }}
                            >
                                <Icon icon={IconEnum.Shield} width={24} height={24} />
                            </Box>
                            <Box>
                                <Typography variant="subtitle1" fontWeight={600}>
                                    Authenticator App
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    Use an authenticator app like Google Authenticator or Authy
                                </Typography>
                            </Box>
                        </Stack>
                        <Button
                            variant="outlined"
                            startIcon={<Icon icon={IconEnum.Plus} />}
                            onClick={() => setIsTotpSetupOpen(true)}
                        >
                            Add Device
                        </Button>
                    </Stack>

                    <Divider sx={{ my: 2 }} />

                    {/* Device List */}
                    {devices.length === 0 ? (
                        <Box
                            sx={{
                                py: 3,
                                textAlign: 'center',
                                bgcolor: (theme) => alpha(theme.palette.grey[500], 0.04),
                                borderRadius: 1,
                            }}
                        >
                            <Icon
                                icon={IconEnum.Smartphone}
                                sx={{
                                    fontSize: 40,
                                    color: 'text.disabled',
                                    mb: 1,
                                }}
                            />
                            <Typography color="text.secondary">
                                No authenticator devices configured
                            </Typography>
                            <Typography variant="body2" color="text.disabled">
                                Add a device to enable two-factor authentication
                            </Typography>
                        </Box>
                    ) : (
                        <List disablePadding>
                            {devices.map((device, index) => (
                                <ListItem
                                    key={device.id}
                                    sx={{
                                        borderRadius: 1,
                                        mb: index < devices.length - 1 ? 1 : 0,
                                        bgcolor: (theme) =>
                                            alpha(theme.palette.grey[500], 0.04),
                                    }}
                                >
                                    <ListItemIcon>
                                        <Icon
                                            icon={IconEnum.Smartphone}
                                            sx={{
                                                color: device.verified
                                                    ? 'success.main'
                                                    : 'warning.main',
                                            }}
                                        />
                                    </ListItemIcon>
                                    <ListItemText
                                        primary={
                                            <Stack direction="row" spacing={1} alignItems="center">
                                                <Typography variant="subtitle2">
                                                    {device.deviceName || 'Authenticator Device'}
                                                </Typography>
                                                {device.verified ? (
                                                    <Typography
                                                        variant="caption"
                                                        sx={{
                                                            bgcolor: 'success.lighter',
                                                            color: 'success.main',
                                                            px: 1,
                                                            py: 0.25,
                                                            borderRadius: 0.5,
                                                        }}
                                                    >
                                                        Verified
                                                    </Typography>
                                                ) : (
                                                    <Typography
                                                        variant="caption"
                                                        sx={{
                                                            bgcolor: 'warning.lighter',
                                                            color: 'warning.main',
                                                            px: 1,
                                                            py: 0.25,
                                                            borderRadius: 0.5,
                                                        }}
                                                    >
                                                        Pending
                                                    </Typography>
                                                )}
                                            </Stack>
                                        }
                                        secondary={
                                            <Stack direction="row" spacing={2}>
                                                <Typography variant="caption" color="text.secondary">
                                                    Added: {formatDate(device.createdAt)}
                                                </Typography>
                                                <Typography variant="caption" color="text.secondary">
                                                    Last used: {formatDate(device.lastUsedAt)}
                                                </Typography>
                                            </Stack>
                                        }
                                    />
                                    <ListItemSecondaryAction>
                                        <Tooltip title="Remove device">
                                            <IconButton
                                                edge="end"
                                                onClick={() => handleRemoveDevice(device.id)}
                                                disabled={removingDeviceId === device.id}
                                            >
                                                {removingDeviceId === device.id ? (
                                                    <CircularProgress size={20} />
                                                ) : (
                                                    <Icon icon={IconEnum.Trash} />
                                                )}
                                            </IconButton>
                                        </Tooltip>
                                    </ListItemSecondaryAction>
                                </ListItem>
                            ))}
                        </List>
                    )}
                </CardContent>
            </Card>

            {/* Recovery Code Section */}
            <Card>
                <CardContent>
                    <Stack
                        direction="row"
                        alignItems="center"
                        justifyContent="space-between"
                    >
                        <Box>
                            <Typography variant="subtitle1" fontWeight={600}>
                                Recovery Code
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Generate a recovery code to regain access to your account if you lose your authenticator device.
                                {mfaStatus?.hasRecoveryCode && (
                                    <Typography
                                        component="span"
                                        variant="body2"
                                        color="success.main"
                                        sx={{ ml: 1 }}
                                    >
                                        ✓ Active
                                    </Typography>
                                )}
                            </Typography>
                        </Box>
                        <Button
                            variant="outlined"
                            onClick={handleGenerateRecoveryCode}
                            loading={isGeneratingRecovery}
                            startIcon={<Icon icon={IconEnum.Key} />}
                        >
                            {mfaStatus?.hasRecoveryCode ? 'Regenerate' : 'Generate'}
                        </Button>
                    </Stack>
                    {mfaStatus?.hasRecoveryCode && (
                        <Alert severity="warning" sx={{ mt: 2 }}>
                            Generating a new recovery code will invalidate your current one.
                        </Alert>
                    )}
                </CardContent>
            </Card>

            {/* TOTP Setup Dialog */}
            <TotpSetupDialog
                open={isTotpSetupOpen}
                onClose={() => setIsTotpSetupOpen(false)}
                onComplete={handleTotpSetupComplete}
            />

            {/* Recovery Code Dialog */}
            <Dialog
                open={isRecoveryDialogOpen}
                onClose={() => {
                    setIsRecoveryDialogOpen(false);
                    setRecoveryCode(null);
                }}
                maxWidth="sm"
                fullWidth
            >
                <DialogTitle>
                    <Stack direction="row" alignItems="center" spacing={1}>
                        <Icon icon={IconEnum.Key} />
                        <Typography variant="h6">Your Recovery Code</Typography>
                    </Stack>
                </DialogTitle>
                <DialogContent>
                    <Alert severity="warning" sx={{ mb: 3 }}>
                        <strong>Important:</strong> Save this recovery code in a secure location. It can only be used once and will not be shown again.
                    </Alert>
                    <TextField
                        fullWidth
                        value={recoveryCode || ''}
                        InputProps={{
                            readOnly: true,
                            sx: {
                                fontFamily: 'monospace',
                                fontSize: '1.25rem',
                                letterSpacing: 2,
                                textAlign: 'center',
                            },
                        }}
                    />
                </DialogContent>
                <DialogActions>
                    <Button
                        onClick={handleCopyRecoveryCode}
                        startIcon={<Icon icon={IconEnum.Copy} />}
                    >
                        Copy
                    </Button>
                    <Button
                        variant="contained"
                        onClick={() => {
                            setIsRecoveryDialogOpen(false);
                            setRecoveryCode(null);
                        }}
                    >
                        Done
                    </Button>
                </DialogActions>
            </Dialog>
        </Stack>
    );
}
