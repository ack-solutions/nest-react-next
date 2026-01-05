'use client';

import React from 'react';
import { cn } from '../../utils/cn';
import { Typography } from './typography';
import Link from 'next/link';

const DropdownInternalContext = React.createContext<{
    close: () => void;
    mode: 'click' | 'hover';
} | null>(null);

interface DropdownProps {
    trigger: React.ReactNode;
    children: React.ReactNode;
    className?: string;
    contentClassName?: string;
    width?: 'sm' | 'md' | 'lg' | 'xl' | 'full' | string;
    position?: 'left' | 'center' | 'right' | 'auto-left' | 'auto-right' | 'auto-center';
    offset?: number;
    openOn?: 'click' | 'hover';
}

export const Dropdown: React.FC<DropdownProps> = ({
    trigger,
    children,
    className,
    contentClassName,
    width = '300px',
    position = 'left',
    offset = 0,
    openOn = 'click',
}) => {
    const rootRef = React.useRef<HTMLDivElement | null>(null);
    const [isOpen, setIsOpen] = React.useState(false);

    const isHoverMode = openOn === 'hover';

    const close = React.useCallback(() => {
        if (!isHoverMode) setIsOpen(false);
    }, [isHoverMode]);

    const handleDocumentClick = React.useCallback((event: MouseEvent) => {
        if (!rootRef.current) return;
        if (rootRef.current.contains(event.target as Node)) return;
        setIsOpen(false);
    }, []);

    const handleKeyDown = React.useCallback((event: KeyboardEvent) => {
        if (event.key === 'Escape') {
            setIsOpen(false);
        }
    }, []);

    React.useEffect(() => {
        if (!isHoverMode && isOpen) {
            document.addEventListener('click', handleDocumentClick);
            document.addEventListener('keydown', handleKeyDown);
            return () => {
                document.removeEventListener('click', handleDocumentClick);
                document.removeEventListener('keydown', handleKeyDown);
            };
        }
        return undefined;
    }, [isHoverMode, isOpen, handleDocumentClick, handleKeyDown]);

    const getWidthClass = () => {
        if (typeof width === 'string') {
            switch (width) {
                case 'sm': return 'min-w-[200px]';
                case 'md': return 'min-w-[300px]';
                case 'lg': return 'min-w-[400px]';
                case 'xl': return 'min-w-[500px]';
                case 'full': return 'w-full';
                default: return `min-w-[${width}]`;
            }
        }
        return `min-w-[${width}]`;
    };

    return (
        <div
            ref={rootRef}
            className={cn('flex group relative h-full items-center', className)}
            onMouseLeave={isHoverMode ? undefined : undefined}
        >
            {/* Trigger */}
            <div
                className={cn("w-full")}
                onClick={isHoverMode ? undefined : () => setIsOpen((prev) => !prev)}
                aria-expanded={!isHoverMode && isOpen ? true : undefined}
                aria-haspopup="menu"
            >
                {trigger}
            </div>

            {/* Dropdown (hover or click depending on prop) */}
            <DropdownInternalContext.Provider value={{ close, mode: openOn }}>
                <div
                    className={cn(
                        'absolute top-full z-50 bg-background border border-border-subtle rounded-xl shadow-lg',
                        isHoverMode
                            ? 'invisible opacity-0 group-hover:visible group-hover:opacity-100 group-hover:translate-y-1'
                            : cn(
                                isOpen ? 'visible opacity-100 translate-y-1' : 'invisible opacity-0 translate-y-0'
                            ),
                        'transition-all duration-200 ease-in-out',
                        getWidthClass(),
                        {
                            'left-0': position === 'left',
                            'right-0': position === 'right',
                            'left-1/2 -translate-x-1/2': position === 'center',
                        },
                        contentClassName
                    )}
                    style={{ marginTop: offset ? `${offset}px` : undefined }}
                    role="menu"
                >
                    {children}
                </div>
            </DropdownInternalContext.Provider>
        </div>
    );
};

export const DropdownContent: React.FC<{
    children: React.ReactNode;
    className?: string;
}> = ({ children, className }) => (
    <div className={cn('p-2', className)}>
        {children}
    </div>
);

export const DropdownGrid: React.FC<{
    children: React.ReactNode;
    columns?: 1 | 2 | 3 | 4;
    className?: string;
}> = ({ children, columns = 2, className }) => (
    <div className={cn(
        "grid gap-4",
        {
            'grid-cols-1': columns === 1,
            'grid-cols-2': columns === 2,
            'grid-cols-3': columns === 3,
            'grid-cols-4': columns === 4,
        },
        className
    )}>
        {children}
    </div>
);

export const DropdownSection: React.FC<{
    title?: any;
    children: React.ReactNode;
    className?: string;
}> = ({ title, children, className }) => (
    <div className={cn("space-y-3", className)}>
        {title && (
            <Typography variant="subtitle2" className="text-foreground font-semibold mb-3 pb-2">
                {title}
            </Typography>
        )}
        {children}
    </div>
);

export const DropdownList: React.FC<{
    children: React.ReactNode;
    className?: string;
}> = ({ children, className }) => (
    <div className={cn("space-y-2", className)}>
        {children}
    </div>
);

export const DropdownItem: React.FC<{
    children: React.ReactNode;
    icon?: React.ReactNode;
    badge?: string;
    description?: string;
    href?: string;
    onClick?: () => void;
    className?: string;
    variant?: 'default' | 'destructive' | 'success' | 'warning';
}> = ({
    children,
    icon,
    badge,
    description,
    href,
    onClick,
    className,
    variant = 'default'
}) => {
        const getVariantClasses = () => {
            switch (variant) {
                case 'destructive':
                    return 'hover:bg-error/10 text-error';
                case 'success':
                    return 'hover:bg-success/10 text-success';
                case 'warning':
                    return 'hover:bg-warning/10 text-warning';
                default:
                    return 'hover:bg-gray-100 text-text-primary hover:text-primary';
            }
        };

        const content = (
            <div className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-md transition-colors duration-200 cursor-pointer",
                getVariantClasses(),
                className
            )}>
                {icon && (
                    <div className="shrink-0 text-foreground/60">
                        {icon}
                    </div>
                )}
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                        <Typography className="text-sm" component='span' variant='body2'>
                            {children}
                        </Typography>
                        {badge && (
                            <Typography className="px-2 py-1 text-xs bg-primary/10 text-primary rounded-sm" component='span' variant='caption'>
                                {badge}
                            </Typography>
                        )}
                    </div>
                    {description && (
                        <Typography className="mt-1" component='span' variant='caption'>
                            {description}
                        </Typography>
                    )}
                </div>
            </div>
        );

        // Access Dropdown context to close on select
        const ctx = React.useContext(DropdownInternalContext);

        const handleSelect = () => {
            if (onClick) onClick();
            if (ctx && ctx.mode === 'click') ctx.close();
        };

        if (href) {
            return (
                <Link href={href} className="block mb-0" onClick={handleSelect}>
                    {content}
                </Link>
            );
        }

        return (
            <div onClick={handleSelect}>
                {content}
            </div>
        );
    };

export const DropdownSeparator: React.FC<{
    className?: string;
}> = ({ className }) => (
    <div className={cn('h-px bg-border-subtle my-2', className)} />
);

export const DropdownLabel: React.FC<{
    children: React.ReactNode;
    className?: string;
}> = ({ children, className }) => (
    <div className={cn('px-3 py-2 text-xs font-semibold text-foreground-muted', className)}>
        <Typography variant="caption" color="text-secondary">
            {children}
        </Typography>
    </div>
);

// Compound component for easier usage
const DropdownCompound = Dropdown as typeof Dropdown & {
    Content: typeof DropdownContent;
    Grid: typeof DropdownGrid;
    Section: typeof DropdownSection;
    List: typeof DropdownList;
    Item: typeof DropdownItem;
    Separator: typeof DropdownSeparator;
    Label: typeof DropdownLabel;
};

DropdownCompound.Content = DropdownContent;
DropdownCompound.Grid = DropdownGrid;
DropdownCompound.Section = DropdownSection;
DropdownCompound.List = DropdownList;
DropdownCompound.Item = DropdownItem;
DropdownCompound.Separator = DropdownSeparator;
DropdownCompound.Label = DropdownLabel;

// Attach context to component to allow Items to access it without separate import
// This is internal and not part of the public API surface.
(Dropdown as unknown as { __ctx?: React.Context<{ close: () => void; mode: 'click' | 'hover' } | null> }).__ctx = (function createCtx() {
    // Create once and reuse across renders
    const ctxRef = (Dropdown as unknown as { __ctx?: React.Context<{ close: () => void; mode: 'click' | 'hover' } | null> }).__ctx;
    if (ctxRef) return ctxRef;
    return React.createContext<{ close: () => void; mode: 'click' | 'hover' } | null>(null);
})();

export default DropdownCompound;
