/**
 * =================================================================
 * SCREEN COMPONENT
 * =================================================================
 *
 * Safe area wrapper component for consistent screen layout.
 * Handles safe area insets and provides common screen styling.
 */

import React, { ReactNode } from 'react';
import {
    View,
    ScrollView,
    StyleSheet,
    ViewStyle,
    StatusBar,
    KeyboardAvoidingView,
    Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAppTheme } from '../theme';
import { spacing } from '../constants';

export interface ScreenProps {
    children: ReactNode;
    /** Use ScrollView for scrollable content */
    scroll?: boolean;
    /** Add horizontal and vertical padding */
    padded?: boolean;
    /** Center content vertically and horizontally */
    centered?: boolean;
    /** Custom background color (defaults to theme background) */
    backgroundColor?: string;
    /** Edges to apply safe area (defaults to all) */
    edges?: ('top' | 'bottom' | 'left' | 'right')[];
    /** Enable keyboard avoiding behavior */
    keyboardAvoiding?: boolean;
    /** Additional style for the container */
    style?: ViewStyle;
    /** Additional style for the content */
    contentStyle?: ViewStyle;
}

/**
 * Screen component - use as the root wrapper for all screens
 */
export function Screen({
    children,
    scroll = false,
    padded = true,
    centered = false,
    backgroundColor,
    edges = ['top', 'bottom', 'left', 'right'],
    keyboardAvoiding = false,
    style,
    contentStyle,
}: ScreenProps) {
    const theme = useAppTheme();

    const bgColor = backgroundColor ?? theme.colors.background;

    const containerStyles: ViewStyle[] = [
        styles.container,
        { backgroundColor: bgColor },
        style,
    ].filter(Boolean) as ViewStyle[];

    const contentStyles: ViewStyle[] = [
        styles.content,
        padded && styles.padded,
        centered && styles.centered,
        contentStyle,
    ].filter(Boolean) as ViewStyle[];

    const renderContent = () => {
        if (scroll) {
            return (
                <ScrollView
                    style={styles.scrollView}
                    contentContainerStyle={[
                        styles.scrollContent,
                        padded && styles.padded,
                        centered && styles.scrollCentered,
                        contentStyle,
                    ]}
                    keyboardShouldPersistTaps="handled"
                    showsVerticalScrollIndicator={false}
                >
                    {children}
                </ScrollView>
            );
        }

        return <View style={contentStyles}>{children}</View>;
    };

    const content = (
        <SafeAreaView style={containerStyles} edges={edges}>
            <StatusBar
                barStyle={theme.dark ? 'light-content' : 'dark-content'}
                backgroundColor={bgColor}
            />
            {renderContent()}
        </SafeAreaView>
    );

    if (keyboardAvoiding) {
        return (
            <KeyboardAvoidingView
                style={styles.keyboardAvoiding}
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            >
                {content}
            </KeyboardAvoidingView>
        );
    }

    return content;
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    content: {
        flex: 1,
    },
    padded: {
        paddingHorizontal: spacing.base,
        paddingVertical: spacing.base,
    },
    centered: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        flexGrow: 1,
    },
    scrollCentered: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    keyboardAvoiding: {
        flex: 1,
    },
});

export default Screen;
