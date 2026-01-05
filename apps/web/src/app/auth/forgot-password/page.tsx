'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { object, string } from 'yup';
import { ArrowLeft, CheckCircle, Mail, Lock } from 'lucide-react';

import { useAuth } from '@libs/react-shared';
import { errorMessage } from '@libs/utils';
import { Typography } from '@web/components/ui/typography';
import { Button } from '@web/components/ui/button';
import { Icon } from '@web/components/ui/icons';
import { Stack } from '@web/components/ui/stack';
import OTPInput from '@web/components/ui/otp-input';
import {
    Form,
    FormInput,
    FormPasswordInput,
    FormActions,
    FormError,
    useAppForm,
} from '@web/components/ui/form';
import { AuthHeader } from '@web/components/auth';
import { authNavigation } from '@web/config';

// Validation Schemas
const emailSchema = object().shape({
    email: string()
        .trim()
        .email('Please enter a valid email address')
        .required('Email is required'),
});

const passwordSchema = object().shape({
    newPassword: string()
        .trim()
        .min(8, 'Password must be at least 8 characters')
        .required('New password is required'),
    confirmPassword: string()
        .trim()
        .required('Please confirm your password'),
});

// Step Enum
enum Step {
    EMAIL = 'email',
    OTP = 'otp',
    RESET = 'reset',
    SUCCESS = 'success',
}

export default function ForgotPasswordPage() {
    const router = useRouter();
    const { forgotPassword, verifyForgotPasswordOtp, resetPassword } = useAuth();

    const [currentStep, setCurrentStep] = useState<Step>(Step.EMAIL);
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [resetToken, setResetToken] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Email Form
    const emailForm = useAppForm<{ email: string }>({
        defaultValues: { email: '' },
        schema: emailSchema,
    });

    // Password Form
    const passwordForm = useAppForm<{ newPassword: string; confirmPassword: string }>({
        defaultValues: { newPassword: '', confirmPassword: '' },
        schema: passwordSchema,
    });

    // Handle Email Submit
    const handleEmailSubmit = async (values: { email: string }) => {
        setIsLoading(true);
        setError(null);

        try {
            await forgotPassword({ email: values.email });
            setEmail(values.email);
            setCurrentStep(Step.OTP);
            setOtp('');
        } catch (err) {
            setError(errorMessage(err));
        } finally {
            setIsLoading(false);
        }
    };

    // Handle OTP Submit
    const handleOtpSubmit = async () => {
        if (otp.length !== 4) return;

        setIsLoading(true);
        setError(null);

        try {
            const response = await verifyForgotPasswordOtp({ email, otp });
            const token = (response as any)?.resetToken || (response as any)?.token;

            if (token) {
                setResetToken(token);
                setCurrentStep(Step.RESET);
            } else {
                throw new Error('Reset token not received');
            }
        } catch (err) {
            setError(errorMessage(err));
            setOtp('');
        } finally {
            setIsLoading(false);
        }
    };

    // Handle Password Reset
    const handlePasswordReset = async (values: { newPassword: string; confirmPassword: string }) => {
        if (values.newPassword !== values.confirmPassword) {
            passwordForm.setError('confirmPassword', {
                message: 'Passwords do not match',
            });
            return;
        }

        if (!resetToken) {
            setError('Reset token is missing. Please start over.');
            return;
        }

        setIsLoading(true);
        setError(null);

        try {
            await resetPassword({
                token: resetToken,
                newPassword: values.newPassword,
            } as any);
            setCurrentStep(Step.SUCCESS);
        } catch (err) {
            setError(errorMessage(err));
        } finally {
            setIsLoading(false);
        }
    };

    const handleBackToEmail = () => {
        setCurrentStep(Step.EMAIL);
        setOtp('');
        setError(null);
    };

    const handleResendOtp = () => {
        handleEmailSubmit({ email });
    };

    // Render Step Content
    const renderStep = () => {
        switch (currentStep) {
            case Step.EMAIL:
                return (
                    <>
                        <AuthHeader
                            title="Forgot password?"
                            subtitle="Enter your email address and we'll send you a verification code"
                        />

                        <Form form={emailForm} onSubmit={handleEmailSubmit}>
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

                            <FormActions align="left">
                                <Button
                                    type="submit"
                                    variant="contained"
                                    size="lg"
                                    fullWidth
                                    loading={isLoading}
                                    disabled={isLoading}
                                >
                                    {isLoading ? 'Sending...' : 'Send Verification Code'}
                                </Button>
                            </FormActions>
                        </Form>

                        <div className="mt-6 text-center">
                            <Link
                                href={authNavigation.login}
                                className="inline-flex items-center gap-2 text-primary font-medium hover:text-primary-dark transition-colors"
                            >
                                <ArrowLeft className="w-4 h-4" />
                                Back to Login
                            </Link>
                        </div>
                    </>
                );

            case Step.OTP:
                return (
                    <>
                        <AuthHeader
                            title="Enter verification code"
                            subtitle={`We've sent a 4-digit code to ${email}`}
                        />

                        <Stack spacing={5} direction="column">
                            <FormError message={error} />

                            <div className="flex flex-col items-center space-y-4">
                                <OTPInput
                                    value={otp}
                                    onChange={setOtp}
                                    numInputs={4}
                                    shouldAutoFocus
                                    inputType="number"
                                    containerStyle={{ gap: '12px', justifyContent: 'center' }}
                                    renderInput={(props) => (
                                        <input
                                            {...props}
                                            className="w-12 h-12 text-center text-xl font-semibold border-2 border-neutral-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all duration-200 hover:border-primary/50 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                        />
                                    )}
                                />
                            </div>

                            <Button
                                type="button"
                                variant="contained"
                                size="lg"
                                fullWidth
                                loading={isLoading}
                                disabled={isLoading || otp.length !== 4}
                                onClick={handleOtpSubmit}
                            >
                                {isLoading ? 'Verifying...' : 'Verify Code'}
                            </Button>

                            <Stack spacing={3} direction="column" alignItems="center">
                                <Typography variant="body2" color="text-secondary">
                                    Didn't receive the code?{' '}
                                    <button
                                        type="button"
                                        onClick={handleResendOtp}
                                        className="text-primary font-medium hover:text-primary-dark transition-colors"
                                        disabled={isLoading}
                                    >
                                        Resend
                                    </button>
                                </Typography>

                                <button
                                    type="button"
                                    onClick={handleBackToEmail}
                                    className="inline-flex items-center gap-2 text-text-secondary hover:text-text-primary transition-colors"
                                >
                                    <ArrowLeft className="w-4 h-4" />
                                    Change email
                                </button>
                            </Stack>
                        </Stack>
                    </>
                );

            case Step.RESET:
                return (
                    <>
                        <AuthHeader
                            title="Create new password"
                            subtitle="Enter a strong password for your account"
                        />

                        <Form form={passwordForm} onSubmit={handlePasswordReset}>
                            <FormError message={error} />

                            <FormPasswordInput
                                name="newPassword"
                                label="New Password"
                                placeholder="••••••••"
                                leftIcon={<Icon icon={Lock} />}
                                fullWidth
                                inputSize="lg"
                                autoComplete="new-password"
                                required
                            />

                            <FormPasswordInput
                                name="confirmPassword"
                                label="Confirm Password"
                                placeholder="••••••••"
                                leftIcon={<Icon icon={Lock} />}
                                fullWidth
                                inputSize="lg"
                                autoComplete="new-password"
                                required
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
                                    {isLoading ? 'Resetting...' : 'Reset Password'}
                                </Button>
                            </FormActions>
                        </Form>
                    </>
                );

            case Step.SUCCESS:
                return (
                    <Stack spacing={6} direction="column" alignItems="center" className="py-6">
                        <div className="w-16 h-16 rounded-full bg-success/10 flex items-center justify-center">
                            <CheckCircle className="w-8 h-8 text-success" />
                        </div>

                        <AuthHeader
                            title="Password reset successful!"
                            subtitle="Your password has been changed. You can now sign in with your new password."
                        />

                        <Stack spacing={3} direction="column" className="w-full">
                            <Button
                                type="button"
                                variant="contained"
                                size="lg"
                                fullWidth
                                onClick={() => router.push(authNavigation.login)}
                            >
                                Sign In Now
                            </Button>

                            <Link
                                href="/"
                                className="block text-center text-primary font-medium hover:text-primary-dark transition-colors"
                            >
                                Go to Homepage
                            </Link>
                        </Stack>
                    </Stack>
                );

            default:
                return null;
        }
    };

    return renderStep();
}
