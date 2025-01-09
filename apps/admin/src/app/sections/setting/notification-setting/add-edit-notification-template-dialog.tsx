import { DefaultDialog } from '@admin/app/components';
import { yupResolver } from '@hookform/resolvers/yup';
import { FormContainer, RHFTextEditor, RHFTextField, useNotificationTemplateQuery, useToasty } from '@libs/react-core';
import { INotificationTemplate } from '@libs/types';
import { Button, Container } from '@mui/material';
import Grid from '@mui/material/Grid2';
import { useCallback, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { object, string } from 'yup';


export interface AddEditNotificationTemplateDialogProps {
    onClose?: (value?: any) => void;
    templateValues?: INotificationTemplate
}

const defaultValues = {
    title: '',
    slug: '',
    emailSubject: '',
    event: '',
    emailBody: '',
};

const validationSchema = object().shape({
    title: string().label('Title'),
    slug: string().label('Slug'),
    event: string().label('Event').required(),
    emailSubject: string().label('Email Subject').required(),
    emailBody: string().trim().label('Email Body'),
});

const AddEditNotificationTemplateDialog = ({
    onClose,
    templateValues,
}: AddEditNotificationTemplateDialogProps) => {
    const { showToasty } = useToasty();
    const { useCreateNotificationTemplate, useUpdateNotificationTemplate } = useNotificationTemplateQuery();
    const { mutate: createNotificationTemplate } = useCreateNotificationTemplate();
    const { mutate: updateNotificationTemplate } = useUpdateNotificationTemplate();

    const formContext = useForm({
        defaultValues,
        resolver: yupResolver(validationSchema),
    });
    const { reset, handleSubmit } = formContext;

    const handleSubmitForm = useCallback(
        (value: INotificationTemplate) => {
            const options = {
                onSuccess: (data) => {
                    showToasty(
                        value?.id
                            ? 'Notification template updated successfully'
                            : 'Notification template added successfully',
                    );
                    onClose && onClose({ isRefresh: true });
                },
                onError: (error) => {
                    showToasty(error, 'error');
                },
            };
            if (value?.id) {
                updateNotificationTemplate(value, options);
            } else {
                createNotificationTemplate(value, options);
            }
        },
        [
            createNotificationTemplate,
            onClose,
            showToasty,
            updateNotificationTemplate,
        ],
    );

    useEffect(() => {
        reset({
            ...templateValues,
        });
    }, [reset, templateValues]);

    return (
        <DefaultDialog
            title={templateValues?.id ? 'Edit Template' : 'Add Template'}
            onClose={onClose}
            fullScreen
            actions={
                <>
                    <Button
                        variant="outlined"
                        onClick={() => { onClose(); }}
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
            <Container>
                <FormContainer
                    FormProps={{
                        id: 'add-edit-form-notification-template',
                    }}
                    formContext={formContext}
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
                                name="title"
                                label="Title (only seen by admins)"
                                placeholder='Title'
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
                                required
                                name="slug"
                                label="Slug"
                                helperText='will be automatically generated from your title, if left empty.'
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
                                required
                                name="emailSubject"
                                label="Email Subject"
                                placeholder='Email Subject'
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
                                required
                                name="event"
                                label="Event"
                                placeholder='Event'
                            />
                        </Grid>
                        <Grid size={{ xs: 12 }}>
                            <RHFTextEditor
                                name="emailBody"
                                label="Email Body"
                            />
                        </Grid>
                    </Grid>
                </FormContainer>
            </Container>
        </DefaultDialog>
    );
};

export default AddEditNotificationTemplateDialog;
