import Page from '@admin/app/components/page';
import { yupResolver } from '@hookform/resolvers/yup';
import { FormContainer, RHFTextField, SettingService, useSettingQuery, useToasty } from '@libs/react-core';
import {
    Button,
    Card,
    CardActions,
    CardContent,
    CardHeader,
    Container,
} from '@mui/material';
import Grid from '@mui/material/Grid2';
import { useCallback, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form';
import { object, string } from 'yup';


const settingService = SettingService.getInstance<SettingService>();

const defaultValues = {
    settings: {
        contactUsEmail: '',
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
        resolver: yupResolver(validationSchema),
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
    }, []);

    useEffect(() => {
        if (isSuccess) {
            const values: any = {};
            data.items.forEach((settingData) => {
                values[settingData.key] = settingData.value;
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
            <Container maxWidth={false}>
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
                        spacing={4}
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
                                    >Save</Button>
                                </CardActions>
                            </Card>
                        </Grid>
                    </Grid>
                </FormContainer>
            </Container>
        </Page>
    );
};

export default GeneralSetting;
