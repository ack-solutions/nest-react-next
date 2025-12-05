import { Box, FormHelperText, useTheme } from '@mui/material';
import { Control, useController } from 'react-hook-form';

import { useResponsive } from '../../hook';
import OTPInput, { OTPInputProps } from '../fields/otp-input';


export interface RHFOtpInputProps
    extends Omit<OTPInputProps, 'onChange' | 'renderInput'> {
    name: string;
    control?: Control;
    inputStyleProps?: any
}

export function RHFOtpInput({ name, control, inputStyleProps, ...props }: RHFOtpInputProps) {
    const isMobile = useResponsive('down', 'sm');
    const theme = useTheme();
    const {
        field,
        fieldState: { error },
    } = useController({
        name,
        control,
    });

    return (
        <Box>
            <OTPInput
                containerStyle={{
                    margin: '0 auto',
                }}
                inputStyle={{
                    padding: theme.spacing(1),
                    width: isMobile ? 38 : 50,
                    height: isMobile ? 38 : 50,
                    margin: theme.spacing(0, 1),
                    border: '1px solid',
                    borderRadius: theme.shape.borderRadius,
                    background: 'transparent',
                    color: theme.palette.text.primary,
                    textAlign: 'center',
                    fontSize: theme.typography.h6.fontSize,
                    fontWeight: theme.typography.fontWeightBold,
                    ...theme.typography.body1,
                    ...(error?.message ?
                        { borderColor: theme.palette.error.main } :
                        { borderColor: theme.palette.grey[500] }),
                    ...inputStyleProps,
                }}
                onChange={field.onChange}
                value={field.value}
                inputType="number"
                renderInput={(props) => <input {...props} />}
                shouldAutoFocus
                {...props}
            />
            {error?.message ? (
                <FormHelperText
                    error
                    sx={{ ml: 1.5 }}
                >
                    {error?.message}
                </FormHelperText>
            ) : null}
        </Box>
    );
}
