import { yupResolver } from '@hookform/resolvers/yup';
import { useRole } from '@libs/react-shared';
import { ICreateUserInput, IRole, IUser, RoleGuardEnum, UserStatusEnum } from '@libs/types';
import { Box, Button, Card, CardContent, Stack, Typography, Divider, Grid } from '@mui/material';
import { useCallback, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import { array, object, string } from 'yup';

import { Icon } from '../../components';
import { IconEnum } from '../../components/icons/icons';
import UserStatusLabel from '../../components/user/user-status-label';
import {
    FormContainer,
    RHFPassword,
    RHFSelect,
    RHFTextField,
    RHFUploadAvatar,
} from '../../form';
import RHFLabelDropdown from '../../form/hook-form-fields/rhf-label-dropdown';
import { RHFPhoneNumber } from '../../form/hook-form-fields/rhf-phone-number';
import { schemaHelper } from '../../form/hook-form-fields/schema-helper';
import { PATH_DASHBOARD } from '../../routes/paths';


export interface AddEditUserFormProps {
    values?: IUser;
    onSubmit: (value?: IUser) => void;
}

const defaultValues: Partial<ICreateUserInput> = {
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    phoneNumber: '',
    phoneIsoCode: '',
    phoneCountryCode: '',
    status: UserStatusEnum.ACTIVE,
    roles: [],
};

const validationSchema = yupResolver(
    object().shape({
        firstName: string().trim().required().label('First Name'),
        lastName: string().trim().required().label('Last Name'),
        email: schemaHelper.email().label('Email').required(),
        phoneNumber: schemaHelper.phoneNumber().label('Phone Number'),
        roles: array().min(1, 'Please select at least one role').label('Roles'),
        password: string()
            .label('Password')
            .when('id', {
                is: (id: any) => !id, // if creating
                then: () => schemaHelper.password({ required: true }).label('Password'),
                otherwise: () => schemaHelper.password({ required: false }).label('Password'),
            }),
    }),
);

function AddEditUserForm({ onSubmit, values }: AddEditUserFormProps) {
    const navigate = useNavigate();
    const { userId } = useParams();
    const { useGetRoleByGuard } = useRole();
    const { data: roleData } = useGetRoleByGuard(RoleGuardEnum.ADMIN);

    const formContext = useForm({
        defaultValues,
        resolver: validationSchema as any,
    });
    const { reset, watch, setValue, formState: { isSubmitting } } = formContext;
    const formValues = watch();

    const handleSubmit = useCallback(
        (values) => {
            const requestValues = { ...values };
            onSubmit(requestValues);
        },
        [onSubmit],
    );


    useEffect(() => {
        reset({
            ...defaultValues,
            ...values,
            email: values?.authUser?.email || '',
            roles: (values?.authUser?.roles || [])?.map((role: IRole) => role?.name),
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [values]);


    return (
        <FormContainer
            formProps={{
                id: 'add-edit-form-user',
            }}
            formContext={formContext}
            validationSchema={validationSchema}
            onSuccess={handleSubmit}
        >
            <Card>
                <CardContent sx={{ p: 3 }}>
                    {/* Avatar and Status Section */}
                    <Box
                        sx={{
                            mb: 4,
                            display: 'flex',
                            alignItems: 'center',
                            gap: 3,
                        }}
                    >
                        <RHFUploadAvatar
                            name="avatar"
                            previewUrl={values?.avatarUrl}
                            sx={{
                                width: 100,
                                height: 100,
                            }}
                        />
                        <Box>
                            <Typography
                                variant="h6"
                                gutterBottom
                            >
                                Profile Photo
                            </Typography>
                            <Typography
                                variant="body2"
                                color="text.secondary"
                                sx={{ mb: 2 }}
                            >
                                Upload a profile photo for this user
                            </Typography>
                            <RHFLabelDropdown
                                name="status"
                                options={Object.values(UserStatusEnum)}
                                anchor={(
                                    <UserStatusLabel
                                        user={{ status: formValues?.status } as IUser}
                                        variant="soft"
                                    />
                                )}
                            />
                        </Box>
                    </Box>

                    <Divider sx={{ mb: 3 }} />

                    {/* Personal Information Section */}
                    <Typography
                        variant="h6"
                        gutterBottom
                        sx={{ mb: 2 }}
                    >
                        Personal Information
                    </Typography>
                    <Grid
                        container
                        spacing={3}
                        sx={{ mb: 4 }}
                    >
                        <Grid
                            size={{
                                xs: 12,
                                sm: 6,
                            }}>
                            <RHFTextField
                                fullWidth
                                required
                                name="firstName"
                                label="First Name"
                            />
                        </Grid>
                        <Grid
                            size={{
                                xs: 12,
                                sm: 6,
                            }}>
                            <RHFTextField
                                fullWidth
                                required
                                name="lastName"
                                label="Last Name"
                            />
                        </Grid>
                        <Grid
                            size={{
                                xs: 12,
                                sm: 6,
                            }}>
                            <RHFTextField
                                type="email"
                                fullWidth
                                required
                                name="email"
                                label="Email"
                            />
                        </Grid>
                        <Grid
                            size={{
                                xs: 12,
                                sm: 6,
                            }}>
                            <RHFPhoneNumber
                                fullWidth
                                name="phoneNumber"
                                label="Phone Number"
                            />
                        </Grid>
                        {!userId && (
                            <Grid
                                size={{
                                    xs: 12,
                                    sm: 6,
                                }}>
                                <RHFPassword
                                    fullWidth
                                    name="password"
                                    label="Password"
                                />
                            </Grid>
                        )}
                    </Grid>

                    <Divider sx={{ mb: 3 }} />

                    {/* Permissions & Access Section */}
                    <Typography
                        variant="h6"
                        gutterBottom
                        sx={{ mb: 2 }}
                    >
                        Permissions & Access
                    </Typography>
                    <Grid
                        container
                        spacing={3}
                        sx={{ mb: 4 }}
                    >
                        <Grid
                            size={{
                                xs: 12,
                                sm: 6,
                            }}>
                            <RHFSelect
                                fullWidth
                                required
                                name="roles"
                                label="Roles"
                                valueKey="name"
                                labelKey="name"
                                options={roleData || []}
                                isMultiple
                                helperText="Select one or more roles for this user"
                            />
                        </Grid>
                    </Grid>

                    {/* Action Buttons */}
                    <Stack
                        direction="row"
                        spacing={2}
                        sx={{ pt: 2 }}
                    >
                        <Button
                            variant="outlined"
                            onClick={() => navigate(PATH_DASHBOARD.users.root)}
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="contained"
                            type="submit"
                            loading={isSubmitting}
                        >
                            {values?.id ? 'Update User' : 'Create User'}
                        </Button>
                    </Stack>
                </CardContent>
            </Card>
        </FormContainer>
    );
}

export default AddEditUserForm;
