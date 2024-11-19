import { Button, Card, CardContent, Container, Stack, Tab, Tabs } from '@mui/material'
import { Field, Form, Formik, FormikHelpers } from 'formik'
import { SyntheticEvent, useCallback, useRef, useState } from 'react'
import { object, string } from 'yup';
import Grid from '@mui/material/Grid2';
import { TextField, UploadAvatarField } from '@admin/app/components';
import { useNavigate } from 'react-router-dom';
import { useAuth, UserService, useToasty } from '@libs/react-core';
import PhoneNumberInput from '@admin/app/components/form/phone-number-input';
import PhoneNumberField from '@admin/app/components/form/formik/phone-number-field';
import General from '@admin/app/sections/user/general';
import UserChangePassword from './user-change-password';
import Page from '@admin/app/components/page';
import { PATH_DASHBOARD } from '@admin/app/routes/paths';
import CustomBreadcrumbs from '@admin/app/components/custom-breadcrumbs/custom-breadcrumbs';

const userService = UserService.getInstance<UserService>();

const defaultValues: any = {
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    avatar: '',
};

const validationSchema = object().shape({
    firstName: string().trim().required().label('First Name'),
    lastName: string().trim().required().label('Last Name'),
    email: string().trim().required().label('Email'),
    phoneNumber: string().required().label('Phone Number'),
});

const UserProfile = () => {
    const [tabValue, setTabValue] = useState<string>('general');
    const handleChangeTab = useCallback(
        (event: SyntheticEvent, newValue: string) => {
            setTabValue(newValue);
        },
        [],
    )

    return (
        <Page title='Profile'>
            <Container>
                <CustomBreadcrumbs
                    heading="Profile"
                    links={[
                        { name: 'Dashboard', href: PATH_DASHBOARD.root },
                        { name: 'Profile' },
                    ]}
                />
                <Tabs
                    value={tabValue}
                    onChange={handleChangeTab}
                >
                    <Tab value="general" label="General" disableRipple />
                    <Tab value="password" label="Password" disableRipple />
                </Tabs>
                
                {tabValue === 'general' && (
                    <General />
                )}
                {tabValue === 'password' && (
                    <UserChangePassword />
                )}
            </Container>
        </Page>
    )
}

export default UserProfile