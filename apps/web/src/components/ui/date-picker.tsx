'use client';

import React, { useState, useRef, useEffect, useMemo } from 'react';
import { cn } from '../../utils/cn';
import { tv, type VariantProps } from 'tailwind-variants';
import { Calendar, ChevronLeft, ChevronRight } from 'lucide-react';

// ============================================================================
// Constants
// ============================================================================

const MONTHS = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
];

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const YEAR_RANGE = 50; // ±50 years from current year

// ============================================================================
// Type Definitions
// ============================================================================

/**
 * Date display format options
 * - 'short': 12/25/2024
 * - 'long': December 25, 2024 (default)
 * - 'medium': Dec 25, 2024
 * - 'numeric': 12/25/2024
 * - 'iso': 2024-12-25
 * - 'dd/mm/yyyy': 25/12/2024
 * - 'mm/dd/yyyy': 12/25/2024
 * - 'yyyy-mm-dd': 2024-12-25
 * - Custom function: (date: Date) => string
 */
export type DateDisplayFormat =
    | 'short'
    | 'long'
    | 'medium'
    | 'numeric'
    | 'iso'
    | 'dd/mm/yyyy'
    | 'mm/dd/yyyy'
    | 'yyyy-mm-dd'
    | ((date: Date) => string);

export interface DatePickerProps
    extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'value'>,
    VariantProps<typeof datePickerVariants> {
    label?: string;
    helperText?: string;
    value?: string;
    onChange?: (value: string) => void;
    minDate?: string;
    maxDate?: string;
    placeholder?: string;
    /**
     * Format for displaying the selected date in the input field.
     * Can be a predefined format string or a custom formatter function.
     * @default 'long'
     */
    displayFormat?: DateDisplayFormat;
}

type ViewType = 'calendar' | 'year' | 'month';

// ============================================================================
// Style Variants
// ============================================================================

const datePickerVariants = tv({
    base: [
        'transition-all duration-200 focus:outline-hidden disabled:opacity-50 disabled:cursor-not-allowed',
        'rounded-lg text-foreground placeholder:text-grey',
    ],
    variants: {
        variant: {
            default: 'bg-background border border-divider focus:border-primary focus:ring-2 focus:ring-primary/20',
            filled: 'bg-grey border-2 border-transparent focus:border-primary focus:ring-2 focus:ring-primary/20',
            outlined: 'bg-transparent border-2 border-divider focus:border-primary focus:ring-2 focus:ring-primary/20',
        },
        inputSize: {
            sm: 'h-8 px-3 text-sm',
            md: 'h-10 px-4 text-sm',
            lg: 'h-12 px-4 text-base',
        },
        state: {
            default: '',
            error: 'border-error focus:border-error focus:ring-error/20',
            success: 'border-success focus:border-success focus:ring-success/20',
            warning: 'border-warning focus:border-warning focus:ring-warning/20',
        },
        fullWidth: {
            true: 'w-full',
            false: '',
        },
    },
    defaultVariants: {
        variant: 'default',
        inputSize: 'md',
        state: 'default',
        fullWidth: false,
    },
});

const calendarVariants = tv({
    slots: {
        popup: [
            'absolute z-50 mt-2 p-4 bg-background border border-divider rounded-xl shadow-xl',
            'backdrop-blur-xs animate-in fade-in-0 zoom-in-95 duration-200',
        ],
        header: 'flex items-center justify-between mb-4',
        monthYear: 'text-base font-semibold text-foreground flex items-center gap-1',
        monthYearButton: 'py-1 rounded-lg transition-colors cursor-pointer',
        navButton: [
            'p-1.5 rounded-lg hover:bg-primary/10 transition-colors',
            'text-grey hover:text-foreground cursor-pointer',
            'focus:outline-hidden focus:ring-2 focus:ring-primary/20',
        ],
        grid: 'grid grid-cols-7 gap-1',
        weekday: 'text-xs font-medium text-grey text-center py-2',
        day: [
            'w-9 h-9 flex items-center justify-center rounded-lg text-sm',
            'transition-all duration-150 cursor-pointer',
            'hover:bg-primary/10 focus:outline-hidden focus:ring-2 focus:ring-primary/20',
        ],
        dayToday: 'font-semibold text-primary',
        daySelected: 'bg-primary text-primary-contrast hover:bg-primary-dark',
        dayOtherMonth: 'text-grey opacity-50',
        dayDisabled: 'opacity-30 cursor-not-allowed hover:bg-transparent',
        yearPicker: 'grid grid-cols-4 gap-2 max-h-64 overflow-y-auto',
        yearItem: [
            'p-2 rounded-lg text-sm text-center cursor-pointer transition-colors',
            'hover:bg-primary/10 focus:outline-hidden focus:ring-2 focus:ring-primary/20',
        ],
        yearSelected: 'bg-primary text-primary-contrast font-semibold hover:bg-primary-dark active:scale-95',
        yearCurrent: 'font-semibold text-primary',
        monthPicker: 'grid grid-cols-3 gap-2',
        monthItem: [
            'p-3 rounded-lg text-sm text-center cursor-pointer transition-colors',
            'hover:bg-primary/10 focus:outline-hidden focus:ring-2 focus:ring-primary/20',
        ],
        monthSelected: 'bg-primary text-primary-contrast font-semibold hover:bg-primary-dark active:scale-95',
        monthCurrent: 'font-semibold text-primary',
        viewHeader: 'flex items-center justify-between mb-4',
        viewTitle: 'text-base font-semibold text-foreground',
        backButton: [
            'p-1.5 rounded-lg hover:bg-primary/10 transition-colors',
            'text-grey hover:text-foreground cursor-pointer',
            'focus:outline-hidden focus:ring-2 focus:ring-primary/20',
        ],
    },
});

const helperTextVariants = tv({
    base: ['mt-2 text-sm'],
    variants: {
        state: {
            default: 'text-grey',
            error: 'text-error',
            success: 'text-success',
            warning: 'text-warning',
        },
    },
    defaultVariants: {
        state: 'default',
    },
});

// ============================================================================
// Utility Functions
// ============================================================================

/**
 * Normalize date to start of day for comparison
 */
const normalizeDate = (date: Date): Date => {
    const normalized = new Date(date);
    normalized.setHours(0, 0, 0, 0);
    return normalized;
};

/**
 * Format date to ISO string (YYYY-MM-DD)
 */
const formatDateToISO = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};

/**
 * Get last day of month
 */
const getLastDayOfMonth = (year: number, month: number): number => {
    return new Date(year, month + 1, 0).getDate();
};

/**
 * Generate array of years for year picker
 */
const generateYearRange = (): number[] => {
    const currentYear = new Date().getFullYear();
    const startYear = currentYear - YEAR_RANGE;
    const endYear = currentYear + YEAR_RANGE;
    return Array.from({ length: endYear - startYear + 1 }, (_, i) => startYear + i);
};

/**
 * Format date for display based on format type
 */
const formatDateForDisplay = (date: Date, format: DateDisplayFormat): string => {
    if (typeof format === 'function') {
        return format(date);
    }

    switch (format) {
        case 'short':
        case 'numeric':
            return date.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'numeric',
                day: 'numeric',
            });

        case 'long':
            return date.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
            });

        case 'medium':
            return date.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
            });

        case 'iso':
        case 'yyyy-mm-dd':
            return formatDateToISO(date);

        case 'dd/mm/yyyy': {
            const dd = String(date.getDate()).padStart(2, '0');
            const mm = String(date.getMonth() + 1).padStart(2, '0');
            const yyyy = date.getFullYear();
            return `${dd}/${mm}/${yyyy}`;
        }

        case 'mm/dd/yyyy': {
            const mm = String(date.getMonth() + 1).padStart(2, '0');
            const dd = String(date.getDate()).padStart(2, '0');
            const yyyy = date.getFullYear();
            return `${mm}/${dd}/${yyyy}`;
        }

        default:
            return date.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
            });
    }
};

// ============================================================================
// Main Component
// ============================================================================

export const DatePicker: React.FC<DatePickerProps> = ({
    variant = 'default',
    inputSize = 'md',
    state = 'default',
    label,
    helperText,
    value,
    onChange,
    minDate,
    maxDate,
    fullWidth = false,
    placeholder = 'Select date',
    displayFormat = 'long',
    className,
    disabled,
    ...props
}) => {
    // ========================================================================
    // State & Refs
    // ========================================================================
    const [isOpen, setIsOpen] = useState(false);
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const [view, setView] = useState<ViewType>('calendar');
    const containerRef = useRef<HTMLDivElement>(null);

    const slots = calendarVariants();
    const selectedDate = value ? new Date(value) : null;
    const today = useMemo(() => normalizeDate(new Date()), []);

    // ========================================================================
    // Computed Values
    // ========================================================================
    const years = useMemo(() => generateYearRange(), []);
    const currentYear = new Date().getFullYear();
    const selectedYear = selectedDate?.getFullYear() ?? null;

    // Generate calendar days
    const days = useMemo(() => {
        const year = currentMonth.getFullYear();
        const month = currentMonth.getMonth();
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const daysInMonth = lastDay.getDate();
        const startingDayOfWeek = firstDay.getDay();

        const daysArray: (Date | null)[] = Array(startingDayOfWeek).fill(null);
        for (let day = 1; day <= daysInMonth; day++) {
            daysArray.push(new Date(year, month, day));
        }
        return daysArray;
    }, [currentMonth]);

    // ========================================================================
    // Effects
    // ========================================================================
    // Reset view and update current month when popup opens
    useEffect(() => {
        if (isOpen) {
            setView('calendar');
            if (selectedDate && !isNaN(selectedDate.getTime())) {
                setCurrentMonth(new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1));
            } else {
                const today = new Date();
                setCurrentMonth(new Date(today.getFullYear(), today.getMonth(), 1));
            }
        }
    }, [isOpen]); // Only reset when popup opens/closes, not when selectedDate changes

    // Close popup when clicking outside
    useEffect(() => {
        if (!isOpen) return;

        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isOpen]);

    // ========================================================================
    // Date Validation Helpers
    // ========================================================================
    const isToday = (date: Date): boolean => {
        return normalizeDate(date).getTime() === today.getTime();
    };

    const isSelected = (date: Date): boolean => {
        if (!selectedDate) return false;
        return normalizeDate(date).getTime() === normalizeDate(selectedDate).getTime();
    };

    const isDisabled = (date: Date): boolean => {
        const checkDate = normalizeDate(date);

        if (minDate) {
            const min = normalizeDate(new Date(minDate));
            if (checkDate < min) return true;
        }

        if (maxDate) {
            const max = normalizeDate(new Date(maxDate));
            if (checkDate > max) return true;
        }

        return false;
    };

    // ========================================================================
    // Date Update Helper
    // ========================================================================
    const updateSelectedDate = (year: number, month: number, preserveDay: boolean = true) => {
        if (!selectedDate) return;

        const day = preserveDay ? selectedDate.getDate() : 1;
        const lastDay = getLastDayOfMonth(year, month);
        const dayToUse = Math.min(day, lastDay);
        const newDate = new Date(year, month, dayToUse);
        onChange?.(formatDateToISO(newDate));
    };

    // ========================================================================
    // Event Handlers
    // ========================================================================
    const handleDayClick = (date: Date) => {
        if (isDisabled(date)) return;
        onChange?.(formatDateToISO(date));
        setIsOpen(false);
    };

    const handlePrevMonth = () => {
        const newDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1);
        setCurrentMonth(newDate);
        updateSelectedDate(newDate.getFullYear(), newDate.getMonth());
    };

    const handleNextMonth = () => {
        const newDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1);
        setCurrentMonth(newDate);
        updateSelectedDate(newDate.getFullYear(), newDate.getMonth());
    };

    const handleYearClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        e.preventDefault();
        setView('year');
    };

    const handleMonthClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        e.preventDefault();
        setView('month');
    };

    const handleYearSelect = (year: number) => {
        const monthToUse = currentMonth.getMonth();
        setCurrentMonth(new Date(year, monthToUse, 1));
        updateSelectedDate(year, monthToUse);
        setView('month');
    };

    const handleMonthSelect = (month: number) => {
        const yearToUse = currentMonth.getFullYear();
        setCurrentMonth(new Date(yearToUse, month, 1));
        updateSelectedDate(yearToUse, month);
        setView('calendar');
    };

    const handleBackToCalendar = () => {
        setView('calendar');
    };

    // ========================================================================
    // Format Display Value
    // ========================================================================
    const formatDisplayValue = (value?: string): string => {
        if (!value) return '';
        const date = new Date(value);
        if (isNaN(date.getTime())) return value;
        return formatDateForDisplay(date, displayFormat);
    };

    // ========================================================================
    // Render
    // ========================================================================
    const inputClasses = cn(
        datePickerVariants({ variant, inputSize, state, fullWidth }),
        'cursor-pointer',
        className
    );

    return (
        <div ref={containerRef} className={cn('relative', fullWidth && 'w-full')}>
            {label && (
                <label className="block font-medium text-foreground mb-2">
                    {label}
                </label>
            )}

            <div className="relative">
                <input
                    type="text"
                    readOnly
                    value={formatDisplayValue(value)}
                    placeholder={placeholder}
                    onClick={() => !disabled && setIsOpen(!isOpen)}
                    className={inputClasses}
                    disabled={disabled}
                    {...props}
                />

                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-grey">
                    <Calendar className="w-4 h-4" />
                </div>

                {isOpen && !disabled && (
                    <div className={slots.popup()} style={{ minWidth: '280px' }}>
                        {/* Calendar View */}
                        {view === 'calendar' && (
                            <>
                                <div className={slots.header()}>
                                    <button
                                        type="button"
                                        onClick={handlePrevMonth}
                                        className={slots.navButton()}
                                        aria-label="Previous month"
                                    >
                                        <ChevronLeft className="w-4 h-4" />
                                    </button>

                                    <div className={slots.monthYear()}>
                                        <button
                                            type="button"
                                            onClick={handleMonthClick}
                                            className={slots.monthYearButton()}
                                            aria-label="Select month"
                                        >
                                            {MONTHS[currentMonth.getMonth()]}
                                        </button>
                                        <button
                                            type="button"
                                            onClick={handleYearClick}
                                            className={slots.monthYearButton()}
                                            aria-label="Select year"
                                        >
                                            {currentMonth.getFullYear()}
                                        </button>
                                    </div>

                                    <button
                                        type="button"
                                        onClick={handleNextMonth}
                                        className={slots.navButton()}
                                        aria-label="Next month"
                                    >
                                        <ChevronRight className="w-4 h-4" />
                                    </button>
                                </div>

                                <div className={slots.grid()}>
                                    {WEEKDAYS.map((day) => (
                                        <div key={day} className={slots.weekday()}>
                                            {day}
                                        </div>
                                    ))}
                                </div>

                                <div className={slots.grid()}>
                                    {days.map((date, index) => {
                                        if (!date) {
                                            return <div key={`empty-${index}`} className="w-9 h-9" />;
                                        }

                                        return (
                                            <button
                                                key={date.toISOString()}
                                                type="button"
                                                onClick={() => handleDayClick(date)}
                                                className={cn(
                                                    slots.day(),
                                                    isToday(date) && slots.dayToday(),
                                                    isSelected(date) && slots.daySelected(),
                                                    date.getMonth() !== currentMonth.getMonth() && slots.dayOtherMonth(),
                                                    isDisabled(date) && slots.dayDisabled()
                                                )}
                                                disabled={isDisabled(date)}
                                                aria-label={`Select ${date.toLocaleDateString()}`}
                                            >
                                                {date.getDate()}
                                            </button>
                                        );
                                    })}
                                </div>
                            </>
                        )}

                        {/* Year Picker View */}
                        {view === 'year' && (
                            <>
                                <div className={slots.viewHeader()}>
                                    <button
                                        type="button"
                                        onClick={handleBackToCalendar}
                                        className={slots.backButton()}
                                        aria-label="Back to calendar"
                                    >
                                        <ChevronLeft className="w-4 h-4" />
                                    </button>
                                    <div className={slots.viewTitle()}>Select Year</div>
                                    <div className="w-10" />
                                </div>
                                <div className={slots.yearPicker()}>
                                    {years.map((year) => (
                                        <button
                                            key={year}
                                            type="button"
                                            onClick={() => handleYearSelect(year)}
                                            className={cn(
                                                slots.yearItem(),
                                                year === currentYear && slots.yearCurrent(),
                                                year === selectedYear && slots.yearSelected()
                                            )}
                                            aria-label={`Select year ${year}`}
                                        >
                                            {year}
                                        </button>
                                    ))}
                                </div>
                            </>
                        )}

                        {/* Month Picker View */}
                        {view === 'month' && (
                            <>
                                <div className={slots.viewHeader()}>
                                    <button
                                        type="button"
                                        onClick={handleBackToCalendar}
                                        className={slots.backButton()}
                                        aria-label="Back to calendar"
                                    >
                                        <ChevronLeft className="w-4 h-4" />
                                    </button>
                                    <button
                                        type="button"
                                        onClick={handleYearClick}
                                        className={cn(slots.viewTitle(), slots.monthYearButton())}
                                        aria-label="Select year"
                                    >
                                        {currentMonth.getFullYear()}
                                    </button>
                                    <div className="w-10" />
                                </div>
                                <div className={slots.monthPicker()}>
                                    {MONTHS.map((month, index) => {
                                        const isCurrentMonth = index === new Date().getMonth() &&
                                            currentMonth.getFullYear() === currentYear;
                                        const isSelectedMonth = index === currentMonth.getMonth();

                                        return (
                                            <button
                                                key={month}
                                                type="button"
                                                onClick={() => handleMonthSelect(index)}
                                                className={cn(
                                                    slots.monthItem(),
                                                    isCurrentMonth && slots.monthCurrent(),
                                                    isSelectedMonth && slots.monthSelected()
                                                )}
                                                aria-label={`Select ${month}`}
                                            >
                                                {month}
                                            </button>
                                        );
                                    })}
                                </div>
                            </>
                        )}
                    </div>
                )}
            </div>

            {helperText && (
                <p className={helperTextVariants({ state })}>
                    {helperText}
                </p>
            )}
        </div>
    );
};

export default DatePicker;
