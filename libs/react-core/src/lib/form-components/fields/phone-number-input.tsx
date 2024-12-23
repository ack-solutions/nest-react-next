import { Box } from '@mui/material';
import { matchIsValidTel, MuiTelInput, MuiTelInputInfo, MuiTelInputProps } from 'mui-tel-input';
import { useMemo, useState } from 'react';


export interface PhoneNumberInputProps extends Omit<MuiTelInputProps, 'onChange'> {
    label?: string
    onChange?: (value: string, countryData: MuiTelInputInfo) => void
}

const PhoneNumberInput = ({
    label,
    onChange,
    value,
    sx,
    // ...props
}: PhoneNumberInputProps) => {
    const [isValid, setIsValid] = useState(true);
    const phone = useMemo(() => {
        return (
            value
        )
    }, [value])

    const handlePhoneChange = (value: string, countryData: MuiTelInputInfo) => {
        if (onChange) {
            onChange(value, countryData)
        }
        const valid = matchIsValidTel(value, {
            onlyCountries: [],
            excludedCountries: [],
            continents: []
        });
        setIsValid(valid);
    };

    return (
        <Box
            sx={{
                width: '100%',
                ...sx
            }}
        >
            <MuiTelInput
                label={label}
                value={phone}
                onChange={handlePhoneChange}
                defaultCountry="IN"
                fullWidth
                error={!isValid}
                helperText={!isValid ? 'Please enter a valid phone number.' : ''}
                focusOnSelectCountry
                inputMode='search'
                MenuProps={{
                    PaperProps: {
                        style: {
                            maxHeight: 300,
                            overflowY: 'auto',
                        },
                    },
                }}

            />
        </Box>
    );
};

export default PhoneNumberInput;
