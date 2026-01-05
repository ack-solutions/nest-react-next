'use client';

import React from 'react';

/**
 * Phone Number Input Component
 *
 * Note: The react-phone-number-input package is not compatible with React 19.
 * This is a placeholder component. To enable phone number input functionality,
 * either wait for the package to be updated or use an alternative library.
 */

export interface PhoneNumberProps {
    value?: string;
    onChange?: (value: string | undefined) => void;
    defaultCountry?: string;
    placeholder?: string;
    disabled?: boolean;
    className?: string;
}

export const PhoneNumberInput: React.FC<PhoneNumberProps> = ({
    value,
    onChange,
    placeholder = 'Enter phone number',
    disabled = false,
    className = '',
}) => {
    return (
        <input
            type="tel"
            value={value || ''}
            onChange={(e) => onChange?.(e.target.value || undefined)}
            placeholder={placeholder}
            disabled={disabled}
            className={`w-full px-4 py-3 rounded-xl border border-neutral-200 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary disabled:bg-neutral-100 disabled:cursor-not-allowed ${className}`}
        />
    );
};

export default PhoneNumberInput;
