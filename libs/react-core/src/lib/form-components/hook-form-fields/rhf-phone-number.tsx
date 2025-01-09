import { FormHelperText } from '@mui/material';
import { MuiTelInputInfo } from 'mui-tel-input';
import { useCallback } from 'react';
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
    const {
        field,
        fieldState: { error },
    } = useController({
        name,
        control,
        defaultValue,
    });

    const handlePhoneChange = useCallback(
        (_newValue: string, _countryData: MuiTelInputInfo) => {
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
