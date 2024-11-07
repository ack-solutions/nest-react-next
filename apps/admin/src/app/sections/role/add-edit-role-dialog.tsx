
import { DefaultDialog, RoleService, TextField, useToasty } from '@mlm/react-core'
import { IRole } from '@mlm/types'
import { Button, Stack } from '@mui/material'
import { Field, Form, Formik, FormikHelpers, FormikProps } from 'formik'
import React, { useCallback, useRef } from 'react'
import { object, string } from 'yup'

const roleService = RoleService.getInstance<RoleService>();

export interface AddEditRoleDialogProps {
  onClose?: () => void
  roleValue?: IRole;
  onSubmit: (value: IRole, action: any) => void
}

const defaultValue = {
  name: ''
}
const validationSchema = object().shape({
  name: string().label('Name').required(),
});
const AddEditRoleDialog = ({ onClose, roleValue, onSubmit }: AddEditRoleDialogProps) => {
  const formRef = useRef<FormikProps<any>>(null);
  const { showToasty } = useToasty();

  // const handleSubmitForm = useCallback(
  //   (value: IRole, action: any) => {
  //     console.log(value);

  //     if (value?.id) {
  //       roleService.update(value?.id, value).then(() => {
  //         showToasty('Role updated Successfully')
  //         action.setSubmitting(false)
  //       }).catch((error) => {
  //         showToasty(error, 'error')
  //       })
  //     } else {
  //       roleService.create(value).then(() => {
  //         action.setSubmitting(false)
  //         showToasty('Role updated Successfully')
  //       }).catch((error) => {
  //         showToasty(error, 'error')
  //       })
  //     }
  //   },
  //   [],
  // )


  return (
    <DefaultDialog
      onClose={onClose}
      maxWidth='sm'
      title={`${roleValue ? 'Edit' : 'Add'} Role`}
      actions={
        <Stack direction='row' spacing={2}>
          <Button onClick={onClose}>Cancel</Button>
          <Button variant='contained' onClick={() => formRef.current?.handleSubmit()}>Save</Button>
        </Stack>
      }
    >
      <Formik
        initialValues={Object.assign({}, defaultValue, roleValue)}
        validationSchema={validationSchema}
        enableReinitialize
        onSubmit={onSubmit}
        innerRef={formRef}
      >
        {({ errors, isSubmitting, handleSubmit, values }) => (
          <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
            <Field
              fullWidth
              name="name"
              label="Name"
              component={TextField}
              required
            />
          </Form>
        )}
      </Formik>
    </DefaultDialog>
  )
}

export default AddEditRoleDialog