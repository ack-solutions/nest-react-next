'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { object, string } from 'yup';
import { Mail, Lock, User, Gift } from 'lucide-react';

import { useAuth } from '@libs/react-shared';
import { errorMessage } from '@libs/utils';
import { Typography } from '@web/components/ui/typography';
import { Button } from '@web/components/ui/button';
import { Icon } from '@web/components/ui/icons';
import Checkbox from '@web/components/ui/checkbox';
import {
    Form,
    FormInput,
    FormPasswordInput,
    FormRow,
    FormActions,
    FormError,
    useAppForm,
} from '@web/components/ui/form';
import { AuthHeader, AuthLink } from '@web/components/auth';
import { authNavigation } from '@web/config';

// Validation Schema
const registerSchema = object().shape({
    firstName: string()
        .trim()
        .required('First name is required'),
    lastName: string()
        .trim()
        .required('Last name is required'),
    email: string()
        .trim()
        .email('Please enter a valid email address')
        .required('Email is required'),
    password: string()
        .trim()
        .min(8, 'Password must be at least 8 characters')
        .required('Password is required'),
    referralCode: string()
        .trim()
        .optional(),
});

interface RegisterFormData {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    referralCode?: string;
}

export default function RegisterPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { signup } = useAuth();

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [agreedToTerms, setAgreedToTerms] = useState(false);

    // Get referral code from URL query params (?ref=CODE)
    const urlReferralCode = searchParams.get('ref') || '';

    const form = useAppForm<RegisterFormData>({
        defaultValues: {
            firstName: '',
            lastName: '',
            email: '',
            password: '',
            referralCode: urlReferralCode,
        },
        schema: registerSchema,
    });

    // Update referral code if URL params change
    useEffect(() => {
        if (urlReferralCode) {
            form.setValue('referralCode', urlReferralCode.toUpperCase());
        }
    }, [urlReferralCode, form]);

    const handleRegister = async (values: RegisterFormData) => {
        if (!agreedToTerms) {
            setError('Please agree to the Terms of Service and Privacy Policy');
            return;
        }

        setIsLoading(true);
        setError(null);

        try {
            await signup(values);

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
    };

    return (
        <>
            <AuthHeader
                title="Create an account"
                subtitle="Join us and start your journey today"
            />

            <Form form={form} onSubmit={handleRegister}>
                <FormError message={error} />

                <FormRow columns={2}>
                    <FormInput
                        name="firstName"
                        label="First Name"
                        type="text"
                        placeholder="John"
                        leftIcon={<Icon icon={User} />}
                        fullWidth
                        inputSize="lg"
                        autoComplete="given-name"
                        required
                    />
                    <FormInput
                        name="lastName"
                        label="Last Name"
                        type="text"
                        placeholder="Doe"
                        leftIcon={<Icon icon={User} />}
                        fullWidth
                        inputSize="lg"
                        autoComplete="family-name"
                        required
                    />
                </FormRow>

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
                    autoComplete="new-password"
                    required
                />

                <FormInput
                    name="referralCode"
                    label="Referral Code"
                    type="text"
                    placeholder="Enter referral code (optional)"
                    leftIcon={<Icon icon={Gift} />}
                    fullWidth
                    inputSize="lg"
                />

                <Checkbox
                    size="small"
                    checked={agreedToTerms}
                    onChange={(e) => setAgreedToTerms(e.target.checked)}
                    label={
                        <Typography variant="body2" className="leading-5">
                            I agree to the{' '}
                            <Link
                                href="/terms-and-conditions"
                                target="_blank"
                                className="text-primary font-medium hover:text-primary-dark"
                            >
                                Terms of Service
                            </Link>
                            {' '}and{' '}
                            <Link
                                href="/privacy-policy"
                                target="_blank"
                                className="text-primary font-medium hover:text-primary-dark"
                            >
                                Privacy Policy
                            </Link>
                        </Typography>
                    }
                />

                <FormActions align="left">
                    <Button
                        type="submit"
                        variant="contained"
                        size="lg"
                        fullWidth
                        loading={isLoading}
                        disabled={isLoading}
                    >
                        {isLoading ? 'Creating account...' : 'Create Account'}
                    </Button>
                </FormActions>
            </Form>

            <AuthLink
                text="Already have an account?"
                linkText="Sign in"
                href={authNavigation.login}
            />
        </>
    );
}
