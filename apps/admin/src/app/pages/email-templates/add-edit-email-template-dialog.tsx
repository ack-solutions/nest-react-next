import { FormContainer, RHFSelect, RHFTextField } from '@admin/app/form';
import { useToasty } from '@admin/app/hook';
import { yupResolver } from '@hookform/resolvers/yup';
import { useTemplate, useTemplateLayout } from '@libs/react-shared';
import { ITemplate, TemplateLanguageEnum, TemplateTypeEnum } from '@libs/types';
import { Button, Grid } from '@mui/material';
import { Stack } from '@mui/material';
import { useCallback, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { object, string } from 'yup';

import { DefaultDialog } from '../../components/default-dialog';
import { PATH_DASHBOARD } from '../../routes/paths';


export interface AddEditEmailTemplateDialogProps {
    templateValues?: ITemplate;
    onClose: () => void;
    open: boolean;
}

const defaultValues: Partial<ITemplate> = {
    name: '',
    displayName: '',
    description: '',
    subject: '',
    templateLayoutName: '',
    type: TemplateTypeEnum.EMAIL,
    language: TemplateLanguageEnum.HTML,
    isActive: true,
};

const basicDetailsValidationSchema = object().shape({
    name: string().matches(/^[a-z0-9\-_]+$/, 'Name must be in lowercase, numbers, dashes and underscores').label('Name').required(),
    displayName: string().label('Display Name').required(),
    subject: string().label('Subject').nullable(),
    language: string().label('Language').required(),
    type: string().label('Type').required(),
    description: string().label('Description'),
});

function AddEditEmailTemplateDialog({ templateValues, onClose, open }: AddEditEmailTemplateDialogProps) {
    const { useCreateTemplate, useUpdateTemplate } = useTemplate();
    const { useGetTemplateLayout } = useTemplateLayout();
    const { showToasty } = useToasty();
    const navigate = useNavigate();

    const { mutateAsync: createTemplate } = useCreateTemplate();
    const { mutateAsync: updateTemplate } = useUpdateTemplate();
    const { data: templateLayouts } = useGetTemplateLayout({});

    const basicDetailsFormContext = useForm({
        defaultValues,
        resolver: yupResolver(basicDetailsValidationSchema) as any,
    });
    const { reset, formState: { isSubmitting: isSubmittingBasicDetails } } = basicDetailsFormContext;

    const handleSubmitBasicDetails = useCallback(
        async (value: ITemplate) => {
            const emailTemplateData = {
                ...value,
                type: TemplateTypeEnum.EMAIL, // Ensure it's always email type
            };

            if (value?.id) {
                await updateTemplate(emailTemplateData).then(() => {
                    showToasty('Email template details updated successfully', 'success');
                    onClose();
                }).catch((error) => {
                    showToasty(error, 'error');
                });
            } else {
                await createTemplate({
                    ...emailTemplateData,
                    content: '',
                }).then((data: ITemplate) => {
                    showToasty('Email template created successfully', 'success');
                    onClose();
                    navigate(PATH_DASHBOARD.emailTemplates.edit(data.id));
                }).catch((error) => {
                    showToasty(error, 'error');
                });
            }
        },
        [
            createTemplate,
            showToasty,
            updateTemplate,
            onClose,
            navigate,
        ],
    );

    useEffect(() => {
        if (templateValues) {
            reset({
                ...defaultValues,
                ...templateValues,
            });
        }
    }, [templateValues, reset]);

    return (
        <DefaultDialog
            open={open}
            onClose={onClose}
            title={templateValues?.id ? 'Edit Email Template Details' : 'Create Email Template'}
            maxWidth="md"
            fullWidth
            actions={(
                <Stack
                    direction="row"
                    spacing={2}
                >
                    <Button
                        variant="outlined"
                        onClick={onClose}
                    >
                        Cancel
                    </Button>
                    <Button
                        type="submit"
                        variant="contained"
                        loading={isSubmittingBasicDetails}
                        form="edit-email-template-details-form"
                    >
                        {templateValues?.id ? 'Save Changes' : 'Create Template'}
                    </Button>
                </Stack>
            )}
        >
            <FormContainer
                formProps={{
                    id: 'edit-email-template-details-form',
                }}
                formContext={basicDetailsFormContext as any}
                validationSchema={basicDetailsValidationSchema}
                onSuccess={handleSubmitBasicDetails}
            >
                <Grid
                    container
                    spacing={3}
                >
                    <Grid
                        size={{
                            xs: 12,
                            md: 6,
                        }}
                    >
                        <RHFTextField
                            name="name"
                            label="Template Name"
                            fullWidth
                            required
                            helperText="Unique identifier for the template (lowercase, numbers, dashes, underscores)"
                        />
                    </Grid>
                    <Grid
                        size={{
                            xs: 12,
                            md: 6,
                        }}
                    >
                        <RHFTextField
                            name="displayName"
                            label="Display Name"
                            fullWidth
                            required
                            helperText="Human-readable name for the template"
                        />
                    </Grid>

                    <Grid
                        size={{
                            xs: 12,
                        }}
                    >
                        <RHFTextField
                            name="subject"
                            label="Email Subject"
                            fullWidth
                            helperText="Default subject line for emails using this template"
                        />
                    </Grid>

                    <Grid
                        size={{
                            xs: 12,
                            sm: 6,
                        }}
                    >
                        <RHFSelect
                            required
                            name="language"
                            label="Template Language"
                            options={Object.values(TemplateLanguageEnum)}
                            fullWidth
                            helperText="Choose the markup language for the template"
                        />
                    </Grid>

                    <Grid
                        size={{
                            xs: 12,
                            sm: 6,
                        }}
                    >
                        <RHFSelect
                            name="templateLayoutName"
                            label="Template Layout"
                            options={templateLayouts?.map((layout) => layout.name) || []}
                            fullWidth
                            helperText="Optional layout wrapper for the template"
                        />
                    </Grid>

                    <Grid
                        size={{
                            xs: 12,
                        }}
                    >
                        <RHFTextField
                            name="description"
                            label="Description"
                            fullWidth
                            multiline
                            rows={3}
                            helperText="Brief description of the template's purpose"
                        />
                    </Grid>
                </Grid>
            </FormContainer>
        </DefaultDialog>
    );
}

export default AddEditEmailTemplateDialog;
