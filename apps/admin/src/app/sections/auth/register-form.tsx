import { yupResolver } from '@hookform/resolvers/yup';
import { patterns } from '@libs/utils';
import { Alert, Button, Link, Stack, Typography } from '@mui/material';
import { useCallback, useState } from 'react';
import { Control, useForm, UseFormSetError } from 'react-hook-form';
import { boolean, object, string } from 'yup';

import TermsAndPrivacyDialog from './terms-and-privacy-dialog';
import { FormContainer, RHFCheckbox, RHFPassword, RHFPhoneNumber, RHFTextField } from '../../form';
import { schemaHelper } from '../../form/hook-form-fields/schema-helper';


export interface RegisterFromProps {
    onSubmit?: (value: any, setError: UseFormSetError<any>) => void;
}

const defaultValues = {
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    phoneIsoCode: '',
    phoneCountryCode: '',
    password: '',
    termsCondition: false,
};

const validationSchema = object().shape({
    firstName: string().label('First Name ').required(),
    lastName: string().label('Last Name ').required(),
    email: schemaHelper.email().label('Email').required(),
    phoneNumber: schemaHelper.phoneNumber().label('Phone Number').required(),
    password: string()
        .required()
        .min(8, 'Password must be at least 8 characters')
        .matches(patterns.password, 'Password must include at least one uppercase letter, one lowercase letter, one number, and one special character')
        .label('Password'),
    termsCondition: boolean()
        .label('Terms & Conditions')
        .oneOf([true], 'Please accept the Terms & Conditions')
        .required(),
});

function RegisterFrom({ onSubmit }: RegisterFromProps) {
    const [termsAndPrivacySlug, setTermsAndPrivacySlug] = useState();
    const formContext = useForm({
        defaultValues,
        resolver: yupResolver(validationSchema),
    });
    const { control, formState: { errors, isSubmitting }, setError } = formContext;

    const handleSubmit = useCallback(
        async (value: any) => {
            if (onSubmit) {
                await onSubmit(value, setError);
            }
        },
        [onSubmit, setError],
    );

    const handleOpenTermsAndPolicyDialog = useCallback(
        (value) => (event) => {
            event.preventDefault();
            event.stopPropagation();
            setTermsAndPrivacySlug(value);
        },
        [],
    );


    return (
        <FormContainer
            formProps={{
                id: 'register-from',
            }}
            formContext={formContext}
            validationSchema={validationSchema}
            onSuccess={handleSubmit}
        >
            <Stack spacing={2}>
                {(errors as any).afterSubmit ? <Alert severity="error">{(errors as any).afterSubmit.message as any}</Alert> : null}
                <Stack
                    spacing={2}
                    direction={{
                        xs: 'column',
                        sm: 'row',
                    }}
                >
                    <RHFTextField
                        fullWidth
                        name="firstName"
                        label="First Name"
                        required
                    />

                    <RHFTextField
                        fullWidth
                        name="lastName"
                        label="Last Name"
                        required
                    />
                </Stack>
                <RHFTextField
                    fullWidth
                    type="email"
                    name="email"
                    label="Email address"
                    autoComplete="email"
                    required
                />
                <RHFPhoneNumber
                    fullWidth
                    name="phoneNumber"
                    label="Phone Number"
                    required
                />

                <RHFPassword
                    fullWidth
                    name="password"
                    label="Password"
                    required
                />
                <RHFCheckbox
                    name="termsCondition"
                    control={control as Control<any>}
                    label={(
                        <Typography
                            component="span"
                            variant="body2"
                        >
                            I agree to the
                            <Link
                                // href={PATH_AUTH.login}
                                onClick={handleOpenTermsAndPolicyDialog('terms-of-use')}
                                // target="_blank"
                                sx={{
                                    textDecoration: 'underline',
                                    mx: 0.5,
                                }}
                            >
                                Terms & Conditions
                            </Link>
                            and
                            <Link
                                // href={PATH_AUTH.login}
                                onClick={handleOpenTermsAndPolicyDialog('privacy-policy')}
                                // target="_blank"
                                sx={{
                                    textDecoration: 'underline',
                                    mx: 0.5,
                                }}
                            >
                                Privacy Policy
                            </Link>
                        </Typography>
                    )}
                />

                <Button
                    fullWidth
                    type="submit"
                    variant="contained"
                    loading={isSubmitting}
                    sx={{ mt: 2 }}
                >
                    Register
                </Button>
            </Stack>
            {!!termsAndPrivacySlug && (
                <TermsAndPrivacyDialog
                    slug={termsAndPrivacySlug}
                    onClose={() => setTermsAndPrivacySlug(null)}
                />
            )}
        </FormContainer>
    );
}

export default RegisterFrom;
