import { useState } from 'react';
import { Box, InputLabel, useTheme } from '@mui/material';
import { matchIsValidTel, MuiTelInput, MuiTelInputInfo, MuiTelInputProps } from 'mui-tel-input';

export interface PhoneNumberInputProps extends Omit<MuiTelInputProps, 'onChange'> {
    label?: string
    onChange?: (value: string, countryData: MuiTelInputInfo) => void
}

const PhoneNumberInput = ({
    label,
    onChange,
    value,
    sx,
    ...props
}: PhoneNumberInputProps) => {
    const [phone, setPhone] = useState<any>(value || '');
    const [isValid, setIsValid] = useState(true);
    const theme = useTheme()

    const handlePhoneChange = (value: string, countryData: MuiTelInputInfo) => {
        setPhone(value);
        onChange && onChange(value, countryData)

        const valid = matchIsValidTel(value, {
            onlyCountries: [],
            excludedCountries: [],
            continents: []
        });
        setIsValid(valid);
    };

    return (
        <Box sx={{ width: '100%', ...sx }}>
            {label && (
                <InputLabel
                    disabled={!!props?.disabled}
                    required={!!props?.required}
                    error={!!props?.error}
                    htmlFor={props?.name}
                    margin='dense'
                    sx={{
                        ...theme.typography.body2,
                        color: 'text.secondary', mb: 0.5
                    }}
                >
                    {label}
                </InputLabel>
            )}
            <MuiTelInput
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
