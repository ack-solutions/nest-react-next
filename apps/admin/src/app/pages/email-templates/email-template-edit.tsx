import { Page } from '@admin/app/components/page';
import { FormContainer, RHFEnhancedTemplateEditor, RHFTextField } from '@admin/app/form';
import { useBoolean, useToasty } from '@admin/app/hook';
import { PATH_DASHBOARD } from '@admin/app/routes/paths';
import { yupResolver } from '@hookform/resolvers/yup';
import { useTemplate, useTemplateLayout } from '@libs/react-shared';
import { TemplateTypeEnum } from '@libs/types';
import { TemplateLanguageEnum } from '@libs/types';
import { ITemplate } from '@libs/types';
import EditIcon from '@mui/icons-material/Edit';
import EmailIcon from '@mui/icons-material/Email';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import SaveIcon from '@mui/icons-material/Save';
import { Button, Card, CardContent, Typography, Stack, Accordion, AccordionSummary, AccordionDetails, Grid, Chip, Divider } from '@mui/material';
import { Box } from '@mui/material';
import { find } from 'lodash';
import { useCallback, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import { object, string } from 'yup';

import AddEditEmailTemplateDialog from './add-edit-email-template-dialog';


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

function EditEmailTemplate() {
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
    const subjectValue = watch('subject');

    const handleSubmitContent = useCallback(
        async (value: any) => {
            const request = {
                ...value,
                content: value.content,
                previewContext: value.previewContext,
                type: TemplateTypeEnum.EMAIL, // Ensure it's always email type
            };

            try {
                if (templateValues?.id) {
                    await updateTemplate(request);
                } else {
                    await createTemplate(request);
                }
                showToasty('Email template saved successfully', 'success');
                navigate(PATH_DASHBOARD.emailTemplates.root);
            } catch (error) {
                console.error(error);
                showToasty('Failed to save email template', 'error');
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
            setPreviewHtml('<div style="color: red; padding: 20px;">Error rendering email template</div>');
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
            title={templateValues?.displayName || 'Email Template'}
            breadcrumbs={[
                {
                    name: 'Dashboard',
                    href: PATH_DASHBOARD.root,
                },
                {
                    name: 'Email Templates',
                    href: PATH_DASHBOARD.emailTemplates.root,
                },
                { name: templateValues?.id ? 'Edit' : 'Create' },
            ]}
        >
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    overflow: 'hidden',
                }}
            >
                {/* Email Template Header */}
                <Card
                    sx={{
                        mb: 2,
                        flexShrink: 0,
                    }}
                >
                    <CardContent sx={{ py: 2 }}>
                        <Stack spacing={2}>
                            {/* Top Row - Template Info and Actions */}
                            <Box
                                sx={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    flexWrap: 'wrap',
                                    gap: 2,
                                }}
                            >
                                <Box>
                                    <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 0.5 }}>
                                        <EmailIcon color="primary" />
                                        <Typography
                                            variant="h6"
                                            fontWeight="bold"
                                        >
                                            {templateValues?.displayName || 'New Email Template'}
                                        </Typography>
                                    </Stack>
                                    <Stack direction="row" spacing={1} alignItems="center">
                                        <Chip
                                            label="EMAIL"
                                            size="small"
                                            variant="filled"
                                            color="primary"
                                        />
                                        <Chip
                                            label={templateValues?.language || 'HTML'}
                                            size="small"
                                            variant="outlined"
                                            color="secondary"
                                        />
                                        {templateValues?.templateLayoutName && (
                                            <Chip
                                                label={`Layout: ${templateValues.templateLayoutName}`}
                                                size="small"
                                                variant="outlined"
                                                color="default"
                                            />
                                        )}
                                    </Stack>
                                </Box>

                                <Stack direction="row" spacing={1}>
                                    <Button
                                        variant="outlined"
                                        size="small"
                                        startIcon={<EditIcon />}
                                        onClick={() => isEditDialogOpen.onTrue()}
                                    >
                                        Edit Details
                                    </Button>
                                    <Button
                                        variant="contained"
                                        size="small"
                                        startIcon={<SaveIcon />}
                                        loading={isSubmitting}
                                        onClick={() => formContext.handleSubmit(handleSubmitContent)()}
                                        sx={{ minWidth: 120 }}
                                    >
                                        Save Template
                                    </Button>
                                </Stack>
                            </Box>

                            {/* Subject Line */}
                            {(subjectValue || templateValues?.subject) && (
                                <>
                                    <Divider />
                                    <Box>
                                        <Typography
                                            variant="caption"
                                            color="text.secondary"
                                            display="block"
                                        >
                                            Subject Line
                                        </Typography>
                                        <Typography
                                            variant="body2"
                                            fontWeight="medium"
                                        >
                                            {subjectValue || templateValues?.subject}
                                        </Typography>
                                    </Box>
                                </>
                            )}

                            {/* Description */}
                            {templateValues?.description && (
                                <>
                                    <Divider />
                                    <Typography
                                        variant="body2"
                                        color="text.secondary"
                                        sx={{ fontStyle: 'italic' }}
                                    >
                                        {templateValues.description}
                                    </Typography>
                                </>
                            )}
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
                    <FormContainer
                        formProps={{
                            id: 'edit-email-template-form',
                        }}
                        formContext={formContext as any}
                        validationSchema={validationSchema}
                        onSuccess={handleSubmitContent}
                    >
                        <Box
                            sx={{
                                flex: 1,
                                display: 'flex',
                                flexDirection: 'column',
                                overflow: 'hidden',
                                p: 2,
                                gap: 2,
                            }}
                        >
                            {/* Subject Field */}
                            <RHFTextField
                                name="subject"
                                label="Email Subject"
                                fullWidth
                                placeholder="Enter email subject line..."
                                helperText="This will be the subject line of the email"
                            />

                            {/* Email Content Editor */}
                            <Box sx={{
                                flex: 1,
                                minHeight: 0,
                            }}>
                                {languageValue === TemplateLanguageEnum.HTML || languageValue === TemplateLanguageEnum.MJML ? (
                                    <RHFEnhancedTemplateEditor
                                        name="content"
                                        control={formContext.control}
                                        language={languageValue}
                                        onRender={handleRenderTemplate}
                                        renderOnChange
                                        height="calc(100vh - 320px)"
                                        title="Email Content"
                                    />
                                ) : (
                                    <RHFTextField
                                        name="content"
                                        label="Email Content"
                                        multiline
                                        minRows={15}
                                        fullWidth
                                        placeholder="Enter your email content here..."
                                    />
                                )}
                            </Box>

                            {/* JSON Context Editor */}
                            <Accordion
                                expanded={showJsonEditor}
                                onChange={handleToggleJsonEditor}
                                sx={{
                                    flexShrink: 0,
                                    border: 1,
                                    borderColor: 'divider',
                                    borderRadius: 1,
                                    '&:before': {
                                        display: 'none',
                                    },
                                }}
                            >
                                <AccordionSummary
                                    expandIcon={<ExpandMoreIcon />}
                                    sx={{
                                        minHeight: 48,
                                        '&.Mui-expanded': {
                                            minHeight: 48,
                                        },
                                    }}
                                >
                                    <Typography variant="subtitle1" fontWeight="medium">
                                        Test Data for Email Preview
                                    </Typography>
                                </AccordionSummary>
                                <AccordionDetails sx={{ p: 1 }}>
                                    <RHFEnhancedTemplateEditor
                                        name="previewContext"
                                        control={formContext.control}
                                        language="json"
                                        height="300px"
                                        title="JSON Test Data"
                                    />
                                </AccordionDetails>
                            </Accordion>

                            {/* Bottom Action Buttons */}
                            <Box
                                sx={{
                                    display: 'flex',
                                    justifyContent: 'flex-end',
                                    gap: 2,
                                    pt: 1,
                                    borderTop: 1,
                                    borderColor: 'divider',
                                }}
                            >
                                <Button
                                    variant="outlined"
                                    onClick={() => navigate(PATH_DASHBOARD.emailTemplates.root)}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    type="submit"
                                    variant="contained"
                                    loading={isSubmitting}
                                    startIcon={<SaveIcon />}
                                >
                                    Save Email Template
                                </Button>
                            </Box>
                        </Box>
                    </FormContainer>
                </Card>

                {/* Edit Dialog */}
                <AddEditEmailTemplateDialog
                    open={isEditDialogOpen.value}
                    templateValues={templateValues}
                    onClose={() => isEditDialogOpen.onFalse()}
                />
            </Box>
        </Page>
    );
}

export default EditEmailTemplate;
