import { yupResolver } from '@hookform/resolvers/yup';
import { DefaultDialog } from '@admin/app/components';
import { FormContainer, RHFSelect, RHFTextField } from '@admin/app/form';
import { useToasty } from '@admin/app/hook';
import { usePermission } from '@libs/react-shared';
import { IPermission, RoleGuardEnum } from '@libs/types';
import { errorMessage } from '@libs/utils';
import { Button, Stack } from '@mui/material';
import { useCallback, useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { mixed, object, string } from 'yup';


export interface AddEditPermissionDialogProps {
    open: boolean;
    permission?: IPermission | null;
    onClose: (saved?: boolean) => void;
}

type PermissionFormValues = {
    id?: string;
    name: string;
    guard: RoleGuardEnum;
    category?: string;
    description?: string;
};

const defaultValues: PermissionFormValues = {
    name: '',
    guard: RoleGuardEnum.ADMIN,
    category: '',
    description: '',
};

const validationSchema = object({
    name: string().trim().required().label('Name'),
    guard: mixed<RoleGuardEnum>()
        .oneOf(Object.values(RoleGuardEnum))
        .required()
        .label('Guard'),
    category: string().trim().label('Category'),
    description: string().trim().label('Description'),
});


export default function AddEditPermissionDialog({
    open,
    permission,
    onClose,
}: AddEditPermissionDialogProps) {
    const { useCreatePermission, useUpdatePermission } = usePermission();
    const { showToasty } = useToasty();

    const formContext = useForm<PermissionFormValues>({
        defaultValues,
        resolver: yupResolver(validationSchema) as any,
    });
    const {
        reset,
        formState: { isSubmitting },
    } = formContext;

    const { mutateAsync: createPermission } = useCreatePermission();
    const { mutateAsync: updatePermission } = useUpdatePermission();

    const isEdit = useMemo(() => Boolean(permission?.id), [permission?.id]);

    const handleSubmitForm = useCallback(
        async (value: PermissionFormValues) => {
            try {
                if (value.id) {
                    await updatePermission({
                        id: value.id,
                        name: value.name as any,
                        category: value.category || undefined,
                        description: value.description || undefined,
                    });
                } else {
                    await createPermission({
                        name: value.name as any,
                        guard: value.guard,
                        category: value.category || undefined,
                        description: value.description || undefined,
                    });
                }
                showToasty(
                    `Permission successfully ${value.id ? 'updated' : 'created'}`,
                );
                onClose(true);
            } catch (error) {
                showToasty(errorMessage(error, 'Failed to save permission'), 'error');
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
        if (!open) {
            return;
        }
        if (permission) {
            reset({
                id: permission.id,
                name: String(permission.name || ''),
                guard: (permission.guard as RoleGuardEnum) || RoleGuardEnum.ADMIN,
                category: permission.category || '',
                description: permission.description || '',
            });
        } else {
            reset(defaultValues);
        }
    }, [
        open,
        permission,
        reset,
    ]);

    return (
        <DefaultDialog
            open={open}
            maxWidth="sm"
            fullWidth
            title={isEdit ? 'Edit Permission' : 'Add Permission'}
            onClose={() => onClose()}
            actions={(
                <>
                    <Button variant="outlined" color="inherit" onClick={() => onClose()}>
                        Cancel
                    </Button>
                    <Button
                        variant="contained"
                        type="submit"
                        form="add-edit-form-permission"
                        loading={isSubmitting}
                    >
                        {isEdit ? 'Update' : 'Create'}
                    </Button>
                </>
            )}
        >
            <FormContainer
                formProps={{ id: 'add-edit-form-permission' }}
                formContext={formContext as any}
                validationSchema={validationSchema}
                onSuccess={handleSubmitForm}
            >
                <Stack spacing={2}>
                    <RHFTextField
                        fullWidth
                        required
                        name="name"
                        label="Name"
                        helperText="Use kebab-case identifier (e.g. access-vehicles)"
                    />
                    <RHFTextField
                        fullWidth
                        name="category"
                        label="Category"
                        helperText="Used to group permissions in the role editor"
                    />
                    <RHFTextField
                        fullWidth
                        name="description"
                        label="Description"
                        multiline
                        minRows={2}
                    />
                </Stack>
            </FormContainer>
        </DefaultDialog>
    );
}
