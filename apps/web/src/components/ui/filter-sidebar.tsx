'use client';

import React, { useState } from 'react';
import { SlidersHorizontal } from 'lucide-react';
import Sticky from 'react-stickynode';
import { Button } from '@web/components/ui/button';
import { Icon } from '@web/components/ui/icons';

export interface FilterItem {
    id: string;
    title: string;
    icon?: React.ComponentType<any>;
    content: React.ReactNode;
}

export interface FilterSidebarProps {
    // Array of filter items to render
    filters: FilterItem[];

    // Reset
    onReset?: () => void;
    resetLabel?: string;

    // Sticky configuration
    stickyTop?: number;
    stickyBottomBoundary?: string;
}

export const FilterSidebar = ({
    filters = [],
    onReset,
    resetLabel = 'Reset Filters',
    stickyTop = 140,
    stickyBottomBoundary = '#content',
}: FilterSidebarProps) => {
    const [showFilters, setShowFilters] = useState(false);

    return (
        <div className="lg:w-64 shrink-0">
            {/* Mobile Filter Toggle */}
            <button
                onClick={() => setShowFilters(!showFilters)}
                className="lg:hidden w-full flex items-center justify-center gap-2 px-4 py-3 bg-white border border-gray-300 rounded-lg mb-4"
            >
                <Icon icon={SlidersHorizontal} size="sm" />
                <span>Filters</span>
            </button>

            <Sticky top={stickyTop} bottomBoundary={stickyBottomBoundary}>
                <div className={`${showFilters ? 'block' : 'hidden'} lg:block space-y-6`}>
                    {/* Render all filters */}
                    {filters.map((filter) => (
                        <div key={filter.id}>
                            {filter.content}
                        </div>
                    ))}

                    {/* Reset Filters */}
                    {onReset && (
                        <Button onClick={onReset} variant="outline" fullWidth>
                            {resetLabel}
                        </Button>
                    )}
                </div>
            </Sticky>
        </div>
    );
};
