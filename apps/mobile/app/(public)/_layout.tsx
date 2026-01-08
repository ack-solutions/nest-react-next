/**
 * =================================================================
 * PUBLIC LAYOUT
 * =================================================================
 *
 * Layout for public screens (no authentication required).
 * Contains onboarding and other public screens.
 */

import { Stack } from 'expo-router';

export default function PublicLayout() {
    return (
        <Stack
            screenOptions={{
                headerShown: false,
                animation: 'slide_from_right',
            }}
        >
            <Stack.Screen name="onboarding" />
        </Stack>
    );
}
