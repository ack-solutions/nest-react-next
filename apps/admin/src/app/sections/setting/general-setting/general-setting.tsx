import Page from '@admin/app/components/page';
import { yupResolver } from '@hookform/resolvers/yup';
import { FormContainer, RHFPassword, RHFSelect, RHFTextField, SettingService, useSettingQuery, useToasty } from '@libs/react-core';
import { SmtpEncryptionTypeEnum } from '@libs/types';
import { isJsonString } from '@libs/utils';
import {
    Button,
    Card,
    CardActions,
    CardContent,
    CardHeader,
    MenuItem,
    Stack,
} from '@mui/material';
import Grid from '@mui/material/Grid2';
import { upperCase } from 'lodash';
import { useCallback, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form';
import { object, string } from 'yup';


const settingService = SettingService.getInstance<SettingService>();

const defaultValues = {
    settings: {
        contactUsEmail: '',
        smtpHost: '',
        smtpPort: '',
        smtpUsername: '',
        smtpPassword: '',
        smtpEncryption: SmtpEncryptionTypeEnum.AUTO,
        smtpFromEmail: '',
        smtpFromName: '',
    },
};

const validationSchema = object().shape({
    settings: object().shape({
        contactUsEmail: string().label('Contact Us Admin Email').required(),
    }),
});

const GeneralSetting = () => {
    const [settings, setSettings] = useState<any>({});
    const { showToasty } = useToasty();
    const formContext = useForm({
        defaultValues,
        resolver: yupResolver(validationSchema) as any,
    })
    const { useGetManySetting } = useSettingQuery();
    const { data, isSuccess } = useGetManySetting();

    const { reset } = formContext;

    const handleSubmitForm = useCallback((values?: any) => {
        settingService
            .updateSetting(values)
            .then(() => {
                showToasty('Setting Successfully Updated ');
            })
            .catch((error) => {
                console.log(error);
                showToasty(error.message, 'error');
            });
    }, [showToasty]);

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
        reset({
            ...settings,
        })
    }, [reset, settings]);


    return (
        <Page title="GeneralSetting">
            <FormContainer
                FormProps={{
                    id: "add-edit-form-setting"
                }}
                formContext={formContext}
                validationSchema={validationSchema}
                onSuccess={handleSubmitForm}
            >
                <Grid
                    container
                    spacing={2}
                >
                    <Grid
                        size={{
                            xs: 12,
                            sm: 6
                        }}
                    >
                        <Card>
                            <CardHeader title='Contact Us Email' />
                            <CardContent>
                                <RHFTextField
                                    fullWidth
                                    type="email"
                                    name="settings[contactUsEmail]"
                                    label="Contact Us Admin Email"
                                />
                            </CardContent>
                            <CardActions>
                                <Button
                                    variant='contained'
                                    type='submit'
                                >
                                    Save
                                </Button>
                            </CardActions>
                        </Card>
                    </Grid>
                    <Grid
                        size={{
                            xs: 12,
                            sm: 6
                        }}
                    >
                        <Card>
                            <CardHeader title='SMTP Setting' />
                            <CardContent>
                                <Stack spacing={2}>
                                    <Stack
                                        spacing={2}
                                        direction='row'
                                    >
                                        <RHFTextField
                                            fullWidth
                                            name="settings[smtpHost]"
                                            label=" Host Name"
                                            placeholder='smtp.gmail.com'
                                        />
                                        <RHFTextField
                                            fullWidth
                                            name="settings[smtpPort]"
                                            label=" Port"
                                            placeholder='25'
                                            type='number'
                                            helperText='1234'
                                        />
                                    </Stack>
                                    <Stack
                                        spacing={2}
                                        direction='row'
                                    >
                                        <RHFTextField
                                            fullWidth
                                            name="settings[smtpUsername]"
                                            label=" User Name"
                                        />
                                        <RHFPassword
                                            fullWidth
                                            name="settings[smtpPassword]"
                                            label=" Password"
                                        />
                                    </Stack>
                                    <Stack
                                        spacing={2}
                                        direction='row'
                                    >
                                        <RHFSelect
                                            fullWidth
                                            name="settings[smtpEncryption]"
                                            label="Encryption"
                                        >
                                            {Object.values(SmtpEncryptionTypeEnum).map((type, index) => (
                                                <MenuItem
                                                    value={type}
                                                    key={index}
                                                >
                                                    {upperCase(type)}
                                                </MenuItem>
                                            ))}
                                        </RHFSelect>
                                        <RHFTextField
                                            fullWidth
                                            name="settings[smtpFromEmail]"
                                            label="From Email"
                                        />
                                        <RHFTextField
                                            fullWidth
                                            name="settings[smtpFromName]"
                                            label=" From Name"
                                        />
                                    </Stack>
                                </Stack>
                            </CardContent>
                            <CardActions>
                                <Button
                                    variant='contained'
                                    type='submit'
                                >
                                    Save
                                </Button>
                            </CardActions>
                        </Card>
                    </Grid>
                </Grid>
            </FormContainer>
        </Page >
    );
};

export default GeneralSetting;
