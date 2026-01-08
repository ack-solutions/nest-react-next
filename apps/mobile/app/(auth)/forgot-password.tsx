/**
 * =================================================================
 * FORGOT PASSWORD SCREEN
 * =================================================================
 *
 * Password reset request screen.
 * Similar pattern to the admin app's forgot-password page.
 */

import { useState, useCallback } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';

import { Screen, AppText, AppButton, AppInput } from '../../src/components';
import { useAuth } from '@libs/react-shared';
import { useAppTheme } from '../../src/theme';
import { spacing } from '../../src/constants';

export default function ForgotPasswordScreen() {
    const { forgotPassword, isLoading } = useAuth();
    const theme = useAppTheme();

    // Form state
    const [email, setEmail] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    // Handle form submission
    const handleSubmit = useCallback(async () => {
        setError(null);

        // Validate email
        if (!email.trim()) {
            setError('Email is required');
            return;
        }
        if (!/\S+@\S+\.\S+/.test(email)) {
            setError('Please enter a valid email');
            return;
        }

        try {
            await forgotPassword({ email: email.trim() });
            setSuccess(true);
        } catch (err: any) {
            setError(err.message || 'Failed to send reset email. Please try again.');
        }
    }, [email, forgotPassword]);

    // Success state
    if (success) {
        return (
            <Screen centered padded>
                <View style={styles.successContainer}>
                    <View
                        style={[
                            styles.iconContainer,
                            { backgroundColor: theme.colors.primaryContainer },
                        ]}
                    >
                        <AppText variant="h2">📧</AppText>
                    </View>

                    <AppText variant="h4" bold center>
                        Check Your Email
                    </AppText>

                    <AppText
                        variant="body1"
                        secondary
                        center
                        style={styles.successText}
                    >
                        We've sent password reset instructions to {email}
                    </AppText>

                    <AppButton
                        fullWidth
                        onPress={() => router.replace('/(auth)/login')}
                        style={styles.successButton}
                    >
                        Back to Login
                    </AppButton>

                    <TouchableOpacity
                        onPress={() => setSuccess(false)}
                        style={styles.resendLink}
                    >
                        <AppText
                            variant="body2"
                            style={{ color: theme.colors.primary }}
                        >
                            Didn't receive email? Try again
                        </AppText>
                    </TouchableOpacity>
                </View>
            </Screen>
        );
    }

    return (
        <Screen scroll keyboardAvoiding padded>
            <View style={styles.container}>
                {/* Back button */}
                <TouchableOpacity
                    onPress={() => router.back()}
                    style={styles.backButton}
                >
                    <AppText style={{ color: theme.colors.primary }}>
                        ← Back
                    </AppText>
                </TouchableOpacity>

                {/* Header */}
                <View style={styles.header}>
                    <AppText variant="h3" bold>
                        Forgot Password?
                    </AppText>
                    <AppText variant="body1" secondary style={styles.subtitle}>
                        Enter your email and we'll send you instructions to reset your password.
                    </AppText>
                </View>

                {/* Form */}
                <View style={styles.form}>
                    {/* Error message */}
                    {error && (
                        <View
                            style={[
                                styles.errorContainer,
                                { backgroundColor: theme.colors.errorContainer },
                            ]}
                        >
                            <AppText
                                variant="body2"
                                style={{ color: theme.colors.onErrorContainer }}
                            >
                                {error}
                            </AppText>
                        </View>
                    )}

                    {/* Email input */}
                    <AppInput
                        label="Email"
                        value={email}
                        onChangeText={setEmail}
                        keyboardType="email-address"
                        autoCapitalize="none"
                        autoComplete="email"
                        textContentType="emailAddress"
                    />

                    {/* Submit button */}
                    <AppButton
                        fullWidth
                        loading={isLoading}
                        onPress={handleSubmit}
                        style={styles.submitButton}
                    >
                        Send Reset Email
                    </AppButton>
                </View>
            </View>
        </Screen>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: spacing.md,
    },
    backButton: {
        marginBottom: spacing.lg,
    },
    header: {
        marginBottom: spacing.xl,
    },
    subtitle: {
        marginTop: spacing.sm,
    },
    form: {
        gap: spacing.xs,
    },
    errorContainer: {
        padding: spacing.md,
        borderRadius: 8,
        marginBottom: spacing.md,
    },
    submitButton: {
        marginTop: spacing.md,
    },
    successContainer: {
        alignItems: 'center',
        paddingHorizontal: spacing.lg,
    },
    iconContainer: {
        width: 80,
        height: 80,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: spacing.lg,
    },
    successText: {
        marginTop: spacing.sm,
        marginBottom: spacing.xl,
    },
    successButton: {
        marginBottom: spacing.md,
    },
    resendLink: {
        padding: spacing.sm,
    },
});
