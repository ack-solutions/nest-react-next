/**
 * =================================================================
 * LOGIN SCREEN
 * =================================================================
 *
 * User login screen with email/password form.
 * Similar layout patterns to the admin app's login page.
 */

import { View, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { router } from 'expo-router';
import { FieldValues } from 'react-hook-form';

import { Screen, AppText, AppButton, AppDivider } from '../../src/components';
import { useAuth } from '@libs/react-shared';
import { useAppTheme } from '../../src/theme';
import { spacing } from '../../src/constants';
import { appConfig } from '../../src/config/app.config';
import {
    FormContainer,
    RHFTextField,
    RHFPassword,
    loginFormSchema,
    useFormSubmit
} from '../../src/form';

export default function LoginScreen() {
    const { login } = useAuth();
    const theme = useAppTheme();

    // Handle form submission
    const handleLogin = async (data: FieldValues) => {
        try {
            await login({
                providerName: 'email',
                credentials: {
                    email: data.email.trim(),
                    password: data.password
                },
            });
        } catch (err: any) {
            Alert.alert('Login Failed', err.message || 'Please check your credentials and try again.');
        }
    };

    return (
        <Screen scroll keyboardAvoiding padded>
            <View style={styles.container}>
                {/* Header */}
                <View style={styles.header}>
                    {!appConfig.features.requiredLogin && (
                        <TouchableOpacity
                            onPress={() => router.replace('/(tabs)/home')}
                            style={{ alignSelf: 'flex-end', padding: spacing.sm }}
                        >
                            <AppText variant="body2" style={{ color: theme.colors.primary }}>
                                Skip
                            </AppText>
                        </TouchableOpacity>
                    )}
                    <AppText variant="h3" bold>
                        Welcome Back
                    </AppText>
                    <AppText variant="body1" secondary style={styles.subtitle}>
                        Sign in to continue to your account
                    </AppText>
                </View>

                {/* Form */}
                <FormContainer
                    validationSchema={loginFormSchema}
                    defaultValues={{ email: 'ajay@ackplus.com', password: 'Admin@123' }}
                >
                    <LoginFormContent onSubmit={handleLogin} />
                </FormContainer>

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

function LoginFormContent({ onSubmit }: { onSubmit: (data: FieldValues) => Promise<void> }) {
    const theme = useAppTheme();
    const { handleSubmit, isSubmitting } = useFormSubmit();

    return (
        <View style={styles.form}>
            {/* Email input */}
            <RHFTextField
                name="email"
                label="Email"
                keyboardType="email-address"
                autoCapitalize="none"
                autoComplete="email"
                textContentType="emailAddress"
            />

            {/* Password input */}
            <RHFPassword
                name="password"
                label="Password"
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
                loading={isSubmitting}
                onPress={handleSubmit(onSubmit)}
                style={styles.submitButton}
            >
                Sign In
            </AppButton>
        </View>
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
