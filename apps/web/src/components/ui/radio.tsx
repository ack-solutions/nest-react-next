import React from 'react';
import { cn } from '../../utils/cn';
import { Typography } from './typography';
import { tv, type VariantProps } from 'tailwind-variants';

const radioVariants = tv({
    base: [
        'rounded-full border-2 transition-all duration-200 focus:outline-hidden disabled:opacity-50 disabled:cursor-not-allowed relative flex items-center justify-center cursor-pointer',
    ],
    variants: {
        size: {
            sm: 'h-4 w-4',
            md: 'h-5 w-5',
            lg: 'h-6 w-6',
        },
        state: {
            default: 'border-divider focus:ring-2 focus:ring-primary/20',
            error: 'border-error focus:ring-2 focus:ring-error/20',
            success: 'border-success focus:ring-2 focus:ring-success/20',
            warning: 'border-warning focus:ring-2 focus:ring-warning/20',
        },
        color: {
            primary: 'border-primary bg-primary',
            secondary: 'border-secondary bg-secondary',
            success: 'border-success bg-success',
            warning: 'border-warning bg-warning',
            info: 'border-info bg-info',
            error: 'border-error bg-error',
            default: 'border-divider bg-foreground',
        } as const,
        checked: {
            true: '',
            false: '',
        },
        disabled: {
            true: 'cursor-not-allowed',
            false: 'hover:border-primary/60',
        },
    },
    compoundVariants: [
        {
            checked: true,
            color: 'primary',
            class: 'border-primary bg-primary',
        },
        {
            checked: true,
            color: 'secondary',
            class: 'border-secondary bg-secondary',
        },
        {
            checked: true,
            color: 'success',
            class: 'border-success bg-success',
        },
        {
            checked: true,
            color: 'warning',
            class: 'border-warning bg-warning',
        },
        {
            checked: true,
            color: 'info',
            class: 'border-info bg-info',
        },
        {
            checked: true,
            color: 'error',
            class: 'border-error bg-error',
        },
        {
            checked: true,
            color: 'default',
            class: 'border-divider bg-foreground',
        },
    ],
    defaultVariants: {
        size: 'md',
        state: 'default',
        color: 'primary',
        checked: false,
        disabled: false,
    },
});

const radioIconVariants = tv({
    base: [
        'rounded-full bg-background',
    ],
    variants: {
        size: {
            sm: 'w-2 h-2',
            md: 'w-2.5 h-2.5',
            lg: 'w-3 h-3',
        },
    },
    defaultVariants: {
        size: 'md',
    },
});

const radioLabelVariants = tv({
    base: [
        'font-normal cursor-pointer ml-2',
    ],
    variants: {
        size: {
            sm: 'text-sm',
            md: 'text-base',
            lg: 'text-lg',
        },
        state: {
            default: 'text-foreground',
            error: 'text-foreground',
            success: 'text-foreground',
            warning: 'text-foreground',
        },
        disabled: {
            true: 'cursor-not-allowed opacity-50',
            false: '',
        },
    },
    defaultVariants: {
        size: 'md',
        state: 'default',
        disabled: false,
    },
});

const radioHelperTextVariants = tv({
    base: [
        'mt-1',
    ],
    variants: {
        size: {
            sm: 'text-xs',
            md: 'text-sm',
            lg: 'text-base',
        },
        state: {
            default: 'text-grey',
            error: 'text-error',
            success: 'text-success',
            warning: 'text-warning',
        },
    },
    defaultVariants: {
        size: 'md',
        state: 'default',
    },
});

export interface RadioProps
    extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size' | 'color'>,
    VariantProps<typeof radioVariants> {
    label?: string;
    helperText?: string;
}

export const Radio: React.FC<RadioProps> = ({
    label,
    helperText,
    size = 'md',
    state = 'default',
    color = 'primary',
    className,
    id,
    disabled = false,
    ...props
}) => {
    const radioRef = React.useRef<HTMLInputElement>(null);
    const generatedId = React.useId();
    const radioId = id || generatedId;

    const radioClasses = cn(
        radioVariants({
            size,
            state,
            color,
            checked: !!props.checked,
            disabled,
        }),
        className,
    );

    const labelClasses = radioLabelVariants({
        size,
        state,
        disabled,
    });

    const helperTextClasses = radioHelperTextVariants({
        size,
        state,
    });

    const handleRadioClick = () => {
        if (disabled) return;

        // Trigger the hidden input's click event
        if (radioRef.current) {
            radioRef.current.click();
        }
    };

    return (
        <div className="flex flex-col">
            <div className="flex items-center">
                {/* Hidden input for form compatibility */}
                <input
                    ref={radioRef}
                    type="radio"
                    id={radioId}
                    className="sr-only"
                    disabled={disabled}
                    {...props}
                />
                {/* Custom radio */}
                <div
                    className={radioClasses}
                    onClick={handleRadioClick}
                    role="radio"
                    aria-checked={props.checked}
                    tabIndex={disabled ? -1 : 0}
                    onKeyDown={(e) => {
                        if ((e.key === ' ' || e.key === 'Enter') && !disabled) {
                            e.preventDefault();
                            handleRadioClick();
                        }
                    }}
                >
                    {props.checked && (
                        <div className={radioIconVariants({ size })} />
                    )}
                </div>
                {label && (
                    <label
                        htmlFor={radioId}
                        className={labelClasses}
                    >
                        {label}
                    </label>
                )}
            </div>
            {helperText && (
                <Typography variant="body2" className={helperTextClasses}>
                    {helperText}
                </Typography>
            )}
        </div>
    );
};

// Form Control Label component for better label association
const formControlLabelVariants = tv({
    base: [
        'inline-flex items-center',
    ],
    variants: {
        labelPlacement: {
            start: 'flex-row-reverse',
            end: 'flex-row',
            top: 'flex-col',
            bottom: 'flex-col-reverse',
        },
    },
    defaultVariants: {
        labelPlacement: 'end',
    },
});

const formControlLabelTextVariants = tv({
    base: [
        'font-normal cursor-pointer',
    ],
    variants: {
        disabled: {
            true: 'cursor-not-allowed opacity-50',
            false: '',
        },
        labelPlacement: {
            start: 'mr-2',
            end: 'ml-2',
            top: 'mb-2',
            bottom: 'mt-2',
        },
    },
    defaultVariants: {
        disabled: false,
        labelPlacement: 'end',
    },
});

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
    const labelClasses = formControlLabelTextVariants({
        disabled,
        labelPlacement,
    });

    return (
        <label className={cn(formControlLabelVariants({ labelPlacement }), className)}>
            {labelPlacement === 'start' || labelPlacement === 'end' ? (
                <>
                    {control}
                    <span className={labelClasses}>
                        {label}
                    </span>
                </>
            ) : (
                <>
                    <span className={labelClasses}>
                        {label}
                    </span>
                    {control}
                </>
            )}
        </label>
    );
};

// Radio Group Component for managing multiple radio buttons
const radioGroupVariants = tv({
    base: [
        'space-y-3',
    ],
    variants: {
        row: {
            true: 'flex flex-wrap gap-6',
            false: '',
        },
    },
    defaultVariants: {
        row: false,
    },
});

export interface RadioGroupProps {
    children: React.ReactNode;
    value?: string | number;
    defaultValue?: string | number;
    onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
    name?: string;
    disabled?: boolean;
    row?: boolean;
    className?: string;
}

export const RadioGroup = ({
    children,
    value,
    defaultValue,
    onChange,
    name,
    disabled = false,
    row = false,
    className,
}: RadioGroupProps) => {
    const [internalValue, setInternalValue] = React.useState(defaultValue || value);

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (!disabled) {
            if (onChange) {
                onChange(event);
            } else {
                setInternalValue(event.target.value);
            }
        }
    };

    const currentValue = value !== undefined ? value : internalValue;

    const clones = React.Children.map(children, (child) => {
        if (React.isValidElement(child)) {
            const element = child as React.ReactElement<any>;

            // If it's a FormControlLabel, pass props to the control inside
            if (element.props.control && React.isValidElement(element.props.control)) {
                const controlElement = element.props.control as React.ReactElement<any>;
                const newControl = React.cloneElement(controlElement, {
                    name: name || controlElement.props.name,
                    checked: controlElement.props.value === currentValue,
                    onChange: handleChange,
                    disabled: disabled || controlElement.props.disabled,
                });

                return React.cloneElement(element, {
                    ...element.props,
                    control: newControl,
                });
            }

            // If it's a Radio component directly
            return React.cloneElement(element, {
                name: name || element.props.name,
                checked: element.props.value === currentValue,
                onChange: handleChange,
                disabled: disabled || element.props.disabled,
            });
        }
        return child;
    });

    return (
        <div
            className={cn(
                radioGroupVariants({ row }),
                className
            )}
            role="radiogroup"
        >
            {clones}
        </div>
    );
};

export default Radio;
