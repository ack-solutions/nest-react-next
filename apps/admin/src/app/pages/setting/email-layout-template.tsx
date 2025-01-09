import Page from '@admin/app/components/page';
import { SettingService, useSettingQuery, useToasty } from '@libs/react-core';
import { isJsonString } from '@libs/utils';
import { Button, Card, CardActions, CardContent, CardHeader, Box, useTheme } from '@mui/material';
import Grid from '@mui/material/Grid2'
import { useCallback, useRef, useEffect, useState } from 'react';
import EmailEditor from 'react-email-editor';


const settingService = SettingService.getInstance<SettingService>();

const EmailLayoutSetting = () => {
    const emailEditorRef = useRef(null);
    const [settings, setSettings] = useState<any>({});
    const { showToasty } = useToasty();
    const { useGetManySetting } = useSettingQuery();
    const { data, isSuccess } = useGetManySetting();
    const unlayer = emailEditorRef.current?.editor;
    const theme = useTheme()

    const handleSaveSettings = useCallback(() => {
        unlayer?.exportHtml(({ design, html }) => {
            const request: any = {
                settings: {
                    emailLayout: {
                        design,
                        html
                    }
                }
            }
            settingService.updateSetting(request)
                .then(() => {
                    showToasty('Email Layout Successfully Updated');
                })
                .catch((error) => {
                    console.error(error);
                    showToasty(error.message, 'error');
                });
        });
    }, [showToasty, unlayer]);

    useEffect(() => {
        if (isSuccess) {
            const values: any = {};
            data.items.forEach((settingData) => {
                values[settingData.key] = isJsonString(settingData.value)
                    ? JSON.parse(settingData.value)
                    : settingData.value;
            });
            setSettings({ settings: { ...values } });
        }
    }, [data, isSuccess]);

    useEffect(() => {
        if (settings?.settings?.emailLayout) {
            unlayer?.loadDesign(settings?.settings?.emailLayout.design);
        }
    }, [settings, unlayer]);

    return (
        <Page title="Email Layout Setting">
            <Grid
                container
                spacing={2}
            >
                <Grid size={{ xs: 12 }} >
                    <Card>
                        <CardHeader title="Email Layout Editor" />
                        <CardContent>
                            <Box
                                sx={{
                                    border: `1px solid ${theme.palette.divider}`,
                                    borderRadius: 1
                                }}
                            >
                                <EmailEditor ref={emailEditorRef} />
                            </Box>
                        </CardContent>
                        <CardActions>
                            <Button
                                variant="contained"
                                onClick={handleSaveSettings}
                            >
                                Save Settings
                            </Button>
                        </CardActions>
                    </Card>
                </Grid>
            </Grid>
        </Page>
    );
};

export default EmailLayoutSetting;
