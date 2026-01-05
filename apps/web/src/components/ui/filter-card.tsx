import React from 'react';
import { Card, CardContent } from '@web/components/ui/card';
import { Typography } from '@web/components/ui/typography';
import { Icon } from '@web/components/ui/icons';
import { LucideIcon } from 'lucide-react';

interface FilterCardProps {
    title: string;
    icon?: LucideIcon;
    children: React.ReactNode;
}

export const FilterCard: React.FC<FilterCardProps> = ({ title, icon, children }) => {
    return (
        <Card>
            <CardContent className="p-2">
                <Typography 
                    variant="h5" 
                    color="text-primary" 
                    className="mb-3 flex items-center gap-2"
                >
                    {icon && <Icon icon={icon} />}
                    {title}
                </Typography>
                {children}
            </CardContent>
        </Card>
    );
};
