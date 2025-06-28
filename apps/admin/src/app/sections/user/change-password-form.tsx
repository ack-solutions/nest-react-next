import { yupResolver } from '@hookform/resolvers/yup';
import { useUser } from '@libs/react-shared';
import { patterns } from '@libs/utils';
import { Stack, Button, CardContent, Card, CardActions } from '@mui/material';
import { useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { useParams } from 'react-router-dom';
import { object, ref, string } from 'yup';

import { FormContainer, RHFPassword } from '../../form';
import { useToasty } from '../../hook';


const defaultValues = {
    password: '',
    confirmPassword: '',
};
const validationSchema = yupResolver(
    object().shape({
        password: string()
            .label('New Password')
            .required()
            .min(8, 'New Password must be at least 8 characters')
            .matches(patterns.password, 'New Password must include at least one uppercase letter, one lowercase letter, one number, and one special character'),
        confirmPassword: string()
            .label('Confirm Password')
            .oneOf([ref('password'), ''], 'Passwords must match')
            .required(),
    }),
);

function ChangePasswordForm() {
    const { userId } = useParams();
    const { showToasty } = useToasty();
    const formContext = useForm({
        defaultValues,
        resolver: validationSchema,
    });
    const { reset, formState: { isSubmitting } } = formContext;
    const { useSetPassword } = useUser();
    const { mutateAsync: setPassword } = useSetPassword();

    const handleSubmit = useCallback(
        async (values: any) => {
            await setPassword({
                password: values.password,
                userId,
            }).then(() => {
                showToasty('Password Successfully updated');
                reset();
            }).catch((error) => {
                showToasty(error, 'error');
                reset();
            });
        },
        [
            reset,
            setPassword,
            showToasty,
            userId,
        ],
    );

    return (
        <FormContainer
            formProps={{
                id: 'reset-password',
            }}
            formContext={formContext}
            validationSchema={validationSchema}
            onSuccess={handleSubmit}
        >
            <Card>
                <CardContent>
                    <Stack spacing={2}>
                        <RHFPassword
                            fullWidth
                            name="password"
                            label="Password"
                        />

                        <RHFPassword
                            fullWidth
                            name="confirmPassword"
                            label="Confirm Password"
                        />
                    </Stack>
                </CardContent>
                <CardActions>
                    <Button
                        type="submit"
                        variant="contained"
                        loading={isSubmitting}
                    >
                        Reset Password
                    </Button>
                </CardActions>
            </Card>
        </FormContainer>
    );
}

export default ChangePasswordForm;
