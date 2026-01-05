import React from 'react';
import { Container } from '@web/components/ui/container';
import { Typography } from '@web/components/ui/typography';

interface PageHeaderProps {
    title: string;
    description: string;
    count?: number;
    countLabel?: string;
}

export const PageHeader: React.FC<PageHeaderProps> = ({
    title,
    description,
    count,
    countLabel = 'items available',
}) => {
    return (
        <div className="bg-white border-b border-gray-200">
            <Container className="py-6">
                <Typography variant="h2" component="h1" className="mb-2">
                    {title}
                </Typography>
                <Typography variant="subtitle2" color="text-secondary">
                    {description}
                </Typography>
                {count !== undefined && (
                    <div className="mt-2">
                        <Typography variant="body2" color="text-secondary">
                            {count} {countLabel}
                        </Typography>
                    </div>
                )}
            </Container>
        </div>
    );
};
