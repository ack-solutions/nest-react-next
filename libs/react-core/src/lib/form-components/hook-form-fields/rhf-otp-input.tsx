import { FormHelperText } from "@mui/material";
import { useTheme } from '@mui/material/styles';
import { Control, useController } from 'react-hook-form';

import OTPInput, { OTPInputProps } from "../fields/otp-input";


export interface RHFOtpInputProps extends Omit<OTPInputProps, 'onChange' | 'renderInput'> {
    name: string;
    control?: Control;
}

export const RHFOtpInput = ({
    name,
    control,
    ...props
}: RHFOtpInputProps) => {
    const theme = useTheme();
    const {
        field,
        fieldState: { error },
    } = useController({
        name,
        control,
    });



    return (
        <>
            <OTPInput
                containerStyle={{
                    margin: ' 0 auto'
                }}
                inputStyle={{
                    padding: theme.spacing(1),
                    width: 50,
                    height: 50,
                    margin: theme.spacing(0, 1),
                    borderRadius: theme.shape.borderRadius,
                    ...theme.typography.body1,
                    ...error?.message ? { borderColor: theme.palette.error.main } : { borderColor: theme.palette.divider }
                }}
                onChange={field.onChange}
                value={field.value}
                inputType='number'
                renderInput={(props) => <input {...props} />}
                shouldAutoFocus
                {...props}
            />
            {error?.message && (
                <FormHelperText error > {error?.message} </FormHelperText>
            )}
        </>
    );
}
