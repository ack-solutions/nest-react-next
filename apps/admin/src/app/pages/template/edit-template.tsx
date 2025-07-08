import { Page } from '@admin/app/components/page';
import { FormContainer, RHFMJMLSplitEditor, RHFTextField } from '@admin/app/form';
import { useBoolean, useToasty } from '@admin/app/hook';
import { PATH_DASHBOARD } from '@admin/app/routes/paths';
import { yupResolver } from '@hookform/resolvers/yup';
import { useTemplate, useTemplateLayout } from '@libs/react-shared';
import { TemplateTypeEnum } from '@libs/types';
import { TemplateLanguageEnum } from '@libs/types';
import { ITemplate } from '@libs/types';
import EditIcon from '@mui/icons-material/Edit';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Button, Card, CardContent, Typography, Stack, Accordion, AccordionSummary, AccordionDetails, styled, Grid } from '@mui/material';
import { Box } from '@mui/material';
import { find } from 'lodash';
import { useCallback, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { PanelGroup, Panel, PanelResizeHandle } from 'react-resizable-panels';
import { useNavigate, useParams } from 'react-router-dom';
import { object, string } from 'yup';

import AddEditTemplateDialog from './add-edit-template-dialog';


const ResizeHandle = styled(PanelResizeHandle)(({ theme }) => ({
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

const defaultValues: Partial<ITemplate> = {
    displayName: '',
    description: '',
    subject: '',
    templateLayoutName: '',
    type: TemplateTypeEnum.EMAIL,
    language: TemplateLanguageEnum.HTML,
    content: '',
    isActive: true,
};

const validationSchema = object().shape({
    subject: string().label('Subject').nullable(),
    language: string().label('Language').required(),
    type: string().label('Type').required(),
    content: string().label('Content'),
});


function EditTemplate() {
    const { templateId } = useParams();
    const { useCreateTemplate, useUpdateTemplate, useRenderTemplate, useGetTemplateById } = useTemplate();
    const { useGetTemplateLayout } = useTemplateLayout();
    const [showJsonEditor, setShowJsonEditor] = useState(false);
    const [previewHtml, setPreviewHtml] = useState<string>('');
    const isEditDialogOpen = useBoolean(false);

    const { mutateAsync: createTemplate } = useCreateTemplate();
    const { mutateAsync: updateTemplate } = useUpdateTemplate();
    const { mutateAsync: renderTemplate } = useRenderTemplate();

    const { data: templateValues } = useGetTemplateById(templateId);

    const { data: templateLayouts } = useGetTemplateLayout({});

    const { showToasty } = useToasty();
    const navigate = useNavigate();

    const formContext = useForm({
        defaultValues,
        resolver: yupResolver(validationSchema) as any,
    });

    const { reset, watch, formState: { isSubmitting } } = formContext;

    const languageValue = watch('language');
    const previewContext = watch('previewContext');
    const templateLayoutName = watch('templateLayoutName');

    const handleSubmitContent = useCallback(
        async (value: any) => {
            const request = {
                ...value,
                content: value.content,
                previewContext: value.previewContext,

            };

            try {
                if (templateValues?.id) {
                    await updateTemplate(request);
                } else {
                    await createTemplate(value);
                }
                showToasty('Template content saved successfully', 'success');
                navigate(PATH_DASHBOARD.templates.root);
            } catch (error) {
                console.error(error);
                showToasty('Failed to save template content', 'error');
            }
        },
        [
            createTemplate,
            navigate,
            showToasty,
            templateValues,
            updateTemplate,
        ],
    );

    const handleRenderTemplate = useCallback(async (content: string) => {
        try {
            const result = await renderTemplate({
                content,
                language: languageValue,
                engine: templateValues?.engine,
                context: JSON.parse(previewContext as any),
                ...(templateLayoutName && {
                    templateLayoutId: find(templateLayouts, {
                        name: templateLayoutName,
                    })?.id,
                }),
            });
            setPreviewHtml(result);
            return result;
        } catch (error) {
            console.error('Render error:', error);
            setPreviewHtml('<div style="color: red; padding: 20px;">Error rendering template</div>');
            throw error;
        }
    }, [
        renderTemplate,
        languageValue,
        previewContext,
        templateLayoutName,
        templateLayouts,
        templateValues,
    ]);

    const handleToggleJsonEditor = () => {
        setShowJsonEditor(!showJsonEditor);
    };

    useEffect(() => {
        if (templateValues) {
            reset({
                ...defaultValues,
                ...templateValues,
            });
        }
    }, [templateValues, reset]);

    return (
        <Page
            title={templateValues?.displayName}
            breadcrumbs={[
                {
                    name: 'Dashboard',
                    href: PATH_DASHBOARD.root,
                },
                {
                    name: 'Template',
                    href: PATH_DASHBOARD.templates.root,
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
                                            {templateValues?.displayName}
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
                                            {templateValues?.type}
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
                                            {templateValues?.language}
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
                                            Layout
                                        </Typography>
                                        <Typography
                                            variant="body2"
                                            fontWeight="medium"
                                        >
                                            {templateValues?.templateLayoutName}
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
                                id: 'edit-template-content-form',
                            }}
                            formContext={formContext as any}
                            validationSchema={validationSchema}
                            onSuccess={handleSubmitContent}
                        >
                            <Box>
                                {/* Editor Container */}
                                <Box>
                                    <PanelGroup
                                        direction="horizontal"
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
                                                {languageValue === TemplateLanguageEnum.HTML || languageValue === TemplateLanguageEnum.MJML ? (
                                                    <RHFMJMLSplitEditor
                                                        name="content"
                                                        control={formContext.control}
                                                        // label="Template Content"
                                                        language={languageValue}
                                                        onRender={handleRenderTemplate}
                                                        renderOnChange
                                                    />
                                                ) : (
                                                    <RHFTextField
                                                        name="content"
                                                        label="Content"
                                                        multiline
                                                        minRows={5}
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
                                                    {/* Preview Section */}
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
                                                                Template Preview
                                                            </Typography>
                                                        </AccordionSummary>
                                                        <AccordionDetails>

                                                            <Box>
                                                                <iframe
                                                                    title="Template Preview"
                                                                    srcDoc={previewHtml}
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

                                                    {/* JSON Context Section */}
                                                    <Accordion
                                                        expanded={showJsonEditor}
                                                        onChange={handleToggleJsonEditor}
                                                        sx={{
                                                            flexShrink: 0,
                                                            '&.Mui-expanded': {
                                                                margin: 0,
                                                            },
                                                            '&:before': {
                                                                display: 'none',
                                                            },
                                                            borderTop: '1px solid',
                                                            borderColor: 'divider',
                                                        }}
                                                    >
                                                        <AccordionSummary
                                                            expandIcon={<ExpandMoreIcon />}
                                                            aria-controls="json-context-content"
                                                            id="json-context-header"
                                                            sx={{
                                                                minHeight: '48px',
                                                                '&.Mui-expanded': {
                                                                    minHeight: '48px',
                                                                },
                                                            }}
                                                        >
                                                            <Typography
                                                                variant="subtitle1"
                                                                fontWeight="medium"
                                                            >
                                                                JSON Context for Preview
                                                            </Typography>
                                                        </AccordionSummary>
                                                        <AccordionDetails sx={{ p: 1 }}>
                                                            <Box sx={{ height: '300px' }}>
                                                                <RHFMJMLSplitEditor
                                                                    name="previewContext"
                                                                    control={formContext.control}
                                                                    label=""
                                                                    language="json"
                                                                    showPreview={false}
                                                                />
                                                            </Box>
                                                        </AccordionDetails>
                                                    </Accordion>
                                                </Box>
                                            </Box>
                                        </Panel>
                                    </PanelGroup>
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
                                    // onClick={() => navigate(PATH_DASHBOARD.settings.template)}
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        type="submit"
                                        variant="contained"
                                        loading={isSubmitting}
                                    >
                                        Save Template
                                    </Button>
                                </Box>
                            </Box>
                        </FormContainer>
                    </CardContent>
                </Card>

                <AddEditTemplateDialog
                    open={isEditDialogOpen.value}
                    templateValues={templateValues}
                    onClose={() => isEditDialogOpen.onFalse()}
                />
            </Box>
        </Page>
    );
}

export default EditTemplate;
