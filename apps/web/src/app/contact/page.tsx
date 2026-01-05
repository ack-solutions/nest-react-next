import { Metadata } from 'next';
import { ContactPageClient } from '@web/sections/contact/contact-page';

export const metadata: Metadata = {
    title: 'Contact Us | Your Company',
    description: 'Get in touch with our team. We are here to help you with any questions or concerns you may have.',
    openGraph: {
        title: 'Contact Us | Your Company',
        description: 'Get in touch with our team.',
        type: 'website',
    },
};

export default function ContactPage() {
    return <ContactPageClient />;
}
