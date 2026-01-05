import { Icon } from './icons';
import { CheckIcon, MinusIcon } from 'lucide-react';
import { tv, type VariantProps } from 'tailwind-variants';
import { Typography } from './typography';
import { cn } from '@web/utils/cn';
import React from 'react';

const checkboxVariants = tv({
    slots: {
        root: 'flex flex-col',
        container: 'flex items-start gap-3',
        wrapper: 'flex items-center',
        input: 'sr-only',
        checkbox: [
            'rounded-sm border-2 transition-all duration-200 cursor-pointer',
            'focus:outline-hidden disabled:opacity-50 disabled:cursor-not-allowed',
            'relative flex items-center justify-center',
        ],
        label: 'font-normal cursor-pointer',
        helperText: 'mt-1',
        icon: 'pointer-events-none',
    },
    variants: {
        size: {
            small: {
                checkbox: 'h-4 w-4',
                icon: 'w-2.5 h-2.5',
                label: 'text-sm',
                helperText: 'text-xs',
            },
            medium: {
                checkbox: 'h-5 w-5',
                icon: 'w-3 h-3',
                label: 'text-base',
                helperText: 'text-sm',
            },
            large: {
                checkbox: 'h-6 w-6',
                icon: 'w-4 h-4',
                label: 'text-lg',
                helperText: 'text-base',
            },
        },
        color: {
            primary: '',
            secondary: '',
            success: '',
            warning: '',
            error: '',
            info: '',
        },
        variant: {
            default: {
                checkbox: 'bg-background',
            },
            filled: {
                checkbox: 'bg-grey',
            },
        },
        state: {
            default: '',
            error: '',
            success: '',
            warning: '',
        },
        checked: {
            true: '',
            false: '',
        },
        disabled: {
            true: {
                checkbox: 'cursor-not-allowed hover:border-divider',
                label: 'cursor-not-allowed opacity-50',
            },
            false: '',
        },
        indeterminate: {
            true: '',
            false: '',
        },
    },
    compoundVariants: [
        // Default state styles
        {
            state: 'default',
            class: {
                checkbox: 'border-divider focus:border-primary focus:ring-2 focus:ring-primary/20',
                label: 'text-foreground',
                helperText: 'text-grey',
            },
        },
        {
            state: 'error',
            class: {
                checkbox: 'border-error focus:border-error focus:ring-2 focus:ring-error/20',
                label: 'text-foreground',
                helperText: 'text-error',
            },
        },
        {
            state: 'success',
            class: {
                checkbox: 'border-success focus:border-success focus:ring-2 focus:ring-success/20',
                label: 'text-foreground',
                helperText: 'text-success',
            },
        },
        {
            state: 'warning',
            class: {
                checkbox: 'border-warning focus:border-warning focus:ring-2 focus:ring-warning/20',
                label: 'text-foreground',
                helperText: 'text-warning',
            },
        },
        // Checked primary colors
        {
            checked: true,
            color: 'primary',
            state: 'default',
            class: {
                checkbox: 'bg-primary border-primary hover:bg-primary/90',
            },
        },
        {
            checked: true,
            color: 'secondary',
            state: 'default',
            class: {
                checkbox: 'bg-secondary border-secondary hover:bg-secondary/90',
            },
        },
        {
            checked: true,
            color: 'success',
            class: {
                checkbox: 'bg-success border-success hover:bg-success/90',
            },
        },
        {
            checked: true,
            color: 'warning',
            class: {
                checkbox: 'bg-warning border-warning hover:bg-warning/90',
            },
        },
        {
            checked: true,
            color: 'error',
            class: {
                checkbox: 'bg-error border-error hover:bg-error/90',
            },
        },
        {
            checked: true,
            color: 'info',
            class: {
                checkbox: 'bg-info border-info hover:bg-info/90',
            },
        },
        // Error state overrides
        {
            checked: true,
            state: 'error',
            class: {
                checkbox: 'bg-error border-error hover:bg-error/90',
            },
        },
        {
            checked: true,
            state: 'success',
            class: {
                checkbox: 'bg-success border-success hover:bg-success/90',
            },
        },
        {
            checked: true,
            state: 'warning',
            class: {
                checkbox: 'bg-warning border-warning hover:bg-warning/90',
            },
        },
        // Hover states for unchecked
        {
            checked: false,
            disabled: false,
            state: 'default',
            class: {
                checkbox: 'hover:border-primary/60',
            },
        },
        {
            checked: false,
            disabled: false,
            state: 'error',
            class: {
                checkbox: 'hover:border-error/60',
            },
        },
        {
            checked: false,
            disabled: false,
            state: 'success',
            class: {
                checkbox: 'hover:border-success/60',
            },
        },
        {
            checked: false,
            disabled: false,
            state: 'warning',
            class: {
                checkbox: 'hover:border-warning/60',
            },
        },
    ],
    defaultVariants: {
        size: 'medium',
        color: 'primary',
        variant: 'default',
        state: 'default',
        checked: false,
        disabled: false,
        indeterminate: false,
    },
});

export interface CheckboxProps
    extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size' | 'color'>,
    VariantProps<typeof checkboxVariants> {
    label?: React.ReactNode;
    helperText?: string;
    indeterminate?: boolean;
}

export const Checkbox: React.FC<CheckboxProps> = ({
    label,
    helperText,
    size = 'medium',
    color = 'primary',
    variant = 'default',
    state = 'default',
    indeterminate = false,
    className,
    id,
    disabled = false,
    checked = false,
    ...props
}) => {
    const checkboxRef = React.useRef<HTMLInputElement>(null);
    const generatedId = React.useId();
    const checkboxId = id || generatedId;

    React.useEffect(() => {
        if (checkboxRef.current) {
            checkboxRef.current.indeterminate = indeterminate;
        }
    }, [indeterminate]);

    const slots = checkboxVariants({
        size,
        color,
        variant,
        state,
        checked: checked || indeterminate,
        disabled,
        indeterminate,
    });

    const handleCheckboxClick = () => {
        if (disabled) return;

        // Trigger the hidden input's click event
        if (checkboxRef.current) {
            checkboxRef.current.click();
        }
    };

    return (
        <div className={slots.root()}>
            <div className={slots.wrapper()}>
                <div className={slots.container()}>
                    {/* Hidden input for form compatibility */}
                    <input
                        ref={checkboxRef}
                        type="checkbox"
                        id={checkboxId}
                        className={slots.input()}
                        disabled={disabled}
                        checked={checked}
                        {...props}
                    />
                    {/* Custom checkbox */}
                    <div
                        className={cn(slots.checkbox(), className)}
                        onClick={handleCheckboxClick}
                        role="checkbox"
                        aria-checked={indeterminate ? 'mixed' : checked}
                        tabIndex={disabled ? -1 : 0}
                        onKeyDown={(e) => {
                            if ((e.key === ' ' || e.key === 'Enter') && !disabled) {
                                e.preventDefault();
                                handleCheckboxClick();
                            }
                        }}
                    >
                        {checked && !indeterminate && (
                            <Icon
                                icon={CheckIcon}
                                color="white"
                                className={slots.icon()}
                                strokeWidth={3}
                            />
                        )}
                        {indeterminate && (
                            <Icon
                                icon={MinusIcon}
                                color="white"
                                className={slots.icon()}
                                strokeWidth={3}
                            />
                        )}
                    </div>
                </div>
                {label && (
                    <label
                        htmlFor={checkboxId}
                        className={slots.label() + ' ' + 'ml-2'}
                    >
                        {label}
                    </label>
                )}
            </div>
            {helperText && (
                <Typography variant="body2" className={slots.helperText()}>
                    {helperText}
                </Typography>
            )}
        </div>
    );
};

// FormControlLabel component (Material UI style)
export interface FormControlLabelProps {
    control: React.ReactElement<any>;
    label: React.ReactNode;
    disabled?: boolean;
    className?: string;
    labelPlacement?: 'end' | 'start' | 'top' | 'bottom';
}

export const FormControlLabel: React.FC<FormControlLabelProps> = ({
    control,
    label,
    disabled = false,
    className,
    labelPlacement = 'end',
}) => {
    const layoutClasses = {
        start: 'flex-row-reverse',
        end: 'flex-row',
        top: 'flex-col',
        bottom: 'flex-col-reverse',
    };

    const spacingClasses = {
        start: 'mr-2',
        end: 'ml-2',
        top: 'mb-2',
        bottom: 'mt-2',
    };

    const controlProps = {
        ...(control.props as any || {}),
        disabled: disabled || (control.props as any)?.disabled,
    };
    const clonedControl = React.cloneElement(control, controlProps);

    return (
        <label className={cn(
            'inline-flex items-center cursor-pointer',
            layoutClasses[labelPlacement],
            disabled && 'cursor-not-allowed opacity-50',
            className
        )}>
            {clonedControl}
            <span className={cn(
                'font-normal select-none',
                spacingClasses[labelPlacement],
                disabled && 'cursor-not-allowed'
            )}>
                {label}
            </span>
        </label>
    );
};

// Checkbox Group Component (Material UI style)
export interface CheckboxGroupProps {
    children: React.ReactNode;
    label?: string;
    helperText?: string;
    error?: boolean;
    required?: boolean;
    className?: string;
    row?: boolean;
}

export const CheckboxGroup: React.FC<CheckboxGroupProps> = ({
    children,
    label,
    helperText,
    error = false,
    required = false,
    className,
    row = false,
}) => {
    return (
        <fieldset className={cn('space-y-3', className)}>
            {label && (
                <legend className={cn(
                    'text-sm font-medium mb-3',
                    error ? 'text-error' : 'text-foreground'
                )}>
                    {label}
                    {required && <span className="text-error ml-1">*</span>}
                </legend>
            )}
            <div className={cn(
                row ? 'flex flex-wrap gap-4' : 'space-y-3'
            )}>
                {children}
            </div>
            {helperText && (
                <Typography
                    variant="body2"
                    color={error ? 'error' : 'grey'}
                    className="mt-2"
                >
                    {helperText}
                </Typography>
            )}
        </fieldset>
    );
};

export default Checkbox;
