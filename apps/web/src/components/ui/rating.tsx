'use client';

import React from 'react';
import { Star } from 'lucide-react';

interface RatingProps {
    rating: number;
    maxRating?: number;
    showNumber?: boolean;
    size?: number;
}

export const Rating: React.FC<RatingProps> = ({
    rating,
    maxRating = 5,
    showNumber = true,
    size = 16,
}) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    return (
        <div className="inline-flex items-center gap-2">
            <div className="flex items-center gap-0.5">
                {[...Array(maxRating)].map((_, index) => (
                    <Star
                        key={index}
                        size={size}
                        className={
                            index < fullStars
                                ? 'fill-[#FFB800] text-[#FFB800]'
                                : index === fullStars && hasHalfStar
                                    ? 'fill-[#FFB800] text-[#FFB800] opacity-50'
                                    : 'text-gray-300'
                        }
                    />
                ))}
            </div>
            {showNumber && (
                <span className="text-sm font-semibold text-text-primary">
                    {rating.toFixed(1)}
                </span>
            )}
        </div>
    );
};
