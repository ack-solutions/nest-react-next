# Mobile App Template

A production-ready Expo React Native template for the monorepo.

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- pnpm (workspace package manager)
- Expo CLI: `npm install -g expo-cli`
- iOS: Xcode (for iOS simulator)
- Android: Android Studio (for Android emulator)

### Installation

```bash
# From monorepo root
cd apps/mobile
pnpm install

# Start development server
pnpm dev

# Run on specific platform
pnpm ios      # iOS simulator
pnpm android  # Android emulator
pnpm web      # Web browser
```

## 📁 Project Structure

```
apps/mobile/
├── app/                    # expo-router screens
│   ├── _layout.tsx         # Root layout with providers
│   ├── index.tsx           # Entry point (splash/routing)
│   ├── (public)/           # Public screens (no auth)
│   │   └── onboarding.tsx
│   ├── (auth)/             # Auth screens
│   │   ├── login.tsx
│   │   ├── register.tsx
│   │   └── forgot-password.tsx
│   └── (tabs)/             # Protected tab screens
│       ├── home.tsx
│       └── profile.tsx
├── src/
│   ├── auth/               # Auth logic
│   ├── components/         # Reusable UI components
│   ├── config/             # App configuration
│   ├── constants/          # Design tokens
│   ├── lib/                # Utilities (API, storage)
│   └── theme/              # Theme system
├── app.config.ts           # Expo configuration
├── package.json
└── tsconfig.json
```

## 🎨 Rebranding Guide

### 1. Change App Name & Bundle ID

Edit `app.config.ts`:

```typescript
const APP_NAME = 'Your App Name';
const APP_SLUG = 'your-app-slug';
const APP_SCHEME = 'yourapp';
const ANDROID_PACKAGE = 'com.yourcompany.yourapp';
const IOS_BUNDLE_ID = 'com.yourcompany.yourapp';
```

### 2. Update App Icon & Splash

Replace these files in `src/assets/images/`:
- `icon.png` (1024x1024) - Main app icon
- `splash.png` (1284x2778) - Splash screen image
- `adaptive-icon.png` (1024x1024) - Android adaptive icon

Update splash background color in `app.config.ts`:
```typescript
const SPLASH_BACKGROUND_COLOR = '#your-color';
```

### 3. Change Theme Colors

Edit `src/theme/tokens.ts`:

```typescript
export const colors = {
    primary: {
        main: '#your-primary-color',
        light: '#lighter-shade',
        dark: '#darker-shade',
        // ...
    },
    secondary: {
        main: '#your-secondary-color',
        // ...
    },
    // ...
};
```

Or use environment variables:

```bash
# .env
EXPO_PUBLIC_API_URL=https://your-api.com/api
```

### 5. App Configuration

Edit `src/config/app.config.ts` for:
- App info (name, version, description)
- Feature flags
- Auth settings
- Storage keys

## 🔐 Authentication

The auth system is ready for integration with your backend.

### Current Implementation
- Placeholder API in `src/auth/auth-api.ts`
- Secure token storage using `expo-secure-store`
- Auth context with login/logout/register

### Integration with Monorepo Auth

To use `@libs/react-shared`:

```typescript
// Option 1: Use underlying client
import { createAuthClient } from '@ackplus/nest-auth-client';

const authClient = createAuthClient({
    baseUrl: API_URL,
});

// Option 2: Replace auth-api.ts with actual API calls
export async function login(credentials) {
    return apiClient.post('/auth/login', credentials);
}
```

### Replace Placeholder API

In `src/auth/auth-api.ts`, replace the placeholder functions with actual API calls:

```typescript
export async function login(credentials: LoginCredentials): Promise<AuthResponse> {
    return apiClient.post('/auth/login', credentials);
}
```

## 🧩 Components

Reusable components in `src/components/`:

| Component | Description |
|-----------|-------------|
| `Screen` | Safe area wrapper with scroll support |
| `AppText` | Typography with variants (h1-h6, body, caption) |
| `AppButton` | Button with primary/secondary/outline modes |
| `AppInput` | Text input with label and error handling |
| `AppCard` | Card container with elevation |
| `AppDivider` | Divider with optional label |
| `AppLoader` | Loading indicator |

### Usage Example

```tsx
import { Screen, AppText, AppButton, AppInput } from '../src/components';

function MyScreen() {
    return (
        <Screen scroll padded>
            <AppText variant="h3" bold>Title</AppText>
            <AppInput label="Email" />
            <AppButton onPress={() => {}}>Submit</AppButton>
        </Screen>
    );
}
```

## 🌗 Theme System

Built on `react-native-paper` with Material Design 3.

### Access Theme

```tsx
import { useTheme, useAppTheme } from '../src/theme';

function MyComponent() {
    // Full theme controls
    const { isDark, toggleTheme, setThemeMode } = useTheme();

    // Just theme colors
    const theme = useAppTheme();

    return (
        <View style={{ backgroundColor: theme.colors.primary }}>
            <Switch value={isDark} onValueChange={toggleTheme} />
        </View>
    );
}
```

### Theme Modes
- `light` - Light theme
- `dark` - Dark theme
- `system` - Follow device setting

## 📦 Key Dependencies

- **expo** ~52.0.0 - Expo SDK
- **expo-router** ~4.0.0 - File-based routing
- **react-native-paper** ^5.12.0 - UI components
- **@tanstack/react-query** ^5.90.16 - Data fetching
- **expo-secure-store** ~14.0.0 - Secure storage
- **axios** ^1.13.2 - HTTP client

## 📱 Scripts

```bash
pnpm dev        # Start Expo development server
pnpm ios        # Run on iOS simulator
pnpm android    # Run on Android emulator
pnpm web        # Run in web browser
pnpm lint       # Run ESLint
pnpm typecheck  # Run TypeScript check
```

## 📝 Environment Variables

Expo supports `EXPO_PUBLIC_*` prefixed environment variables:

```bash
# .env (create this file)
EXPO_PUBLIC_API_URL=http://localhost:3000/api
EXPO_PUBLIC_ENV=development
```

Access in code:
```typescript
const apiUrl = process.env.EXPO_PUBLIC_API_URL;
```

## 🔧 Troubleshooting

### Metro bundler issues
```bash
npx expo start --clear
```

### iOS build issues
```bash
cd ios && pod install && cd ..
```

### Android build issues
```bash
cd android && ./gradlew clean && cd ..
```

## 📄 License

Private - Internal use only.
