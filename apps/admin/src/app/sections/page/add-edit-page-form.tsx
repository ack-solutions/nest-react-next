import { TextField } from '@admin/app/components'
import { Field, Form, Formik, FormikHelpers } from 'formik'
import React, { forwardRef, useCallback } from 'react'
import Grid from '@mui/material/Grid2';
import { IPage, PageTemplateEnum } from '@libs/types';
import { object, string } from 'yup';
import { Card, CardContent, MenuItem } from '@mui/material';

export interface AddEditPageFormProps {
    onSubmit?: (values: IPage, formikHelpers: FormikHelpers<any>) => void;
    pageValue?: IPage
}
const defaultValues = {
    name: "",
    slug: "",
    template: PageTemplateEnum.DEFAULT,
    title: "",
}

const validationSchema = object().shape({
    title: string().trim().label('Title').required(),
    template: string().label('Template'),
    name: string().trim().label('Name').required(),
});

const AddEditPageForm = forwardRef(
    ({ onSubmit, pageValue }: AddEditPageFormProps, ref: any) => {
        const handleChangeTemplate = useCallback(
            (e) => {
                let text = "Are you sure you want to change the page template?\nYou will lose any unsaved modifications for this page.";
                if (confirm(text) == true) {
                    ref?.current?.setFieldValue('template', e.target.value)

                }
            },
            [],
        )
        return (
            <Formik
                initialValues={Object.assign({}, defaultValues, pageValue)}
                validationSchema={validationSchema}
                enableReinitialize
                onSubmit={onSubmit}
                innerRef={ref}
            >
                {({ handleSubmit, values, setFieldValue }) => (
                    <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
                        <Card >
                            <CardContent>
                                <Grid spacing={3} container >
                                    <Grid size={{ xs: 12, sm: 6 }}>
                                        <Field
                                            fullWidth
                                            select
                                            name="template"
                                            label="Template"
                                            component={TextField}
                                            onChange={handleChangeTemplate}
                                        >
                                            <MenuItem value={PageTemplateEnum.DEFAULT}>Default</MenuItem>
                                        </Field>
                                    </Grid>
                                    <Grid size={{ xs: 12, sm: 6 }} >
                                        <Field
                                            fullWidth
                                            name="name"
                                            required
                                            label="Page Name (only seen by admins)"
                                            component={TextField}
                                        />
                                    </Grid>
                                    <Grid size={{ xs: 12, sm: 6 }} >
                                        <Field
                                            fullWidth
                                            name="title"
                                            required
                                            label="Page Title"
                                            component={TextField}
                                        />
                                    </Grid>
                                    <Grid size={{ xs: 12, sm: 6 }}>
                                        <Field
                                            fullWidth
                                            name="slug"
                                            label="Page Slug (URL)"
                                            helperText='will be automatically generated from your title, if left empty.'
                                            component={TextField}
                                        />
                                    </Grid>
                                </Grid>
                            </CardContent>
                        </Card>
                    </Form>
                )}
            </Formik>
        )
    }
)
export default AddEditPageForm