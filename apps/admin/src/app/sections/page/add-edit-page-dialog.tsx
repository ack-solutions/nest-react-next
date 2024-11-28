import { useCallback, useEffect } from 'react';
import { Button, Stack } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { DefaultDialog } from '@admin/app/components';
import { errorMessage, FormContainer, RHFTextField, useToasty } from '@libs/react-core';
import { object, string } from 'yup';
import { IPage } from '@libs/types';
import { usePage } from '@admin/app/hooks/use-page';


export interface AddEditPageDialogProps {
    onSubmit?: (values: IPage) => void;
    onClose?: () => void;
    initialValue?: Partial<IPage>
}

const validationSchema = yupResolver(object({
    title: string().label('Title').required(),
    name: string().label('Name').required(),
}));

const defaultValues: Partial<IPage> = {
    title: "",
    name: ""
}

export default function AddEditPageDialog({
    onClose,
    initialValue,
    onSubmit,
}: AddEditPageDialogProps) {

    const { useUpdatePage, useCreatePage } = usePage();
    const { mutateAsync: updatePage } = useUpdatePage();
    const { mutateAsync: createPage } = useCreatePage();
    const { showToasty } = useToasty();

    const formContext = useForm({
        defaultValues,
        resolver: validationSchema,
    })
    const { reset } = formContext;

    const handleSubmit = useCallback(
        async (values: Partial<IPage>) => {
            try {
                let resp;
                if (initialValue?.id) {
                    resp = await updatePage({
                        ...values,
                        id: initialValue?.id
                    })
                } else {
                    resp = await createPage(values)
                }

                if (onSubmit) { onSubmit(resp) }
                if (onClose) { onClose() }

                showToasty('Page successfully saved')
                return resp;
            } catch (error) {
                showToasty(errorMessage(error, "Error while saving Page"), 'error');
                throw error;
            }
        },

        [createPage, initialValue?.id, onClose, onSubmit, showToasty, updatePage],
    )

    useEffect(() => {
        // Load Value in form
        reset({
            ...initialValue,
        })
    }, [reset, initialValue]);

    return (
        <DefaultDialog
            onClose={onClose}
            title={defaultValues?.id ? 'Edit Page' : 'Add Page'}
            actions={
                <>
                    <Button onClick={onClose}>Cancel</Button>
                    <LoadingButton
                        type="submit"
                        form="add-edit-form-page"
                        variant="contained"
                        color="primary"
                        disabled={formContext?.formState?.isSubmitting}
                        loading={formContext?.formState?.isSubmitting}
                    >
                        Save
                    </LoadingButton>
                </>
            }
        >
            <FormContainer
                FormProps={{
                    id: "add-edit-form-page"
                }}
                formContext={formContext}
                validationSchema={validationSchema}
                onSuccess={handleSubmit}
            >
                <Stack spacing={2}>
                    <RHFTextField
                        label="Title"
                        name="title"
                        fullWidth
                        variant="outlined"
                    />

                    <RHFTextField
                        label="Name"
                        name="name"
                        fullWidth
                        variant="outlined"
                    />
                </Stack>

            </FormContainer>
        </DefaultDialog>
    );
}
