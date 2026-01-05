import React from 'react';
import { cn } from '../../utils/cn';
import { X } from 'lucide-react';

export interface ChipProps extends React.HTMLAttributes<HTMLDivElement> {
    label: string;
    selected?: boolean;
    onRemove?: () => void;
    icon?: React.ReactNode;
    variant?: 'default' | 'primary' | 'outlined';
    size?: 'sm' | 'md' | 'lg';
}

export const Chip: React.FC<ChipProps> = ({
    label,
    selected = false,
    onRemove,
    icon,
    variant = 'default',
    size = 'md',
    className,
    onClick,
    ...props
}) => {
    const baseStyles = 'inline-flex items-center gap-2 rounded-full font-medium transition-all duration-200 cursor-pointer border';

    const variantStyles = {
        default: selected
            ? 'bg-[#1A1A1A] text-white border-[#1A1A1A] shadow-md shadow-black/20 hover:bg-black'
            : 'bg-white text-text-primary border-(--border-subtle) hover:border-[#1A1A1A] hover:bg-gray-100',
        primary: selected
            ? 'bg-[#1A1A1A] text-white border-[#1A1A1A] shadow-md shadow-black/20 hover:bg-black'
            : 'bg-primary/10 text-primary border-primary/20 hover:bg-primary/20 hover:border-primary',
        outlined: selected
            ? 'border-2 border-[#1A1A1A] bg-[#1A1A1A] text-white hover:bg-black'
            : 'border border-gray-300 bg-white text-gray-700 hover:border-[#1A1A1A] hover:bg-gray-50',
    };

    const sizeStyles = {
        sm: 'px-3 py-1.5 text-xs',
        md: 'px-4 py-2 text-sm',
        lg: 'px-5 py-2.5 text-base',
    };

    const iconSizeStyles = {
        sm: 'h-3 w-3',
        md: 'h-4 w-4',
        lg: 'h-5 w-5',
    };

    return (
        <div
            className={cn(
                baseStyles,
                variantStyles[variant],
                sizeStyles[size],
                className
            )}
            onClick={onClick}
            {...props}
        >
            {icon && (
                <span className={cn('inline-flex', iconSizeStyles[size])}>
                    {icon}
                </span>
            )}
            <span>{label}</span>
            {onRemove && (
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        onRemove();
                    }}
                    className={cn(
                        'inline-flex items-center justify-center rounded-full hover:bg-black/10 transition-colors',
                        iconSizeStyles[size]
                    )}
                    aria-label="Remove"
                >
                    <X className={iconSizeStyles[size]} />
                </button>
            )}
        </div>
    );
};
