import { FormHelperText } from '@mui/material';
import { ErrorMessage, FieldProps, getIn } from 'formik';
import { matchIsValidTel, MuiTelInputInfo } from 'mui-tel-input';
import { useState, useCallback } from 'react';

import PhoneNumberInput from '../phone-number-input';


export interface PhoneNumberFieldProps extends FieldProps { }

const PhoneNumberField = ({
    form: { setFieldValue, touched, errors },
    field: { name, value },
    ...props
}: PhoneNumberFieldProps) => {

    const [isValid, setIsValid] = useState(true);

    const handlePhoneChange = useCallback(
        (newValue: string, _countryData: MuiTelInputInfo) => {
            setFieldValue(name, newValue);
            const valid = matchIsValidTel(newValue, {
                onlyCountries: [],
                excludedCountries: [],
                continents: [],
            });
            setIsValid(valid);
        },
        [name, setFieldValue],
    );

    const hasError = getIn(touched, name) && getIn(errors, name);

    return (
        <>
            <PhoneNumberInput
                value={value}
                onChange={handlePhoneChange}
                error={!isValid || !!hasError}
                helperText={!isValid ? 'Please enter a valid phone number.' : ''}
                {...props}
            />
            {hasError && (
                <FormHelperText error>
                    <ErrorMessage name={name} />
                </FormHelperText>
            )}
        </>
    );
};

export default PhoneNumberField;
