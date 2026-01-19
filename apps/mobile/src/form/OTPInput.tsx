/**
 * =================================================================
 * OTP INPUT COMPONENT
 * =================================================================
 *
 * OTP input component using react-native-paper with hidden TextInput
 * and visual OTP boxes for better UX.
 */

import React, { useRef, useState, useCallback, useEffect } from 'react';
import { View, StyleSheet, Pressable, TextInput as RNTextInput } from 'react-native';
import type { StyleProp, ViewStyle, TextStyle } from 'react-native';
import { TextInput, Text } from 'react-native-paper';
import type { TextInputProps } from 'react-native-paper';
import { colors, spacing } from '../constants';

interface OTPInputProps {
    /** Number of OTP digits */
    length?: number;
    /** Current OTP value */
    value?: string;
    /** Callback when OTP changes */
    onChange?: (otp: string) => void;
    /** Auto focus first input on mount */
    autoFocus?: boolean;
    /** Called when all digits are entered */
    onComplete?: (otp: string) => void;
    /** Error state */
    error?: boolean;
    /** Disabled state */
    disabled?: boolean;
    /** Container style */
    containerStyle?: StyleProp<ViewStyle>;
    /** OTP box style */
    otpBoxStyle?: StyleProp<ViewStyle>;
    /** OTP text style */
    otpTextStyle?: StyleProp<TextStyle>;
    /** Additional TextInput props */
    textInputProps?: TextInputProps;
}

export function OTPInput({
    length = 4,
    value = '',
    onChange,
    autoFocus = true,
    onComplete,
    error = false,
    disabled = false,
    containerStyle,
    otpBoxStyle,
    otpTextStyle,
    textInputProps,
}: OTPInputProps) {
    const [isInputFocused, setIsInputFocused] = useState<boolean>(autoFocus);
    const [otp, setOtp] = useState<string>(value);
    const inputRef = useRef<RNTextInput>(null);

    // Sync with external value
    useEffect(() => {
        if (value !== otp) {
            setOtp(value);
        }
    }, [value]);

    // Handle OTP change
    const handleChange = useCallback(
        (text: string) => {
            // Only allow numeric input
            const numericText = text.replace(/[^0-9]/g, '').slice(0, length);
            setOtp(numericText);
            onChange?.(numericText);

            // Check for completion
            if (numericText.length === length) {
                onComplete?.(numericText);
            }
        },
        [length, onChange, onComplete]
    );

    // Handle press on OTP boxes
    const handlePress = useCallback(() => {
        if (!disabled) {
            setIsInputFocused(true);
            inputRef.current?.focus();
        }
    }, [disabled]);

    // Handle blur
    const handleBlur = useCallback(() => {
        setIsInputFocused(false);
    }, []);

    // Generate box array
    const boxArray = new Array(length).fill(0);

    return (
        <View style={[styles.container, containerStyle]}>
            {/* Hidden TextInput for keyboard input */}
            <TextInput
                mode="outlined"
                style={styles.hiddenInput}
                value={otp}
                onChangeText={handleChange}
                maxLength={length}
                ref={inputRef}
                onBlur={handleBlur}
                onFocus={() => setIsInputFocused(true)}
                keyboardType="number-pad"
                autoFocus={autoFocus}
                editable={!disabled}
                {...textInputProps}
            />

            {/* Visual OTP Boxes */}
            <Pressable 
                style={styles.otpContainer} 
                onPress={handlePress}
                disabled={disabled}
            >
                {boxArray.map((_, index) => {
                    const isCurrentValue = index === otp.length;
                    const isLastValue = index === length - 1;
                    const isCodeComplete = otp.length === length;
                    const isValueFocused = isCurrentValue || (isLastValue && isCodeComplete);

                    const boxBorderColor = error
                        ? colors.error.main
                        : isInputFocused && isValueFocused
                            ? colors.primary.main
                            : otp[index]
                                ? colors.grey[400]
                                : colors.grey[300];

                    const boxBackgroundColor = disabled
                        ? colors.grey[200]
                        : error
                            ? colors.error.lighter
                            : otp[index]
                                ? colors.common.white
                                : colors.grey[50];

                    return (
                        <View
                            key={index}
                            style={[
                                styles.otpBox,
                                otpBoxStyle,
                                {
                                    borderColor: boxBorderColor,
                                    backgroundColor: boxBackgroundColor,
                                },
                            ]}
                        >
                            <Text 
                                style={[
                                    styles.otpText,
                                    otpTextStyle,
                                    disabled && styles.otpTextDisabled,
                                ]}
                            >
                                {otp[index] || ''}
                            </Text>
                        </View>
                    );
                })}
            </Pressable>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    hiddenInput: {
        position: 'absolute',
        opacity: 0,
        height: 1,
        width: 1,
    },
    otpContainer: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'center',
        gap: spacing.sm,
    },
    otpBox: {
        borderWidth: 1.5,
        borderRadius: 12,
        width: 56,
        height: 56,
        justifyContent: 'center',
        alignItems: 'center',
    },
    otpText: {
        fontSize: 24,
        fontWeight: '600',
        color: colors.grey[900],
        textAlign: 'center',
    },
    otpTextDisabled: {
        color: colors.grey[500],
    },
});

export default OTPInput;
