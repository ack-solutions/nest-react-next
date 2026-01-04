import { yupResolver } from '@hookform/resolvers/yup';
import { useUser } from '@libs/react-shared';
import { IUser } from '@libs/types';
import { Box, Button, Stack, Typography } from '@mui/material';
import { pick } from 'lodash';
import { useCallback, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { object, string } from 'yup';

import { DefaultDialog } from '../../components';
import { useAuth } from '@libs/react-shared';
import { FormContainer, RHFTextField, RHFUploadAvatar } from '../../form';
import { useToasty } from '../../hook';


interface BasicInfoEditDialogProps {
    open: boolean;
    onClose: () => void;
    user?: IUser;
}


const validationSchema = yupResolver(
    object().shape({
        firstName: string().trim().required().label('First Name'),
        lastName: string().trim().required().label('Last Name'),
    }),
);

export default function BasicInfoEditDialog({ open, onClose, user }: BasicInfoEditDialogProps) {
    const { showToasty } = useToasty();
    const { useUpdateProfile } = useUser();
    const { mutateAsync: updateProfile } = useUpdateProfile();
    const { refetchUser } = useAuth();

    const formContext = useForm({
        resolver: validationSchema,
        defaultValues: {
            firstName: '',
            lastName: '',
        },
    });

    const { formState: { isSubmitting }, reset } = formContext;

    const handleSubmitProfileForm = useCallback(
        async (values) => {
            try {
                const request = pick(
                    values,
                    'firstName',
                    'lastName',
                    'avatar',
                );
                updateProfile(request)
                    .then(() => {
                        showToasty('User profile successfully updated');
                        refetchUser();
                        onClose();
                    })
                    .catch((error) => {
                        showToasty(error, 'error');
                    });
            } catch (error) {
                showToasty(error, 'error');
            }
        },
        [
            refetchUser,
            showToasty,
            updateProfile,
            onClose,
        ],
    );

    useEffect(() => {
        reset({
            ...user,
        });
    }, [reset, user]);

    return (
        <DefaultDialog
            open={open}
            onClose={onClose}
            title="Edit Basic Information"
            maxWidth="xs"
            fullWidth
            actions={(
                <Stack
                    direction="row"
                    spacing={2}
                >
                    <Button
                        variant="outlined"
                        onClick={onClose}
                        disabled={isSubmitting}
                    >
                        Cancel
                    </Button>
                    <Button
                        type="submit"
                        variant="contained"
                        loading={isSubmitting}
                        form="basic-info-form"
                    >
                        Save Changes
                    </Button>
                </Stack>
            )}
        >
            <FormContainer
                formProps={{
                    id: 'basic-info-form',
                }}
                formContext={formContext}
                validationSchema={validationSchema}
                onSuccess={handleSubmitProfileForm}
            >
                <Stack spacing={2}>
                    <Box sx={{ textAlign: 'center' }}>
                        <RHFUploadAvatar
                            name="avatar"
                            previewUrl={user?.avatarUrl}
                            sx={{
                                mx: 'auto',
                                width: 100,
                                height: 100,
                            }}
                        />
                        <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{ mt: 1 }}
                        >
                            Click to upload a new profile picture
                        </Typography>
                    </Box>

                    <RHFTextField
                        name="firstName"
                        label="First Name"
                        fullWidth
                        required
                    />

                    <RHFTextField
                        name="lastName"
                        label="Last Name"
                        fullWidth
                        required
                    />
                </Stack>
            </FormContainer>
        </DefaultDialog>
    );
}
