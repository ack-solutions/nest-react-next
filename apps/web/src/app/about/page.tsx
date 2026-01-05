import { Metadata } from 'next';
import { AboutPageClient } from '@web/sections/about/about-page';

export const metadata: Metadata = {
    title: 'About Us | Your Company',
    description: 'Learn about our mission, values, and the team behind Your Company. We are dedicated to building innovative solutions that help businesses succeed.',
    openGraph: {
        title: 'About Us | Your Company',
        description: 'Learn about our mission, values, and the team behind our company.',
        type: 'website',
    },
};

export default function AboutPage() {
    return <AboutPageClient />;
}
