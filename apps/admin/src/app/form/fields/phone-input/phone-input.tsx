import type { TextFieldProps } from '@mui/material/TextField';
import { useState, forwardRef, useEffect, useCallback, Ref, createContext, useMemo } from 'react';
import PhoneNumberInput, { parsePhoneNumber, PhoneNumber, type Country, type Value } from 'react-phone-number-input/input';

import { CustomInput } from './custom-input';


export interface PhoneInputProps extends Omit<TextFieldProps, 'onChange' | 'ref'> {
    value: string;
    isoCode?: Country;
    countryCode?: string;
    disableSelect?: boolean;
    onChange: (newValue: any, parsedValue?: PhoneNumber | undefined) => void;
    onChangeCountry?: (isoCode: Country, countryCode: string) => void;
}

interface PhoneInputContextType {
    isoCode?: Country;
    onChangeCountry?: (isoCode: Country, countryCode: string) => void;
    disableSelect?: boolean;
}

export const PhoneInputContext = createContext<PhoneInputContextType>({});

export const PhoneInput = forwardRef(({
    value,
    onChange,
    onChangeCountry,
    placeholder,
    isoCode: initialIsoCode,
    countryCode: initialCountryCode,
    disableSelect,
    error,
    helperText,
    label,
    variant = 'outlined',
    ...other
}: PhoneInputProps, ref: Ref<PhoneInputProps>) => {
    const [isoCode, setIsoCode] = useState<Country>('IN');

    const handleChange = useCallback((newValue: Value) => {
        const parsedValue = parsePhoneNumber(newValue || '', isoCode);
        onChange(newValue, parsedValue);
    }, [isoCode, onChange]);

    const handleCountryChange = useCallback((newIsoCode: Country, newCountryCode: string) => {
        setIsoCode(newIsoCode);
        onChangeCountry?.(newIsoCode, newCountryCode);
    }, [onChangeCountry]);

    useEffect(() => {
        if (initialIsoCode) {
            setIsoCode(initialIsoCode);
        }
    }, [initialIsoCode, initialCountryCode]);

    const contextValue = useMemo(() => ({
        isoCode,
        onChangeCountry: handleCountryChange,
        disableSelect,
    }), [
        isoCode,
        handleCountryChange,
        disableSelect,
    ]);

    return (
        <PhoneInputContext.Provider value={contextValue}>
            <PhoneNumberInput
                ref={ref}
                country={isoCode}
                inputComponent={CustomInput}
                value={value}
                onChange={handleChange}
                placeholder={placeholder ?? 'Enter phone number'}
                error={error}
                helperText={helperText}
                label={label}
                variant={variant}
                {...other}
            />
        </PhoneInputContext.Provider>
    );
});

PhoneInput.displayName = 'PhoneInput';
