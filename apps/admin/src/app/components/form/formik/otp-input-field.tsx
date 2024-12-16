import { FormHelperText, useTheme } from "@mui/material"
import { ErrorMessage, FieldProps, getIn } from "formik"
import { useCallback } from "react"

import OTPInput, { OTPInputProps } from "../otp-input"


export interface OtpInputFieldProps extends FieldProps, Omit<OTPInputProps, 'onChange' | 'renderInput'> {
}

export const OtpInputField = ({
    form: { setFieldValue, touched, errors },
    field: { name, value },
    ...props
}: OtpInputFieldProps) => {
    const theme = useTheme()
    const handleOTPChange = useCallback(
        (otp: string) => {
            setFieldValue(name, otp)
        },
        [name, setFieldValue],
    )

    const hasError = getIn(touched, name) && getIn(errors, name)

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
                    ...hasError ? { borderColor: theme.palette.error.main } : { borderColor: theme.palette.divider }
                }}
                onChange={handleOTPChange}
                value={value}
                inputType='number'
                renderInput={(props) => <input {...props} />}
                shouldAutoFocus
                {...props}
            />
            {hasError && (
                <FormHelperText error > <ErrorMessage name={name} /> </FormHelperText>
            )}
        </>

    )
}