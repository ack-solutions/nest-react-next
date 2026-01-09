import React from 'react';
import { View, StyleSheet, TouchableOpacity, ViewStyle } from 'react-native';
import { useController, Control } from 'react-hook-form';
import { Switch, HelperText } from 'react-native-paper';
import { AppText } from '../../components/AppText';
import { useAppTheme } from '../../theme';
import { spacing } from '../../constants';

interface RHFSwitchProps {
    name: string;
    control?: Control<any>;
    label: string;
    disabled?: boolean;
    style?: ViewStyle;
}

export function RHFSwitch({ name, control, label, disabled, style }: RHFSwitchProps) {
    const theme = useAppTheme();
    const {
        field: { value, onChange },
        fieldState: { error },
    } = useController({ name, control });

    return (
        <View style={style}>
            <View style={styles.container}>
                <AppText style={styles.label}>{label}</AppText>
                <Switch
                    value={!!value}
                    onValueChange={onChange}
                    disabled={disabled}
                    color={theme.colors.primary}
                />
            </View>

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
        justifyContent: 'space-between',
        paddingVertical: spacing.sm,
    },
    label: {
        flex: 1,
    },
});
