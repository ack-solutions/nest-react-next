'use client';

import React from 'react';
import { cn } from '@web/utils/cn';

export interface TabItem {
    value: string;
    label: string;
    count?: number;
}

export interface TabsProps {
    value: string;
    onChange: (value: string) => void;
    items: TabItem[];
    className?: string;
}

export function Tabs({ value, onChange, items, className }: TabsProps) {
    return (
        <div className={cn('flex gap-2 overflow-x-auto', className)}>
            {items.map((item) => {
                const isActive = value === item.value;
                return (
                    <button
                        key={item.value}
                        onClick={() => onChange(item.value)}
                        className={cn(
                            'px-6 py-3 font-medium text-sm transition-colors whitespace-nowrap flex items-center gap-2 relative',
                            isActive
                                ? 'text-primary border-b-2 border-primary'
                                : 'text-gray-600 hover:text-gray-900'
                        )}
                    >
                        <span>{item.label}</span>
                        {item.count !== undefined && (
                            <span className={cn(
                                'px-2 py-0.5 rounded-full text-xs font-medium',
                                isActive
                                    ? 'bg-primary/10 text-primary'
                                    : 'bg-gray-100 text-gray-600'
                            )}>
                                {item.count}
                            </span>
                        )}
                    </button>
                );
            })}
        </div>
    );
}

