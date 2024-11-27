import { DefaultDialog, TextField } from '@admin/app/components'
import { INotificationTemplate } from '@libs/types';
import { Button } from '@mui/material';
import { Field, Form, Formik, FormikHelpers } from 'formik';
import { useCallback, useRef } from 'react'
import { object, string } from 'yup';
import Grid from '@mui/material/Grid2';
import TextEditorField from '@admin/app/components/form/formik/text-editer-field';
import { NotificationTemplateService, useToasty } from '@libs/react-core';
import { omit } from 'lodash';

const notificationTemplateService = NotificationTemplateService.getInstance<NotificationTemplateService>();

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
    templateValues
}: AddEditNotificationTemplateDialogProps) => {
    const formRef = useRef<any>();
    const { showToasty } = useToasty()

    const handleSubmitForm = useCallback(
        (value: INotificationTemplate, action: FormikHelpers<any>) => {
            const request = {
                ...omit(value, ['id', 'createdAt', 'updatedAt', 'deletedAt']),
            };
            if (value?.id) {
                notificationTemplateService
                    .update(value?.id, request)
                    .then((resp) => {
                        showToasty(`Notification template updated successfully .`);
                        action.setSubmitting(false);
                        onClose && onClose({ isRefresh: true });
                    })
                    .catch((error) => {
                        action.setSubmitting(false);
                        showToasty(error, 'error');
                    });
            } else {
                notificationTemplateService
                    .create(request)
                    .then((resp) => {
                        showToasty(`Notification template added successfully .`);
                        action.setSubmitting(false);
                        onClose && onClose({ isRefresh: true });
                    })
                    .catch((error) => {
                        action.setSubmitting(false);
                        showToasty(error, 'error');
                    });
            }
        },
        [],
    )

    return (
        <DefaultDialog
            title={templateValues?.id ? 'Edit Template' : 'Add Template'}
            onClose={onClose}
            fullScreen
            actions={
                <>
                    <Button variant="outlined" onClick={() => { onClose() }}>
                        Cancel
                    </Button>
                    <Button variant="contained" color="primary" onClick={() => formRef?.current?.handleSubmit()}>
                        Save
                    </Button>
                </>
            }
        >
            <Formik
                initialValues={Object.assign({}, defaultValues, templateValues)}
                validationSchema={validationSchema}
                onSubmit={handleSubmitForm}
                innerRef={formRef}
                enableReinitialize
            >
                {({ handleSubmit }) => (
                    <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
                        <Grid spacing={3} container >
                            <Grid size={{ xs: 12, sm: 6 }}>
                                <Field
                                    fullWidth
                                    name="title"
                                    label="Title (only seen by admins)"
                                    component={TextField}
                                    placeholder='Title'
                                />
                            </Grid>
                            <Grid size={{ xs: 12, sm: 6 }}>
                                <Field
                                    fullWidth
                                    required
                                    name="slug"
                                    label="Slug"
                                    component={TextField}
                                    helperText='will be automatically generated from your title, if left empty.'
                                />
                            </Grid>
                            <Grid size={{ xs: 12, sm: 6 }}>
                                <Field
                                    fullWidth
                                    required
                                    name="emailSubject"
                                    label="Email Subject"
                                    component={TextField}
                                    placeholder='Email Subject'
                                />
                            </Grid>
                            <Grid size={{ xs: 12, sm: 6 }}>
                                <Field
                                    fullWidth
                                    required
                                    name="event"
                                    label="Event"
                                    component={TextField}
                                    placeholder='Event'
                                />
                            </Grid>
                            <Grid size={{ xs: 12 }}>
                                <Field
                                    fullWidth
                                    name="emailBody"
                                    label="Email Body"
                                    component={TextEditorField}
                                />
                            </Grid>
                        </Grid>
                    </Form>
                )}
            </Formik>
        </DefaultDialog>
    )
}

export default AddEditNotificationTemplateDialog