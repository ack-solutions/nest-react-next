'use client';

import React from 'react';
import { LucideIcon } from 'lucide-react';
import { Card, CardContent } from '@web/components/ui/card';
import { Typography } from '@web/components/ui/typography';
import { Icon } from '@web/components/ui/icons';
import { cn } from '@web/utils/cn';

export interface ContactInfoCardProps {
    icon: LucideIcon;
    title: string;
    description?: string;
    content: React.ReactNode;
    className?: string;
}

export function ContactInfoCard({
    icon,
    title,
    description,
    content,
    className,
}: ContactInfoCardProps) {
    return (
        <Card className={cn(className)}>
            <CardContent className="p-6">
                <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center mb-4">
                    <Icon icon={icon} className="text-white" />
                </div>
                <Typography variant="h4" component="p" gutterBottom>
                    {title}
                </Typography>
                {description && (
                    <Typography variant="body2" color="text-secondary" sx={{ mb: 2 }}>
                        {description}
                    </Typography>
                )}
                {typeof content === 'string' ? (
                    <Typography variant="body1">
                        {content}
                    </Typography>
                ) : (
                    <div>{content}</div>
                )}
            </CardContent>
        </Card>
    );
}

