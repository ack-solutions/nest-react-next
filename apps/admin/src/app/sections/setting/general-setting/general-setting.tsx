import { useCallback, useEffect, useRef, useState } from 'react'
import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Container,
} from '@mui/material';
import Grid from '@mui/material/Grid2';
import { NotificationTemplateService, SettingService, useToasty } from '@libs/react-core';
import { object, string } from 'yup';
import { Field, Form, Formik, FormikHelpers, FormikProps } from 'formik';
import Page from '@admin/app/components/page';
import { TextField } from '@admin/app/components';

const notificationTemplate = NotificationTemplateService.getInstance<NotificationTemplateService>();
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
  const formRef = useRef<FormikProps<any>>();

  const handleSubmit = useCallback((values?: any, action?: FormikHelpers<any>) => {
    settingService
      .updateSetting(values)
      .then(() => {
        action.setSubmitting(false);
        showToasty('Setting Successfully Updated ');
      })
      .catch((error) => {
        console.log(error);
        showToasty(error.message, 'error');
      });
  }, []);

  useEffect(() => {
    settingService.getMany({ page: 1, limit: 20 }).then((data) => {
      let values: any = {};
      console.log(data);
      data.items.forEach((settingData) => {
        values[settingData.key] = settingData.value;
      });
      setSettings({ settings: { ...values } });
    });
  }, []);

  return (
    <Page title="GeneralSetting">
      <Container maxWidth={false}>
        <Formik
          initialValues={Object.assign({}, defaultValues, settings)}
          validationSchema={validationSchema}
          enableReinitialize
          onSubmit={handleSubmit}
          innerRef={formRef}
        >
          {({ handleSubmit, values, setFieldValue }) => (
            <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
              <Grid container spacing={4}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Card>
                    <CardHeader title='Contact Us Email' />
                    <CardContent>
                      <Field
                        fullWidth
                        type="email"
                        name="settings[contactUsEmail]"
                        label="Contact Us Admin Email"
                        component={TextField}
                      />
                    </CardContent>
                    <CardActions>
                      <Button variant='contained' type='submit'>Save</Button>
                    </CardActions>
                  </Card>
                </Grid>
              </Grid>
            </Form>
          )}
        </Formik>
      </Container>
    </Page>
  );
};

export default GeneralSetting;
