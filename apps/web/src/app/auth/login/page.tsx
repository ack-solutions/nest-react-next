'use client';

import React, { useCallback, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { object, string } from 'yup';
import { Mail, Lock } from 'lucide-react';

import { useAuth } from '@libs/react-shared';
import { errorMessage } from '@libs/utils';
import { Typography } from '@web/components/ui/typography';
import { Button } from '@web/components/ui/button';
import { Icon } from '@web/components/ui/icons';
import Checkbox from '@web/components/ui/checkbox';
import { Stack } from '@web/components/ui/stack';
import {
    Form,
    FormInput,
    FormPasswordInput,
    FormActions,
    FormError,
    useAppForm,
} from '@web/components/ui/form';
import { AuthHeader, AuthLink } from '@web/components/auth';
import { authNavigation } from '@web/config';

// Validation Schema
const loginSchema = object().shape({
    email: string()
        .trim()
        .email('Please enter a valid email address')
        .required('Email is required'),
    password: string()
        .trim()
        .required('Password is required'),
});

interface LoginFormData {
    email: string;
    password: string;
}

export default function LoginPage() {
    const router = useRouter();
    const { login } = useAuth();

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [rememberMe, setRememberMe] = useState(false);

    const form = useAppForm<LoginFormData>({
        defaultValues: {
            email: '',
            password: '',
        },
        schema: loginSchema,
    });

    const handleLogin = useCallback(
        async (values: LoginFormData) => {
            setIsLoading(true);
            setError(null);

            try {
                const response = await login({
                    providerName: 'email',
                    credentials: values,
                });

                // Check if MFA is required
                if (response?.isRequiresMfa) {
                    router.push('/auth/mfa');
                    return;
                }

                // Redirect after successful login
                const returnUrl = typeof window !== 'undefined'
                    ? localStorage.getItem('returnUrl')
                    : null;

                if (returnUrl) {
                    localStorage.removeItem('returnUrl');
                    router.replace(returnUrl);
                } else {
                    router.replace('/');
                }
            } catch (err) {
                setError(errorMessage(err));
            } finally {
                setIsLoading(false);
            }
        },
        [login, router]
    );

    return (
        <>
            <AuthHeader
                title="Welcome back"
                subtitle="Sign in to access your account"
            />

            <Form form={form} onSubmit={handleLogin}>
                <FormError message={error} />

                <FormInput
                    name="email"
                    label="Email Address"
                    type="email"
                    placeholder="you@example.com"
                    leftIcon={<Icon icon={Mail} />}
                    fullWidth
                    inputSize="lg"
                    autoComplete="email"
                    required
                />

                <FormPasswordInput
                    name="password"
                    label="Password"
                    placeholder="••••••••"
                    leftIcon={<Icon icon={Lock} />}
                    fullWidth
                    inputSize="lg"
                    autoComplete="current-password"
                    required
                />

                <Stack
                    direction="row"
                    alignItems="center"
                    justifyContent="space-between"
                >
                    <Checkbox
                        size="small"
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                        label={
                            <Typography variant="body2" color="text-secondary">
                                Remember me
                            </Typography>
                        }
                    />
                    <Link
                        href={authNavigation.forgotPassword}
                        className="text-sm text-primary font-medium hover:text-primary-dark transition-colors"
                    >
                        Forgot password?
                    </Link>
                </Stack>

                <FormActions align="left">
                    <Button
                        type="submit"
                        variant="contained"
                        size="lg"
                        fullWidth
                        loading={isLoading}
                        disabled={isLoading}
                    >
                        {isLoading ? 'Signing in...' : 'Sign In'}
                    </Button>
                </FormActions>
            </Form>

            <AuthLink
                text="Don't have an account?"
                linkText="Create one"
                href={authNavigation.register}
            />
        </>
    );
}
