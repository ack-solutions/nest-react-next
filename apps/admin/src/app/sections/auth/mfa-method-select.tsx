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
        description: 'Receive a code via email',
        icon: IconEnum.Mail,
    },
    {
        value: 'phone',
        label: 'Phone',
        description: 'Receive a code via SMS',
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
            displayText = `Send code to ${userEmail}`;
        } else if (method === 'phone' && userPhone) {
            displayText = `Send code to ${userPhone}`;
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
                    justifyContent: 'center',
                    alignItems: 'center',
                    minHeight: 200,
                }}
            >
                <CircularProgress />
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
                    Select verification method
                </Typography>
                <Typography
                    color="text.secondary"
                    sx={{ mt: 2 }}
                >
                    No MFA methods available
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
                spacing={2}
                sx={{ mb: 4 }}
            >
                <Typography
                    variant="h4"
                    gutterBottom
                >
                    Select verification method
                </Typography>
                <Typography>
                    Choose how you'd like to verify your identity
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
                                transition: 'all 0.2s',
                                border: methodInfo.isDefault ? '2px solid' : undefined,
                                borderColor: methodInfo.isDefault ? 'primary.main' : undefined,
                                '&:hover': {
                                    boxShadow: (theme) => theme.customShadows.z8,
                                    transform: 'translateY(-2px)',
                                },
                            }}
                            onClick={() => handleSelect(method)}
                        >
                            <CardContent>
                                <Stack
                                    direction="row"
                                    spacing={2}
                                    alignItems="center"
                                >
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
                                                gutterBottom
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
                                    <Button
                                        variant="outlined"
                                        size="small"
                                    >
                                        Select
                                    </Button>
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
                    >
                        Back to Login
                    </Button>
                </Box>
            )}
        </Box>
    );
}
