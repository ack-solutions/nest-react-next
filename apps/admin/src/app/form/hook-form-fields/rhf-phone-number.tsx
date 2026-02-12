import { get } from 'lodash';
import { useCallback, useEffect, useState } from 'react';
import { useFormContext, useWatch } from 'react-hook-form';
import { PhoneNumber, Value, Country } from 'react-phone-number-input';

import { PhoneInput, PhoneInputProps } from '../fields/phone-input';


export interface RHFPhoneNumberProps extends Omit<PhoneInputProps, 'onChange' | 'onChangeCountry' | 'value'> {
    name: string;
    isoCodeKey?: string;
    countryCodeKey?: string;
    defaultValue?: string;
}

export function RHFPhoneNumber({
    name,
    isoCodeKey = 'phoneIsoCode',
    countryCodeKey = 'phoneCountryCode',
    ...props
}: RHFPhoneNumberProps) {
    const {
        control,
        setValue,
        formState: { errors, touchedFields, isSubmitted },
    } = useFormContext();
    const phone = useWatch({ defaultValue: '', control, name });
    const iso = useWatch({ defaultValue: 'IN', control, name: isoCodeKey });
    const code = useWatch({ defaultValue: '+91', control, name: countryCodeKey });

    const [displayValue, setDisplayValue] = useState<string>(() =>
        phone && code ? `${code}${phone}` : '',
    );

    const showError = !!get(errors, name, '') && (touchedFields?.[name] || isSubmitted);
    const errorText = showError ? (get(errors, name)?.message as string) : '';

    useEffect(() => {
        if (!phone || !code) return;
        const expected = `${code}${phone}`;
        if (displayValue !== expected) setDisplayValue(expected);
    }, [phone, code, displayValue]);

    const handleChange = useCallback(
        (value: Value, parsed?: PhoneNumber) => {
            setDisplayValue(value ?? '');
            setValue(name, parsed?.nationalNumber ?? '', { shouldValidate: true });
            if (parsed?.country) setValue(isoCodeKey, parsed.country);
            if (parsed?.countryCallingCode) setValue(countryCodeKey, `+${parsed.countryCallingCode}`);
        },
        [name, isoCodeKey, countryCodeKey, setValue],
    );

    const handleCountryChange = useCallback(
        (isoCode: Country, countryCode: string) => {
            if (phone) setValue(name, phone, { shouldTouch: true, shouldValidate: true });
            setValue(isoCodeKey, isoCode);
            setValue(countryCodeKey, countryCode);
        },
        [name, isoCodeKey, countryCodeKey, phone, setValue],
    );

    const handleBlur = useCallback(() => {
        setValue(name, phone ?? '', { shouldTouch: true, shouldValidate: true });
    }, [name, phone, setValue]);

    return (
        <PhoneInput
            value={displayValue}
            isoCode={iso}
            countryCode={code}
            onChange={handleChange}
            onChangeCountry={handleCountryChange}
            onBlur={handleBlur}
            error={!!showError}
            helperText={errorText}
            {...props}
        />
    );
}
