import { FormHelperText } from '@mui/material';
import { matchIsValidTel, MuiTelInputInfo } from 'mui-tel-input';
import { useState, useCallback } from 'react';
import { Control, useController } from 'react-hook-form';

import PhoneNumberInput, { PhoneNumberInputProps } from '../fields/phone-number-input';


export interface RHFPhoneNumberProps extends PhoneNumberInputProps {
    name: string;
    control?: Control;
    defaultValue?: string;
}

export const RHFPhoneNumber = ({
    name,
    control,
    defaultValue = '',
    ...props
}: RHFPhoneNumberProps) => {
    const [isValid, setIsValid] = useState(true);

    const {
        field,
        fieldState: { error },
    } = useController({
        name,
        control,
        defaultValue,
    });

    const handlePhoneChange = useCallback(
        (newValue: string, _countryData: MuiTelInputInfo) => {
            console.log(_countryData);

            field.onChange(_countryData.numberValue);
        },
        [field],
    );

    return (
        <>
            <PhoneNumberInput
                value={field?.value}
                onChange={handlePhoneChange}
                error={!isValid || !!error}
                helperText={!isValid ? 'Please enter a valid phone number.' : ''}
                {...props}
            />
            {error && (
                <FormHelperText error>
                    {error.message}
                </FormHelperText>
            )}
        </>
    );
};
