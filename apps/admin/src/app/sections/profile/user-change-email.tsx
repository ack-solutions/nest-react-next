import { yupResolver } from '@hookform/resolvers/yup';
import { useAuth, useUser } from '@libs/react-shared';
import {
    Box,
    Stack,
    Button,
    Typography,
    useTheme,
} from '@mui/material';
import { useCallback, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { object } from 'yup';

import { FormContainer, RHFTextField } from '../../form';
import { schemaHelper } from '../../form/hook-form-fields/schema-helper';
import { useToasty } from '../../hook';


function UserChangeEmail() {
    const { currentUser, refetchUser, authUser } = useAuth();
    const { useChangeEmail } = useUser();
    const { mutateAsync: changeEmail } = useChangeEmail();
    const { showToasty } = useToasty();
    const theme = useTheme();

    const validationSchema = yupResolver(
        object().shape({
            email: schemaHelper.email().label('Email').required(),
        }),
    );

    const formContext = useForm({
        defaultValues: { email: '' },
        resolver: validationSchema,
    });
    const { reset, formState: { isSubmitting } } = formContext;


    const handleSave = useCallback(
        (values) => {
            changeEmail({ email: values.email })
                .then(() => {
                    refetchUser();
                    showToasty('Email Changed successfully');
                })
                .catch((error) => {
                    showToasty(error, 'error');
                });
        },
        [
            changeEmail,
            refetchUser,
            showToasty,
        ],
    );

    useEffect(() => {
        reset({
            email: authUser?.email,
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentUser]);

    return (
        <Box>
            <Box sx={{ mb: 2 }}>
                <Typography
                    variant="subtitle1"
                    fontWeight="600"
                    gutterBottom
                >
                    Email Address
                </Typography>
                <Typography
                    variant="body2"
                    color="text.secondary"
                >
                    Update your email address for account notifications
                </Typography>
            </Box>

            <FormContainer
                formContext={formContext}
                validationSchema={validationSchema}
                onSuccess={handleSave}
            >
                <Stack spacing={3}>
                    <RHFTextField
                        fullWidth
                        required
                        name="email"
                        label="Email Address"
                        type="email"
                        variant="outlined"
                        sx={{
                            '& .MuiOutlinedInput-root': {
                                backgroundColor: theme.palette.background.paper,
                            },
                        }}
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
                            Update
                        </Button>
                    </Box>
                </Stack>
            </FormContainer>
        </Box>
    );
}

export default UserChangeEmail;
