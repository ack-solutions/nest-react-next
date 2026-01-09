/**
 * =================================================================
 * REGISTER SCREEN
 * =================================================================
 *
 * User registration screen with form.
 */

import { useState, useCallback } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';

import { Screen, AppText, AppButton, AppInput, AppDivider } from '../../src/components';
import { useAuth } from '@libs/react-shared';
import { useAppTheme } from '../../src/theme';
import { spacing } from '../../src/constants';

/**
 * Basic validation helper
 *
 * TODO: Replace with zod or yup for more robust validation
 */
function validateForm(
    email: string,
    password: string,
    confirmPassword: string
): string | null {
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
    if (password !== confirmPassword) {
        return 'Passwords do not match';
    }
    return null;
}

export default function RegisterScreen() {
    const { signup, isLoading } = useAuth();
    const theme = useAppTheme();

    // Form state
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState<string | null>(null);

    // Handle form submission
    const handleSubmit = useCallback(async () => {
        setError(null);

        const validationError = validateForm(email, password, confirmPassword);
        if (validationError) {
            setError(validationError);
            return;
        }

        try {
            await signup({
                email: email.trim(),
                password,
                firstName: firstName.trim() || undefined,
                lastName: lastName.trim() || undefined,
            });
            // Navigation is handled by auth provider/layout
        } catch (err: any) {
            setError(err.message || 'Registration failed. Please try again.');
        }
    }, [email, password, confirmPassword, firstName, lastName, signup]);

    return (
        <Screen scroll keyboardAvoiding padded>
            <View style={styles.container}>
                {/* Header */}
                <View style={styles.header}>
                    <AppText variant="h3" bold>
                        Create Account
                    </AppText>
                    <AppText variant="body1" secondary style={styles.subtitle}>
                        Sign up to get started
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

                    {/* Name inputs */}
                    <View style={styles.nameRow}>
                        <AppInput
                            label="First Name"
                            value={firstName}
                            onChangeText={setFirstName}
                            autoCapitalize="words"
                            containerStyle={styles.nameInput}
                        />
                        <AppInput
                            label="Last Name"
                            value={lastName}
                            onChangeText={setLastName}
                            autoCapitalize="words"
                            containerStyle={styles.nameInput}
                        />
                    </View>

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
                        autoComplete="password-new"
                        textContentType="newPassword"
                    />

                    {/* Confirm password input */}
                    <AppInput
                        label="Confirm Password"
                        value={confirmPassword}
                        onChangeText={setConfirmPassword}
                        secureTextEntry
                        autoComplete="password-new"
                        textContentType="newPassword"
                    />

                    {/* Submit button */}
                    <AppButton
                        fullWidth
                        loading={isLoading}
                        onPress={handleSubmit}
                        style={styles.submitButton}
                    >
                        Create Account
                    </AppButton>
                </View>

                {/* Divider */}
                <AppDivider label="or" marginVertical={spacing.lg} />

                {/* Login link */}
                <View style={styles.loginContainer}>
                    <AppText variant="body2" secondary>
                        Already have an account?{' '}
                    </AppText>
                    <TouchableOpacity onPress={() => router.replace('/(auth)/login')}>
                        <AppText
                            variant="body2"
                            bold
                            style={{ color: theme.colors.primary }}
                        >
                            Sign In
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
    nameRow: {
        flexDirection: 'row',
        gap: spacing.sm,
    },
    nameInput: {
        flex: 1,
    },
    errorContainer: {
        padding: spacing.md,
        borderRadius: 8,
        marginBottom: spacing.md,
    },
    submitButton: {
        marginTop: spacing.md,
    },
    loginContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
});
