import Page from '@admin/app/components/page'
import GeneralSetting from '@admin/app/sections/setting/general-setting/general-setting'
import { Box, Container } from '@mui/material'


const Settings = () => {


    return (
        <Page title='Settings'>
            <GeneralSetting />
        </Page>
    )
}

export default Settings
