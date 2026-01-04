import { Page } from '@admin/app/components/page';
import { FormContainer, RHFMJMLSplitEditor, RHFTextField } from '@admin/app/form';
import { useBoolean, useToasty } from '@admin/app/hook';
import { yupResolver } from '@hookform/resolvers/yup';
import { useTemplateLayout } from '@libs/react-shared';
import { ITemplateLayout, TemplateLayoutLanguageEnum, TemplateLayoutTypeEnum } from '@libs/types';
import EditIcon from '@mui/icons-material/Edit';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Button, Card, CardContent, Grid, Typography, Stack, Accordion, AccordionSummary, AccordionDetails, styled, Box } from '@mui/material';
import { useCallback, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Group, Panel, Separator } from 'react-resizable-panels';
import { useNavigate, useParams } from 'react-router-dom';
import { object, string } from 'yup';

import AddEditTemplateLayoutDialog from './add-edit-template-layout-dialog';
import { PATH_DASHBOARD } from '../../routes/paths';


const ResizeHandle = styled(Separator)(({ theme }) => ({
    width: '8px',
    cursor: 'col-resize',
    backgroundColor: 'transparent',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    transition: 'all 0.2s ease-in-out',
    '&:hover': {
        backgroundColor: theme.palette.action.hover,
    },
    '&::after': {
        content: '""',
        width: '2px',
        height: '40px',
        backgroundColor: theme.palette.divider,
        borderRadius: '1px',
        transition: 'all 0.2s ease-in-out',
    },
    '&:hover::after': {
        backgroundColor: theme.palette.primary.main,
        height: '60px',
        width: '3px',
    },
    '&:active::after': {
        backgroundColor: theme.palette.primary.dark,
    },
}));

const defaultValues: Partial<ITemplateLayout> = {
    displayName: '',
    description: '',
    type: TemplateLayoutTypeEnum.EMAIL,
    language: TemplateLayoutLanguageEnum.HTML,
    content: '',
    isActive: true,
};

const validationSchema = object().shape({
    name: string().matches(/^[a-z0-9\-_]+$/, 'Name must be in lowercase, numbers, dashes and underscores').label('Name').required(),
    language: string().label('Language').required(),
    type: string().label('Type').required(),
    content: string().label('Content'),
});

function EditTemplateLayout() {
    const { templateLayoutId } = useParams();
    const { useCreateTemplateLayout, useUpdateTemplateLayout, useRenderTemplateLayout, useGetTemplateLayoutById } = useTemplateLayout();
    const [htmlContent, setHtmlContent] = useState('');
    const isEditDialogOpen = useBoolean(false);

    const { mutateAsync: createTemplateLayout } = useCreateTemplateLayout();
    const { mutateAsync: updateTemplateLayout } = useUpdateTemplateLayout();
    const { mutateAsync: renderTemplateLayout } = useRenderTemplateLayout();

    const { data: templateLayoutValues } = useGetTemplateLayoutById(templateLayoutId);


    const { showToasty } = useToasty();
    const navigate = useNavigate();
    const formContext = useForm({
        defaultValues,
        resolver: yupResolver(validationSchema) as any,
    });
    const { reset, watch, formState: { isSubmitting } } = formContext;
    const languageValue = watch('language');

    const handleSubmitForm = useCallback(
        async (value: any) => {
            let result: any;
            if (templateLayoutValues) {
                result = updateTemplateLayout(value);
            } else {
                result = createTemplateLayout(value);
            }
            result.then(() => {
                showToasty('Template layout saved successfully', 'success');
                navigate(PATH_DASHBOARD.templateLayouts.root);
            }).catch((error) => {
                console.error(error);
                showToasty(error, 'error');
            });
        },
        [
            createTemplateLayout,
            navigate,
            showToasty,
            templateLayoutValues,
            updateTemplateLayout,
        ],
    );

    const handleRenderTemplateLayout = useCallback(async (content?: string) => {
        try {
            const result = await renderTemplateLayout({
                content: content,
                language: languageValue,
                engine: templateLayoutValues?.engine,
                context: { content: '' },
            });
            setHtmlContent(result);
            return result;
        } catch (error) {
            console.error(error);
            const errorHtml = '<div style="color: red; padding: 20px;">Error rendering template layout</div>';

            return errorHtml;
        }
    }, [
        renderTemplateLayout,
        templateLayoutValues,
        languageValue,
    ]);

    useEffect(() => {
        if (templateLayoutValues) {
            reset({
                ...templateLayoutValues,
            });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [templateLayoutValues]);

    return (
        <Page
            title={templateLayoutValues?.displayName}
            breadcrumbs={[
                {
                    name: 'Dashboard',
                    href: PATH_DASHBOARD.root,
                },
                {
                    name: 'Template Layouts',
                    href: PATH_DASHBOARD.templateLayouts.root,
                },
                { name: 'Edit' },
            ]}
        >
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    overflow: 'hidden',
                }}
            >
                {/* Header Card */}
                {templateLayoutValues ? (
                    <Card
                        sx={{
                            mb: 2,
                            flexShrink: 0,
                        }}
                    >
                        <CardContent>
                            <Stack spacing={2}>
                                <Grid
                                    container
                                    spacing={2}
                                >
                                    <Grid
                                        size={{
                                            xs: 12,
                                            sm: 6,
                                            md: 2.4,
                                        }}
                                    >
                                        <Box>
                                            <Typography
                                                variant="caption"
                                                color="text.secondary"
                                                display="block"
                                            >
                                                Display Name
                                            </Typography>
                                            <Typography
                                                variant="body2"
                                                fontWeight="medium"
                                            >
                                                {templateLayoutValues?.displayName}
                                            </Typography>
                                        </Box>
                                    </Grid>

                                    <Grid
                                        size={{
                                            xs: 12,
                                            sm: 6,
                                            md: 2.4,
                                        }}
                                    >
                                        <Box>
                                            <Typography
                                                variant="caption"
                                                color="text.secondary"
                                                display="block"
                                            >
                                                Type
                                            </Typography>
                                            <Typography
                                                variant="body2"
                                                fontWeight="medium"
                                            >
                                                {templateLayoutValues?.type}
                                            </Typography>
                                        </Box>
                                    </Grid>

                                    <Grid
                                        size={{
                                            xs: 12,
                                            sm: 6,
                                            md: 2.4,
                                        }}
                                    >
                                        <Box>
                                            <Typography
                                                variant="caption"
                                                color="text.secondary"
                                                display="block"
                                            >
                                                Language
                                            </Typography>
                                            <Typography
                                                variant="body2"
                                                fontWeight="medium"
                                            >
                                                {templateLayoutValues?.language}
                                            </Typography>
                                        </Box>
                                    </Grid>

                                    <Grid
                                        size={{
                                            xs: 12,
                                            sm: 6,
                                            md: 2.4,
                                        }}
                                    >
                                        <Box>
                                            <Typography
                                                variant="caption"
                                                color="text.secondary"
                                                display="block"
                                            >
                                                Status
                                            </Typography>
                                            <Typography
                                                variant="body2"
                                                fontWeight="medium"
                                            >
                                                {templateLayoutValues?.isActive ? 'Active' : 'Inactive'}
                                            </Typography>
                                        </Box>
                                    </Grid>

                                    <Grid
                                        size={{
                                            xs: 12,
                                            sm: 6,
                                            md: 2.4,
                                        }}
                                    >
                                        <Button
                                            variant="outlined"
                                            size="small"
                                            startIcon={<EditIcon />}
                                            onClick={() => isEditDialogOpen.onTrue()}
                                        >
                                            Edit
                                        </Button>
                                    </Grid>
                                </Grid>
                            </Stack>
                        </CardContent>
                    </Card>
                ) : null}

                {/* Main Editor Card */}
                <Card
                    sx={{
                        flex: 1,
                        display: 'flex',
                        flexDirection: 'column',
                        overflow: 'hidden',
                    }}
                >
                    <CardContent
                        sx={{
                            flex: 1,
                            display: 'flex',
                            flexDirection: 'column',
                            overflow: 'hidden',
                            p: 0,
                        }}
                    >
                        <FormContainer
                            formProps={{
                                id: 'add-edit-form-template-layout',
                            }}
                            formContext={formContext as any}
                            validationSchema={validationSchema}
                            onSuccess={handleSubmitForm}
                        >
                            <Box>
                                {/* Editor Container */}
                                <Box>
                                    <Group
                                        orientation="horizontal"
                                    >
                                        {/* Left Panel - Editor */}
                                        <Panel
                                            defaultSize={50}
                                            minSize={30}
                                        >
                                            <Box
                                                sx={{
                                                    height: '100%',
                                                    display: 'flex',
                                                    flexDirection: 'column',
                                                    pr: 1,
                                                }}
                                            >
                                                {languageValue === TemplateLayoutLanguageEnum.HTML || languageValue === TemplateLayoutLanguageEnum.MJML ? (
                                                    <RHFMJMLSplitEditor
                                                        name="content"
                                                        control={formContext.control}
                                                        // label="Template Layout Content"
                                                        language={languageValue}
                                                        onRender={handleRenderTemplateLayout}
                                                        renderOnChange
                                                    />
                                                ) : (
                                                    <RHFTextField
                                                        name="content"
                                                        label="Content"
                                                        multiline
                                                        minRows={25}
                                                        fullWidth
                                                    />
                                                )}
                                            </Box>
                                        </Panel>

                                        <ResizeHandle />

                                        {/* Right Panel - Preview */}
                                        <Panel
                                            defaultSize={50}
                                            minSize={30}
                                        >
                                            <Box
                                                sx={{
                                                    display: 'flex',
                                                    flexDirection: 'column',
                                                    pl: 1,
                                                }}
                                            >
                                                <Box
                                                    sx={{
                                                        display: 'flex',
                                                        flexDirection: 'column',
                                                        border: '1px solid',
                                                        borderColor: 'divider',
                                                        borderRadius: 2,
                                                        overflow: 'hidden',
                                                        bgcolor: 'background.paper',
                                                    }}
                                                >
                                                    <Accordion
                                                        defaultExpanded
                                                        sx={{
                                                            flex: 1,
                                                            display: 'flex',
                                                            flexDirection: 'column',
                                                            '&.Mui-expanded': {
                                                                margin: 0,
                                                            },
                                                            '&:before': {
                                                                display: 'none',
                                                            },
                                                        }}
                                                    >
                                                        <AccordionSummary
                                                            expandIcon={<ExpandMoreIcon />}
                                                            aria-controls="preview-content"
                                                            id="preview-header"
                                                            sx={{
                                                                minHeight: '48px',
                                                                flexShrink: 0,
                                                                borderBottom: '1px solid',
                                                                borderColor: 'divider',
                                                                '&.Mui-expanded': {
                                                                    minHeight: '48px',
                                                                },
                                                            }}
                                                        >
                                                            <Typography
                                                                variant="subtitle1"
                                                                fontWeight="medium"
                                                            >
                                                                Template Layout Preview
                                                            </Typography>
                                                        </AccordionSummary>
                                                        <AccordionDetails>
                                                            <Box>
                                                                <iframe
                                                                    title="Template Layout Preview"
                                                                    srcDoc={htmlContent}
                                                                    style={{
                                                                        width: '100%',
                                                                        height: '450px',
                                                                        border: 'none',
                                                                        display: 'block',
                                                                    }}
                                                                />
                                                            </Box>
                                                        </AccordionDetails>
                                                    </Accordion>
                                                </Box>
                                            </Box>
                                        </Panel>
                                    </Group>
                                </Box>

                                {/* Action Buttons */}
                                <Box
                                    sx={{
                                        flexShrink: 0,
                                        p: 2,
                                        borderTop: '1px solid',
                                        borderColor: 'divider',
                                        bgcolor: 'background.paper',
                                        display: 'flex',
                                        justifyContent: 'flex-end',
                                        gap: 2,
                                    }}
                                >
                                    <Button
                                        variant="outlined"
                                        onClick={() => navigate(PATH_DASHBOARD.templateLayouts.root)}
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        type="submit"
                                        variant="contained"
                                        loading={isSubmitting}
                                    >
                                        Save Template Layout
                                    </Button>
                                </Box>
                            </Box>
                        </FormContainer>
                    </CardContent>
                </Card>

                {isEditDialogOpen.value && templateLayoutValues ? (
                    <AddEditTemplateLayoutDialog
                        onClose={() => {
                            isEditDialogOpen.onFalse();
                        }}
                        templateLayoutValues={templateLayoutValues}
                    />
                ) : null}
            </Box>
        </Page>
    );
}

export default EditTemplateLayout;
