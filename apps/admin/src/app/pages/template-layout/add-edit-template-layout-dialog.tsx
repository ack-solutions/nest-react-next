import { FormContainer, RHFSelect, RHFTextField } from '@admin/app/form';
import { useToasty } from '@admin/app/hook';
import { PATH_DASHBOARD } from '@admin/app/routes/paths';
import { yupResolver } from '@hookform/resolvers/yup';
import { useTemplateLayout } from '@libs/react-shared';
import { ITemplateLayout, TemplateLayoutLanguageEnum, TemplateLayoutTypeEnum } from '@libs/types';
import { Button, Grid } from '@mui/material';
import { useCallback, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { object, string } from 'yup';

import { DefaultDialog } from '../../components/default-dialog';


export interface AddEditTemplateLayoutDialogProps {
    onClose?: () => void;
    templateLayoutValues?: ITemplateLayout;
}

const defaultValues: Partial<ITemplateLayout> = {
    name: '',
    displayName: '',
    description: '',
    type: TemplateLayoutTypeEnum.EMAIL,
    language: TemplateLayoutLanguageEnum.HTML,
};

const validationSchema = object().shape({
    name: string().matches(/^[a-z0-9\-_]+$/, 'Name must be in lowercase, numbers, dashes and underscores').label('Name').required(),
    displayName: string().label('Display Name').required(),
    description: string().label('Description'),
    type: string().label('Type'),
    language: string().label('Language'),
});

function AddEditTemplateLayoutDialog({
    onClose,
    templateLayoutValues,
}: AddEditTemplateLayoutDialogProps) {
    const { showToasty } = useToasty();
    const { useCreateTemplateLayout, useUpdateTemplateLayout } = useTemplateLayout();
    const { mutateAsync: createTemplateLayout } = useCreateTemplateLayout();
    const { mutateAsync: updateTemplateLayout } = useUpdateTemplateLayout();

    const navigate = useNavigate();

    const formContext = useForm({
        defaultValues,
        resolver: yupResolver(validationSchema) as any,
    });
    const { reset, handleSubmit } = formContext;

    const handleSubmitForm = useCallback(
        (value: ITemplateLayout) => {
            if (templateLayoutValues?.id) {
                updateTemplateLayout({
                    ...value,
                    id: templateLayoutValues.id,
                }).then(() => {
                    showToasty('Template layout updated successfully');
                    if (onClose) {
                        onClose();
                    }
                }).catch((error) => {
                    showToasty(error, 'error');
                });
            } else {
                createTemplateLayout({
                    ...value,
                    content: '',
                }).then((data: ITemplateLayout) => {
                    showToasty('Template layout added successfully');
                    if (onClose) {
                        onClose();
                    }
                    navigate(PATH_DASHBOARD.templateLayouts.edit(data.id));
                }).catch((error) => {
                    showToasty(error, 'error');
                });
            }
        },
        [
            createTemplateLayout,
            onClose,
            showToasty,
            templateLayoutValues?.id,
            updateTemplateLayout,
            navigate,
        ],
    );

    useEffect(() => {
        reset({
            ...templateLayoutValues,
        });
    }, [reset, templateLayoutValues]);

    return (
        <DefaultDialog
            title={templateLayoutValues?.id ? 'Edit Template Layout' : 'Add Template Layout'}
            onClose={onClose}
            fullWidth
            maxWidth="md"
            actions={(
                <>
                    <Button
                        variant="outlined"
                        onClick={onClose}
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
                    id: 'add-edit-form-template-layout',
                }}
                formContext={formContext as any}
                validationSchema={validationSchema}
                onSuccess={handleSubmitForm}
            >
                <Grid
                    spacing={3}
                    container
                >
                    <Grid
                        size={{
                            xs: 12,
                            sm: 6,
                        }}
                    >
                        <RHFTextField
                            fullWidth
                            name="name"
                            label="Name"
                            placeholder="template-layout-name"
                            helperText="Lowercase letters, numbers, dashes and underscores only"
                            required
                        />
                    </Grid>
                    <Grid
                        size={{
                            xs: 12,
                            sm: 6,
                        }}
                    >
                        <RHFTextField
                            fullWidth
                            name="displayName"
                            label="Display Name"
                            placeholder="Template Layout Display Name"
                            required
                        />
                    </Grid>
                    <Grid
                        size={{
                            xs: 12,
                            sm: 6,
                        }}
                    >
                        <RHFSelect
                            fullWidth
                            required
                            name="type"
                            label="Type"
                            options={Object.values(TemplateLayoutTypeEnum)}
                        />
                    </Grid>
                    <Grid
                        size={{
                            xs: 12,
                            sm: 6,
                        }}
                    >
                        <RHFSelect
                            fullWidth
                            required
                            name="language"
                            label="Language"
                            options={Object.values(TemplateLayoutLanguageEnum)}
                        />
                    </Grid>

                    <Grid size={{ xs: 12 }}>
                        <RHFTextField
                            fullWidth
                            name="description"
                            label="Description"
                            placeholder="Template layout description"
                            multiline
                            minRows={2}
                        />
                    </Grid>
                </Grid>
            </FormContainer>
        </DefaultDialog>
    );
}

export default AddEditTemplateLayoutDialog;
