'use client';

import { useCallback, useEffect, useState } from 'react';
import {
    Alert,
    Box,
    Button,
    CircularProgress,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Divider,
    Stack,
    Step,
    StepLabel,
    Stepper,
    TextField,
    Typography,
    IconButton,
    Tooltip,
} from '@mui/material';
import { useAuth } from '@libs/react-shared';
import { ITotpSetupResponse } from '@libs/types';

import { Icon } from '../../components';
import { IconEnum } from '../../components/icons/icons';
import { FormContainer, RHFOtpInput } from '../../form';
import { useToasty } from '../../hook';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import { object, string } from 'yup';


interface TotpSetupDialogProps {
    open: boolean;
    onClose: () => void;
    onComplete: () => void;
}

const steps = ['Scan QR Code', 'Verify Setup'];

const validationSchema = object().shape({
    otp: string()
        .label('Code')
        .required('Please enter the verification code')
        .length(6, 'Code must be 6 digits'),
});

type FormValues = {
    otp: string;
};

export default function TotpSetupDialog({
    open,
    onClose,
    onComplete,
}: TotpSetupDialogProps) {
    const { setupTotp, verifyTotpSetup } = useAuth();
    const { showToasty } = useToasty();

    // State
    const [activeStep, setActiveStep] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [setupData, setSetupData] = useState<ITotpSetupResponse | null>(null);
    const [isVerifying, setIsVerifying] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const formContext = useForm<FormValues>({
        defaultValues: { otp: '' },
        resolver: yupResolver(validationSchema) as any,
    });

    const { reset, formState: { isSubmitting } } = formContext;

    /**
     * Initialize TOTP setup when dialog opens
     */
    useEffect(() => {
        if (open) {
            setActiveStep(0);
            setSetupData(null);
            setError(null);
            reset({ otp: '' });
            initializeSetup();
        }
    }, [open, reset]);

    /**
     * Initialize TOTP setup - fetch QR code
     */
    const initializeSetup = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const data = await setupTotp();
            setSetupData(data);
        } catch (err: any) {
            console.error('[TotpSetupDialog] Error initializing setup:', err);
            setError(err?.message || 'Failed to initialize TOTP setup');
            showToasty('Failed to generate QR code', 'error');
        } finally {
            setIsLoading(false);
        }
    }, [setupTotp, showToasty]);

    /**
     * Handle verification submission
     */
    const handleVerify = useCallback(
        async (values: FormValues) => {
            if (!setupData) return;

            setIsVerifying(true);
            setError(null);
            try {
                await verifyTotpSetup({
                    otp: values.otp,
                    secret: setupData.secret,
                });
                showToasty('Authenticator app configured successfully!');
                onComplete();
            } catch (err: any) {
                console.error('[TotpSetupDialog] Error verifying:', err);
                setError(err?.message || 'Invalid verification code. Please try again.');
            } finally {
                setIsVerifying(false);
            }
        },
        [setupData, verifyTotpSetup, showToasty, onComplete],
    );

    /**
     * Copy secret to clipboard
     */
    const handleCopySecret = useCallback(() => {
        if (setupData?.secret) {
            navigator.clipboard.writeText(setupData.secret);
            showToasty('Secret key copied to clipboard');
        }
    }, [setupData, showToasty]);

    /**
     * Move to next step
     */
    const handleNext = useCallback(() => {
        setActiveStep((prev) => prev + 1);
    }, []);

    /**
     * Move to previous step
     */
    const handleBack = useCallback(() => {
        setActiveStep((prev) => prev - 1);
        setError(null);
        reset({ otp: '' });
    }, [reset]);

    /**
     * Handle dialog close
     */
    const handleClose = useCallback(() => {
        if (!isVerifying) {
            onClose();
        }
    }, [isVerifying, onClose]);

    return (
        <Dialog
            open={open}
            onClose={handleClose}
            maxWidth="sm"
            fullWidth
            PaperProps={{
                sx: { borderRadius: 2 },
            }}
        >
            <DialogTitle>
                <Stack direction="row" alignItems="center" spacing={2}>
                    <Box
                        sx={{
                            p: 1,
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
                    <Typography variant="h6">Set Up Authenticator App</Typography>
                </Stack>
            </DialogTitle>

            <DialogContent>
                {/* Stepper */}
                <Stepper activeStep={activeStep} sx={{ py: 3 }}>
                    {steps.map((label) => (
                        <Step key={label}>
                            <StepLabel>{label}</StepLabel>
                        </Step>
                    ))}
                </Stepper>

                <Divider sx={{ mb: 3 }} />

                {/* Error Alert */}
                {error && (
                    <Alert severity="error" sx={{ mb: 3 }}>
                        {error}
                    </Alert>
                )}

                {/* Step 1: Scan QR Code */}
                {activeStep === 0 && (
                    <Stack spacing={3}>
                        <Typography color="text.secondary">
                            Scan the QR code below with your authenticator app (Google Authenticator, Authy, etc.)
                        </Typography>

                        {isLoading ? (
                            <Box
                                sx={{
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    py: 8,
                                }}
                            >
                                <CircularProgress />
                            </Box>
                        ) : setupData ? (
                            <>
                                {/* QR Code */}
                                <Box
                                    sx={{
                                        display: 'flex',
                                        justifyContent: 'center',
                                        p: 3,
                                        bgcolor: 'white',
                                        borderRadius: 2,
                                        border: 1,
                                        borderColor: 'divider',
                                    }}
                                >
                                    <img
                                        src={setupData.qrCode}
                                        alt="TOTP QR Code"
                                        style={{
                                            width: 200,
                                            height: 200,
                                        }}
                                    />
                                </Box>

                                {/* Manual Entry */}
                                <Alert
                                    severity="info"
                                    icon={<Icon icon={IconEnum.Info} />}
                                >
                                    <Typography variant="body2" sx={{ mb: 1 }}>
                                        Can't scan the QR code? Enter this secret key manually:
                                    </Typography>
                                    <Stack direction="row" alignItems="center" spacing={1}>
                                        <TextField
                                            size="small"
                                            value={setupData.secret}
                                            InputProps={{
                                                readOnly: true,
                                                sx: {
                                                    fontFamily: 'monospace',
                                                    fontSize: '0.875rem',
                                                    letterSpacing: 1,
                                                },
                                            }}
                                            fullWidth
                                        />
                                        <Tooltip title="Copy secret key">
                                            <IconButton
                                                size="small"
                                                onClick={handleCopySecret}
                                            >
                                                <Icon icon={IconEnum.Copy} />
                                            </IconButton>
                                        </Tooltip>
                                    </Stack>
                                </Alert>
                            </>
                        ) : (
                            <Alert severity="error">
                                Failed to generate QR code. Please try again.
                            </Alert>
                        )}
                    </Stack>
                )}

                {/* Step 2: Verify */}
                {activeStep === 1 && (
                    <FormContainer
                        formProps={{ id: 'verify-totp-form' }}
                        formContext={formContext}
                        validationSchema={validationSchema}
                        onSuccess={handleVerify}
                    >
                        <Stack spacing={3}>
                            <Typography color="text.secondary">
                                Enter the 6-digit verification code from your authenticator app to complete the setup.
                            </Typography>

                            <Box
                                sx={{
                                    display: 'flex',
                                    justifyContent: 'center',
                                    py: 2,
                                }}
                            >
                                <RHFOtpInput
                                    name="otp"
                                    numInputs={6}
                                />
                            </Box>
                        </Stack>
                    </FormContainer>
                )}
            </DialogContent>

            <DialogActions sx={{ px: 3, pb: 3 }}>
                <Button
                    onClick={handleClose}
                    disabled={isVerifying}
                >
                    Cancel
                </Button>

                {activeStep === 0 ? (
                    <Button
                        variant="contained"
                        onClick={handleNext}
                        disabled={!setupData || isLoading}
                    >
                        Next
                    </Button>
                ) : (
                    <>
                        <Button
                            onClick={handleBack}
                            disabled={isVerifying}
                        >
                            Back
                        </Button>
                        <Button
                            variant="contained"
                            type="submit"
                            form="verify-totp-form"
                            loading={isSubmitting || isVerifying}
                        >
                            Verify & Complete
                        </Button>
                    </>
                )}
            </DialogActions>
        </Dialog>
    );
}
