'use client';

import React from 'react';
import { LucideIcon } from 'lucide-react';
import { Typography } from '@web/components/ui/typography';
import { Icon } from '@web/components/ui/icons';
import { cn } from '@web/utils/cn';

export interface InfoItemProps {
    icon: LucideIcon;
    label: string;
    value: string | React.ReactNode;
    className?: string;
}

export function InfoItem({
    icon,
    label,
    value,
    className,
}: InfoItemProps) {
    return (
        <div className={cn('flex items-start gap-3 p-4 bg-gray-100 rounded-xl', className)}>
            <div className="bg-background p-2 rounded-lg">
                <Icon icon={icon} color="grey" />
            </div>
            <div className="flex-1">
                <Typography variant="caption" color="text-secondary" className="mb-1">
                    {label}
                </Typography>
                <Typography variant="body1">
                    {value || 'Not added'}
                </Typography>
            </div>
        </div>
    );
}
