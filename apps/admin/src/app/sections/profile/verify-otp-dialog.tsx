import { yupResolver } from '@hookform/resolvers/yup';
import { Button, Typography } from '@mui/material';
import { Stack } from '@mui/material';
import { useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { object, string } from 'yup';

import { DefaultDialog } from '../../components';
import { useAuth } from '@libs/react-shared';
import { FormContainer, RHFOtpInput } from '../../form';


const VerifySchema = object().shape({
    otp: string().label('OTP').required(),
});

export interface VerifyOtpDialogProps {
    onClose?: () => void;
    onSubmit: (value: any, setError?: any) => void;
    fromValue?: any
    type?: 'phone' | 'email'
}

function VerifyOtpDialog({ onClose, onSubmit, fromValue, type }: VerifyOtpDialogProps) {
    const { currentUser, authUser } = useAuth();
    const formContext = useForm({
        defaultValues: { ...fromValue },
        resolver: yupResolver(VerifySchema),
    });
    const {
        setError,
        reset,
        handleSubmit,
    } = formContext;

    const handleSubmitForm = useCallback(
        (value) => {
            if (onSubmit) { onSubmit(value, setError); }
            reset();
        },
        [
            onSubmit,
            reset,
            setError,
        ],
    );

    return (
        <DefaultDialog
            title="Verify Your OTP"
            maxWidth="xs"
            fullWidth
            onClose={onClose}
            actions={(
                <Stack
                    spacing={2}
                    direction="row"
                >
                    <Button
                        variant="outlined"
                        onClick={onClose}
                    >
                        cancel
                    </Button>
                    <Button
                        variant="contained"
                        onClick={handleSubmit(handleSubmitForm)}
                    >
                        Submit
                    </Button>
                </Stack>
            )}
        >
            <FormContainer
                formProps={{
                    id: 'verify-otp-from',
                }}
                formContext={formContext}
                validationSchema={yupResolver(
                    object().shape({
                        phoneNumber: string().required().label('Phone Number'),
                    }),
                )}
                onSuccess={handleSubmitForm}
            >
                <Typography variant="body2">
                    {`Please enter the OTP code sent to your ${type === 'phone' ? 'Phone Number' : 'Email'}.`}
                </Typography>
                <Typography
                    color="textSecondary"
                    variant="body2"
                    mb={2}
                >
                    {type === 'phone' ? currentUser?.phoneNumber : authUser?.email}
                </Typography>
                <RHFOtpInput
                    name="otp"
                    inputStyleProps={{
                        background: 'transparent',
                        color: (theme) => theme.palette.text.primary,
                    }}
                />
            </FormContainer>

        </DefaultDialog>
    );
}

export default VerifyOtpDialog;
