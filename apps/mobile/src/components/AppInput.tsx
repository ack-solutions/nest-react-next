/**
 * =================================================================
 * APP INPUT COMPONENT
 * =================================================================
 *
 * Text input component with label, error handling, and theme support.
 * Uses react-native-paper's TextInput with custom styling.
 */

import React, { forwardRef, useState } from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import { TextInput, TextInputProps, HelperText } from 'react-native-paper';
import { useAppTheme } from '../theme';
import { spacing } from '../constants';

export interface AppInputProps extends Omit<TextInputProps, 'error'> {
    /** Input label */
    label?: string;
    /** Error message to display */
    error?: string;
    /** Helper text (shown when no error) */
    helperText?: string;
    /** Container style */
    containerStyle?: ViewStyle;
    /** Full width input */
    fullWidth?: boolean;
}

/**
 * AppInput component - use for all text inputs
 */
export const AppInput = forwardRef<any, AppInputProps>(
    (
        {
            label,
            error,
            helperText,
            containerStyle,
            fullWidth = true,
            secureTextEntry,
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

        return (
            <View style={[styles.container, fullWidth && styles.fullWidth, containerStyle]}>
                <TextInput
                    ref={ref}
                    mode="outlined"
                    label={label}
                    error={!!error}
                    secureTextEntry={actualSecureEntry}
                    right={
                        isPassword ? (
                            <TextInput.Icon
                                icon={isPasswordVisible ? 'eye-off' : 'eye'}
                                onPress={togglePasswordVisibility}
                            />
                        ) : undefined
                    }
                    outlineStyle={styles.outline}
                    style={styles.input}
                    {...rest}
                />
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

AppInput.displayName = 'AppInput';

const styles = StyleSheet.create({
    container: {
        marginBottom: spacing.sm,
    },
    fullWidth: {
        width: '100%',
    },
    input: {
        backgroundColor: 'transparent',
    },
    outline: {
        borderRadius: 8,
    },
    helperText: {
        paddingHorizontal: 0,
    },
});

export default AppInput;
