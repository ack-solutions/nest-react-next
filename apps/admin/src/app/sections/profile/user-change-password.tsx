import { yupResolver } from '@hookform/resolvers/yup';
import { useUser } from '@libs/react-shared';
import { patterns } from '@libs/utils';
import {
    Button,
    Box,
    Stack,
    Typography,
    Alert,
} from '@mui/material';
import { useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { object, ref, string } from 'yup';

import { FormContainer, RHFPassword } from '../../form';
import { useToasty } from '../../hook';


const validationSchema = yupResolver(
    object().shape({
        oldPassword: string().label('Old Password').required(),
        password: string()
            .label('New Password')
            .required()
            .min(8, 'New Password must be at least 8 characters')
            .matches(patterns.password, 'New Password must include at least one uppercase letter, one lowercase letter, one number, and one special character'),
        confirmPassword: string()
            .label('Confirm Password')
            .oneOf([ref('password'), null], 'Passwords must match')
            .required(),
    }),
);

const defaultValues = {
    oldPassword: '',
    password: '',
    confirmPassword: '',
};

function UserChangePassword() {
    const { showToasty } = useToasty();
    const { useChangePassword } = useUser();
    const { mutate: changePassword } = useChangePassword();

    const formContext = useForm({
        defaultValues,
        resolver: validationSchema,
    });
    const { reset, formState: { isSubmitting } } = formContext;

    const handleSubmitForm = useCallback(
        (values) => {
            const options = {
                onSuccess: (data) => {
                    showToasty(data.message);
                    reset();
                },
                onError: (error) => {
                    showToasty(error, 'error');
                    reset();
                },
            };
            changePassword(values, options);
        },
        [
            changePassword,
            reset,
            showToasty,
        ],
    );

    return (
        <Stack spacing={2}>
            <Typography
                variant="h6"
                fontWeight="600"
                gutterBottom
            >
                Change Password
            </Typography>
            <Typography
                variant="body2"
                color="text.secondary"
            >
                Update your password to keep your account secure
            </Typography>

            <Alert
                severity="info"
                sx={{
                    borderRadius: 2,
                    '& .MuiAlert-message': {
                        fontSize: '0.875rem',
                    },
                }}
            >
                Your password must be at least 8 characters long and include uppercase letters, lowercase letters, numbers, and special characters.
            </Alert>

            <FormContainer
                formProps={{
                    id: 'change-password-form',
                }}
                formContext={formContext}
                validationSchema={validationSchema}
                onSuccess={handleSubmitForm}
            >
                <Stack spacing={2}>
                    <RHFPassword
                        name="oldPassword"
                        label="Current Password"
                        required
                        fullWidth
                        variant="outlined"
                    />

                    <RHFPassword
                        name="password"
                        label="New Password"
                        required
                        fullWidth
                        variant="outlined"
                    />

                    <RHFPassword
                        name="confirmPassword"
                        label="Confirm New Password"
                        required
                        fullWidth
                        variant="outlined"
                    />

                    <Box
                        sx={{
                            display: 'flex',
                            justifyContent: 'flex-end',
                        }}
                    >
                        <Button
                            variant="contained"
                            type="submit"
                            loading={isSubmitting}
                        >
                            Update Password
                        </Button>
                    </Box>
                </Stack>
            </FormContainer>
        </Stack>
    );
}

export default UserChangePassword;
