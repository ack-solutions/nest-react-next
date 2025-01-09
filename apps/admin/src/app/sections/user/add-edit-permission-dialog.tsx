import { DefaultDialog } from '@admin/app/components';
import { yupResolver } from '@hookform/resolvers/yup';
import { FormContainer, RHFSelect, RHFTextField, usePermissionQuery, useRoleQuery, useToasty } from '@libs/react-core';
import { IPermission } from '@libs/types';
import { Button, Stack } from '@mui/material'
import { map } from 'lodash';
import { useCallback, useEffect } from 'react'
import { useForm } from 'react-hook-form';
import { object, string } from 'yup';


interface AddEditPermissionDialogProps {
    onClose: (value?: any) => void;
    values?: any;
}

const defaultValues = {
    name: '',
    roles: []
};

const validationSchema = object().shape({
    name: string().trim().required().label('Name'),
});

const AddEditPermissionDialog = ({ onClose, values }: AddEditPermissionDialogProps) => {
    const { useGetManyRole } = useRoleQuery()
    const { useCreatePermission, useUpdatePermission } = usePermissionQuery()
    const { data: roleData } = useGetManyRole()
    const { showToasty } = useToasty();
    const formContext = useForm({
        defaultValues,
        resolver: yupResolver(validationSchema),
    })
    const { reset, handleSubmit, } = formContext;
    const { mutate: createPermission } = useCreatePermission()
    const { mutate: updatePermission } = useUpdatePermission()

    const handleSubmitForm = useCallback(
        (value: IPermission) => {
            const options = {
                onSuccess: () => {
                    showToasty(
                        value?.id
                            ? 'Permission updated successfully'
                            : 'Permission added successfully'
                    );
                    onClose && onClose()
                },
                onError: (error) => {
                    console.log(error)
                    showToasty(error, 'error');
                }
            }
            if (value?.id) {
                updatePermission(value, options);
            } else {
                createPermission(value, options);
            }
        },
        [createPermission, onClose, showToasty, updatePermission],
    )
    useEffect(() => {
        reset({
            ...values,
            roles: map(values.roles, 'id')
        })
    }, [reset, values]);

    return (
        <DefaultDialog
            maxWidth='xs'
            title={values?.id ? 'Edit Permission' : 'Add Permission'}
            onClose={() => onClose()}
            actions={
                <>
                    <Button
                        variant="outlined"
                        onClick={() => { onClose() }}
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
            }
        >
            <FormContainer
                FormProps={{
                    id: "add-edit-form-user"
                }}
                formContext={formContext}
                validationSchema={validationSchema}
                onSuccess={handleSubmitForm}
            >
                <Stack spacing={2}>
                    <RHFTextField
                        fullWidth
                        required
                        name='name'
                        label='Name'
                    />
                    <RHFSelect
                        fullWidth
                        required
                        name='roles'
                        label='Roles'
                        valueKey='id'
                        labelKey='name'
                        isMultiple
                        options={roleData?.items}
                        slotProps={{
                            select: {
                                multiple: true
                            }
                        }}
                    />
                </Stack>

            </FormContainer>
        </DefaultDialog>
    )
}

export default AddEditPermissionDialog
