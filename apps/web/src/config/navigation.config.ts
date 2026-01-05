/**
 * Navigation Configuration
 * Centralized configuration for all navigation items
 */

export interface NavItem {
    title: string;
    path: string;
    icon?: string;
    description?: string;
    highlighted?: boolean;
    external?: boolean;
    children?: NavItem[];
}

export interface FooterSection {
    title: string;
    links: NavItem[];
}

export interface SocialLink {
    name: string;
    url: string;
    icon: string;
}

// ============================================
// HEADER NAVIGATION
// ============================================
export const headerNavigation: NavItem[] = [
    {
        title: 'Home',
        path: '/',
    },
    {
        title: 'About',
        path: '/about',
    },
    {
        title: 'Services',
        path: '/services',
        children: [
            {
                title: 'Web Development',
                path: '/services/web-development',
                description: 'Custom web applications built with modern technologies',
            },
            {
                title: 'Mobile Apps',
                path: '/services/mobile-apps',
                description: 'Native and cross-platform mobile solutions',
            },
            {
                title: 'UI/UX Design',
                path: '/services/design',
                description: 'Beautiful and intuitive user experiences',
            },
        ],
    },
    {
        title: 'Blog',
        path: '/blog',
    },
    {
        title: 'Contact',
        path: '/contact',
    },
];

// ============================================
// FOOTER NAVIGATION
// ============================================
export const footerNavigation: FooterSection[] = [
    {
        title: 'Company',
        links: [
            { title: 'About Us', path: '/about' },
            { title: 'Careers', path: '/careers' },
            { title: 'Blog', path: '/blog' },
            { title: 'Press', path: '/press' },
        ],
    },
    {
        title: 'Resources',
        links: [
            { title: 'Documentation', path: '/docs' },
            { title: 'Help Center', path: '/help' },
            { title: 'API Reference', path: '/api-docs' },
            { title: 'Community', path: '/community' },
        ],
    },
    {
        title: 'Legal',
        links: [
            { title: 'Privacy Policy', path: '/privacy-policy' },
            { title: 'Terms of Service', path: '/terms-and-conditions' },
            { title: 'Cookie Policy', path: '/cookie-policy' },
            { title: 'GDPR', path: '/gdpr' },
        ],
    },
    {
        title: 'Contact',
        links: [
            { title: 'Get in Touch', path: '/contact' },
            { title: 'Support', path: '/support' },
            { title: 'Sales', path: '/sales' },
            { title: 'Partnerships', path: '/partnerships' },
        ],
    },
];

// ============================================
// SOCIAL LINKS
// ============================================
export const socialLinks: SocialLink[] = [
    {
        name: 'Twitter',
        url: 'https://twitter.com/yourcompany',
        icon: 'twitter',
    },
    {
        name: 'Facebook',
        url: 'https://facebook.com/yourcompany',
        icon: 'facebook',
    },
    {
        name: 'Instagram',
        url: 'https://instagram.com/yourcompany',
        icon: 'instagram',
    },
    {
        name: 'LinkedIn',
        url: 'https://linkedin.com/company/yourcompany',
        icon: 'linkedin',
    },
    {
        name: 'GitHub',
        url: 'https://github.com/yourcompany',
        icon: 'github',
    },
];

// ============================================
// AUTH NAVIGATION
// ============================================
export const authNavigation = {
    login: '/auth/login',
    register: '/auth/register',
    forgotPassword: '/auth/forgot-password',
    resetPassword: '/auth/reset-password',
    dashboard: '/dashboard',
    profile: '/profile',
    settings: '/settings',
};

// ============================================
// SITE CONFIG
// ============================================
export const siteConfig = {
    name: 'Your Company',
    description: 'Your company tagline or description goes here',
    url: process.env.NEXT_PUBLIC_APP_URL || 'https://yourcompany.com',
    ogImage: '/images/og-image.png',
    links: {
        twitter: 'https://twitter.com/yourcompany',
        github: 'https://github.com/yourcompany',
    },
    creator: 'Your Company',
    copyrightYear: new Date().getFullYear(),
};
