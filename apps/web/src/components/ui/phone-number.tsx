'use client';

import React, { forwardRef, useCallback, useMemo } from 'react';
import PhoneInput, { parsePhoneNumber, getCountryCallingCode, type Country, type Value, type PhoneNumber } from 'react-phone-number-input';
import 'react-phone-number-input/style.css';
import { cn } from '../../utils/cn';
import { tv, type VariantProps } from 'tailwind-variants';
import { Phone } from 'lucide-react';

// ============================================================================
// Style Variants
// ============================================================================

const phoneInputVariants = tv({
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
            sm: 'h-8 text-sm',
            md: 'h-10 text-sm',
            lg: 'h-12 text-base',
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
// Type Definitions
// ============================================================================

export interface PhoneNumberProps
    extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'value' | 'size'>,
    VariantProps<typeof phoneInputVariants> {
    label?: string;
    helperText?: string;
    value?: Value;
    onChange?: (value: Value, parsed?: PhoneNumber) => void;
    onChangeCountry?: (isoCode: Country, countryCode: string) => void;
    defaultCountry?: Country;
    placeholder?: string;
    international?: boolean;
    withCountryCallingCode?: boolean;
    onBlur?: () => void;
}

// ============================================================================
// Custom Input Component
// ============================================================================

interface CustomInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    variant?: 'default' | 'filled' | 'outlined';
    inputSize?: 'sm' | 'md' | 'lg';
    state?: 'default' | 'error' | 'success' | 'warning';
    fullWidth?: boolean;
}

const CustomInput = forwardRef<HTMLInputElement, CustomInputProps>(
    ({ variant, inputSize, state, fullWidth, className, ...props }, ref) => {
        const inputClasses = cn(
            phoneInputVariants({ variant, inputSize, state, fullWidth }),
            'px-4',
            className
        );

        return <input ref={ref} className={inputClasses} {...props} />;
    }
);

CustomInput.displayName = 'CustomInput';

// ============================================================================
// Main Component
// ============================================================================

export const PhoneNumberInput: React.FC<PhoneNumberProps> = ({
    variant = 'default',
    inputSize = 'md',
    state = 'default',
    label,
    helperText,
    value,
    onChange,
    onChangeCountry,
    defaultCountry = 'US',
    placeholder = 'Enter phone number',
    international = true,
    withCountryCallingCode = true,
    fullWidth = false,
    className,
    disabled,
    onBlur,
    ...props
}) => {
    const handleChange = useCallback(
        (val: Value) => {
            let parsed: PhoneNumber | undefined;
            if (val) {
                try {
                    parsed = parsePhoneNumber(val);
                } catch (e) {
                    // Ignore parsing errors
                }
            }
            onChange?.(val, parsed);
        },
        [onChange]
    );

    const handleCountryChange = useCallback(
        (country?: Country) => {
            if (country && onChangeCountry) {
                try {
                    const callingCode = getCountryCallingCode(country);
                    onChangeCountry(country, `+${callingCode}`);
                } catch (e) {
                    // Ignore errors
                }
            }
        },
        [onChangeCountry]
    );

    const containerClasses = cn('relative', fullWidth && 'w-full');

    // Custom styles for react-phone-number-input
    const phoneInputStyles = useMemo(
        () => ({
            '--PhoneInputCountryFlag-height': inputSize === 'sm' ? '16px' : inputSize === 'md' ? '20px' : '24px',
            '--PhoneInputCountryFlag-width': inputSize === 'sm' ? '24px' : inputSize === 'md' ? '30px' : '36px',
        }),
        [inputSize]
    ) as React.CSSProperties;

    return (
        <div className={containerClasses} style={phoneInputStyles}>
            {label && (
                <label className="block font-medium text-foreground mb-2">
                    {label}
                </label>
            )}

            <div className="relative">
                <div className={cn(
                    '[&_.PhoneInput]:flex [&_.PhoneInput]:items-center',
                    '[&_.PhoneInputInput]:flex-1 [&_.PhoneInputInput]:border-0 [&_.PhoneInputInput]:outline-hidden [&_.PhoneInputInput]:bg-transparent',
                    '[&_.PhoneInputInput]:text-foreground [&_.PhoneInputInput]:placeholder:text-grey',
                    '[&_.PhoneInputCountry]:mr-2 [&_.PhoneInputCountry]:flex [&_.PhoneInputCountry]:items-center',
                    '[&_.PhoneInputCountrySelect]:border-0 [&_.PhoneInputCountrySelect]:bg-transparent [&_.PhoneInputCountrySelect]:text-foreground',
                    '[&_.PhoneInputCountrySelect]:cursor-pointer focus:[&_.PhoneInputCountrySelect]:outline-hidden',
                    '[&_.PhoneInputCountrySelectArrow]:opacity-50 [&_.PhoneInputCountrySelectArrow]:ml-1',
                    '[&_.PhoneInputCountryIcon]:border-0 [&_.PhoneInputCountryIcon]:rounded-sm',
                    '[&_.PhoneInputCountryIcon--square]:rounded-sm',
                    // Focus states
                    '[&_.PhoneInputInput:focus]:outline-hidden',
                    '[&_.PhoneInputCountrySelect:focus]:outline-hidden [&_.PhoneInputCountrySelect:focus]:ring-2 [&_.PhoneInputCountrySelect:focus]:ring-primary/20',
                )}>
                    <PhoneInput
                        international={international}
                        withCountryCallingCode={withCountryCallingCode}
                        defaultCountry={defaultCountry}
                        value={value}
                        onChange={handleChange}
                        onCountryChange={handleCountryChange}
                        onBlur={onBlur}
                        placeholder={placeholder}
                        disabled={disabled}
                        inputComponent={CustomInput}
                        className={cn(
                            phoneInputVariants({ variant, inputSize, state, fullWidth }),
                            'pl-2',
                            className
                        )}
                        {...props}
                    />
                </div>
            </div>

            {helperText && (
                <p className={helperTextVariants({ state })}>
                    {helperText}
                </p>
            )}
        </div>
    );
};

export default PhoneNumberInput;
