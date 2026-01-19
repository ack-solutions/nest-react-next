/**
 * =================================================================
 * REGISTER SCREEN
 * =================================================================
 *
 * User registration screen with form.
 * Design matches the provided mockups with:
 * - Skip button at top right
 * - Create Account title
 * - First Name, Last Name, Email, Phone, Password fields with icons
 * - Referral code (optional)
 * - Sign Up button
 * - Sign In link at bottom
 */

import { View, StyleSheet, TouchableOpacity, Alert, ScrollView } from 'react-native';
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
    RHFPhoneField,
    registerFormSchema,
    useFormSubmit
} from '../../src/form';

export default function RegisterScreen() {
    const { signup } = useAuth();
    const theme = useAppTheme();
    const insets = useSafeAreaInsets();

    // Handle form submission
    const handleRegister = async (data: FieldValues) => {
        try {
            await signup({
                email: data.email.trim(),
                password: data.password,
                firstName: data.firstName.trim(),
                lastName: data.lastName.trim(),
                phoneNumber: data.phoneNumber,
                referralCode: data.referralCode?.trim() || undefined,
            });
            // Navigation is handled by auth provider/layout
        } catch (err: any) {
            Alert.alert('Registration Failed', err.message || 'Please try again.');
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

                {/* Header Section */}
                <View style={styles.header}>
                    <AppText variant="h3" bold style={styles.title}>
                        Create Account
                    </AppText>
                    <AppText variant="body2" secondary>
                        Join Badacup to discover amazing deals
                    </AppText>
                </View>

                {/* Form */}
                <FormContainer
                    validationSchema={registerFormSchema}
                    defaultValues={{
                        firstName: '',
                        lastName: '',
                        email: '',
                        phoneNumber: '',
                        password: '',
                        confirmPassword: '',
                        referralCode: '',
                    }}
                >
                    <RegisterFormContent onSubmit={handleRegister} />
                </FormContainer>

                {/* Login link */}
                <View style={styles.loginContainer}>
                    <AppText variant="body2" secondary>
                        Already have an account?{' '}
                    </AppText>
                    <TouchableOpacity onPress={() => router.replace('/(auth)/login')}>
                        <AppText
                            variant="body2"
                            bold
                            style={{ color: colors.primary.main }}
                        >
                            Sign In
                        </AppText>
                    </TouchableOpacity>
                </View>
            </View>
        </Screen>
    );
}

function RegisterFormContent({ onSubmit }: { onSubmit: (data: FieldValues) => Promise<void> }) {
    const { handleSubmit, isSubmitting } = useFormSubmit();

    return (
        <View style={styles.form}>
            {/* Full Name input */}
            <View style={styles.row}>
                <RHFTextField
                    name="firstName"
                    label="First Name"
                    placeholder="First name"
                    autoCapitalize="words"
                    autoComplete="name"
                    textContentType="name"
                    fullWidth={false}
                    leftIcon={<Feather name="user" size={18} color={colors.grey[400]} />}
                />
                <RHFTextField
                    name="lastName"
                    label="Last Name"
                    placeholder="Last name"
                    autoCapitalize="words"
                    autoComplete="name"
                    fullWidth={false}
                    textContentType="name"
                    leftIcon={<Feather name="user" size={18} color={colors.grey[400]} />}
                />
            </View>

            {/* Email input */}
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

            {/* Phone Number input */}
            <RHFPhoneField
                name="phoneNumber"
                label="Phone Number"
                placeholder="Enter your 10-digit mobile number"
                leftIcon={<Feather name="phone" size={18} color={colors.grey[400]} />}
            />

            {/* Password input */}
            <RHFPassword
                name="password"
                label="Password"
                placeholder="Password"
                autoComplete="password-new"
                textContentType="newPassword"
                leftIcon={<Feather name="lock" size={18} color={colors.grey[400]} />}
            />

            {/* Confirm Password input */}
            <RHFPassword
                name="confirmPassword"
                label="Confirm Password"
                placeholder="Re-enter your password"
                autoComplete="password-new"
                textContentType="newPassword"
                leftIcon={<Feather name="lock" size={18} color={colors.grey[400]} />}
            />

            {/* Referral Code input (optional) */}
            <RHFTextField
                name="referralCode"
                label="Referral Code"
                labelSuffix="(Optional)"
                placeholder="Referral code"
                leftIcon={<Feather name="gift" size={18} color={colors.grey[400]} />}
            />

            {/* Submit button */}
            <AppButton
                fullWidth
                loading={isSubmitting}
                onPress={handleSubmit(onSubmit)}
                style={styles.submitButton}
            >
                Sign Up
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
        padding: spacing.xs,
    },
    header: {
        alignItems: 'center',
        marginBottom: spacing.lg,
    },
    title: {
        marginBottom: spacing.xs,
    },
    form: {
        gap: spacing.sm,
    },
    row: {
        flexDirection: 'row',
        gap: spacing.sm
    },
    submitButton: {
        marginTop: spacing.sm,
    },
    loginContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: spacing.xl,
        paddingBottom: spacing.xl,
    },
});
