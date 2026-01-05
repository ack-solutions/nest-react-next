'use client';

import React from 'react';
import { Filter, Search, Star } from 'lucide-react';
import { FilterCard } from '@web/components/ui/filter-card';
import { Typography } from '@web/components/ui/typography';
import { IDealCategories } from '@libs/types';

// Search Filter Helper
export interface SearchFilterConfig {
    value: string;
    placeholder?: string;
    onChange: (value: string) => void;
}

export const createSearchFilter = (config: SearchFilterConfig) => ({
    id: 'search',
    title: 'Search',
    icon: Search,
    content: (
        <FilterCard title="Search" icon={Search}>
            <input
                type="text"
                placeholder={config.placeholder || 'Search...'}
                value={config.value}
                onChange={(e) => config.onChange(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-hidden focus:border-primary text-sm"
            />
        </FilterCard>
    ),
});

// Category Filter Helper
export interface CategoryFilterConfig {
    categories: IDealCategories[];
    selectedCategory: string;
    onChange: (category: string) => void;
    allLabel?: string;
}

export const createCategoryFilter = (config: CategoryFilterConfig) => ({
    id: 'category',
    title: 'Categories',
    icon: Filter,
    content: (
        <FilterCard title="Categories" icon={Filter}>
            <div className="space-y-2">
                <button
                    onClick={() => config.onChange('all')}
                    className={`block w-full text-left px-3 py-2 rounded-lg transition-colors text-sm ${config.selectedCategory === 'all'
                            ? 'bg-primary text-white'
                            : 'text-gray-700 hover:bg-gray-100'
                        }`}
                >
                    {config.allLabel || 'All Categories'}
                </button>
                {config.categories.map((category) => (
                    <button
                        key={category.id}
                        onClick={() => config.onChange(category.name || '')}
                        className={`block w-full text-left px-3 py-2 rounded-lg transition-colors text-sm ${config.selectedCategory === category.name
                                ? 'bg-primary text-white'
                                : 'text-gray-700 hover:bg-gray-100'
                            }`}
                    >
                        {category.name}
                    </button>
                ))}
            </div>
        </FilterCard>
    ),
});

// Price Range Filter Helper
export interface PriceRangeFilterConfig {
    priceRange: [number, number];
    onChange: (range: [number, number]) => void;
    min?: number;
    max?: number;
    step?: number;
    currency?: string;
}

export const createPriceRangeFilter = (config: PriceRangeFilterConfig) => ({
    id: 'priceRange',
    title: 'Price Range',
    content: (
        <FilterCard title="Price Range">
            <div className="space-y-3">
                <div>
                    <Typography variant="body2" color="text-secondary">
                        Min: {config.currency || '₹'}{config.priceRange[0]}
                    </Typography>
                    <input
                        type="range"
                        min={config.min || 0}
                        max={config.max || 5000}
                        step={config.step || 100}
                        value={config.priceRange[0]}
                        onChange={(e) => config.onChange([parseInt(e.target.value), config.priceRange[1]])}
                        className="w-full accent-primary"
                    />
                </div>
                <div>
                    <Typography variant="body2" color="text-secondary">
                        Max: {config.currency || '₹'}{config.priceRange[1]}
                    </Typography>
                    <input
                        type="range"
                        min={config.min || 0}
                        max={config.max || 5000}
                        step={config.step || 100}
                        value={config.priceRange[1]}
                        onChange={(e) => config.onChange([config.priceRange[0], parseInt(e.target.value)])}
                        className="w-full accent-primary"
                    />
                </div>
            </div>
        </FilterCard>
    ),
});

// Rating Filter Helper
export interface RatingFilterConfig {
    minRating: number;
    onChange: (rating: number) => void;
    ratingOptions?: number[];
}

export const createRatingFilter = (config: RatingFilterConfig) => ({
    id: 'rating',
    title: 'Minimum Rating',
    icon: Star,
    content: (
        <FilterCard title="Minimum Rating" icon={Star}>
            <div className="space-y-2">
                {(config.ratingOptions || [4.5, 4.0, 3.5, 3.0]).map((rating) => (
                    <button
                        key={rating}
                        onClick={() => config.onChange(rating)}
                        className={`block w-full text-left px-3 py-2 rounded-lg transition-colors text-sm ${config.minRating === rating
                                ? 'bg-primary text-white'
                                : 'text-gray-700 hover:bg-gray-100'
                            }`}
                    >
                        {rating}★ & above
                    </button>
                ))}
                <button
                    onClick={() => config.onChange(0)}
                    className={`block w-full text-left px-3 py-2 rounded-lg transition-colors text-sm ${config.minRating === 0
                            ? 'bg-primary text-white'
                            : 'text-gray-700 hover:bg-gray-100'
                        }`}
                >
                    All Ratings
                </button>
            </div>
        </FilterCard>
    ),
});

// Verified Filter Helper
export interface VerifiedFilterConfig {
    verifiedOnly: boolean;
    onChange: (verified: boolean) => void;
    label?: string;
}

export const createVerifiedFilter = (config: VerifiedFilterConfig) => ({
    id: 'verified',
    title: 'Verification',
    content: (
        <FilterCard title="Verification">
            <label className="flex items-center gap-3 cursor-pointer">
                <input
                    type="checkbox"
                    checked={config.verifiedOnly}
                    onChange={(e) => config.onChange(e.target.checked)}
                    className="w-4 h-4 accent-primary"
                />
                <span className="text-sm text-gray-700">{config.label || 'Show verified stores only'}</span>
            </label>
        </FilterCard>
    ),
});

// Custom Filter Helper (for any custom filter)
export interface CustomFilterConfig {
    id: string;
    title: string;
    icon?: React.ComponentType<any>;
    content: React.ReactNode;
}

export const createCustomFilter = (config: CustomFilterConfig) => ({
    id: config.id,
    title: config.title,
    icon: config.icon,
    content: config.content,
});
