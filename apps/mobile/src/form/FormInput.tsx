/**
 * =================================================================
 * FORM INPUT COMPONENT
 * =================================================================
 *
 * Base form input component with:
 * - External label display (shown above the input when label prop is passed)
 * - Error handling
 * - Left/Right icon support
 * - Password visibility toggle
 *
 * Used by RHFTextField, RHFPassword, RHFPhoneField
 */

import React, { forwardRef, useState, ReactNode } from 'react';
import { StyleSheet, View, ViewStyle, Text } from 'react-native';
import { TextInput, TextInputProps, HelperText } from 'react-native-paper';
import { useAppTheme } from '../theme';
import { spacing, colors } from '../constants';

export interface FormInputProps extends Omit<TextInputProps, 'error' | 'left' | 'right' | 'label'> {
    /** External label shown above the input */
    label?: string;
    /** Optional text to show after label (e.g., "(Optional)") */
    labelSuffix?: string;
    /** Error message to display */
    error?: string;
    /** Helper text (shown when no error) */
    helperText?: string;
    /** Container style */
    containerStyle?: ViewStyle;
    /** Full width input */
    fullWidth?: boolean;
    /** Left icon name (Material Community Icons) or custom React node */
    leftIcon?: string | ReactNode;
    /** Right icon name (Material Community Icons) or custom React node */
    rightIcon?: string | ReactNode;
}

/**
 * FormInput component - Base input for form fields
 * Shows external label above the input when label prop is provided
 */
export const FormInput = forwardRef<any, FormInputProps>(
    (
        {
            label,
            labelSuffix,
            error,
            helperText,
            containerStyle,
            fullWidth = true,
            secureTextEntry,
            leftIcon,
            rightIcon,
            ...rest
        },
        ref
    ) => {
        const theme = useAppTheme();
        const [isPasswordVisible, setIsPasswordVisible] = useState(false);

        // Handle password visibility toggle
        const isPassword = secureTextEntry !== undefined;
        const actualSecureEntry = secureTextEntry && !isPasswordVisible;

        const togglePasswordVisibility = () => {
            setIsPasswordVisible(!isPasswordVisible);
        };

        // Render left icon
        const renderLeftIcon = () => {
            if (!leftIcon) return undefined;
            if (typeof leftIcon === 'string') {
                return <TextInput.Icon icon={leftIcon} color={colors.grey[400]} />;
            }
            return <TextInput.Icon icon={() => leftIcon} />;
        };

        // Render right icon (password toggle or custom)
        const renderRightIcon = () => {
            if (isPassword) {
                return (
                    <TextInput.Icon
                        icon={isPasswordVisible ? 'eye-off' : 'eye'}
                        onPress={togglePasswordVisibility}
                        color={colors.grey[400]}
                    />
                );
            }
            if (rightIcon) {
                if (typeof rightIcon === 'string') {
                    return <TextInput.Icon icon={rightIcon} color={colors.grey[400]} />;
                }
                return <TextInput.Icon icon={() => rightIcon} />;
            }
            return undefined;
        };

        return (
            <View style={[
                fullWidth ? styles.fullWidth : styles.flexOne, 
                containerStyle
            ]}>
                {/* External Label */}
                {label && (
                    <View style={styles.labelContainer}>
                        <Text style={styles.label}>{label}</Text>
                        {labelSuffix && (
                            <Text style={styles.labelSuffix}>{labelSuffix}</Text>
                        )}
                    </View>
                )}

                {/* Input Field */}
                <TextInput
                    ref={ref}
                    mode="outlined"
                    error={!!error}
                    secureTextEntry={actualSecureEntry}
                    left={renderLeftIcon()}
                    right={renderRightIcon()}
                    outlineStyle={[
                        styles.outline,
                        error && { borderColor: theme.colors.error }
                    ]}
                    style={styles.input}
                    outlineColor={colors.grey[300]}
                    activeOutlineColor={colors.primary.main}
                    placeholderTextColor={colors.grey[400]}
                    {...rest}
                />

                {/* Helper/Error Text */}
                {(error || helperText) && (
                    <HelperText
                        type={error ? 'error' : 'info'}
                        visible={!!(error || helperText)}
                        style={styles.helperText}
                    >
                        {error || helperText}
                    </HelperText>
                )}
            </View>
        );
    }
);

FormInput.displayName = 'FormInput';

const styles = StyleSheet.create({
    fullWidth: {
        width: '100%',
    },
    flexOne: {
        flex: 1,
    },
    labelContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: spacing.xs,
        gap: spacing.xs,
    },
    label: {
        fontSize: 14,
        fontWeight: '500',
        color: colors.grey[800],
    },
    labelSuffix: {
        fontSize: 12,
        color: colors.grey[500],
    },
    input: {
        backgroundColor: colors.grey[50],
        fontSize: 14,
    },
    outline: {
        borderRadius: 12,
        borderWidth: 1,
    },
    helperText: {
        paddingHorizontal: 0,
        marginTop: -2,
    },
});

export default FormInput;
