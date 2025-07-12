import { DefaultDialog } from '@admin/app/components';
import { usePage } from '@libs/react-shared';
import { IPage, PageStatusEnum } from '@libs/types';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Box,
    Stack,
    MenuItem,
    ToggleButton,
    ToggleButtonGroup,
    Typography,
} from '@mui/material';
import { useCallback, useState } from 'react';

import { Icon } from '../../components/icons/icon';
import { IconEnum } from '../../components/icons/icons';
import {
    FormContainer,
    RHFTextField,
    RHFSelect,
    RHFTextEditor,
    RHFMonacoEditor,
} from '../../form';
import { useToasty } from '../../hook';


interface AddEditPageDialogProps {
    initialValue?: IPage | null;
    onClose: () => void;
    onSubmit?: () => void;
}

export default function AddEditPageDialog({
    initialValue,
    onClose,
    onSubmit,
}: AddEditPageDialogProps) {
    const { showToasty } = useToasty();
    const { useCreatePage, useUpdatePage } = usePage();
    const { mutateAsync: createPage, isPending: isCreating } = useCreatePage();
    const { mutateAsync: updatePage, isPending: isUpdating } = useUpdatePage();

    const [editorMode, setEditorMode] = useState<'visual' | 'code'>('visual');

    const isEditing = !!initialValue?.id;
    const isLoading = isCreating || isUpdating;

    const handleFormSubmit = useCallback(async (data: IPage) => {
        try {
            if (isEditing) {
                await updatePage({
                    id: initialValue.id,
                    ...data,
                });
                showToasty('Page updated successfully');
            } else {
                await createPage(data);
                showToasty('Page created successfully');
            }
            onSubmit?.();
        } catch (error) {
            showToasty(error || `Failed to ${isEditing ? 'update' : 'create'} page`, 'error');
        }
    }, [
        isEditing,
        initialValue?.id,
        updatePage,
        createPage,
        showToasty,
        onSubmit,
    ]);

    return (
        <DefaultDialog
            open
            onClose={onClose}
            maxWidth="lg"
            fullWidth
            title={isEditing ? 'Edit Page' : 'Add New Page'}
            actions={
                <>
                    <Button
                        onClick={onClose}
                        disabled={isLoading}
                    >
                        Cancel
                    </Button>
                    <Button
                        type="submit"
                        variant="contained"
                        disabled={isLoading}
                    >
                        {isEditing ? 'Update' : 'Create'} Page
                    </Button>
                </>
            }
        >

            <FormContainer
                onSuccess={handleFormSubmit}
                defaultValues={{
                    title: initialValue?.title || '',
                    name: initialValue?.name || '',
                    slug: initialValue?.slug || '',
                    content: initialValue?.content || '',
                    status: initialValue?.status || PageStatusEnum.DRAFT,
                }}
            >

                <Stack spacing={3}>
                    <Box sx={{
                        display: 'flex',
                        gap: 2,
                    }}>
                        <RHFTextField
                            name="title"
                            label="Title"
                            required
                            fullWidth
                        />
                        <RHFSelect
                            name="status"
                            label="Status"
                            required
                            sx={{ minWidth: 150 }}
                        >
                            <MenuItem value={PageStatusEnum.DRAFT}>
                                Draft
                            </MenuItem>
                            <MenuItem value={PageStatusEnum.PUBLISHED}>
                                Published
                            </MenuItem>
                            <MenuItem value={PageStatusEnum.UNPUBLISHED}>
                                Unpublished
                            </MenuItem>
                        </RHFSelect>
                    </Box>

                    <Box sx={{
                        display: 'flex',
                        gap: 2,
                    }}>
                        <RHFTextField
                            name="name"
                            label="Name"
                            fullWidth
                            helperText="Internal name for reference"
                        />
                        <RHFTextField
                            name="slug"
                            label="Slug"
                            fullWidth
                            helperText="URL-friendly version of the title"
                        />
                    </Box>

                    <Box>
                        <Box sx={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            mb: 1,
                        }}>
                            <Typography variant="body1" component="label" sx={{ fontWeight: 500 }}>
                                Content
                            </Typography>
                            <ToggleButtonGroup
                                value={editorMode}
                                exclusive
                                onChange={(_, newMode) => {
                                    if (newMode !== null) {
                                        setEditorMode(newMode);
                                    }
                                }}
                                size="small"
                            >
                                <ToggleButton value="visual">
                                    <Icon icon={IconEnum.Eye} sx={{ mr: 1 }} />
                                    Visual
                                </ToggleButton>
                                <ToggleButton value="code">
                                    <Icon icon={IconEnum.FileText} sx={{ mr: 1 }} />
                                    Code
                                </ToggleButton>
                            </ToggleButtonGroup>
                        </Box>

                        {editorMode === 'visual' ? (
                            <RHFTextEditor
                                name="content"
                                label=""
                                helperText="Create rich content using the visual editor"
                            />
                        ) : (
                            <RHFMonacoEditor
                                name="content"
                                label=""
                                height="400px"
                                language="html"
                                helperText="Edit HTML code directly with syntax highlighting and auto-completion"
                            />
                        )}
                    </Box>
                </Stack>
            </FormContainer>
        </DefaultDialog>
    );
}
