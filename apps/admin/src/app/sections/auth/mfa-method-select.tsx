import { NestAuthService } from '@libs/react-shared';
import { Box, Button, Card, CardContent, CircularProgress, Stack, Typography } from '@mui/material';
import { useCallback, useEffect, useState } from 'react';

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
}

const nestAuthService = NestAuthService.getInstance<NestAuthService>();

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

// Map API method names to component method names
const mapApiMethodToComponentMethod = (apiMethod: string): MfaMethod | null => {
    const mapping: Record<string, MfaMethod> = {
        'email': 'email',
        'sms': 'phone',
        'phone': 'phone',
        'totp': 'totp',
    };
    return mapping[apiMethod] || null;
};

export default function MfaMethodSelect({
    onSelect,
    userEmail,
    userPhone,
}: MfaMethodSelectProps) {
    const [availableMethods, setAvailableMethods] = useState<MfaMethod[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchMfaStatus = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const response = await nestAuthService.getMfaStatus();
                const { data } = response;

                // Map API methods to component methods
                const mappedMethods: MfaMethod[] = [];
                data.availableMethods?.forEach((apiMethod) => {
                    const mappedMethod = mapApiMethodToComponentMethod(apiMethod);
                    if (mappedMethod && !mappedMethods.includes(mappedMethod)) {
                        mappedMethods.push(mappedMethod);
                    }
                });

                // If enabledMethods exist, use those; otherwise use availableMethods
                if (data.enabledMethods && data.enabledMethods.length > 0) {
                    const enabledMapped: MfaMethod[] = [];
                    data.enabledMethods.forEach((apiMethod) => {
                        const mappedMethod = mapApiMethodToComponentMethod(apiMethod);
                        if (mappedMethod && !enabledMapped.includes(mappedMethod)) {
                            enabledMapped.push(mappedMethod);
                        }
                    });
                    setAvailableMethods(enabledMapped.length > 0 ? enabledMapped : mappedMethods);
                } else {
                    setAvailableMethods(mappedMethods);
                }
            } catch (err: any) {
                setError('Failed to load MFA methods');
                console.error('Error fetching MFA status:', err);
                // Fallback to default methods on error
                setAvailableMethods(['email', 'phone', 'totp']);
            } finally {
                setIsLoading(false);
            }
        };

        fetchMfaStatus();
    }, []);

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

    if (error && availableMethods.length === 0) {
        return (
            <Box>
                <Typography
                    variant="h4"
                    gutterBottom
                >
                    Select verification method
                </Typography>
                <Typography
                    color="error"
                    sx={{ mt: 2 }}
                >
                    {error}
                </Typography>
            </Box>
        );
    }

    if (availableMethods.length === 0) {
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
                {availableMethods.map((method) => {
                    const methodInfo = getMethodInfo(method);
                    if (!methodInfo) return null;

                    return (
                        <Card
                            key={method}
                            sx={{
                                cursor: 'pointer',
                                transition: 'all 0.2s',
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
                                        <Typography
                                            variant="subtitle1"
                                            gutterBottom
                                        >
                                            {methodInfo.label}
                                        </Typography>
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
        </Box>
    );
}
