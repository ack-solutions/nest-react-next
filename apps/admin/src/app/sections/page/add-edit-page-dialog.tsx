import { yupResolver } from '@hookform/resolvers/yup';
import {
    errorMessage,
    FormContainer,
    Icon,
    RHFTextEditor,
    RHFTextField,
    usePage,
    useTabs,
    useToasty,
} from '@libs/react-core';
import { IPage, PageStatusEnum } from '@libs/types';
import { LoadingButton } from '@mui/lab';
import { Button, Card, CardContent, Container, IconButton, MenuItem, Stack, Tab, Tabs } from '@mui/material';
import { startCase } from 'lodash';
import { useCallback, useEffect, useState } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import { array, mixed, object, string } from 'yup';

import { DefaultDialog } from '../../components';


export interface AddEditPageDialogProps {
    onSubmit?: (values: IPage) => void;
    onClose?: () => void;
    initialValue?: Partial<IPage>;
}

const validationSchema = object({
    title: string().label('title').required(),
    slug: string().label('slug'),
    content: string().label('content').required(),
    metaData: array().of(
        object({
            key: string().label('Key'),
            value: string().label('Value'),
        })
    ).label('Meta Data'),
    name: string().label('name').required(),
    status: mixed<PageStatusEnum>().oneOf(Object.values(PageStatusEnum)).label('Status').required(),
});

const defaultValues: IPage = {
    title: '',
    slug: '',
    content: '',
    metaData: [],
    name: '',
    status: PageStatusEnum.DRAFT
};


export default function AddEditPageDialog({
    onClose,
    initialValue,
    onSubmit,
}: AddEditPageDialogProps) {
    const { useUpdatePage, useCreatePage } = usePage();
    const { mutateAsync: updatePage } = useUpdatePage();
    const { mutateAsync: createPage } = useCreatePage();
    const { showToasty } = useToasty();
    const { currentTab, onChangeTab } = useTabs('basic');

    const formContext = useForm<IPage>({
        defaultValues,
        resolver: yupResolver(validationSchema),
    });
    const { reset, handleSubmit, control, formState: { errors } } = formContext;

    const { fields, append, remove } = useFieldArray({
        control: control,
        name: 'metaData',
    });

    const handleSubmitForm = useCallback(
        async (values: IPage) => {
            try {
                let resp;
                if (initialValue?.id) {
                    resp = await updatePage({
                        ...values,
                        id: initialValue?.id,
                    });
                } else {
                    resp = await createPage(values);
                }

                if (onSubmit) {
                    onSubmit(resp);
                }
                if (onClose) {
                    onClose();
                }

                showToasty('Page successfully saved');
                return resp;
            } catch (error) {
                showToasty(
                    errorMessage(error, 'Error while saving Page'),
                    'error'
                );
                throw error;
            }
        },

        [
            createPage,
            initialValue?.id,
            onClose,
            onSubmit,
            showToasty,
            updatePage,
        ]
    );

    useEffect(() => {
        reset({
            ...defaultValues,
            ...initialValue,
        });
    }, [reset, initialValue]);


    return (
        <DefaultDialog
            onClose={onClose}
            fullScreen
            title={defaultValues?.id ? 'Edit Page' : 'Add Page'}
            actions={
                <>
                    <Button onClick={onClose}>Cancel</Button>
                    <LoadingButton
                        type="submit"
                        form="add-edit-page-form"
                        variant="contained"
                        color="primary"
                        disabled={formContext?.formState?.isSubmitting}
                        loading={formContext?.formState?.isSubmitting}
                        onClick={handleSubmit(handleSubmitForm)}
                    >
                        Save
                    </LoadingButton>
                </>
            }
        >
            <Container>
                <FormContainer
                    FormProps={{
                        id: 'add-edit-page-form',
                    }}
                    formContext={formContext}
                    validationSchema={validationSchema}
                    onSuccess={handleSubmitForm}
                >
                    <Tabs
                        value={currentTab}
                        onChange={onChangeTab}
                        sx={{
                            px: 3,
                            mb: 2
                        }}
                    >
                        <Tab
                            value='basic'
                            label='Basic'
                            disableRipple
                        />
                        <Tab
                            value='meta'
                            label='Meta'
                            disableRipple
                        />
                    </Tabs>
                    {currentTab === 'basic' && (
                        <Stack spacing={2} >
                            <Stack
                                spacing={2}
                                direction='row'
                            >
                                <RHFTextField
                                    label="Title"
                                    name="title"
                                    fullWidth
                                />
                                <RHFTextField
                                    label="Name"
                                    name="name"
                                    fullWidth
                                />
                            </Stack>
                            <Stack
                                spacing={2}
                                direction='row'
                            >
                                <RHFTextField
                                    label="Status"
                                    name="status"
                                    fullWidth
                                    select
                                >
                                    {Object.values(PageStatusEnum).map((status, index) => (
                                        <MenuItem
                                            key={index}
                                            value={status}
                                        >
                                            {startCase(status)}
                                        </MenuItem>
                                    ))}
                                </RHFTextField>
                                <RHFTextField
                                    label="Slug"
                                    name="slug"
                                    fullWidth
                                />
                            </Stack>
                            <RHFTextEditor
                                name='content'
                                label='Content'
                            />
                        </Stack>
                    )}
                    {currentTab === 'meta' && (
                        <Card>
                            <CardContent>
                                <Stack spacing={2}>
                                    {fields?.map((field, index) => (
                                        <Stack
                                            spacing={2}
                                            direction='row'
                                            alignItems='center'
                                            key={field?.id}
                                        >
                                            <RHFTextField
                                                label="Key"
                                                name={`metaData.${index}.key`}
                                                fullWidth
                                            />
                                            <RHFTextField
                                                label="Value"
                                                name={`metaData.${index}.value`}
                                                fullWidth
                                            />
                                            <IconButton
                                                type="button"
                                                onClick={() => remove(index)}
                                            >
                                                <Icon icon='trash' />
                                            </IconButton>
                                        </Stack>
                                    ))}
                                </Stack>
                                <Button
                                    variant='contained'
                                    type="button"
                                    onClick={() => append({
                                        key: '',
                                        value: ''
                                    })}
                                    sx={{
                                        mt: 2
                                    }}
                                >
                                    Add MetaData
                                </Button>
                            </CardContent>
                        </Card>
                    )}
                </FormContainer>
            </Container>
        </DefaultDialog>
    );
}
