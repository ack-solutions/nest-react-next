import { Metadata, Viewport } from 'next';
import { cookies } from 'next/headers';
import './global.css';
import { getServerAuth } from '@web/lib/auth.server';
import { AppProviders } from '@web/contexts';
import { LayoutWrapper } from '@web/sections/layout/layout-wrapper';
import { siteConfig } from '@web/config';

// Force dynamic rendering
export const dynamic = 'force-dynamic';
export const revalidate = 0;

// SEO Metadata
export const metadata: Metadata = {
    metadataBase: new URL(siteConfig.url),
    title: {
        default: `${siteConfig.name} - Modern Solutions for Modern Problems`,
        template: `%s | ${siteConfig.name}`,
    },
    description: siteConfig.description,
    keywords: [
        'business',
        'platform',
        'solutions',
        'productivity',
        'collaboration',
        'technology',
    ],
    authors: [{ name: siteConfig.creator }],
    creator: siteConfig.creator,
    openGraph: {
        type: 'website',
        locale: 'en_US',
        url: siteConfig.url,
        siteName: siteConfig.name,
        title: siteConfig.name,
        description: siteConfig.description,
        images: [
            {
                url: siteConfig.ogImage,
                width: 1200,
                height: 630,
                alt: siteConfig.name,
            },
        ],
    },
    twitter: {
        card: 'summary_large_image',
        title: siteConfig.name,
        description: siteConfig.description,
        images: [siteConfig.ogImage],
        creator: '@yourcompany',
    },
    robots: {
        index: true,
        follow: true,
        googleBot: {
            index: true,
            follow: true,
            'max-video-preview': -1,
            'max-image-preview': 'large',
            'max-snippet': -1,
        },
    },
    icons: {
        icon: '/favicon.ico',
        shortcut: '/favicon.ico',
    },
};

// Viewport Configuration
export const viewport: Viewport = {
    themeColor: [
        { media: '(prefers-color-scheme: light)', color: '#ffffff' },
        { media: '(prefers-color-scheme: dark)', color: '#18181b' },
    ],
    width: 'device-width',
    initialScale: 1,
    maximumScale: 5,
};

export default async function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    // Get server-side auth state for initial hydration
    let initialAuthState;
    try {
        initialAuthState = await getServerAuth({ cookies: await cookies() });
    } catch (error) {
        initialAuthState = { user: null, session: null };
    }

    return (
        <html lang="en" suppressHydrationWarning>
            <head>
                <title>{siteConfig.name}: {siteConfig.description}</title>
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
                <link
                    href="https://fonts.googleapis.com/css2?family=Inter:wght@100;200;300;400;500;600;700;800;900&display=swap"
                    rel="stylesheet"
                />
                <link rel="icon" href="/favicon.png" type="image/png" />
            </head>
            <body className="antialiased">
                <AppProviders initialAuthState={initialAuthState}>
                    <LayoutWrapper>{children}</LayoutWrapper>
                </AppProviders>
            </body>
        </html>
    );
}
