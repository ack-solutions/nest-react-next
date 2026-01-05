
import { cookies } from 'next/headers';
import './global.css';
import { getServerAuth } from '@web/lib/auth.server';
import { AppProviders } from '@web/contexts';
import { LayoutWrapper } from '@web/sections/layout/layout-wrapper';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function RootLayout({ children }: { children: React.ReactNode }) {
    // Get server-side auth state for initial hydration
    let initialAuthState;
    try {
        initialAuthState = await getServerAuth({ cookies: await cookies() });
    } catch (error) {
        initialAuthState = { user: null, session: null };
    }

    return (
        <html lang="en">
            <head>
                <title>Badacup: Buy Vouchers & Redeem Coupon Codes</title>
                <meta name="description" content="Badacup - Your platform for buying vouchers and redeeming coupon codes. Discover great deals and offers with easy voucher and coupon management." />
                <link
                    href="https://fonts.googleapis.com/css2?family=Inter:wght@100;200;300;400;500;600;700;800;900&display=swap"
                    rel="stylesheet"
                />
                <link rel="icon" href="/favicon.png" type="image/png" />
            </head>
            <body>
                <AppProviders initialAuthState={initialAuthState}>
                    <LayoutWrapper>{children}</LayoutWrapper>
                </AppProviders>
            </body>
        </html>
    );
}
