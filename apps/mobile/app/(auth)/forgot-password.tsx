/**
 * =================================================================
 * FORGOT PASSWORD SCREEN
 * =================================================================
 *
 * Multi-step password reset flow:
 * 1. EMAIL - Enter email to receive OTP
 * 2. OTP - Enter verification code sent to email
 * 3. RESET - Enter new password
 * 4. SUCCESS - Show success message
 */

import { View, StyleSheet, TouchableOpacity, Alert, Image } from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { useState } from 'react';

import { Screen, AppText, AppButton } from '../../src/components';
import { useAuth } from '@libs/react-shared';
import { spacing, colors } from '../../src/constants';
import {
    FormContainer,
    RHFTextField,
    RHFPassword,
    forgotPasswordSchema,
    resetPasswordSchema,
    useFormSubmit,
    OTPInput
} from '../../src/form';

import { images } from '@/assets';
/**
 * Steps in the forgot password flow
 */
enum ForgotPasswordStep {
    EMAIL = 'email',
    OTP = 'otp',
    RESET = 'reset',
    SUCCESS = 'success'
}

export default function ForgotPasswordScreen() {
    const { forgotPassword, verifyForgotPasswordOtp, resetPassword } = useAuth();
    const insets = useSafeAreaInsets();

    // Step state
    const [currentStep, setCurrentStep] = useState<ForgotPasswordStep>(ForgotPasswordStep.EMAIL);
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [resetToken, setResetToken] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    /**
     * Step 1: Handle email submission - Send OTP
     */
    const handleEmailSubmit = async (data: { email: string }) => {
        setIsLoading(true);
        setError(null);
        try {
            await forgotPassword({ email: data.email.trim() });
            setEmail(data.email.trim());
            setCurrentStep(ForgotPasswordStep.OTP);
            setOtp('');
        } catch (err: any) {
            const message = err?.response?.data?.message ?? err?.message ?? 'Failed to send OTP';
            setError(Array.isArray(message) ? message.join('\n') : message);
        } finally {
            setIsLoading(false);
        }
    };

    /**
     * Step 2: Handle OTP verification
     */
    const handleOtpSubmit = async () => {
        if (otp.length !== 4) {
            setError('Please enter a valid 4-digit code');
            return;
        }

        setIsLoading(true);
        setError(null);
        try {
            const response = await verifyForgotPasswordOtp({ email, otp });
            // Extract resetToken from response
            const token = (response as any)?.resetToken || (response as any)?.token;
            if (token) {
                setResetToken(token);
                setCurrentStep(ForgotPasswordStep.RESET);
            } else {
                throw new Error('Reset token not received');
            }
        } catch (err: any) {
            const message = err?.response?.data?.message ?? err?.message ?? 'Invalid verification code';
            setError(Array.isArray(message) ? message.join('\n') : message);
            setOtp('');
        } finally {
            setIsLoading(false);
        }
    };

    /**
     * Step 3: Handle password reset
     */
    const handlePasswordReset = async (data: { password: string; confirmPassword: string }) => {
        if (data.password !== data.confirmPassword) {
            setError('Passwords do not match');
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
                newPassword: data.password,
            } as any);
            setCurrentStep(ForgotPasswordStep.SUCCESS);
        } catch (err: any) {
            const message = err?.response?.data?.message ?? err?.message ?? 'Failed to reset password';
            setError(Array.isArray(message) ? message.join('\n') : message);
        } finally {
            setIsLoading(false);
        }
    };

    /**
     * Resend OTP
     */
    const handleResendOtp = async () => {
        setIsLoading(true);
        setError(null);
        try {
            await forgotPassword({ email });
            setOtp('');
            Alert.alert('OTP Sent', 'A new verification code has been sent to your email.');
        } catch (err: any) {
            const message = err?.response?.data?.message ?? err?.message ?? 'Failed to resend OTP';
            setError(Array.isArray(message) ? message.join('\n') : message);
        } finally {
            setIsLoading(false);
        }
    };

    /**
     * Navigation helpers
     */
    const handleBackToEmail = () => {
        setCurrentStep(ForgotPasswordStep.EMAIL);
        setOtp('');
        setError(null);
    };

    const handleBackToOtp = () => {
        setCurrentStep(ForgotPasswordStep.OTP);
        setError(null);
    };

    /**
     * Render current step content
     */
    const renderStepContent = () => {
        switch (currentStep) {
            case ForgotPasswordStep.EMAIL:
                return <EmailStep onSubmit={handleEmailSubmit} isLoading={isLoading} error={error} />;

            case ForgotPasswordStep.OTP:
                return (
                    <OTPStep
                        email={email}
                        otp={otp}
                        setOtp={setOtp}
                        onSubmit={handleOtpSubmit}
                        onResend={handleResendOtp}
                        onBack={handleBackToEmail}
                        isLoading={isLoading}
                        error={error}
                    />
                );

            case ForgotPasswordStep.RESET:
                return (
                    <ResetPasswordStep
                        onSubmit={handlePasswordReset}
                        onBack={handleBackToOtp}
                        isLoading={isLoading}
                        error={error}
                    />
                );

            case ForgotPasswordStep.SUCCESS:
                return <SuccessStep />;

            default:
                return null;
        }
    };

    return (
        <Screen scroll keyboardAvoiding edges={['top']}>
            <View style={[styles.container, { paddingTop: insets.top + spacing.sm }]}>
                {/* Back button - only show on EMAIL step */}
                {currentStep === ForgotPasswordStep.EMAIL && (
                    <TouchableOpacity
                        onPress={() => router.back()}
                        style={styles.backButton}
                    >
                        <Feather name="arrow-left" size={24} color={colors.primary.main} />
                    </TouchableOpacity>
                )}

                {/* Logo Section */}
                <View style={styles.logoSection}>
                    <View style={styles.logoContainer}>
                        <Image
                            source={images.logoSmall}
                            style={styles.logo}
                            resizeMode="contain"
                        />
                    </View>
                </View>

                {/* Step Content */}
                {renderStepContent()}
            </View>
        </Screen>
    );
}

/**
 * Step 1: Email Entry
 */
function EmailStep({
    onSubmit,
    isLoading,
    error
}: {
    onSubmit: (data: { email: string }) => Promise<void>;
    isLoading: boolean;
    error: string | null;
}) {
    return (
        <>
            {/* Header */}
            <View style={styles.header}>
                <AppText variant="h3" bold style={styles.title}>
                    Forgot Password?
                </AppText>
                <AppText variant="body2" secondary style={styles.subtitle}>
                    Enter your email and we'll send you a verification code.
                </AppText>
            </View>

            {/* Error message */}
            {error && (
                <View style={styles.errorContainer}>
                    <Feather name="alert-circle" size={16} color={colors.error.main} />
                    <AppText variant="body2" style={styles.errorText}>{error}</AppText>
                </View>
            )}

            {/* Form */}
            <FormContainer
                validationSchema={forgotPasswordSchema}
                defaultValues={{ email: '' }}
            >
                <EmailFormContent onSubmit={onSubmit} isLoading={isLoading} />
            </FormContainer>

            {/* Back to login link */}
            <View style={styles.linkContainer}>
                <AppText variant="body2" secondary>
                    Remember your password?{' '}
                </AppText>
                <TouchableOpacity onPress={() => router.replace('/(auth)/login')}>
                    <AppText variant="body2" bold style={{ color: colors.primary.main }}>
                        Sign In
                    </AppText>
                </TouchableOpacity>
            </View>
        </>
    );
}

function EmailFormContent({
    onSubmit,
    isLoading
}: {
    onSubmit: (data: any) => Promise<void>;
    isLoading: boolean;
}) {
    const { handleSubmit } = useFormSubmit();

    return (
        <View style={styles.form}>
            <RHFTextField
                name="email"
                label="Email Address"
                placeholder="Enter your email"
                keyboardType="email-address"
                autoCapitalize="none"
                autoComplete="email"
                textContentType="emailAddress"
                leftIcon={<Feather name="mail" size={18} color={colors.grey[400]} />}
            />

            <AppButton
                fullWidth
                loading={isLoading}
                onPress={handleSubmit(onSubmit)}
                style={styles.submitButton}
            >
                Send Verification Code
            </AppButton>
        </View>
    );
}

/**
 * Step 2: OTP Verification
 */
function OTPStep({
    email,
    otp,
    setOtp,
    onSubmit,
    onResend,
    onBack,
    isLoading,
    error,
}: {
    email: string;
    otp: string;
    setOtp: (otp: string) => void;
    onSubmit: () => Promise<void>;
    onResend: () => Promise<void>;
    onBack: () => void;
    isLoading: boolean;
    error: string | null;
}) {
    return (
        <>
            {/* Header */}
            <View style={styles.header}>
                <AppText variant="h3" bold style={styles.title}>
                    Enter Verification Code
                </AppText>
                <AppText variant="body2" secondary style={styles.subtitle}>
                    We've sent a 4-digit code to
                </AppText>
                <AppText variant="body2" bold style={{ marginTop: spacing.xs }}>
                    {email}
                </AppText>
            </View>

            {/* Error message */}
            {error && (
                <View style={styles.errorContainer}>
                    <Feather name="alert-circle" size={16} color={colors.error.main} />
                    <AppText variant="body2" style={styles.errorText}>{error}</AppText>
                </View>
            )}

            {/* OTP Input */}
            <View style={styles.otpContainer}>
                <OTPInput
                    value={otp}
                    onChange={setOtp}
                    length={4}
                    autoFocus
                    error={!!error}
                    disabled={isLoading}
                />
            </View>

            {/* Verify Button */}
            <AppButton
                fullWidth
                loading={isLoading}
                disabled={otp.length !== 4}
                onPress={onSubmit}
                style={styles.submitButton}
            >
                Verify Code
            </AppButton>

            {/* Resend link */}
            <View style={styles.linkContainer}>
                <AppText variant="body2" secondary>
                    Didn't receive the code?{' '}
                </AppText>
                <TouchableOpacity onPress={onResend} disabled={isLoading}>
                    <AppText variant="body2" bold style={{ color: colors.primary.main }}>
                        Resend
                    </AppText>
                </TouchableOpacity>
            </View>

            {/* Change email link */}
            <TouchableOpacity onPress={onBack} style={styles.changeEmailButton} disabled={isLoading}>
                <Feather name="arrow-left" size={16} color={colors.primary.main} />
                <AppText variant="body2" style={{ color: colors.primary.main, marginLeft: spacing.xs }}>
                    Change Email
                </AppText>
            </TouchableOpacity>
        </>
    );
}

/**
 * Step 3: Reset Password
 */
function ResetPasswordStep({
    onSubmit,
    onBack,
    isLoading,
    error,
}: {
    onSubmit: (data: { password: string; confirmPassword: string }) => Promise<void>;
    onBack: () => void;
    isLoading: boolean;
    error: string | null;
}) {
    return (
        <>
            {/* Header */}
            <View style={styles.header}>
                <AppText variant="h3" bold style={styles.title}>
                    Reset Password
                </AppText>
                <AppText variant="body2" secondary style={styles.subtitle}>
                    Create a new password for your account
                </AppText>
            </View>

            {/* Error message */}
            {error && (
                <View style={styles.errorContainer}>
                    <Feather name="alert-circle" size={16} color={colors.error.main} />
                    <AppText variant="body2" style={styles.errorText}>{error}</AppText>
                </View>
            )}

            {/* Form */}
            <FormContainer
                validationSchema={resetPasswordSchema}
                defaultValues={{ password: '', confirmPassword: '' }}
            >
                <ResetPasswordFormContent onSubmit={onSubmit} isLoading={isLoading} onBack={onBack} />
            </FormContainer>
        </>
    );
}

function ResetPasswordFormContent({
    onSubmit,
    isLoading,
    onBack,
}: {
    onSubmit: (data: any) => Promise<void>;
    isLoading: boolean;
    onBack: () => void;
}) {
    const { handleSubmit } = useFormSubmit();

    return (
        <View style={styles.form}>
            <RHFPassword
                name="password"
                label="New Password"
                placeholder="Enter new password"
                autoComplete="password-new"
                textContentType="newPassword"
                leftIcon={<Feather name="lock" size={18} color={colors.grey[400]} />}
            />

            <RHFPassword
                name="confirmPassword"
                label="Confirm Password"
                placeholder="Confirm new password"
                autoComplete="password-new"
                textContentType="newPassword"
                leftIcon={<Feather name="lock" size={18} color={colors.grey[400]} />}
            />

            <AppButton
                fullWidth
                loading={isLoading}
                onPress={handleSubmit(onSubmit)}
                style={styles.submitButton}
            >
                Reset Password
            </AppButton>

            {/* Back link */}
            <TouchableOpacity onPress={onBack} style={styles.changeEmailButton} disabled={isLoading}>
                <Feather name="arrow-left" size={16} color={colors.primary.main} />
                <AppText variant="body2" style={{ color: colors.primary.main, marginLeft: spacing.xs }}>
                    Back to Verification
                </AppText>
            </TouchableOpacity>
        </View>
    );
}

/**
 * Step 4: Success
 */
function SuccessStep() {
    return (
        <View style={styles.successContainer}>
            <View style={styles.successIconCircle}>
                <Feather name="check" size={48} color={colors.success.main} />
            </View>

            <AppText variant="h3" bold style={styles.successTitle}>
                Password Reset Successful!
            </AppText>

            <AppText variant="body2" secondary style={styles.successText}>
                Your password has been successfully reset.{'\n'}
                You can now sign in with your new password.
            </AppText>

            <AppButton
                fullWidth
                onPress={() => router.replace('/(auth)/login')}
                style={styles.submitButton}
            >
                Sign In Now
            </AppButton>

            <TouchableOpacity onPress={() => router.replace('/(tabs)/home')} style={styles.homeLink}>
                <AppText variant="body2" style={{ color: colors.primary.main }}>
                    Go to Homepage
                </AppText>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    backButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: colors.grey[100],
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: spacing.md,
    },
    logoSection: {
        alignItems: 'center',
        marginTop: spacing.md,
        marginBottom: spacing.lg,
    },
    logoContainer: {
        width: 100,
        height: 100,
        borderRadius: 20,
        backgroundColor: colors.background.neutral,
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden',
    },
    logo: {
        width: 80,
        height: 80,
    },
    header: {
        alignItems: 'center',
        marginBottom: spacing.lg,
    },
    title: {
        marginBottom: spacing.xs,
    },
    subtitle: {
        textAlign: 'center',
        lineHeight: 22,
    },
    form: {
        gap: spacing.sm,
    },
    errorContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.error.lighter,
        borderColor: colors.error.light,
        borderWidth: 1,
        borderRadius: 8,
        padding: spacing.sm,
        marginBottom: spacing.md,
        gap: spacing.xs,
    },
    errorText: {
        color: colors.error.main,
        flex: 1,
    },
    submitButton: {
        marginTop: spacing.sm,
    },
    linkContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: spacing.xl,
        paddingBottom: spacing.md,
    },
    otpContainer: {
        marginBottom: spacing.lg,
        alignItems: 'center',
    },
    changeEmailButton: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: spacing.md,
    },
    successContainer: {
        alignItems: 'center',
        paddingTop: spacing.xl,
    },
    successIconCircle: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: colors.success.lighter,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: spacing.lg,
    },
    successTitle: {
        marginBottom: spacing.sm,
        textAlign: 'center',
    },
    successText: {
        textAlign: 'center',
        marginBottom: spacing.xl,
        lineHeight: 22,
    },
    homeLink: {
        padding: spacing.md,
    },
});
