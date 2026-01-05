'use client';

import React from 'react';
import { MessageCircle } from 'lucide-react';
import Link from 'next/link';
import { Typography } from '@web/components/ui/typography';
import { Icon } from '@web/components/ui/icons';
import { cn } from '@web/utils/cn';

export interface FAQSectionProps {
    title?: string;
    description?: string;
    buttonText?: string;
    faqLink?: string;
    className?: string;
}

export function FAQSection({
    title = 'Need Quick Answers?',
    description = "Check out our FAQ page for instant answers to common questions about deals, purchases, and redemptions.",
    buttonText = 'Visit FAQ Page',
    faqLink = '/faq',
    className,
}: FAQSectionProps) {
    return (
        <div className={cn(
            'bg-gradient-to-br from-gray-900 to-primary rounded-xl p-8 text-white',
            className
        )}>
            <div className="flex items-center gap-3 mb-4">
                <Icon icon={MessageCircle} size="lg" />
                <Typography variant="h3" color="inherit">
                    {title}
                </Typography>
            </div>
            <Typography variant="body1" color="inherit" sx={{ mb: 3, opacity: 0.9 }}>
                {description}
            </Typography>
            <Link
                href={faqLink}
                className="inline-block px-6 py-3 bg-white text-primary rounded-lg hover:bg-gray-100 transition-colors font-medium"
            >
                {buttonText}
            </Link>
        </div>
    );
}

