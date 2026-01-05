'use client';

import React from 'react';
import { Card, CardHeader, CardContent } from '@web/components/ui/card';
import { Typography } from '@web/components/ui/typography';
import { Button } from '@web/components/ui/button';
import { Icon } from '@web/components/ui/icons';
import { LucideIcon } from 'lucide-react';
import { cn } from '@web/utils/cn';

export interface SectionCardProps {
    title: string;
    subtitle?: string;
    actionLabel?: string;
    actionIcon?: LucideIcon;
    onAction?: () => void;
    children: React.ReactNode;
    className?: string;
}

export function SectionCard({
    title,
    subtitle,
    actionLabel,
    actionIcon,
    onAction,
    children,
    className,
}: SectionCardProps) {
    return (
        <Card className={cn('p-6', className)}>
            <div className="flex items-center justify-between mb-6">
                <div>
                    <Typography variant="subtitle1">{title}</Typography>
                    {subtitle && (
                        <Typography variant="body2" color="text-secondary">
                            {subtitle}
                        </Typography>
                    )}
                </div>
                {actionLabel && onAction && (
                    <Button
                        onClick={onAction}
                        variant="contained"
                        size="sm"
                    >
                        {actionIcon && <Icon icon={actionIcon} size="xs" className="mr-2" />}
                        {actionLabel}
                    </Button>
                )}
            </div>
            {children}
        </Card>
    );
}
