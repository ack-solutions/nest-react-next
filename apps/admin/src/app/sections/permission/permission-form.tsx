import { yupResolver } from '@hookform/resolvers/yup';
import { usePermission } from '@libs/react-shared';
import { IPermission, RoleGuardEnum } from '@libs/types';
import {
    Box,
    Button,
    Grid,
    DialogContent,
    DialogActions,
    Typography,
} from '@mui/material';
import { useCallback, useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { object, string } from 'yup';

import { FormContainer, RHFTextField, RHFSelect } from '../../form';

export interface PermissionFormProps {
    data?: IPermission | null;
    onSuccess?: () => void;
    onCancel?: () => void;
}

interface PermissionFormValues {
    name: string;
    guard: string;
    category: string;
    description: string;
}

const defaultValues: PermissionFormValues = {
    name: '',
    guard: RoleGuardEnum.ADMIN,
    category: '',
    description: '',
};

const validationSchema = yupResolver(
    object().shape({
        name: string().trim().required().label('Name'),
        guard: string().trim().required().label('Guard'),
        category: string().trim().label('Category'),
        description: string().trim().label('Description'),
    }),
);

export default function PermissionForm({
    data,
    onSuccess,
    onCancel,
}: PermissionFormProps) {
    const { useCreatePermission, useUpdatePermission, useGetCategories } =
        usePermission();
    const { mutateAsync: createPermission } = useCreatePermission();
    const { mutateAsync: updatePermission } = useUpdatePermission();
    const { data: existingCategories = [] } = useGetCategories();

    const guardOptions = useMemo(
        () =>
            Object.values(RoleGuardEnum).map(value => ({
                label: value,
                value,
            })),
        [],
    );

    const categoryOptions = useMemo(() => {
        const categories = new Set(existingCategories);
        return Array.from(categories).map(cat => ({
            label: cat,
            value: cat,
        }));
    }, [existingCategories]);

    const formContext = useForm<PermissionFormValues>({
        defaultValues,
        resolver: validationSchema as any,
    });

    const {
        reset,
        formState: { isSubmitting },
    } = formContext;

    const handleSubmit = useCallback(
        async (values: PermissionFormValues) => {
            try {
                if (data?.id) {
                    await updatePermission({
                        id: data.id,
                        ...values,
                    });
                } else {
                    await createPermission(values);
                }
                onSuccess?.();
            } catch (error) {
                console.error('Error saving permission:', error);
            }
        },
        [data?.id, createPermission, updatePermission, onSuccess],
    );

    useEffect(() => {
        if (data) {
            reset({
                name: data.name || '',
                guard: data.guard || RoleGuardEnum.ADMIN,
                category: data.category || '',
                description: data.description || '',
            });
        } else {
            reset(defaultValues);
        }
    }, [data, reset]);

    return (
        <FormContainer
            formProps={{
                id: 'permission-form',
                // flex: 1 ensures it fills the available space in DialogPaper (after DialogTitle)
                // overflow: hidden ensures the form itself doesn't scroll, but its children (DialogContent) do
                style: {
                    display: 'flex',
                    flexDirection: 'column',
                    flex: 1,
                    overflow: 'hidden',
                },
            }}
            formContext={formContext}
            validationSchema={validationSchema}
            onSuccess={handleSubmit}>
            <DialogContent
                dividers
                sx={{ display: 'flex', flexDirection: 'column', p: 3 }}>
                <Grid container spacing={3}>
                    <Grid size={{ xs: 12 }}>
                        <RHFTextField
                            fullWidth
                            required
                            name="name"
                            label="Permission Name"
                            placeholder="e.g., access-users"
                            helperText="Use lowercase with hyphens (e.g., access-users, create-posts)"
                            disabled={!!data?.id}
                        />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                        <RHFSelect
                            fullWidth
                            name="guard"
                            label="Guard"
                            options={guardOptions}
                            valueKey="value"
                            labelKey="label"
                        />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                        <RHFTextField
                            fullWidth
                            name="category"
                            label="Category"
                            placeholder="e.g., Users, Settings"
                            helperText={
                                categoryOptions.length > 0
                                    ? `Existing: ${categoryOptions
                                        .map(c => c.label)
                                        .slice(0, 5)
                                        .join(', ')}${categoryOptions.length > 5
                                        ? '...'
                                        : ''
                                    }`
                                    : 'Enter a category name to group permissions'
                            }
                        />
                    </Grid>
                    <Grid size={{ xs: 12 }}>
                        <RHFTextField
                            fullWidth
                            name="description"
                            label="Description"
                            multiline
                            rows={3}
                            placeholder="Optional description of what this permission allows"
                        />
                    </Grid>
                </Grid>
            </DialogContent>

            <DialogActions
                sx={{
                    px: 3,
                    pb: 2,
                    pt: 2,
                    borderTop: theme => `1px solid ${theme.palette.divider}`,
                }}>
                <Button
                    onClick={onCancel}
                    disabled={isSubmitting}
                    variant="outlined"
                    color="inherit">
                    Cancel
                </Button>
                <Button
                    variant="contained"
                    type="submit"
                    disabled={isSubmitting}>
                    {data?.id ? 'Update' : 'Save'}
                </Button>
            </DialogActions>
        </FormContainer>
    );
}
