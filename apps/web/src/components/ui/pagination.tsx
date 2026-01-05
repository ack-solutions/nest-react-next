import React from 'react';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, MoreHorizontal } from 'lucide-react';

export interface PaginationProps {
    count: number;
    page?: number;
    defaultPage?: number;
    boundaryCount?: number;
    siblingCount?: number;
    disabled?: boolean;
    hideNextButton?: boolean;
    hidePrevButton?: boolean;
    showFirstButton?: boolean;
    showLastButton?: boolean;
    shape?: 'circular' | 'rounded-sm';
    size?: 'small' | 'medium' | 'large';
    variant?: 'text' | 'outlined';
    color?: 'primary' | 'secondary' | 'standard' | 'gradient';
    onChange?: (event: React.MouseEvent<HTMLButtonElement>, page: number) => void;
    className?: string;
    showLabels?: boolean;
}

type PaginationItem = {
    type: 'page' | 'first' | 'previous' | 'next' | 'last' | 'start-ellipsis' | 'end-ellipsis';
    page: number | null;
    selected: boolean;
    disabled: boolean;
};

const Pagination: React.FC<PaginationProps> = ({
    count,
    page: controlledPage,
    defaultPage = 1,
    boundaryCount = 1,
    siblingCount = 1,
    disabled = false,
    hideNextButton = false,
    hidePrevButton = false,
    showFirstButton = false,
    showLastButton = false,
    shape = 'circular',
    size = 'medium',
    variant = 'text',
    color = 'primary',
    onChange,
    className = '',
    showLabels = false,
}) => {
    const [internalPage, setInternalPage] = React.useState(defaultPage);
    const currentPage = controlledPage ?? internalPage;

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>, value: number) => {
        if (!controlledPage) {
            setInternalPage(value);
        }
        onChange?.(event, value);
    };

    const range = (start: number, end: number) => {
        const length = end - start + 1;
        return Array.from({ length }, (_, i) => start + i);
    };

    const startPages = range(1, Math.min(boundaryCount, count));
    const endPages = range(Math.max(count - boundaryCount + 1, boundaryCount + 1), count);

    const siblingsStart = Math.max(
        Math.min(currentPage - siblingCount, count - boundaryCount - siblingCount * 2 - 1),
        boundaryCount + 2
    );

    const siblingsEnd = Math.min(
        Math.max(currentPage + siblingCount, boundaryCount + siblingCount * 2 + 2),
        endPages.length > 0 ? endPages[0] - 2 : count - 1
    );

    const items: PaginationItem[] = [];

    if (showFirstButton) {
        items.push({
            type: 'first',
            page: 1,
            selected: false,
            disabled: disabled || currentPage === 1,
        });
    }

    if (!hidePrevButton) {
        items.push({
            type: 'previous',
            page: currentPage - 1,
            selected: false,
            disabled: disabled || currentPage === 1,
        });
    }

    [...startPages].forEach((page) => {
        items.push({
            type: 'page',
            page,
            selected: page === currentPage,
            disabled: disabled,
        });
    });

    if (siblingsStart > boundaryCount + 2) {
        items.push({
            type: 'start-ellipsis',
            page: null,
            selected: false,
            disabled: disabled,
        });
    } else if (boundaryCount + 1 < count - boundaryCount) {
        items.push({
            type: 'page',
            page: boundaryCount + 1,
            selected: boundaryCount + 1 === currentPage,
            disabled: disabled,
        });
    }

    range(siblingsStart, siblingsEnd).forEach((page) => {
        items.push({
            type: 'page',
            page,
            selected: page === currentPage,
            disabled: disabled,
        });
    });

    if (siblingsEnd < count - boundaryCount - 1) {
        items.push({
            type: 'end-ellipsis',
            page: null,
            selected: false,
            disabled: disabled,
        });
    } else if (count - boundaryCount > boundaryCount) {
        items.push({
            type: 'page',
            page: count - boundaryCount,
            selected: count - boundaryCount === currentPage,
            disabled: disabled,
        });
    }

    [...endPages].forEach((page) => {
        items.push({
            type: 'page',
            page,
            selected: page === currentPage,
            disabled: disabled,
        });
    });

    if (!hideNextButton) {
        items.push({
            type: 'next',
            page: currentPage + 1,
            selected: false,
            disabled: disabled || currentPage === count,
        });
    }

    if (showLastButton) {
        items.push({
            type: 'last',
            page: count,
            selected: false,
            disabled: disabled || currentPage === count,
        });
    }

    const sizeClasses = {
        small: showLabels ? 'h-8 px-3 text-xs' : 'h-8 min-w-[32px] text-xs',
        medium: showLabels ? 'h-10 px-4 text-sm' : 'h-10 min-w-[40px] text-sm',
        large: showLabels ? 'h-12 px-5 text-base' : 'h-12 min-w-[48px] text-base',
    };

    const shapeClasses = {
        circular: 'rounded-full',
        rounded: 'rounded-md',
    };

    const getColorClasses = (selected: boolean, isNavigationButton: boolean = false) => {
        // For gradient color, only apply to navigation buttons (first, last, next, previous)
        if (color === 'gradient' && isNavigationButton) {
            return 'bg-(image:--gradient) text-white hover:opacity-90 border-transparent';
        }

        if (variant === 'text') {
            if (selected) {
                const selectedColors = {
                    primary: 'bg-primary text-primary-contrast hover:bg-primary-dark',
                    secondary: 'bg-secondary text-secondary-contrast hover:bg-secondary-dark',
                    standard: 'bg-grey-dark text-white hover:bg-foreground',
                    gradient: 'bg-primary text-primary-contrast hover:bg-primary-dark', // fallback for page numbers
                };
                return selectedColors[color];
            }
            return 'text-foreground hover:bg-background-secondary';
        } else {
            if (selected) {
                const selectedColors = {
                    primary: 'border border-primary bg-primary-lighter/20 text-primary hover:bg-primary-lighter/30',
                    secondary: 'border border-secondary bg-secondary-lighter/20 text-secondary hover:bg-secondary-lighter/30',
                    standard: 'border border-grey-dark bg-grey-light/20 text-grey-dark hover:bg-grey-light/30',
                    gradient: 'border border-divider bg-primary-lighter/20 text-primary hover:bg-primary-lighter/30', // fallback for page numbers
                };
                return selectedColors[color];
            }
            return 'border border-divider text-foreground hover:bg-background-secondary';
        }
    };

    const renderItem = (item: PaginationItem, index: number) => {
        const baseClasses = `inline-flex items-center justify-center font-medium transition-colors ${sizeClasses[size]} ${shapeClasses[shape]}`;
        const disabledClasses = item.disabled
            ? 'opacity-40 cursor-not-allowed'
            : 'cursor-pointer';

        if (item.type === 'start-ellipsis' || item.type === 'end-ellipsis') {
            return (
                <div
                    key={`ellipsis-${index}`}
                    className={`${baseClasses} ${disabledClasses}`}
                >
                    <MoreHorizontal className="w-5 h-5" />
                </div>
            );
        }

        const iconSize = size === 'small' ? 16 : size === 'medium' ? 20 : 24;
        const isNavigationButton = ['first', 'previous', 'next', 'last'].includes(item.type);

        // Hide navigation buttons when disabled
        if (isNavigationButton && item.disabled) {
            return null;
        }

        const getLabel = () => {
            switch (item.type) {
                case 'first':
                    return 'First';
                case 'previous':
                    return 'Previous';
                case 'next':
                    return 'Next';
                case 'last':
                    return 'Last';
                default:
                    return null;
            }
        };

        const getIcon = () => {
            switch (item.type) {
                case 'first':
                    return showLabels ? getLabel() : <ChevronsLeft size={iconSize} />;
                case 'previous':
                    return showLabels ? getLabel() : <ChevronLeft size={iconSize} />;
                case 'next':
                    return showLabels ? getLabel() : <ChevronRight size={iconSize} />;
                case 'last':
                    return showLabels ? getLabel() : <ChevronsRight size={iconSize} />;
                default:
                    return item.page;
            }
        };

        return (
            <button
                key={`${item.type}-${item.page}-${index}`}
                onClick={(e) => item.page && !item.disabled && handleClick(e, item.page)}
                disabled={item.disabled}
                className={`${baseClasses} ${getColorClasses(item.selected, isNavigationButton)} ${disabledClasses}`}
                aria-current={item.selected ? 'page' : undefined}
                aria-label={
                    item.type === 'page'
                        ? `Go to page ${item.page}`
                        : item.type === 'first'
                            ? 'Go to first page'
                            : item.type === 'last'
                                ? 'Go to last page'
                                : item.type === 'previous'
                                    ? 'Go to previous page'
                                    : item.type === 'next'
                                        ? 'Go to next page'
                                        : undefined
                }
            >
                {getIcon()}
            </button>
        );
    };

    return (
        <nav className={`flex items-center gap-1 ${className}`} aria-label="pagination">
            {items.map((item, index) => renderItem(item, index))}
        </nav>
    );
};

export default Pagination;
