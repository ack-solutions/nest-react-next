/**
 * =================================================================
 * TABS LAYOUT
 * =================================================================
 *
 * Layout for tab-based navigation matching the design.
 * 5 tabs: Home, Deals, Stores, Cart, Profile
 */

import { StyleSheet, Platform } from 'react-native';
import { Tabs } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { colors } from '../../src/theme/tokens';

// Base tab bar height (without safe area padding)
const TAB_BAR_BASE_HEIGHT = 56;
// Minimum bottom padding for visual spacing
const TAB_BAR_MIN_BOTTOM_PADDING = 8;


export default function TabsLayout() {
    // Get safe area insets for proper spacing on all devices
    const insets = useSafeAreaInsets();
    const bottomPadding = Math.max(insets.bottom + 4, TAB_BAR_MIN_BOTTOM_PADDING);

    // Total tab bar height = base height + bottom safe area
    const tabBarHeight = TAB_BAR_BASE_HEIGHT + bottomPadding;

    return (
        <Tabs
            screenOptions={{
                headerShown: false,
                tabBarActiveTintColor: colors.primary.main,
                tabBarInactiveTintColor: colors.grey[400],
                tabBarStyle: {
                    backgroundColor: colors.common.white,
                    borderTopColor: colors.grey[200],
                    borderTopWidth: 1,
                    height: tabBarHeight,
                    paddingBottom: bottomPadding,
                    paddingTop: 8,
                    // Ensure the tab bar is positioned correctly on Android
                    ...(Platform.OS === 'android' && {
                        elevation: 8,
                    }),
                    ...(Platform.OS === 'ios' && {
                        shadowColor: '#000',
                        shadowOpacity: 0.06,
                        shadowRadius: 8,
                        shadowOffset: { width: 0, height: -2 },
                    }),
                },
                tabBarLabelStyle: {
                    fontSize: 10,
                    fontWeight: '500',
                    marginTop: 4,
                },
                // Ensure safe area is handled by the tab navigator
                tabBarHideOnKeyboard: true,
            }}
        >
            <Tabs.Screen
                name="home"
                options={{
                    title: 'Home',
                    tabBarIcon: ({ color, focused }) => (
                        <Feather
                            name="home"
                            size={22}
                            color={color}
                            strokeWidth={focused ? 2.5 : 2}
                        />
                    ),
                }}
            />
            <Tabs.Screen
                name="profile"
                options={{
                    title: 'Profile',
                    tabBarIcon: ({ color, focused }) => (
                        <Feather
                            name="user"
                            size={22}
                            color={color}
                            strokeWidth={focused ? 2.5 : 2}
                        />
                    ),
                }}
            />
        </Tabs>
    );
}

const styles = StyleSheet.create({
    badge: {
        position: 'absolute',
        top: -4,
        right: -8,
        backgroundColor: colors.primary.main,
        borderRadius: 8,
        height: 16,
        justifyContent: 'center',
        alignItems: 'center',
        minWidth: 16,
        paddingHorizontal: 4,
    },
    badgeText: {
        color: colors.common.white,
        fontSize: 10,
        fontWeight: 'bold',
    },
});
