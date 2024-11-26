import { Container, Tab, Tabs } from '@mui/material'
import { SyntheticEvent, useCallback, useState } from 'react'
import { UserService } from '@libs/react-core';
import General from '@admin/app/sections/user/general';
import UserChangePassword from '../../sections/user/user-change-password';
import Page from '@admin/app/components/page';
import { PATH_DASHBOARD } from '@admin/app/routes/paths';
import CustomBreadcrumbs from '@admin/app/components/custom-breadcrumbs/custom-breadcrumbs';

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