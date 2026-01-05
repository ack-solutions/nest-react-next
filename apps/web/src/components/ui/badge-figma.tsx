'use client';

import React from 'react';
import { Clock } from 'lucide-react';

interface BadgeProps {
    children: React.ReactNode;
    variant?: 'discount' | 'timer' | 'new' | 'default';
    className?: string;
}

export const Badge: React.FC<BadgeProps> = ({ children, variant = 'default', className = '' }) => {
    const variantStyles = {
        discount: 'bg-[#1A1A1A] text-white font-semibold shadow-lg shadow-[#1A1A1A]/30',
        timer: 'bg-red-600 text-white font-medium shadow-lg',
        new: 'bg-green-600 text-white font-medium shadow-lg',
        default: 'bg-gray-100 text-gray-700 border border-gray-200 font-medium',
    };

    return (
        <span
            className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs backdrop-blur-xs ${variantStyles[variant]} ${className}`}
        >
            {children}
        </span>
    );
};

interface TimerBadgeProps {
    hours: number;
    minutes: number;
    seconds: number;
}

export const TimerBadge: React.FC<TimerBadgeProps> = ({ hours, minutes, seconds }) => {
    return (
        <Badge variant="timer">
            <Clock size={12} />
            <span>
                Ends in {String(hours).padStart(2, '0')}:{String(minutes).padStart(2, '0')}:
                {String(seconds).padStart(2, '0')}
            </span>
        </Badge>
    );
};

interface DiscountBadgeProps {
    percentage: number;
}

export const DiscountBadge: React.FC<DiscountBadgeProps> = ({ percentage }) => {
    return <Badge variant="discount">{percentage}% OFF</Badge>;
};
