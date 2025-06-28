import { yupResolver } from '@hookform/resolvers/yup';
import { usePermission } from '@libs/react-shared';
import { Button, Stack } from '@mui/material';
import { map } from 'lodash';
import { useCallback, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { object, string } from 'yup';

import { DefaultDialog } from '../../components/default-dialog';
import { FormContainer, RHFTextField } from '../../form';
import { useToasty } from '../../hook';


interface AddEditPermissionDialogProps {
    onClose: (value?: any) => void;
    values?: any;
}

const defaultValues = {
    name: '',
};

const validationSchema = object().shape({
    name: string().trim().required().label('Name'),
});

function AddEditPermissionDialog({
    onClose,
    values,
}: AddEditPermissionDialogProps) {
    const { useCreatePermission, useUpdatePermission } = usePermission();
    const { showToasty } = useToasty();
    const formContext = useForm({
        defaultValues,
        resolver: yupResolver(validationSchema),
    });
    const { reset, handleSubmit } = formContext;
    const { mutateAsync: createPermission } = useCreatePermission();
    const { mutateAsync: updatePermission } = useUpdatePermission();


    const handleSubmitForm = useCallback(
        async (value: any) => {
            try {
                if (value.id) {
                    await updatePermission(value);
                } else {
                    await createPermission(value);
                }
                showToasty(
                    `Permission successfully ${value.id ? 'updated' : 'created'}`,
                );
                if (onClose) {
                    onClose();
                }
            } catch (error) {
                showToasty(error, 'error');
            }
        },
        [
            createPermission,
            onClose,
            showToasty,
            updatePermission,
        ],
    );

    useEffect(() => {
        reset({
            ...values,
            roles: map(values.roles, 'id'),
        });
    }, [reset, values]);

    return (
        <DefaultDialog
            maxWidth="sm"
            fullWidth
            title={values?.id ? 'Edit Permission' : 'Add Permission'}
            onClose={() => onClose()}
            actions={(
                <>
                    <Button
                        variant="outlined"
                        onClick={() => {
                            onClose();
                        }}
                    >
                        Cancel
                    </Button>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleSubmit(handleSubmitForm)}
                    >
                        Save
                    </Button>
                </>
            )}
        >
            <FormContainer
                formProps={{
                    id: 'add-edit-form-user',
                }}
                formContext={formContext}
                validationSchema={validationSchema}
                onSuccess={handleSubmitForm}
            >
                <Stack spacing={2}>
                    <RHFTextField
                        fullWidth
                        required
                        name="name"
                        label="Name"
                    />

                    {/* <RHFSelect
                        fullWidth
                        required
                        name="roles"
                        label="Roles"
                        valueKey="name"
                        labelKey="name"
                        isMultiple
                        options={roleData?.items}
                        slotProps={{
                            select: {
                                multiple: true,
                            },
                        }}
                    /> */}
                </Stack>
            </FormContainer>
        </DefaultDialog>
    );
}

export default AddEditPermissionDialog;
