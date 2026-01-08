/**
 * =================================================================
 * LOGIN SCREEN
 * =================================================================
 *
 * User login screen with email/password form.
 * Similar layout patterns to the admin app's login page.
 */

import { useState, useCallback } from 'react';
import { View, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { router, Link } from 'expo-router';

import { Screen, AppText, AppButton, AppInput, AppDivider } from '../../src/components';
import { useAuth } from '@libs/react-shared';
import { useAppTheme } from '../../src/theme';
import { spacing } from '../../src/constants';

/**
 * Basic validation helper
 *
 * TODO: Replace with zod or yup for more robust validation
 * Example with zod:
 * ```
 * import { z } from 'zod';
 *
 * const loginSchema = z.object({
 *   email: z.string().email('Invalid email'),
 *   password: z.string().min(6, 'Password must be at least 6 characters'),
 * });
 * ```
 */
function validateForm(email: string, password: string): string | null {
    if (!email.trim()) {
        return 'Email is required';
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
        return 'Please enter a valid email';
    }
    if (!password) {
        return 'Password is required';
    }
    if (password.length < 6) {
        return 'Password must be at least 6 characters';
    }
    return null;
}

export default function LoginScreen() {
    const { login, isLoading } = useAuth();
    const theme = useAppTheme();

    // Form state
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);

    // Handle form submission
    const handleSubmit = useCallback(async () => {
        // Clear previous error
        setError(null);

        // Validate form
        const validationError = validateForm(email, password);
        if (validationError) {
            setError(validationError);
            return;
        }

        try {
            await login({
                providerName: 'email',
                credentials: { email: email.trim(), password },
            });
            // Navigation is handled by auth provider/layout
        } catch (err: any) {
            setError(err.message || 'Login failed. Please try again.');
        }
    }, [email, password, login]);

    return (
        <Screen scroll keyboardAvoiding padded>
            <View style={styles.container}>
                {/* Header */}
                <View style={styles.header}>
                    <AppText variant="h3" bold>
                        Welcome Back
                    </AppText>
                    <AppText variant="body1" secondary style={styles.subtitle}>
                        Sign in to continue to your account
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

                    {/* Password input */}
                    <AppInput
                        label="Password"
                        value={password}
                        onChangeText={setPassword}
                        secureTextEntry
                        autoComplete="password"
                        textContentType="password"
                    />

                    {/* Forgot password link */}
                    <TouchableOpacity
                        onPress={() => router.push('/(auth)/forgot-password')}
                        style={styles.forgotPassword}
                    >
                        <AppText
                            variant="body2"
                            style={{ color: theme.colors.primary }}
                        >
                            Forgot Password?
                        </AppText>
                    </TouchableOpacity>

                    {/* Submit button */}
                    <AppButton
                        fullWidth
                        loading={isLoading}
                        onPress={handleSubmit}
                        style={styles.submitButton}
                    >
                        Sign In
                    </AppButton>
                </View>

                {/* Divider */}
                <AppDivider label="or" marginVertical={spacing.lg} />

                {/* Register link */}
                <View style={styles.registerContainer}>
                    <AppText variant="body2" secondary>
                        Don't have an account?{' '}
                    </AppText>
                    <TouchableOpacity onPress={() => router.push('/(auth)/register')}>
                        <AppText
                            variant="body2"
                            bold
                            style={{ color: theme.colors.primary }}
                        >
                            Sign Up
                        </AppText>
                    </TouchableOpacity>
                </View>
            </View>
        </Screen>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: spacing.xl,
    },
    header: {
        marginBottom: spacing.xl,
    },
    subtitle: {
        marginTop: spacing.xs,
    },
    form: {
        gap: spacing.xs,
    },
    errorContainer: {
        padding: spacing.md,
        borderRadius: 8,
        marginBottom: spacing.md,
    },
    forgotPassword: {
        alignSelf: 'flex-end',
        marginTop: spacing.xs,
        marginBottom: spacing.sm,
    },
    submitButton: {
        marginTop: spacing.md,
    },
    registerContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
});
