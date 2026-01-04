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

import { FormContainer, RHFPhoneNumber } from '../../form';
import { schemaHelper } from '../../form/hook-form-fields/schema-helper';
import { useToasty } from '../../hook';


function UserChangePhone() {
    const { currentUser, refetchUser } = useAuth();
    const { useChangePhone } = useUser();
    const { mutateAsync: changePhone } = useChangePhone();
    const { showToasty } = useToasty();
    const theme = useTheme();

    const validationSchema = yupResolver(
        object().shape({
            phoneNumber: schemaHelper.phoneNumber().label('Phone Number').required(),
        }),
    );
    const defaultValues = {
        phoneNumber: '',
        phoneIsoCode: '',
        phoneCountryCode: '',
    };

    const formContext = useForm({
        defaultValues,
        resolver: validationSchema as any,
    });
    const { reset, formState: { isSubmitting } } = formContext;


    const handleSave = useCallback(
        (values) => {
            changePhone({
                ...values,
            })
                .then(() => {
                    refetchUser();
                    showToasty('Phone Number Changed successfully');
                })
                .catch((error) => {
                    showToasty(error, 'error');
                });
        },
        [
            changePhone,
            refetchUser,
            showToasty,
        ],
    );

    useEffect(() => {
        reset({
            phoneNumber: currentUser?.phoneNumber,
            phoneIsoCode: currentUser?.phoneIsoCode,
            phoneCountryCode: currentUser?.phoneCountryCode,
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [
        currentUser?.phoneNumber,
        currentUser?.phoneIsoCode,
        currentUser?.phoneCountryCode,
    ]);

    return (
        <Box>
            <Box sx={{ mb: 2 }}>
                <Typography
                    variant="subtitle1"
                    fontWeight="600"
                    gutterBottom
                >
                    Phone Number
                </Typography>
                <Typography
                    variant="body2"
                    color="text.secondary"
                >
                    Update your phone number for account verification
                </Typography>
            </Box>

            <FormContainer
                formContext={formContext}
                validationSchema={validationSchema}
                onSuccess={handleSave}
            >
                <Stack spacing={3}>
                    <RHFPhoneNumber
                        fullWidth
                        required
                        name="phoneNumber"
                        label="Phone Number"
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
                            disabled={isSubmitting}
                        >
                            Update Phone
                        </Button>
                    </Box>
                </Stack>
            </FormContainer>
        </Box>
    );
}

export default UserChangePhone;
