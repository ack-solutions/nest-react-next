import CustomBreadcrumbs from '@admin/app/components/custom-breadcrumbs/custom-breadcrumbs';
import Page from '@admin/app/components/page';
import { PATH_DASHBOARD } from '@admin/app/routes/paths';
import General from '@admin/app/sections/user/general';
import AccountBoxTwoToneIcon from '@mui/icons-material/AccountBoxTwoTone';
import KeyTwoToneIcon from '@mui/icons-material/KeyTwoTone';
import { Container, Tab, Tabs } from '@mui/material'

import UserChangePassword from '../../sections/user/user-change-password';
import { useTabs } from '@libs/react-core';


const UserProfile = () => {
    const { currentTab, onChangeTab } = useTabs('general');

    return (
        <Page title='Profile'>
            <Container maxWidth={false}>
                <CustomBreadcrumbs
                    heading="Profile"
                    links={[
                        {
                            name: 'Dashboard',
                            href: PATH_DASHBOARD.root
                        },
                        { name: 'Profile' },
                    ]}
                />
                <Tabs
                    value={currentTab}
                    onChange={onChangeTab}
                >
                    <Tab
                        value="general"
                        label="General"
                        disableRipple
                        icon={<AccountBoxTwoToneIcon />}
                        iconPosition="start"
                    />
                    <Tab
                        value="password"
                        label="Password"
                        disableRipple
                        icon={<KeyTwoToneIcon />}
                        iconPosition="start"
                    />
                </Tabs>

                {currentTab === 'general' && (
                    <General />
                )}
                {currentTab === 'password' && (
                    <UserChangePassword />
                )}
            </Container>
        </Page>
    )
}

export default UserProfile
