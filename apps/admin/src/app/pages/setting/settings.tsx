import CustomBreadcrumbs from '@admin/app/components/custom-breadcrumbs/custom-breadcrumbs'
import Page from '@admin/app/components/page'
import { PATH_DASHBOARD } from '@admin/app/routes/paths'
import GeneralSetting from '@admin/app/sections/setting/general-setting/general-setting'
import NotificationSetting from '@admin/app/sections/setting/notification-setting/notification-setting'
import { useTabs } from '@libs/react-core'
import { Box, Container, Tab, Tabs } from '@mui/material'


const Settings = () => {
    const { currentTab, onChangeTab } = useTabs('email-setting');

    return (
        <Page title='Settings'>
            <Container maxWidth={false}>
                <CustomBreadcrumbs
                    heading="Settings"
                    links={[
                        {
                            name: 'Dashboard',
                            href: PATH_DASHBOARD.root
                        },
                        { name: 'Settings' }
                    ]}
                />
                <Tabs
                    value={currentTab}
                    onChange={onChangeTab}
                >
                    <Tab
                        label="Email Setting"
                        value='email-setting'
                    />
                    <Tab
                        label="Notification Setting"
                        value='notification-setting'
                    />
                </Tabs>
                <Box mt={2}>
                    {currentTab === 'email-setting' && (
                        <GeneralSetting />
                    )}
                    {currentTab === 'notification-setting' && (
                        <NotificationSetting />
                    )}
                </Box>
            </Container>
        </Page>
    )
}

export default Settings
