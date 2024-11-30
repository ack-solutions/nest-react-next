import { DefaultDialog } from '@admin/app/components';
import { yupResolver } from '@hookform/resolvers/yup';
import { FormContainer, RHFSelect, RHFTextField, useRoleQuery } from '@libs/react-core';
import { IPermission } from '@libs/types';
import { Button, Stack } from '@mui/material'
import { map } from 'lodash';
import { useEffect, useRef } from 'react'
import { useForm } from 'react-hook-form';
import { object, string } from 'yup';

interface AddEditPermissionDialogProps {
    onClose: (value?: any) => void;
    values?: any;
    onSubmit: (value?: any) => void;
}

const defaultValues = {
    name: '',
    roles: []
};

const validationSchema = object().shape({
    name: string().trim().required().label('Name'),
});

const AddEditPermissionDialog = ({ onClose, values, onSubmit }: AddEditPermissionDialogProps) => {
    const { useGetManyRole } = useRoleQuery()
    const { data: roleData } = useGetManyRole()

    const formContext = useForm({
        defaultValues,
        resolver: yupResolver(validationSchema),
    })
    const { reset, handleSubmit, } = formContext;


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
                    <Button variant="outlined" onClick={() => { onClose() }}>
                        Cancel
                    </Button>
                    <Button variant="contained" color="primary" onClick={handleSubmit(onSubmit)}>
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
                onSuccess={onSubmit}
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