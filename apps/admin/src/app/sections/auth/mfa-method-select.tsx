import { Box, Button, Card, CardContent, CircularProgress, Stack, Typography } from '@mui/material';
import { useCallback, useMemo } from 'react';

import { Icon } from '../../components';
import { IconEnum } from '../../components/icons/icons';


export type MfaMethod = 'email' | 'phone' | 'totp';

interface MfaMethodOption {
    value: MfaMethod;
    label: string;
    description: string;
    icon: IconEnum;
}

interface MfaMethodSelectProps {
    onSelect: (method: MfaMethod) => void;
    userEmail?: string;
    userPhone?: string;
    availableMethods?: MfaMethod[];
    defaultMethod?: MfaMethod | null;
    onBack?: () => void;
    isLoading?: boolean;
}

const mfaMethodsConfig: MfaMethodOption[] = [
    {
        value: 'email',
        label: 'Email',
        description: 'Receive a verification code via email',
        icon: IconEnum.Mail,
    },
    {
        value: 'phone',
        label: 'Phone',
        description: 'Receive a verification code via SMS',
        icon: IconEnum.Phone,
    },
    {
        value: 'totp',
        label: 'Authenticator App',
        description: 'Use your authenticator app',
        icon: IconEnum.Shield,
    },
];

export default function MfaMethodSelect({
    onSelect,
    userEmail,
    userPhone,
    availableMethods = [],
    defaultMethod,
    onBack,
    isLoading = false,
}: MfaMethodSelectProps) {
    // Use available methods from props, or fallback to all methods
    const methodsToShow = useMemo(() => {
        if (availableMethods.length > 0) {
            return availableMethods;
        }
        // Fallback: show all methods
        return ['email', 'phone', 'totp'] as MfaMethod[];
    }, [availableMethods]);

    const handleSelect = useCallback(
        (method: MfaMethod) => {
            onSelect(method);
        },
        [onSelect],
    );

    const getMethodInfo = (method: MfaMethod) => {
        const methodData = mfaMethodsConfig.find((m) => m.value === method);
        if (!methodData) return null;

        let displayText = methodData.description;
        if (method === 'email' && userEmail) {
            // Mask email for privacy
            const maskedEmail = maskEmail(userEmail);
            displayText = `Send code to ${maskedEmail}`;
        } else if (method === 'phone' && userPhone) {
            // Mask phone for privacy
            const maskedPhone = maskPhone(userPhone);
            displayText = `Send code to ${maskedPhone}`;
        }

        return {
            ...methodData,
            displayText,
            isDefault: defaultMethod === method,
        };
    };

    if (isLoading) {
        return (
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    minHeight: 200,
                    gap: 2,
                }}
            >
                <CircularProgress />
                <Typography color="text.secondary">
                    Preparing verification...
                </Typography>
            </Box>
        );
    }

    if (methodsToShow.length === 0) {
        return (
            <Box>
                <Typography
                    variant="h4"
                    gutterBottom
                >
                    Verification Required
                </Typography>
                <Typography
                    color="text.secondary"
                    sx={{ mt: 2 }}
                >
                    No verification methods are available. Please contact support.
                </Typography>
                {onBack && (
                    <Button
                        variant="outlined"
                        onClick={onBack}
                        sx={{ mt: 2 }}
                    >
                        Back to Login
                    </Button>
                )}
            </Box>
        );
    }

    return (
        <Box>
            <Stack
                spacing={1}
                sx={{ mb: 4 }}
            >
                <Typography
                    variant="h4"
                    gutterBottom
                >
                    Verify your identity
                </Typography>
                <Typography color="text.secondary">
                    Choose how you would like to receive your verification code
                </Typography>
            </Stack>

            <Stack spacing={2}>
                {methodsToShow.map((method) => {
                    const methodInfo = getMethodInfo(method);
                    if (!methodInfo) return null;

                    return (
                        <Card
                            key={method}
                            sx={{
                                cursor: 'pointer',
                                transition: 'all 0.2s ease-in-out',
                                border: methodInfo.isDefault ? '2px solid' : '1px solid',
                                borderColor: methodInfo.isDefault ? 'primary.main' : 'divider',
                                '&:hover': {
                                    boxShadow: (theme) => theme.customShadows?.z8 || '0 8px 16px 0 rgba(0,0,0,0.1)',
                                    transform: 'translateY(-2px)',
                                    borderColor: 'primary.main',
                                },
                            }}
                            onClick={() => handleSelect(method)}
                        >
                            <CardContent sx={{ py: 2 }}>
                                <Stack
                                    direction="row"
                                    spacing={2}
                                    alignItems="center"
                                >
                                    <Box
                                        sx={{
                                            p: 1.5,
                                            borderRadius: 1.5,
                                            bgcolor: methodInfo.isDefault ? 'primary.main' : 'primary.lighter',
                                            color: methodInfo.isDefault ? 'primary.contrastText' : 'primary.main',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                        }}
                                    >
                                        <Icon
                                            icon={methodInfo.icon}
                                            width={24}
                                            height={24}
                                        />
                                    </Box>
                                    <Box sx={{ flexGrow: 1 }}>
                                        <Stack direction="row" spacing={1} alignItems="center">
                                            <Typography
                                                variant="subtitle1"
                                                fontWeight={600}
                                            >
                                                {methodInfo.label}
                                            </Typography>
                                            {methodInfo.isDefault && (
                                                <Typography
                                                    variant="caption"
                                                    sx={{
                                                        bgcolor: 'primary.lighter',
                                                        color: 'primary.main',
                                                        px: 1,
                                                        py: 0.25,
                                                        borderRadius: 0.5,
                                                        fontWeight: 500,
                                                    }}
                                                >
                                                    Default
                                                </Typography>
                                            )}
                                        </Stack>
                                        <Typography
                                            variant="body2"
                                            color="text.secondary"
                                        >
                                            {methodInfo.displayText}
                                        </Typography>
                                    </Box>
                                    <Icon
                                        icon={IconEnum.ChevronRight}
                                        width={20}
                                        height={20}
                                    />
                                </Stack>
                            </CardContent>
                        </Card>
                    );
                })}
            </Stack>

            {onBack && (
                <Box sx={{ mt: 3, textAlign: 'center' }}>
                    <Button
                        variant="text"
                        onClick={onBack}
                        startIcon={<Icon icon={IconEnum.ArrowLeft} />}
                    >
                        Back to Login
                    </Button>
                </Box>
            )}
        </Box>
    );
}

/**
 * Mask email for privacy display
 * Example: john.doe@example.com -> j*******@example.com
 */
function maskEmail(email: string): string {
    const [localPart, domain] = email.split('@');
    if (!localPart || !domain) return email;

    if (localPart.length <= 2) {
        return `${localPart[0]}*@${domain}`;
    }

    const firstChar = localPart[0];
    const lastChar = localPart[localPart.length - 1];
    const maskedLength = Math.min(localPart.length - 2, 6);
    const masked = '*'.repeat(maskedLength);

    return `${firstChar}${masked}${lastChar}@${domain}`;
}

/**
 * Mask phone for privacy display
 * Example: +1234567890 -> +1******890
 */
function maskPhone(phone: string): string {
    if (phone.length <= 4) return phone;

    const visibleStart = phone.slice(0, 3);
    const visibleEnd = phone.slice(-3);
    const maskedLength = Math.min(phone.length - 6, 6);
    const masked = '*'.repeat(maskedLength);

    return `${visibleStart}${masked}${visibleEnd}`;
}
