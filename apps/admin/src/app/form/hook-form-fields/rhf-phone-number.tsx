import { get } from 'lodash';
import { useEffect, useState } from 'react';
import { useFormContext, useWatch } from 'react-hook-form';
import { PhoneNumber, Value, Country } from 'react-phone-number-input';

import { PhoneInput, PhoneInputProps } from '../fields/phone-input';


export interface RHFPhoneNumberProps extends Omit<PhoneInputProps, 'onChange' | 'onChangeCountry' | 'value'> {
    name: string;
    isoCodeKey?: string; // e.g., "userCountryIso"
    countryCodeKey?: string; // e.g., "userCallingCode"
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
    const phone = useWatch({
        defaultValue: '',
        control,
        name,
    });
    const iso = useWatch({
        defaultValue: 'IN',
        control,
        name: isoCodeKey,
    });
    const code = useWatch({
        defaultValue: '+91',
        control,
        name: countryCodeKey,
    });

    const [displayValue, setDisplayValue] = useState<any>(phone ? `${code}${phone}` : '');


    const showError = !!get(errors, name, '') && (touchedFields?.[name] || isSubmitted);
    const errorText = showError ? (get(errors, name)?.message as string) : '';

    useEffect(() => {
        // Sync UI display if values change externally
        if (phone && !displayValue?.toString().includes(phone)) {
            setDisplayValue(`${code}${phone}`);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [phone, code]);


    return (
        <PhoneInput
            value={displayValue}
            isoCode={iso}
            countryCode={code}
            onChange={(value: Value, parsed?: PhoneNumber) => {
                setDisplayValue(value || '');
                setValue(name, parsed?.nationalNumber || '', { shouldValidate: true });
                if (parsed?.country) {
                    setValue(isoCodeKey, parsed?.country);
                }
                if (parsed?.countryCallingCode) {
                    setValue(countryCodeKey, `+${parsed.countryCallingCode}`);
                }
            }}
            onChangeCountry={(isoCode: Country, countryCode: string) => {
                if (phone) {
                    setValue(name, phone ?? '', {
                        shouldTouch: true,
                        shouldValidate: true,
                    });
                }
                setValue(isoCodeKey, isoCode);
                setValue(countryCodeKey, countryCode);
            }}
            onBlur={() => {
                setValue(name, phone ?? '', {
                    shouldTouch: true,
                    shouldValidate: true,
                });
            }}
            error={!!showError}
            helperText={errorText}
            {...props}
        />
    );
}
