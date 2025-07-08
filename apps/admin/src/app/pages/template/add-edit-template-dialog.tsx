import { FormContainer, RHFSelect, RHFTextField } from '@admin/app/form';
import { useToasty } from '@admin/app/hook';
import { yupResolver } from '@hookform/resolvers/yup';
import { useTemplate, useTemplateLayout } from '@libs/react-shared';
import { ITemplate, TemplateLanguageEnum, TemplateLayoutLanguageEnum, TemplateTypeEnum } from '@libs/types';
import { Button, Grid } from '@mui/material';
import { Stack } from '@mui/material';
import { useCallback, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { object, string } from 'yup';

import { DefaultDialog } from '../../components/default-dialog';
import { PATH_DASHBOARD } from '../../routes/paths';


export interface AddEditTemplateDialogProps {
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
    subject: string().label('Subject').nullable(),
    language: string().label('Language').required(),
    type: string().label('Type').required(),
    content: string().label('Content'),
});

function AddEditTemplateDialog({ templateValues, onClose, open }: AddEditTemplateDialogProps) {
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
            if (value?.id) {
                await updateTemplate({
                    ...value,
                }).then(() => {
                    showToasty('Template details updated successfully', 'success');
                    onClose();
                }).catch((error) => {
                    showToasty(error, 'error');
                });
            } else {
                await createTemplate({
                    ...value,
                    content: '',
                }).then((data: ITemplate) => {
                    showToasty('Template details updated successfully', 'success');
                    onClose();
                    navigate(PATH_DASHBOARD.templates.edit(data.id));
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
            title="Edit Template Details"
            maxWidth="sm"
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
                        form="edit-basic-details-form"
                    >
                        Save Changes
                    </Button>
                </Stack>
            )}
        >
            <FormContainer
                formProps={{
                    id: 'edit-basic-details-form',
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
                            label="Name"
                            fullWidth
                            required
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
                            name="type"
                            label="Type"
                            options={Object.values(TemplateTypeEnum)}
                            fullWidth
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
                    <Grid
                        size={{
                            xs: 12,
                            sm: 6,
                        }}
                    >
                        <RHFSelect
                            name="templateLayoutName"
                            label="Template Layout"
                            options={templateLayouts || []}
                            valueKey="name"
                            labelKey="displayName"
                            fullWidth
                        />
                    </Grid>

                    <Grid
                        size={{
                            xs: 12,
                            md: 6,
                        }}
                    >
                        <RHFTextField
                            name="subject"
                            label="Subject"
                            fullWidth
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
                            multiline
                            minRows={3}
                            fullWidth
                        />
                    </Grid>
                </Grid>
            </FormContainer>
        </DefaultDialog>
    );
}

export default AddEditTemplateDialog;
