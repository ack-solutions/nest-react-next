import React from 'react';
import { cn } from '../../utils/cn';
import { tv, type VariantProps } from 'tailwind-variants';

const inputVariants = tv({
    base: [
        'transition-all duration-200 focus:outline-hidden disabled:opacity-50 disabled:cursor-not-allowed',
        'rounded-lg text-foreground placeholder:text-gray-400',
    ],
    variants: {
        variant: {
            default: 'bg-background border border-border-subtle focus:border-primary focus:ring-2 focus:ring-primary/10',
            filled: 'bg-gray-50 border-2 border-transparent focus:border-primary focus:ring-2 focus:ring-primary/10',
            outlined: 'bg-transparent border-2 border-border-subtle focus:border-primary focus:ring-2 focus:ring-primary/10',
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
        hasLeftIcon: {
            true: 'pl-10',
            false: '',
        },
        hasRightIcon: {
            true: 'pr-10',
            false: '',
        },
    },
    defaultVariants: {
        variant: 'default',
        inputSize: 'md',
        state: 'default',
        fullWidth: false,
        hasLeftIcon: false,
        hasRightIcon: false,
    },
});

const selectVariants = tv({
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
            sm: 'px-3 text-sm',
            md: 'px-4 text-sm',
            lg: 'px-4 text-base',
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
});

const textareaVariants = tv({
    base: [
        'transition-all duration-200 focus:outline-hidden disabled:opacity-50 disabled:cursor-not-allowed',
        'rounded-lg text-foreground placeholder:text-grey py-3',
    ],
    variants: {
        variant: {
            default: 'bg-background border border-divider focus:border-primary focus:ring-2 focus:ring-primary/20',
            filled: 'bg-grey border-2 border-transparent focus:border-primary focus:ring-2 focus:ring-primary/20',
            outlined: 'bg-transparent border-2 border-divider focus:border-primary focus:ring-2 focus:ring-primary/20',
        },
        inputSize: {
            sm: 'px-3 text-sm',
            md: 'px-4 text-sm',
            lg: 'px-4 text-base',
        },
        state: {
            default: '',
            error: 'border-error focus:border-error focus:ring-error/20',
            success: 'border-success focus:border-success focus:ring-success/20',
            warning: 'border-warning focus:border-warning focus:ring-warning/20',
        },
        resize: {
            none: 'resize-none',
            vertical: 'resize-y',
            horizontal: 'resize-x',
            both: 'resize',
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
        resize: 'vertical',
        fullWidth: false,
    },
});

const helperTextVariants = tv({
    base: [
        'mt-2 text-sm',
    ],
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

export interface InputProps
    extends React.InputHTMLAttributes<HTMLInputElement>,
    VariantProps<typeof inputVariants> {
    label?: string;
    helperText?: string;
    leftIcon?: React.ReactNode;
    rightIcon?: React.ReactNode;
}

export interface SelectProps
    extends React.SelectHTMLAttributes<HTMLSelectElement>,
    VariantProps<typeof inputVariants> {
    options?: { value: string | number; label: string }[];
    label?: string;
    helperText?: string;
}
export interface TextAreaProps
    extends React.TextareaHTMLAttributes<HTMLTextAreaElement>,
    VariantProps<typeof textareaVariants> {
    label?: string;
    helperText?: string;
}


export const Select: React.FC<SelectProps> = ({
    variant = 'outlined',
    inputSize = 'md',
    state = 'default',
    fullWidth = false,
    options = [],
    label,
    helperText,
    ...props
}) => {
    const inputClasses = cn(
        selectVariants({
            variant,
            inputSize,
            state,
            fullWidth,
        }),
    );
    return (
        <div className={cn('relative', fullWidth && 'w-full')}>
            {label && (
                <label className="block font-medium text-foreground mb-2">
                    {label}
                </label>
            )}
            <select className={inputClasses} {...props}>
                <option value="" className='text-grey'>Select an option</option>
                {options?.map((opt) => (
                    <option key={opt.value} value={opt.value} className='text-grey'>
                        {opt.label}
                    </option>
                ))}
            </select>
            {helperText && (
                <p className={helperTextVariants({ state })}>
                    {helperText}
                </p>
            )}
        </div>
    )
};

export const Input = React.forwardRef<HTMLInputElement, InputProps>(({
    variant = 'default',
    inputSize = 'md',
    state = 'default',
    label,
    helperText,
    leftIcon,
    rightIcon,
    fullWidth = false,
    className,
    ...props
}, ref) => {
    const inputClasses = cn(
        inputVariants({
            variant,
            inputSize,
            state,
            fullWidth,
            hasLeftIcon: !!leftIcon,
            hasRightIcon: !!rightIcon,
        }),
        className,
    );

    const containerClasses = cn('relative', fullWidth && 'w-full');

    return (
        <div className={containerClasses}>
            {label && (
                <label className="block font-medium text-foreground mb-2">
                    {label}
                </label>
            )}

            <div className="relative">
                {leftIcon && (
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-grey">
                        {leftIcon}
                    </div>
                )}

                <input ref={ref} className={inputClasses} {...props} />

                {rightIcon && (
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 text-grey">
                        {rightIcon}
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
});

Input.displayName = 'Input';

export const TextArea: React.FC<TextAreaProps> = ({
    variant = 'default',
    inputSize = 'md',
    state = 'default',
    label,
    helperText,
    fullWidth = false,
    resize = 'vertical',
    className,
    ...props
}) => {
    const textareaClasses = cn(
        textareaVariants({
            variant,
            inputSize,
            state,
            resize,
            fullWidth,
        }),
        className,
    );

    const containerClasses = cn(fullWidth && 'w-full');

    return (
        <div className={containerClasses}>
            {label && (
                <label className="block font-medium text-foreground mb-2">
                    {label}
                </label>
            )}

            <textarea className={textareaClasses} {...props} />

            {helperText && (
                <p className={helperTextVariants({ state })}>
                    {helperText}
                </p>
            )}
        </div>
    );
};

// Code editor styled textarea
export const CodeTextArea: React.FC<TextAreaProps> = ({
    className,
    ...props
}) => {
    return (
        <TextArea
            className={cn(
                'font-mono',
                className,
            )}
            variant="default"
            resize="none"
            {...props}
        />
    );
};

// Search input with built-in search icon
export const SearchInput: React.FC<Omit<InputProps, 'leftIcon'>> = ({
    placeholder = 'Search...',
    ...props
}) => {
    return (
        <Input
            type="search"
            placeholder={placeholder}
            leftIcon={
                <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24">
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                </svg>
            }
            {...props}
        />
    );
};
