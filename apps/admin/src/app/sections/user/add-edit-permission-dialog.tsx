
import { DefaultDialog, PermissionService, useToasty } from '@mlm/react-core';
import { Button, Stack } from '@mui/material'
import { Field, Form, Formik, FormikHelpers } from 'formik';
import { TextField } from 'formik-mui';
import { omit } from 'lodash';
import { useSnackbar } from 'notistack';
import { useCallback, useRef } from 'react'
import { object, string } from 'yup';


interface AddEditPermissionDialogProps {
    onClose: (value?: any) => void;
    values?: any;
    onSubmit: (value?: any, action?: FormikHelpers<any>) => void;
}

const permissionService = PermissionService.getInstance<PermissionService>()

const defaultValues = {
    name: '',
    // isActive: true,
};

const validationSchema = object().shape({
    name: string().trim().required().label('Name'),
});

const AddEditPermissionDialog = ({ onClose, values, onSubmit }: AddEditPermissionDialogProps) => {
    const formRef = useRef<any>();
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
                    <Button variant="contained" color="primary" onClick={() => formRef?.current?.handleSubmit()}>
                        Save
                    </Button>
                </>
            }
        >
            <Formik
                initialValues={Object.assign({}, defaultValues, values)}
                validationSchema={validationSchema}
                onSubmit={onSubmit}
                innerRef={formRef}
                enableReinitialize
            >
                {({ handleSubmit }) => (
                    <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
                        <Stack spacing={2}>
                            <Field
                                fullWidth
                                required
                                name='name'
                                label='Name'
                                component={TextField}
                            />
                        </Stack>

                    </Form>
                )}
            </Formik>
        </DefaultDialog>
    )
}

export default AddEditPermissionDialog