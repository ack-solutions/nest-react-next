'use client';

import React from 'react';
import { LucideIcon } from 'lucide-react';
import { Card } from '@web/components/ui/card';
import { Typography } from '@web/components/ui/typography';
import { Icon } from '@web/components/ui/icons';
import { cn } from '@web/utils/cn';

export interface StatsCardProps {
    icon: LucideIcon;
    iconColor?: 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'grey';
    iconBgClassName?: string;
    label: string;
    value: string | number;
    className?: string;
}

export function StatsCard({
    icon,
    iconColor = 'primary',
    iconBgClassName = 'bg-primary/10',
    label,
    value,
    className,
}: StatsCardProps) {
    return (
        <Card className={cn(className)}>
            <div className="flex items-center gap-3">
                <div className={cn('p-3 rounded-xl ', iconBgClassName)}>
                    <Icon icon={icon} size="lg" color={iconColor} />
                </div>
                <div>
                    <Typography variant="body2" color="text-secondary">
                        {label}
                    </Typography>
                    <Typography variant="subtitle1">
                        {value}
                    </Typography>
                </div>
            </div>
        </Card>
    );
}
