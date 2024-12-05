import CustomBreadcrumbs from '@admin/app/components/custom-breadcrumbs/custom-breadcrumbs'
import Page from '@admin/app/components/page'
import { PATH_DASHBOARD } from '@admin/app/routes/paths'
import GeneralSetting from '@admin/app/sections/setting/general-setting/general-setting'
import NotificationSetting from '@admin/app/sections/setting/notification-setting/notification-setting'
import { Box, Container, Tab, Tabs } from '@mui/material'
import React, { SyntheticEvent, useCallback, useState } from 'react'

const Settings = () => {
    const [settingTab, setSettingTab] = useState('general-setting')

    const handleChange = useCallback(
        (event: SyntheticEvent, newValue: string) => {
            setSettingTab(newValue)
        },
        [],
    )

    return (
        <Page title='Settings'>
            <Container maxWidth={false}>
                <CustomBreadcrumbs
                    heading="Settings"
                    links={[
                        { name: 'Dashboard', href: PATH_DASHBOARD.root },
                        { name: 'Settings' }
                    ]}
                />
                <Tabs value={settingTab} onChange={handleChange}>
                    <Tab label="General Setting" value='general-setting' />
                    <Tab label="Notification Setting" value='notification-setting' />
                </Tabs>
                <Box mt={2}>
                    {settingTab === 'general-setting' && (
                        <GeneralSetting />
                    )}
                    {settingTab === 'notification-setting' && (
                        <NotificationSetting />
                    )}
                </Box>
            </Container>
        </Page>
    )
}

export default Settings
