/**
 * =================================================================
 * LOGIN SCREEN
 * =================================================================
 *
 * User login screen with email/password form.
 * Design matches the provided mockups with:
 * - Logo at top
 * - Welcome message
 * - Email and Password fields with icons
 * - Forgot password link
 * - Sign In button
 * - Skip option (if login not required)
 * - Sign Up link at bottom
 */

import { View, StyleSheet, TouchableOpacity, Alert, Image } from 'react-native';
import { router } from 'expo-router';
import { FieldValues } from 'react-hook-form';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';

import { Screen, AppText, AppButton } from '../../src/components';
import { useAuth } from '@libs/react-shared';
import { useAppTheme } from '../../src/theme';
import { spacing, colors } from '../../src/constants';
import { appConfig } from '../../src/config/app.config';
import {
    FormContainer,
    RHFTextField,
    RHFPassword,
    loginFormSchema,
    useFormSubmit
} from '../../src/form';

import { images } from '@/assets';

export default function LoginScreen() {
    const { login } = useAuth();
    const theme = useAppTheme();

    // Handle form submission
    const handleLogin = async (data: FieldValues) => {
        try {
            const resp = await login({
                providerName: 'email',
                credentials: {
                    email: data.email.trim(),
                    password: data.password
                },
            });
            router.replace('/(tabs)/home');
        } catch (err: any) {
            const message =
                err?.response?.data?.message ??
                err?.message ??
                'Please check your credentials and try again.';
            Alert.alert('Login Failed', Array.isArray(message) ? message.join('\n') : message);
        }
    };

    return (
        <Screen scroll keyboardAvoiding edges={['top']}>
            <View style={[styles.container]}>
                {/* Skip Button - Top Right */}
                {!appConfig.features.requiredLogin && (
                    <TouchableOpacity
                        onPress={() => router.replace('/(tabs)/home')}
                        style={styles.skipButton}
                    >
                        <AppText variant="body2" style={{ color: theme.colors.primary }}>
                            Skip
                        </AppText>
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

                {/* Header Section */}
                <View style={styles.header}>
                    <AppText variant="h3" bold style={styles.title}>
                        Welcome Back
                    </AppText>
                    <AppText variant="body2" secondary>
                        Sign in to continue
                    </AppText>
                </View>

                {/* Form */}
                <FormContainer
                    validationSchema={loginFormSchema}
                    defaultValues={{ email: '', password: '' }}
                >
                    <LoginFormContent onSubmit={handleLogin} />
                </FormContainer>

                {/* Register link */}
                <View style={styles.registerContainer}>
                    <AppText variant="body2" secondary>
                        Don't have an account?{' '}
                    </AppText>
                    <TouchableOpacity onPress={() => router.push('/(auth)/register')}>
                        <AppText
                            variant="body2"
                            bold
                            style={{ color: colors.primary.main }}
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
    const { handleSubmit, isSubmitting } = useFormSubmit();

    return (
        <View style={styles.form}>
            {/* Email input */}
            <RHFTextField
                name="email"
                label="Email Address"
                placeholder="Enter your email"
                keyboardType="email-address"
                autoCapitalize="none"
                autoComplete="email"
                textContentType="username"
                leftIcon={<Feather name="mail" size={18} color={colors.grey[400]} />}
            />

            {/* Password input */}
            <RHFPassword
                name="password"
                label="Password"
                placeholder="Enter your password"
                autoComplete="password"
                textContentType="password"
                leftIcon={<Feather name="lock" size={18} color={colors.grey[400]} />}
            />

            {/* Forgot password link */}
            <TouchableOpacity
                onPress={() => router.push('/(auth)/forgot-password')}
                style={styles.forgotPassword}
            >
                <AppText
                    variant="body2"
                    style={{ color: colors.primary.main }}
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
    },
    skipButton: {
        alignSelf: 'flex-end',
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.sm,
    },
    logoSection: {
        alignItems: 'center',
        marginTop: spacing.xl,
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
        marginBottom: spacing.xl,
    },
    title: {
        marginBottom: spacing.xs,
    },
    form: {
        gap: spacing.sm,
    },
    forgotPassword: {
        alignSelf: 'flex-end',
        marginTop: spacing.sm,
        marginBottom: spacing.sm,
    },
    submitButton: {
        marginTop: spacing.md,
    },
    registerContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: spacing.xl,
        paddingBottom: spacing.xl,
    },
});
