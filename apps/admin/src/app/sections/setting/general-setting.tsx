import { Page } from '@admin/app/components';
import { useSettingsContext } from '@admin/app/contexts';
import { FormContainer, RHFSelect, RHFTextField } from '@admin/app/form';
import { useToasty } from '@admin/app/hook';
import { yupResolver } from '@hookform/resolvers/yup';
import { useSetting } from '@libs/react-shared';
import { toDisplayDate, toDisplayTime } from '@libs/utils';
import { Button, Card, CardActions, CardContent, Grid, Typography } from '@mui/material';
import React, { useCallback, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { object, string } from 'yup';


const defaultValues = {
    settings: {
        dateFormat: '',
        timeFormat: '',

    },
};
const validationSchema = yupResolver(
    object().shape({
        settings: object().shape({
            dateFormat: string().trim().label('Date Format').nullable(),
            timeFormat: string().trim().label('Time Format').nullable(),
        }),
    }),
);

const dateFormatOptions = [
    {
        format: 'DD MMM, YYYY',
        label: toDisplayDate(new Date(), 'DD MMM, YYYY'),
    },
    {
        format: 'MM/DD/YYYY',
        label: toDisplayDate(new Date(), 'MM/DD/YYYY'),
    },
    {
        format: 'DD/MM/YYYY',
        label: toDisplayDate(new Date(), 'DD/MM/YYYY'),
    },
    {
        format: 'YYYY-MM-DD',
        label: toDisplayDate(new Date(), 'YYYY-MM-DD'),
    },
    {
        format: 'DD-MM-YYYY',
        label: toDisplayDate(new Date(), 'DD-MM-YYYY'),
    },
    {
        format: 'MMM DD, YYYY',
        label: toDisplayDate(new Date(), 'MMM DD, YYYY'),
    },
];

// Time format options
const timeFormatOptions = [
    {
        format: 'hh:mm A',
        label: toDisplayTime(new Date(), 'hh:mm A'),
    },
    {
        format: 'HH:mm',
        label: toDisplayTime(new Date(), 'HH:mm'),
    },
    {
        format: 'HH:mm:ss',
        label: toDisplayTime(new Date(), 'HH:mm:ss'),
    },
    {
        format: 'hh:mm:ss A',
        label: toDisplayTime(new Date(), 'hh:mm:ss A'),
    },
];

const GeneralSetting = () => {
    // const [settingsData, setSettings] = useState<any>({});
    const { showToasty } = useToasty();
    const formContext = useForm({
        defaultValues,
        resolver: validationSchema as any,
    });
    const { reset } = formContext;
    const { useUpdateSettings, useGetManySetting } = useSetting();
    const { mutateAsync: updateSettings } = useUpdateSettings();

    const { data: settingsData } = useGetManySetting({
        page: 1,
        limit: 20,
    });


    const handleSubmit = useCallback((values?: any) => {
        updateSettings(values).then(() => {
            showToasty('Setting Successfully Updated ');
        }).catch((error) => {
            showToasty(error.message, 'error');
        });
    }, [showToasty, updateSettings]);


    useEffect(() => {
        const values: any = {};
        settingsData?.items?.forEach((settingData) => {
            values[settingData.key] = settingData.value;
        });
        reset({
            ...defaultValues,
            settings: { ...values },
        });
    }, [settingsData, reset]);

    return (
        <Page title="General Setting">
            <FormContainer
                formProps={{
                    id: 'general-setting-form',
                }}
                formContext={formContext}
                validationSchema={validationSchema}
                onSuccess={handleSubmit}
            >
                <Card>
                    <CardContent>
                        <Grid container spacing={2}>
                            <Grid
                                size={{
                                    xs: 12,
                                    md: 6,
                                }}
                            >
                                <RHFSelect
                                    fullWidth
                                    name="settings.dateFormat"
                                    label="Date Format"
                                    options={dateFormatOptions}
                                    valueKey="format"
                                    labelKey="label"
                                    isStartCase={false}
                                />
                            </Grid>
                            <Grid
                                size={{
                                    xs: 12,
                                    md: 6,
                                }}
                            >
                                <RHFSelect
                                    fullWidth
                                    name="settings.timeFormat"
                                    label="Time Format"
                                    options={timeFormatOptions}
                                    valueKey="format"
                                    labelKey="label"
                                    isStartCase={false}
                                />
                            </Grid>

                        </Grid>
                    </CardContent>
                    <CardActions>
                        <Button type="submit" variant="contained" color="primary">
                            Save
                        </Button>
                    </CardActions>
                </Card>
            </FormContainer>
        </Page >
    );
};

export default GeneralSetting;
