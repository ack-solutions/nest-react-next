import { Metadata } from 'next';
import { HomePageClient } from '@web/sections/home/home-page';

export const metadata: Metadata = {
    title: 'Home | Your Company - Modern Solutions for Modern Problems',
    description: 'Welcome to Your Company. We provide innovative solutions that help businesses grow and succeed in the digital age.',
    openGraph: {
        title: 'Your Company - Modern Solutions',
        description: 'Innovative solutions for modern businesses',
        type: 'website',
    },
};

export default function HomePage() {
    return <HomePageClient />;
}
