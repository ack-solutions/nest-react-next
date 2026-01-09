import React from 'react';
import { View, StyleSheet, TouchableOpacity, ViewStyle } from 'react-native';
import { useController, Control } from 'react-hook-form';
import { Checkbox, HelperText } from 'react-native-paper';
import { AppText } from '../../components/AppText';
import { useAppTheme } from '../../theme';
import { spacing } from '../../constants';

interface RHFCheckboxProps {
    name: string;
    control?: Control<any>;
    label: string;
    disabled?: boolean;
    style?: ViewStyle;
}

export function RHFCheckbox({ name, control, label, disabled, style }: RHFCheckboxProps) {
    const theme = useAppTheme();
    const {
        field: { value, onChange },
        fieldState: { error },
    } = useController({ name, control });

    const handlePress = () => {
        if (!disabled) {
            onChange(!value);
        }
    };

    return (
        <View style={style}>
            <TouchableOpacity
                onPress={handlePress}
                activeOpacity={0.7}
                style={styles.container}
                disabled={disabled}
            >
                <Checkbox.Android
                    status={value ? 'checked' : 'unchecked'}
                    onPress={handlePress}
                    disabled={disabled}
                    color={theme.colors.primary}
                />
                <AppText style={styles.label}>{label}</AppText>
            </TouchableOpacity>

            {!!error && (
                <HelperText type="error" visible={!!error}>
                    {error.message}
                </HelperText>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        marginLeft: -8, // Offset the padding of the checkbox
        paddingVertical: spacing.xs,
    },
    label: {
        marginLeft: spacing.xs,
        flex: 1,
    },
});
