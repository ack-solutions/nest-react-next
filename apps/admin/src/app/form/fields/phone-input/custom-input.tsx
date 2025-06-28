import { InputAdornment, TextField } from '@mui/material';
import { forwardRef, useContext } from 'react';

import { CountryListPopover } from './list';
import { TextFieldRawProps } from '../text-field-raw';
import { PhoneInputContext } from './phone-input';


export const CustomInput = forwardRef<HTMLInputElement, TextFieldRawProps>(({
    ...props
}, ref) => {
    const { isoCode, onChangeCountry, disableSelect } = useContext(PhoneInputContext);
    return (
        <TextField
            fullWidth
            inputRef={ref}
            slotProps={{
                input: {
                    inputProps: {
                        maxLength: 15,
                    },
                    startAdornment: !disableSelect && (
                        <InputAdornment position="start">
                            <CountryListPopover
                                isoCode={isoCode}
                                onClickCountry={onChangeCountry}
                            />
                        </InputAdornment>
                    ),
                    sx: {
                        paddingLeft: disableSelect ? undefined : 0.5,
                    },
                },
            }}
            {...props}
        />
    );
});
